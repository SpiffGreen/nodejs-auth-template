const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");

// Perform operations for users

// User account functions - all are made private with the auth middleware
router.post("/change/name", auth, (req, res) => {});
router.post("/change/password", auth, (req, res) => {});
router.post("/change/email", auth, (req, res) => {});

module.exports = router;