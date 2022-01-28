window.getItem = (id) => {
    return window.items[id]
}

window.enableBtns = () => {
    document.querySelector('#delete').disabled = false
    document.querySelector('#update').disabled = false
}

window.disableBtns = () => {
    document.querySelector('#delete').disabled = true
    document.querySelector('#update').disabled = true
}

document.querySelector('#delete').addEventListener('click', () => {
    window.selectedItem.delete()
    window.disableBtns()
})

let createModal = document.querySelector('#createItem')
let updateModal = document.querySelector('#updateItem')

createModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('input#createItemName').focus()
})

createModal.querySelector('button.btn-success').addEventListener('click',(event) => {
    newname = document.querySelector('input#createItemName').value
    new Item(newname)
})

updateModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('input#updateItemName').focus()
})

updateModal.querySelector('button.btn-success').addEventListener('click', (event) => {
    window.disableBtns()
    newname = document.querySelector('input#updateItemName').value
    window.getItem(document.querySelector('input#hiddenID').value).update(newname)
})

class Item {
    constructor(name) {
        this.create(name)
    }

    delete() {
        // localStorage.removeItem(this.id)
        delete window[this.id]
        document.querySelector("#i-" + this.id).remove()
    }

    update(name) {
        this.name = name
        this.updated = Date.now()
        this.save()
        this.render()
    }

    create(name) {
        // this.id = crypto.randomUUID() does not work in safari
        this.id = this.generateID()
        this.name = name
        this.created = Date.now()
        this.updated = 0
        this.save()
        this.render()
    }

    generateID() {
        let ID = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for ( var i = 0; i < 12; i++ ) {
          ID += characters.charAt(Math.floor(Math.random() * 36));
        }
        return ID;
      }

    render() {
        let el = document.createElement('li')
        el.id = 'i-' + this.id
        el.classList.add("list-group-item")
        el.classList.add("list-group-item-action")
        el.classList.add("d-flex", "justify-content-between", "align-items-center")
        el.innerHTML = '<div><input class="form-check-input me-1" type="checkbox"> <span>' + this.name + '</span></div> <div class="moveBtns"></div>'
        el.addEventListener('click', this.click.bind(this))
        el.addEventListener('mouseenter', this.mouseenter.bind(this))
        el.addEventListener('mouseleave', this.mouseleave.bind(this))
        if (document.querySelector("#i-" + this.id)) {
            document.querySelector("#i-" + this.id).replaceWith(el)
        } else {
            document.querySelector('#items').append(el)
        }
    }

    getElement() {
        return document.querySelector('#i-' + this.id)
    }

    mouseleave() {
        this.hideMoveButtons()
    }

    mouseenter() {
        this.showMoveButtons()
    }

    hideMoveButtons() {
        this.getElement().querySelector('.moveBtns').innerHTML = ""
    }

    showMoveButtons() {
        let btns = this.getMoveButtons()
        btns.map((btn) => {
            this.getElement().querySelector('.moveBtns').append(btn)
        })
    }

    getMoveButtons() {
        let el = this.getElement()
        let btns = []
        if (el.previousElementSibling) {
            let iup = document.createElement('i')
            iup.classList.add('bi', 'bi-caret-up-fill', 'fs-6')
            iup.addEventListener('click', this.moveUp.bind(this))
            btns.push(iup)
        }
        if (el.nextElementSibling) {
            let idown = document.createElement('i')
            idown.classList.add('bi', 'bi-caret-down-fill', 'fs-6')
            idown.addEventListener('click', this.moveDown.bind(this))
            btns.push(idown)
        }

        return btns
    }

    moveUp() {
        this.getElement().parentElement.insertBefore(this.getElement(), this.getElement().previousElementSibling)
    }

    moveDown() {
        this.getElement().parentElement.insertBefore(this.getElement(), this.getElement().nextElementSibling.nextElementSibling)
    }

    click(event) {
        if (event.target.nodeName == 'LI') {
            if (event.target.classList.contains('active')) {
                event.target.querySelector('input').checked = false
                event.target.classList.remove('active')
                disableBtns()
            } else {
                if (document.querySelector('li.active > div > input')) {
                    let e = document.querySelector('li.active > div > input')
                    e.checked = false
                    e.parentElement.parentElement.classList.remove('active')
                }
                event.target.classList.add('active')
                event.target.querySelector('input').checked = true
                console.log('item#' + this.id + ' selected');
                enableBtns()

                document.querySelector('input#updateItemName').value = this.name
                document.querySelector('input#hiddenID').value = this.id
                document.querySelector('#updateLabel').innerText = "update item#" + this.id

                window.selectedItem = this

            }
        }
    }

    save() {
        // localStorage.setItem(this.id, this)
        window.items[this.id] = this
    }
}

window.items = {}

new Item('lorem')
new Item('ipsum')
new Item('dolor')
new Item('sit')
new Item('amet')