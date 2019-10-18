const ul = document.querySelector('ul')
const form = document.querySelector('form')
const button = document.querySelector('button')

function addRecipe(recipe, id) {
    let time = recipe.created_at.toMillis()
    let now = new Date().getTime()
    let formatted = dateFns.distanceInWords(now, time, { addSuffix: true })
    let html = `<li data-id="${id}">
    <div> ${recipe.title}</div>
    <div> ${formatted} </div>
    <button class="btn btn-danger btn-sm my-2"> delete </button> </li>`
    ul.innerHTML += html
}

function deteleRecipe(id) {
    const recipes = document.querySelectorAll('li')
    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.remove()
        }
    })
}

form.addEventListener('submit', e => {
    e.preventDefault()
    let now = new Date()
    let recipe = {
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('recipes').add(recipe)
        .then(() => console.log('recipe added'))
        form.reset()
})

// db.collection('recipes').get()
// .then(snapshot => {
// 	snapshot.docs.forEach(doc => console.log(doc.data()))
// })

const unSub = db.collection('recipes').onSnapshot(snapshot => {
    console.log(snapshot.docChanges())
    snapshot.docChanges().forEach(change => {
        const doc = change.doc
        if (change.type === 'added') {
            addRecipe(doc.data(), doc.id)
        } else if (change.type === 'removed') {
            deteleRecipe(doc.id)
        }
    })
})

ul.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('recipes').doc(id).delete()
            .then(() => console.log('deleted'))
    }
})

//unsubscribe from changes
button.addEventListener('button', () => {
    unSub()
    console.log('un subscribed from collection changes.')
})
