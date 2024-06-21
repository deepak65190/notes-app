const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const joi = require('joi');
const noteRoutes = express.Router();

const notesDirectory = path.join(__dirname, "../notes");
//list of all notes
noteRoutes.get("/", (req, res) => {
    const files=fs.readdirSync(notesDirectory) ;
    const notes = files.map(file => {
     return fs.readFileSync(path.join(notesDirectory, file), 'utf-8');
        
    });

  res.send(notes);
});

// Note validation schema
const noteSchema = joi.object({
    title: joi.string().required(), 
    content: joi.string().required(),
});

//create note
noteRoutes.post("/", (req, res) => {
    const {error}=noteSchema.validate(req.body)
    if (error){
        res.status(400).json({ error: error.details[0].message });
    } else{
        const { title, content } = req.body;
  const uniqe_id = uuidv4();
  const note = {
    title,
    content,
    id: uniqe_id,
  };
 
  fs.writeFile(path.join(notesDirectory, `${uniqe_id}.json`),
    JSON.stringify(note),
    (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      }else{
        res.send("note created")
      }
    }
  );

  res.status(201).json(note);
    }
  
});

// Update a note by ID
noteRoutes.put('/:id', async (req, res) => {
    const { error } = noteSchema.validate(req.body);
    if (error){
        res.status(400).json({ error: error.details[0].message });
    }else{
        const noteId = req.params.id;
    const { title, content } = req.body;
    const notePath = path.join(notesDirectory, `${noteId}.json`);
    try {
        const updatedNote = { id: noteId, title, content };
        fs.writeFile(notePath ,JSON.stringify(updatedNote) ,(err)=>{
            if(err){
                console.log(err)
            }else{
                res.json(updatedNote);
            }
        })
       
       
    } catch {
        res.status(404).json({ error: 'Note not found' });
    }
    }

    
});
// Delete a note by ID

noteRoutes.delete('/:id', async (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);
    const notePath = path.join(notesDirectory, `${noteId}.json`);
    console.log(notePath);
    try {
       fs.unlink(notePath ,(err)=>{
        if(err){
            res.send(err)
        }else{
            res.json({ message: 'Note deleted successfully' });
        }
       }) 
        
    } catch (error) {
        console.error(error);  
        res.status(404).json({ error: 'Note not found' });
    }
});


module.exports = noteRoutes;
