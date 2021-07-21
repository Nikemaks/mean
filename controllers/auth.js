const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    });

    if(candidate) {

    } else {
        res.status().json({

        })
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        res.status(409).json({
            message: 'Такой email занят. Попробуйте другой.'
        })
    } else {

        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;

        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {

        }
    }
}
