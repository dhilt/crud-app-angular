const express = require('express');
const app = express();
const data = require('./mock.data.json');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.put('/api/notes', (req, res) => {
  let id = req.query.id;

  if (id) {
    let note = data.notes.find(note => note.id == id);
    note.name = req.body.name;
    note.createdAt = req.body.createdAt;
    note.updatedAt = new Date();
    note.description = req.body.description;
    note.text = req.body.text;

    setTimeout(() => res.send({ status: 'ok', updatedNote: note }), 1200);
  } else {
    setTimeout(() => res.send({ status: 'fail', message: 'Error update' }), 1200);
  }
})

app.post('/api/notes', (req, res) => {  
  if(req.body) {
    let note = req.body;    
    data.notes.push(note);
    setTimeout(() => res.send({ status: 'ok' }), 1200);
  } else {
    setTimeout(() => res.send({ status: 'fail' }), 1200);
  }  
})

app.get('/api/note', (req, res) => {
  const id = req.query.id;
  if (id) {
    result = data.notes.find(note => note.id.toString() === id);
    if (result)
      setTimeout(() => res.send({ status: 'ok', note: result }), 1200);
    else
      setTimeout(() => res.send({ status: 'fail', message: 'Not found' }));
  } else
    setTimeout(() => res.send({ status: 'fail', message: 'Not found' }));
})

app.get('/api/notes', (req, res) => {
  let offset = req.query.offset;
  let count = req.query.count;
  let result = null;
  let notesOutput = [];
  let sortBy = "none";
  let sortOrder = "none";
  let total;

  result = data.notes;
  if ((req.query.sortBy == 'createdAt' || req.query.sortBy == 'updatedAt' || req.query.sortBy == 'name') && (req.query.sortOrder == 'asc' || req.query.sortOrder == 'desc')) {
    sortBy = req.query.sortBy;
    sortOrder = req.query.sortOrder;
    let array = data.notes.concat([]);

    if (sortBy == 'name') {
      array.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      })
    }
    if (sortBy == 'createdAt' || sortBy == 'updatedAt') {
      array.sort((a, b) => {
        let dateA = new Date(a[sortBy]);
        let dateB = new Date(b[sortBy]);
        if (dateA < dateB)
          return -1;
        if (dateA > dateB)
          return 1;
        return 0;
      })
    }

    if (sortOrder == 'desc') {
      array.reverse();
    }
    result = array;
  }

  total = result.length;

  if (offset && count) {
    offset = parseInt(offset);
    count = parseInt(count);
    let until = offset + count;
    until > total ? until = total : until;
    result = result.slice(offset, until);
  }

  notesOutput = result.map((note) => {
    let clone = Object.assign({}, note);
    delete clone.text;
    return clone;
  });

  setTimeout(() => res.send({ status: 'ok', total: total, notes: notesOutput }), 1200);
});

app.delete('/api/notes', (req, res) => {
  const id = req.query.id;
  let index, result;
  if (id) {
    data.notes = data.notes.filter(note => note.id.toString() !== id);
    setTimeout(() => res.send({ status: 'ok', message: 'Note was successfully removed' }), 1200);
  } else {
    setTimeout(() => res.send({ status: 'fail', message: 'Not found' }), 1200);
  }
});

app.get('/api/test', (req, res) => {
  res.send('Hello World!');
});

app.listen(3003, () => {
  console.log('Example app listening on port 3003!');
}); 


