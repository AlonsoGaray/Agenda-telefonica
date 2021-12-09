const express = require('express');
const morgan = require('morgan')

const app = express();
app.use(express.json());
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))
morgan.token('body', function (req, res) { 
  return [
      JSON.stringify(req.body)
  ] 
})


const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
];

const customMiddleware = (req, res, next) => {
  next()
}

app.get('/api/persons/', (req, res) => {
  res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (!person) res.status(404).json({ error: `Person with id ${id} not found `})

  res.send(person);
})

function timeZone () {
  return new Date().toString();
}

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br><br>
  ${timeZone()}`)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const notesFiltered = persons.filter(note => note.id !== id)

  // return res.json(notesFiltered)
  return res.json(notesFiltered).status(204).end()
  
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000) + 1;
}

app.post('/api/persons', customMiddleware, (req, res) => {
  const person = req.body

  if (!person.name) {
    return res.status(400).json({ error: `name missing` })
  }
  if (!person.number) {
    return res.status(400).json({ error: `number missing` })
  }
  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({ error: `name must be unique` })
  }

  person.id = generateId()
  persons.push(person)
  
  res.status(200).json({...person, id:generateId()})  
})

const PORT = 3001

// Start server
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
})
