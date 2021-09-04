const express = require("express");
const path = require("path");
const app = express();
const EADDRINUSE = "EADDRINUSE";

// Connect to database
require("./config/db")();

// Middlewares
app.use(express.json({ extended: false }));

// Api Routing
app.use("/api/users", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));

let PORT = process.env.PORT || 5000;
process.on("uncaughtException", (err) => {
    if(err.code == EADDRINUSE) {
        PORT++;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));