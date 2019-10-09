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

// Eu preciso clicar em um item de uma lista
// e entao, a partir desse clique, saber exatamente
// qual o item, para entao pegar o texto dentro dele
// e passar para o proximo card
document.querySelector('#card-todo ul').addEventListener("click", transitarTarefa);
document.querySelector('#card-doing ul').addEventListener("click", transitarTarefa);
document.querySelector('#card-done ul').addEventListener("click", transitarTarefa);

function transitarTarefa() {
    const liTarget = event.target // aponta para o item li que foi clicado
    const ulParent = liTarget.parentElement // aponta para o ul que e pai do li
    const cardTarget = ulParent.parentElement.parentElement // aponta para o card pai do li: todo, doing ou done
    const cardTargetIdName = cardTarget.getAttribute('id') // retorna o id do card de origem
    
    let cardCode = -1 // cardCode vai determinar o card de origem e de destino
    if (cardTargetIdName == 'card-todo') cardCode = 0
    else if (cardTargetIdName == 'card-doing') cardCode = 1
    else if (cardTargetIdName == 'card-done') cardCode = 2

    // definir o card de destino com base no card code
    fCardDestino = () => {
        if (cardCode == 0) return document.getElementsByClassName('cards')[cardCode+1].getElementsByClassName('card-list-container')[0]
        else if (cardCode == 1) return document.getElementsByClassName('cards')[cardCode+1].getElementsByClassName('card-list-container')[0]
        else if (cardCode == 2) return null // null porque nao existe um card de destino depois do ultimo card
    }
    const cardDestino = fCardDestino()

    // TODO para DOING e DOING para DONE
    if (cardTargetIdName == 'card-todo' || cardTargetIdName == 'card-doing') {
        const li = document.createElement('li') // add um novo li para o card de destino
        li.textContent = liTarget.textContent // inserir o texto da li que foi clicada
        ulParent.removeChild(liTarget) // remover li do ul do card de origem

        cardDestino.appendChild(li) // Add uma nova li no card de destino
    }
    // DONE para excluido
    else if (cardTargetIdName == 'card-done') {
        // remover li do card de origem
        ulParent.removeChild(liTarget)
    }
}
