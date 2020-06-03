const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");

const User = require("../models/user");
const Recipe = require("../models/recipe");

// this is bad for production, better to use redis or any database
let refreshTokens = [];

exports.signUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Sorry email doesn't exist",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(200).json({
      message: "User Created",
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        error: "Email or Password isn't matched",
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(500).json({
        error: "Email or Password isn't matched",
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    // saving refresh tokens in an array
    refreshTokens.push(refreshToken);
    return res.status(200).json({
      message: "Authenticate successfull",
      userId: user.id,
      accessToken: token,
      expiresIn: "10h",
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.createNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: "Add refresh token",
      });
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({
        error: "Not a valid token",
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      const token = generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      return res.status(200).json({
        token,
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        error: "User Not found",
      });
    }

    const recipes = await Recipe.find({ _id: user.createdRecipes });

    return res.status(201).json({
      user,
      recipes,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    if (req.body.email === "") {
      return res.status(404).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        error: "Sorry, Email doesn't exist",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    await user.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      tls: { rejectUnauthorized: false },
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    const mailOptions = {
      from: "recipe_app@gmail.com",
      to: `${user.email}`,
      subject: "Link to reset password",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link or paste into your browser to complete the process within one hour of receiving it:\n\n" +
        `http://localhost:3000/reset/${token}\n\n` +
        "If you did not request this, please this email and your password will remain unchanged.\n",
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      return res.status(200).json({
        message: "recovery email sent",
        response,
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.checkResetToken = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(500).json({
        err: "Something went wrong",
      });
    }
    return res.status(200).json({
      token,
      userId: user._id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.updateResetPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.findOneAndUpdate(
      { _id: req.body.userId },
      { password: hashedPassword },
      { upsert: true },
      function (err) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        return res.status(200).json({
          message: "password updated",
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.getUserName = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    return res.status(200).json({
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
    const user = await User.findById({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({
        error: "No user found",
      });
    }
    return res.status(200).json({
      user: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.checkTokenValidity = async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    if (!accessToken) {
      return res.status(404).json({
        error: "Token is empty",
      });
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      return res.status(200).json({
        successMsg: "Working Fine",
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10h",
    }
  );
}
