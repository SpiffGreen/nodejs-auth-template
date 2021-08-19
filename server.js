const express = require("express");
const path = require("path");
const app = express();

// Connect to database
require("./config/db")();

// Middlewares
app.use(express.json({ extended: false }));

// Api Routing
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));