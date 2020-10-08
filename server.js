// Set up dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Set up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the Express App to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Notes page route
app.get("/notes", function(req, res) {
    // Direct to notes.html
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// API notes page route
app.get("/api/notes", function(req, res) {

    // Read data file
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) throw err;

        // Send all data from db.json to client
        res.json(JSON.parse(data));
    });

});

// Home page route, if anything other than /notes and /api/notes are entered in url, direct to home page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// API notes route
app.post("/api/notes", function(req, res) {

    // Read data file 
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {

        if (err) throw err;

        // Create an array to house data in db.json
        let notesData = JSON.parse(data) || [];

        // Create an object to house incoming data
        let newData = req.body;

        // If nothing in db.json
        if (notesData.length === 0) {
            // Then incoming data id = 1
            newData.id = 1;
        } 
        // Otherwise, the id will be the last object's id + 1
        else {
            newData.id = notesData[notesData.length - 1].id + 1;
        }

        // Add incoming data to stored data array
        notesData.push(newData);

        // Write new data array to db.json
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesData, null, 4), err => {
            if (err) throw err;
        })

    });

    res.send(req.body);
});

// API notes route
app.delete("/api/notes/:id", function(req, res) {

    // Read data file
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {

        if (err) throw err;

        // Filter out the object with id specified by user 
        let newNotesData = JSON.parse(data).filter(function(currentNote) {
            return currentNote.id != req.params.id;
        });

        // Write the filtered data to db.json
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(newNotesData, null, 4), err => {
            if (err) throw err;
        })

    });
    res.send("deleted");

});

// Start server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});