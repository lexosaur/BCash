const router = require('express').Router();
const {User} = require('../../models');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../utils/helpers');

//Create new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            accountNumber: req.body.accountNumber,
        });
        res.status(200).json(newUser);
    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//Login route
router.post('/login', async (req, res) => {
    try {
        const dbUser = await User.findOne( {
            where: {
                email: req.body.email,
            },
        });
        if (!dbUser) {
            res.status(400).json({message: 'Incorrect email or password!'});
            return;
        }

        const validPassword = await dbUser.validatePassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({message: 'Incorrect email or password!'});
            return;
        }

        const userData = dbUser.toJSON();
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({accessToken: accessToken, message: 'Login successful!'})

    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/findbyemail/:email', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne( {
            where: {
                email: req.params.email,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;