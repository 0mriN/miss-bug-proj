import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
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

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        // .then(() => res.send(`Bug ${bugId} removed!`))
        .then(() => res.redirect('/api/bug'))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs', err)
        })
})







const port = 3030
app.listen(port, () =>
    loggerService.info((`Server ready at port https://127.0.0.1:${port}/`))
)