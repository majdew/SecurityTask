const User = require('./../models/User');
const connection = require('./../services/connection');
const router = require('express').Router();

router.post('/create', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//login
router.post('/login', async (req, res) => {
	try {
			
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);


		var token = await user.generateJWTToken();


		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
