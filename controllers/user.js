const {User} = require('../db/models');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            const {name, email, password} = req.body;

            const exist = await User.findOne({where: {email}});
            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: 'email already used!',
                    data: null
                });
            }

            const hashPassword = await bcryp.hash(password, 10);

            const user = await User.create({
                name, email, password: hashPassword
            });

            return res.status(201).json({
                status: true,
                message: 'user created!',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'credential is not valid!',
                    data: null
                });
            }

            const passwordCorrect = await bcryp.compare(password, user.password);
            if (!passwordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: 'credential is not valid!',
                    data: null
                });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY);
            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: {
                    token: token
                }
            });

        } catch (err) {
            next(err);
        }
    },

    whoami: async (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    user: req.user
                }
            });
        } catch (err) {
            next(err);
        }
    }
};