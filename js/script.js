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
    
    // TODO para DOING e DOING para DONE
    const cardTargetIdName = cardTarget.getAttribute('id')
    if (cardTargetIdName == 'card-todo' || cardTargetIdName == 'card-doing') {
        // cardCode vai determinar o card de origem e o de destino
        let cardCode = cardTargetIdName == 'card-todo' ? 0 : 1

        // copiar texto da li clicada
        let liText = liTarget.textContent
        // remover li do card de origem
        ulParent.removeChild(liTarget)
        // add um novo li para o card de destino
        const li = document.createElement('li')
        li.textContent = liText

        // Add uma nova li no card correto
        // 0 = todo, 1 = doing, 2 = done
        document.getElementsByClassName('cards')[cardCode+1].getElementsByClassName('card-list-container')[0].appendChild(li)
    }
    // DONE para excluido
    else if (cardTargetIdName == 'card-done') {
        // remover li do card de origem
        ulParent.removeChild(liTarget)
    }
}
