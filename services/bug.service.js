import { utilService } from "./util.service.js"
import fs from 'fs'

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save,

}

function query(filterBy = {}) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            if (filterBy.labels.length) {
                const regExp = new RegExp(filterBy.labels, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.labels))
            }
            if (filterBy.sortBy) {
                if (filterBy.sortBy === 'title') {
                    bugs =
                        bugs.sort((bug1, bug2) =>
                            bug1.title.localeCompare(bug2.title) * filterBy.sortDir)

                } else if (filterBy.sortBy === 'severity') {
                    bugs =
                        bugs.sort((bug1, bug2) =>
                            (bug1.severity - bug2.severity) * filterBy.sortDir)

                } else if (filterBy.sortBy === 'createdAt') {
                    bugs =
                        bugs.sort((bug1, bug2) =>
                            (bug1.createdAt - bug2.createdAt) * filterBy.sortDir)
                }
            }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    console.log('bugIdx:', bugIdx);
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile().then(() => `bug (${bugId}) removed!`)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}