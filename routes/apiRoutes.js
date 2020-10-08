const router = require("express").Router();
const path = require("path");
const fs = require("fs");

// API notes page route
router.get("/notes", function(req, res) {

    // Read data file
    fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
        if (err) throw err;

        // Send all data from db.json to client
        res.json(JSON.parse(data));
    });

});

// API notes route
router.post("/notes", function(req, res) {

    // Read data file 
    fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {

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
        fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(notesData, null, 4), err => {
            if (err) throw err;
        })

    });

    res.send(req.body);
});

// API notes route
router.delete("/notes/:id", function(req, res) {

    // Read data file
    fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {

        if (err) throw err;

        // Filter out the object with id specified by user 
        let newNotesData = JSON.parse(data).filter(function(currentNote) {
            return currentNote.id != req.params.id;
        });

        // Write the filtered data to db.json
        fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(newNotesData, null, 4), err => {
            if (err) throw err;
        })

    });
    res.send("deleted");

});

module.exports = router;