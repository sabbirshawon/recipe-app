import React, { useRef, useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Loader from '../components/loader/Loader';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ResetPassword = (props) => {
  const password = useRef();
  const confirmPassword = useRef();
  const [userId, setUserId] = useState('');
  const [errMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { token } = useParams();

  useEffect(() => {
    fetch(`/users/reset/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.err) {
          setErrorMsg('Sorry your request is not correct');
        } else {
          setUserId(res.userId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const submitPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/users/reset/updateResetPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        password: password.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.message === 'password updated') {
          setSuccessMsg('Password updated successfully');
          password.current.value = '';
          confirmPassword.current.value = '';
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg('Sorry your request is not correct');
      });
  };

  return (
    <div className="reset_password_wrap">
      {errMsg ? (
        <h1>{errMsg}</h1>
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {successMsg && (
              <div className="success_msg_wrap">
                <h2>Password Updated</h2>
              </div>
            )}
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <form className={classes.form} onSubmit={submitPassword}>
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={password}
                required
                fullWidth
                type="password"
                id="password"
                label="Password"
                name="password"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={confirmPassword}
                required
                fullWidth
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {loading ? (
                  <Loader width={5} height={5} />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </div>
        </Container>
      )}
    </div>
  );
};

export default withRouter(ResetPassword);
