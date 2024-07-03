
import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked ? -1 : 1
                break

            default:
                break;
        }

        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    const { title, severity, labels, sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form>
                <label htmlFor="title">Title</label>
                <input value={title} onChange={handleChange} name="title" type="text" id="title" />

                <label htmlFor="severity">Severity</label>
                <input value={severity || ''} onChange={handleChange} name="severity" type="number" id="severity" />

                <label htmlFor="labels">labels</label>
                <input value={labels} onChange={handleChange} name="labels" type="text" id="labels" />

            </form>
            <label htmlFor="sortBy">Sort by:</label>
            <select name="sortBy" value={sortBy} onChange={handleChange}>
                <option value="">Select Sorting</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>

            <label htmlFor="sortDir">Sort descending:</label>
            <input
                type="checkbox"
                name="sortDir"
                id="sortDir"
                checked={sortDir === -1}
                onChange={handleChange}
            />
        </section>
    )
}