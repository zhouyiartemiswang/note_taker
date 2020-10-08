// Set up dependencies
const express = require("express");
const apiRoutes = require("./routes/apiRoutes.js");
const htmlRoutes = require("./routes/htmlRoutes.js");

// Set up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the Express App to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// Start server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});