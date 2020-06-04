const mongoose = require("mongoose");

exports.makeDb = () => {
	mongoose.set("useCreateIndex", true);
	mongoose.connect(
		`mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@ds015774.mlab.com:15774/recipe-app`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);
	mongoose.set("useFindAndModify", false);
}