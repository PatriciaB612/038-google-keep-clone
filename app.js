class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || []
    this.title = ''
    this.text = ''
    this.id = ''

    this.$form = document.querySelector('#form')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')
    this.$notes = document.querySelector('#notes')
    this.$placeholder = document.querySelector('#placeholder')
    this.$formCloseButton = document.querySelector('#form-close-button')
    this.$modal = document.querySelector('.modal')
    this.$modalTitle = document.querySelector('.modal-title')
    this.$modalText = document.querySelector('.modal-text')
    this.$modalCloseButton = document.querySelector('.modal-close-button')
    this.$colorTooltip = document.querySelector('#color-tooltip')

    this.render()
    this.addEventListeners()
  }

  addEventListeners() {
    document.body.addEventListener('click', (e) => {
      this.handleFormClick(e)
      this.selectNote(e)
      this.openModal(e)
      this.deleteNote(e)
    })

    document.body.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      this.openTooltip(e)
    })

    document.body.addEventListener('mouseout', (e) => {
      this.closeTooltip(e)
    })

    this.$colorTooltip.addEventListener('mouseover', function () {
      this.style.display = 'flex'
    })

    this.$colorTooltip.addEventListener('mouseout', function () {
      this.style.display = 'none'
    })

    this.$colorTooltip.addEventListener('click', (e) => {
      const color = e.target.dataset.color
      if (color) {
        this.editNoteColor(color)
      }
    })

    this.$form.addEventListener('submit', (e) => {
      e.preventDefault()
      const title = this.$noteTitle.value
      const text = this.$noteText.value
      const hasNote = title || text

      if (hasNote) {
        this.addNote({ title, text })
      }
    })

    this.$formCloseButton.addEventListener('click', (e) => {
      e.stopPropagation()
      this.closeForm()
    })

    this.$modalCloseButton.addEventListener('click', () => {
      this.closeModal()
    })
  }

  handleFormClick(e) {
    const isFormClicked = this.$form.contains(e.target)

    const title = this.$noteTitle.value
    const text = this.$noteText.value
    const hasNote = title || text

    if (isFormClicked) {
      this.openForm()
    } else if (hasNote) {
      this.addNote({ title, text })
    } else {
      this.closeForm()
    }
  }

  openForm() {
    this.$form.classList.add('form-open')
    this.$noteTitle.style.display = 'block'
    this.$formButtons.style.display = 'block'
  }

  closeForm() {
    this.$form.classList.remove('form-open')
    this.$noteTitle.style.display = 'none'
    this.$formButtons.style.display = 'none'
    this.$noteText.value = ''
    this.$noteTitle.value = ''
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    }
    this.notes = [...this.notes, newNote]
    this.render()
    this.closeForm()
  }

  selectNote(e) {
    const $selectedNote = e.target.closest('.note')
    if (!$selectedNote) {
      return
    }
    const [$noteTitle, $noteText] = $selectedNote.children
    this.title = $noteTitle.innerText
    this.text = $noteText.innerText
    this.id = $selectedNote.dataset.id
  }

  openModal(e) {
    if (e.target.matches('.toolbar-delete')) return

    if (e.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal')
      this.$modalTitle.value = this.title
      this.$modalText.value = this.text
    }
  }

  closeModal() {
    this.$modal.classList.toggle('open-modal')
    this.editNote()
  }

  openTooltip(e) {
    if (!e.target.matches('.toolbar-color')) return
    this.id = e.target.dataset.id
    const noteCoords = e.target.getBoundingClientRect()
    const horizontal = noteCoords.left + window.scrollX + 10
    const vertical = noteCoords.top + window.scrollY + 10
    this.$colorTooltip.style.left = `${horizontal}px`
    this.$colorTooltip.style.top = `${vertical}px`
    this.$colorTooltip.style.display = 'flex'
  }

  closeTooltip(e) {
    if (!e.target.matches('.toolbar-color')) return
    this.$colorTooltip.style.display = 'none'
  }

  editNote() {
    const title = this.$modalTitle.value
    const text = this.$modalText.value
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    )
    this.render()
  }

  deleteNote(e) {
    e.stopPropagation()
    if (!e.target.matches('.toolbar-delete')) return
    const id = e.target.dataset.id
    this.notes = this.notes.filter((note) => note.id !== Number(id))
    this.render()
  }

  editNoteColor(color) {
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, color } : note
    )
    this.render()
  }

  render() {
    this.saveNotes()
    this.displayNotes()
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes() {
    const hasNote = this.notes.length > 0
    this.$placeholder.style.display = hasNote ? 'none' : 'flex'

    this.$notes.innerHTML = this.notes
      .map(
        (note) =>
          `<div style="background: ${note.color};" class="note" data-id='${
            note.id
          }'>
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id='${
                note.id
              }' src="images/paint-palette-icon.svg">
              <img class="toolbar-delete" data-id='${
                note.id
              }' src="images/trash-can-icon.svg">
            </div>
          </div>
        </div>`
      )
      .join('')
  }
}

new App()
