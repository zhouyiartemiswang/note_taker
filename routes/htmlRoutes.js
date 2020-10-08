const router = require("express").Router();
const path = require("path");


// Notes page route
router.get("/notes", function(req, res) {
    // Direct to notes.html
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// Home page route, if anything other than /notes and /api/notes are entered in url, direct to home page
router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;