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

    // Add texto a lista
    li.textContent = inputTarefa.value

    // Append a nova li a ul do card todo
    document.querySelector('#card-todo ul').appendChild(li)

    // origem eh null pois nao existe um card de origem vindo do input
    verificarVazio(null, document.getElementById('card-todo'))

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
        if (cardCode == 0) return document.getElementsByClassName('cards')[cardCode+1]
        else if (cardCode == 1) return document.getElementsByClassName('cards')[cardCode+1]
        else if (cardCode == 2) return null // null porque nao existe um card de destino depois do ultimo card
    }
    const cardDestino = fCardDestino()

    // TODO para DOING e DOING para DONE
    if (cardTargetIdName == 'card-todo' || cardTargetIdName == 'card-doing') {
        const li = document.createElement('li') // add um novo li para o card de destino
        li.textContent = liTarget.textContent // inserir o texto da li que foi clicada
        ulParent.removeChild(liTarget) // remover li do ul do card de origem

        cardDestino.getElementsByClassName('card-list-container')[0].appendChild(li) // Add uma nova li ao ul do card de destino
    }
    // DONE para excluido
    else if (cardTargetIdName == 'card-done') {
        // remover li do card de origem
        ulParent.removeChild(liTarget)
    }
    
    // verificar se os cars de origem e destino precisam ser estilizados caso estejam vazios
    verificarVazio(cardTarget, cardDestino)
}

// Reponsavel por checar se alguma mudanca de estilo precisa ser feita,
// ele deve ser chamado toda vez que uma tarefa for adicionada, ou transitada de um card para o outro, ou removida
function verificarVazio(origem, destino) {
    // encontrar os ul de card origem e de destino
    let ulOrigParent = null
    let ulDestParent = null

    // tentar recurperar a UL dos cards de Origem e Destino, se por acaso algum deles nao existir, definir como null
    try { ulOrigParent = origem.getElementsByClassName('card-list-container')[0] } 
    catch (error) { ulOrigParent = null }

    try { ulDestParent = destino.getElementsByClassName('card-list-container')[0] } 
    catch (error) { ulDestParent = null }

    // verificar se cada card vai ser estilizado ou desestilizado
    // se a origem NAO tiver nenhum elemento, ao transitar para o outro card, eh preciso estilizar como card vazio
    if (ulOrigParent != null)
        if (ulOrigParent.childElementCount == 0)
            modificarEstiloVazio(ulOrigParent, ulDestParent, true)
    
    // se o destino tiver apenas 1 elemento, ao transitar uma nova li para ele, eu preciso desestilaza-lo para receber o primeiro li
    if (ulDestParent != null)
        if (ulDestParent.childElementCount == 1) // aqui foi definido como 1, pois quando a funcao for chamada, ja vai existir 1 novo li
            modificarEstiloVazio(ulOrigParent, ulDestParent, false)
    
}

// Funcao auxiliar de verificarVazio() usada para add ou retirar os estilos dos cards
function modificarEstiloVazio(ulOrigParent, ulDestParent, addEstilo) {
    // add estilos de vazio
    if (addEstilo) {
        ulOrigParent.classList.add('card-list-container-empty') // modificar o estilo da UL para vazio
        ulOrigParent.parentElement.parentElement.style.backgroundColor = "rgb(235, 235, 235)" // no card, escurecer o fundo
        ulOrigParent.parentElement.parentElement.classList.add('cards-vazio') // no card, diminuir box-shadow e remove-lo no hover
    } 
    // retirar estilos de vazio e reverter as modificacoes feitas acima anteriormente
    else {
        ulDestParent.classList.remove('card-list-container-empty')
        ulDestParent.parentElement.parentElement.style.backgroundColor = "white"
        ulDestParent.parentElement.parentElement.classList.remove('cards-vazio')
    }
}
