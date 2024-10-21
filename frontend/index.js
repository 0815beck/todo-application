let notes = []
const baseUrl = window.location.href

document.addEventListener('DOMContentLoaded', async function(event) {


//  get the list of notes from the server

    const response = await fetch(`${baseUrl}/api/notes`)
    const data = await response.json()
    notes = data
    const ul = document.getElementById('note-list')

//  render the notes to the page

    for(const note of notes) {
        ul.appendChild(createLi(note))
    }


//  add event listeners to the delete and importance buttons

    for(const li of ul.children) {
        addEventListeners(li)
    }

//add an event listener to the submit button

    const form = document.getElementById("new-note-form")
    const textField = document.getElementById("new-note-text")
    form.addEventListener('submit', async function(event) {
        event.preventDefault()
        const newNote = {
            content: textField.value,
            important: false
        }
        textField.value=''
        const response = await fetch(`${baseUrl}/api/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        })
        if (!response.ok) {
            console.error('Unable to post new note')
            return
        }
        const returnedNote = await response.json()
        notes.push(returnedNote)
        const li = createLi(returnedNote)
        ul.appendChild(li)
        addEventListeners(li)
    })
})


function createLi(note) {
    const li = document.createElement('li')
    li.className = `note ${note.important ? 'important-note' : 'unimportant-note'}`
    li.id = `note-${note.id}`
    li.noteId = note.id
    li.innerHTML = 
    `
        <p>${note.content}</p>
        <p>
            <img class="btn importance-btn" src="icons/important.svg"/>
            <img class="btn delete-btn" src="icons/delete.svg"/>
        </p>
    `
    return li
}

function addEventListeners(li) {
    const id = li.noteId
    let note = notes.find(note => note.id === id)

// delete button event listener
    const deleteBtn = document.querySelector(`#${li.id} .delete-btn`)
    console.log(deleteBtn)
    deleteBtn.addEventListener('click',  async function(event) {
        const response =  await fetch(
            `${baseUrl}/api/notes/${id}`, 
            { method: 'DELETE' }
        )
        if (!response.ok) {
            console.error('Unable to delete note')
            return
        }
        notes = notes.filter(note => note.id !== id)
        console.log(li)
        li.remove()
    })

// importance button event listener
    const importanceBtn = document.querySelector(`#${li.id} .importance-btn`)
    importanceBtn.addEventListener('click', async function(event) {
        const response = await fetch(
            `${baseUrl}/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({important: !note.important, content: note.content})
        })
        if (!response.ok) {
            console.error(`Unable to change the importance of note with id ${note.id}`)
            return
        }
        const updatedNote = await response.json()
        note = updatedNote
        li.className = `note ${note.important ? 'important-note' : 'unimportant-note'}`
    })
}
