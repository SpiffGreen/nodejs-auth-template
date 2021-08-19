const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

/**
 * @route       GET api/auth
 * @description Get logged in user
 * @access      Private
 */
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.err(err.message);
        res.status(500).json({ error: "Server-error", msg: "Sorry an error occured while processing your request" });
    }
});

/**
 * @route       POST api/auth
 * @description Auth user & get token
 * @access      Public
 */
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "A valid password is required").exists()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if(!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMath = await bcrypt.compare(password, user.password);
        if(!isMath) return res.status(400).json({ msg: "Invalid Credentials" });
        const payload = {
            user: {id: user.id}
        }
        jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if(err) throw err;
            res.json({error: null, token, msg: "Login successful" });
        });
    } catch (err) {
        cosole.error(err.message);
        res.status(500).json({error: "Server-error", msg: "Sorry an error occured while processing your request" })
    }
});

//  @route      POST api/auth/register
//  @desc       Register a user
//  @access     Public
router.post(
    "/register",
    [
        check("name", "Please include your name").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({min: 6})
    ],
    async (req, res) => {
    // register user here
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ msg: "User already exist", error: []})
        }
        user = new User({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {id: user.id}
        }
        jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if(err) throw err;
            res.json({error: null, token, msg: "User created successfully" });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({error: [], msg: "Server Error"});
    }
});

module.exports = router;