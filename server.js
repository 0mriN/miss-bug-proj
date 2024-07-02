import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity,
        pageIdx: req.query.pageIdx
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

app.post('/api/bug', (req, res) => {

    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

app.put('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const { visitedBugs = [] } = req.cookies

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('you cant visit more bugs atm')
        else visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log('bugId:', bugId);
    bugService.remove(bugId)
        .then(() => res.send(`Bug ${bugId} removed!`))
        // .then(() => res.redirect('/api/bug'))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

const port = 3030
app.listen(port, () =>
    loggerService.info((`Server ready at port https://127.0.0.1:${port}/`))
)