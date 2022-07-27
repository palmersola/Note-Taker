const notes_router = require("express").Router();
const fs = require("fs");
const path = require("path");
const db_path = path.join(__dirname, "../db/db.json");

function getNotesData() {
  return fs.promises.readFile(db_path, "utf8").then(data => JSON.parse(data));
}

notes_router.get("/notes", (req, res) => {
  getNotesData()
    .then(notes_data => {
      res.json(notes_data);
    })
    .catch(err => console.log(err));
});

notes_router.post("/notes", (req, res) => {
  getNotesData().then(notes_data => {
    const new_note = req.body;
    const refrence_id = notes_data.length
      ? notes_data[notes_data.length - 1].id
      : 0;
    new_note.id = refrence_id + 1;

    notes_data.push(new_note);

    fs.promises
      .writeFile(db_path, JSON.stringify(notes_data, null, 2))
      .then(() => res.json(notes_data))
      .catch(err => console.log(err));
  });
});

notes_router.delete(`/notes`, (req, res) => {
  getNotesData().then(notes => {
    const id = req.body.id;
    const obj = notes.find(note => note.id === id);
    const index = notes.indexOf(obj);

    notes.splice(index, 1);

    fs.promises
      .writeFile(db_path, JSON.stringify(notes, null, 2))
      .then(() => res.json(notes))
      .catch(err => console.log(err));
  });
});

module.exports = notes_router;
