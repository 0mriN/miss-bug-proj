import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bugs => {
                setBugs(bugs)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBug(bugId) {
        console.log('bugId:', bugId)
        bugService
            .remove(bugId)
            .then(() => {
                console.log(':remove')
                setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
                showSuccessMsg(`Bug (${bugId}) removed!`)
            })
            .catch((err) => {
                console.log('Error from onRemoveBug -', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?')
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }


    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => {
            let nextPageIdx
            if (prevFilter.pageIdx !== undefined) nextPageIdx = 0
            return { ...prevFilter, ...filterBy, pageIdx: nextPageIdx }
        })
    }

    function togglePagination() {
        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }
        })
    }
    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            </section>
            <section>
                <button onClick={togglePagination}>Toggle Pagination</button>
                <button onClick={() => onChangePage(-1)}>-</button>
                {filterBy.pageIdx + 1 || 'No Pagination'}
                <button onClick={() => onChangePage(1)}>+</button>
            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
