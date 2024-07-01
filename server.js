import express from 'express'
import { bugService } from './services/bug.service.js'
const app = express()

// app.get('/', (req, res) => res.send('Hello there hi there'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
    .then(bug => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
    // .then(() => res.send(`Bug ${bugId} removed!`))
    .then(()=> res.redirect('/api/bug'))
})









app.listen(3030, () => console.log('Server ready at port 3030'))