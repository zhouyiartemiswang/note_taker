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

// HTML Routes
// ------------------------------------------------------------------------

// Notes page route
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
    // console.log(path.join(__dirname, "public/notes.html"));
});

// API Routes
// ------------------------------------------------------------------------

// Notes page route
app.get("/api/notes", function(req, res) {

    // Read data file
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        // console.log(JSON.parse(data)[0]);
        return res.json(JSON.parse(data));
    });

});

// Home page route
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) throw err;

        let notesData = JSON.parse(data) || [];
        let newData = req.body;

        if (notesData.length === 0) {
            newData.id = 1;
        } else {
            newData.id = notesData[notesData.length - 1].id + 1;
        }

        notesData.push(newData);
        // console.log(notesData);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesData, null, 4), err => {
            if (err) throw err;
            console.log("writing complete");
        })
    });

    return res.send(req.body);
});

app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        let newNotesData = JSON.parse(data).filter(function(currentNote) {
            return currentNote.id != req.params.id;
        });
        console.log(newNotesData);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(newNotesData, null, 4), err => {
            if (err) throw err;
            console.log("writing complete");
        })
    });
    res.send("deleted");
});

// Start server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});