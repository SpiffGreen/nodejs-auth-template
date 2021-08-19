const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb";

function connectToDatabase() {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connected to Database"))
    .catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}

module.exports = connectToDatabase;