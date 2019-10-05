document.querySelector("header .btn-add-tarefa").addEventListener("click", addTarefa)

const inputTarefa = document.querySelector('header .input-add-tarefa')

// Add dentro do card de ToDo o novo item de lista, i.e. tarefa
function addTarefa() {
    // Verificar se o usuario passou um campo vazio
    if (!inputTarefa.value) {
        alert('Por favor, informe o nome da tarefa.')
        return
    } 

    // Criar elementos
    const li = document.createElement('li')

    // Add classe ao novo elemento de lista
    li.classList.add('card-list-item')

    // Add texto a lista
    li.textContent = inputTarefa.value

    // Append a nova li a ul do card todo
    document.querySelector('#card-todo ul').appendChild(li)

    inputTarefa.value = ''
}       
