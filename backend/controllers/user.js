import User from '../models/user.js';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';
import { escape } from 'querystring';

const userControllers = {
    register: async (req, res) => {
        try {
            const { email, password, rePassword } = req.body;

            // check if user already exist
            const userExist = await User.findOne({ email });
            if (userExist) {
                return res
                    .status(400)
                    .json({ message: 'User already exist. Please, login' });
            }
            // validate email, password, rePassword
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const doMatchPasswords = matchPasswords(password, rePassword);

            if ((isValidEmail, isValidPassword, doMatchPasswords)) {
                //hash passwords
                const hashedPassword = hashPassword(password);

                const newUser = new User({
                    email,
                    password: hashedPassword
                });
                await newUser.save();

                res.status(201).json(newUser);
            } else {
                return res.status(400).json({
                    message: 'Invalid email or password'
                });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // check if user already exist
            const userExist = await User.findOne({ email });
            if (!userExist) {
                return res
                    .status(400)
                    .json({ message: 'User already exist. Please, try again' });
            }

            bcrypt.compare(password, userExist.password, (err, isValid) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                if (isValid) {
                    // create token
                    const token = jwt.sign(
                        { userExist },
                        process.env.SECRET_TOKEN
                    );

                    // create cookie
                    res.cookie('token', token, { httpOnly: true });
                    res.cookie('email', userExist.email);
                    res.status(201).json(userExist);
                } else {
                    return res
                        .status(400)
                        .json({ message: 'Oups, try again later!' });
                }
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('token');
        res.clearCookie('email');
        res.status(201).json({ message: 'Successfully logged out' });
    }
};

export default userControllers;
