
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT || 3001

morgan.token('person', function getBody(req) {
    return JSON.stringify(req.body)
})

//middleware for unknown endpoint request
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
} 

//middlewares
app.use(express.json())
//to use cross origin file transfer 
app.use(cors())
//enables the app to consume static files in built front end folder
app.use(express.static('build'))
//log to console the given data 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(morgan('tiny'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-12345",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "046-02345",
        id: 2
    },
    {
        name: "Dan Abromove",
        number: "040-10909",
        id: 3
    },
    {
        name: "Hussen",
        number: "040-19909",
        id: 4
    },
    {
        name: "Hamza",
        number: "040-19909",
        id: 5
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook from backend</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p> 
        <p>${new Date()}</p>`
    )
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).send({ error: "resourse not found" })
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const request = req.body
    if (Object.keys(request).length === 0 || request.name === '' || request.number === '' || typeof request.name !== 'string' || request.name === null || request.number === undefined || request === NaN) {
        // Remember calling return is crucial 
       return res.status(400).json({ error: "name and number should be given" }).end()
    } else {
        const personExist = persons.find(person => person.name.toLowerCase() === request.name.toLowerCase())
        if (personExist) {
           return  res.status(409).json({ error: "name must be unique" }).end()
        } else {
            const id = Math.floor(Math.random() * 1000000)
            const person = { 
                name:request.name,
                number:request.number,
                id: id
            }
            persons = persons.concat(person)
            res.json(person)
        }
    }
})
app.put('/api/persons/:id', (req, res) => {    
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        const newNumber = req.body.number
        const changedPerson = { ...person, number: newNumber }

        persons = persons.map(person => person.id !== id ? person : changedPerson)

        res.json(changedPerson)
    }else{
       return res.status(400).json({error:"Unkown end point"}).end()
    }
})
//to catch unknown endpoints 
app.use(unknownEndpoint)

app.listen(PORT, (error) => {
    console.log(`Server running  on port number ${PORT}`)
})