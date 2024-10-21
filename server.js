const express = require('express')
const cors = require('cors')
const path = require('path')

//Start the server

const port = process.env.PORT || 3001
const app = express()

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

//Data

let notes = [
    { id: "0", content: 'I want to learn authentification.', important: true },
    { id: "1", content: 'I love sleeping.', important: false }
]

let nextId = 2

//Register middlewear

app.use(cors())
app.use(express.json())
app.use(express.static('frontend'))


// endpoint for the starting page

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/index.html'))
})



// api endpoints

app.get('/api/notes', (req, res) => {
    res.send(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    console.log(note)
    if (!note) {
        res.status(404).send()
    }
    res.send(note)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    if (!notes.find(note => note.id === id)) {
        res.status(404).end()
    }
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const body = req.body
    const note = {
        id: `${nextId}`,
        content: body.content,
        important: body.important
    }
    nextId++
    notes.push(note)
    res.status(201).json(note)
})

app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    if (!note) {
        res.status(404).end()
    }
    note.content = req.body.content
    note.important = req.body.important
    res.status(200).json(note)
})