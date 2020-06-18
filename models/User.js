const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
		maxlength: 50,
		minlength: 7,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
	password: {
		type: String,
		required: false,
		min: 6,
		max: 1024,
	},
});

userSchema.methods.generateJWTToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id }, 'MysecertKey', {
		expiresIn: '1 second',
	});
	
	user.tokens = user.tokens.concat({ token });

	await user.save();
	return token;

};

userSchema.pre('save', async function (next) {
	if (!this.password) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

userSchema.statics.findByCredentials = async function (email, password) {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("You can't login !!!");
	}

	const isCorrectPassword = await bcrypt.compare(password, user.password);

	if (!isCorrectPassword) {
		throw new Error("You can't login !!!");
	}

	return user;
};

const User = new mongoose.model('User', userSchema);
module.exports = User;
