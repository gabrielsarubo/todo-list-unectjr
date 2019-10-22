const ulCardTodo = document.querySelector('#card-todo ul')
const ulCardDoing = document.querySelector('#card-doing ul')
const ulCardDone = document.querySelector('#card-done ul')

const btnAddTarefa = document.querySelector("header .btn-add-tarefa")
const inputTarefa = document.querySelector('header .input-add-tarefa')

const save = (cardNum) => {
    let listItems = null
    if (cardNum == 0) {
        listItems = ulCardTodo.getElementsByTagName("li") // card = 0
    } else if (cardNum == 1) {
        listItems = ulCardDoing.getElementsByTagName("li") // card = 1
    } else if (cardNum == 2) {
        listItems = ulCardDone.getElementsByTagName("li") // card = 2
    } else { return }

    let arrTarefas = []

    if (localStorage.getItem('arrTarefas')) {    
        arrTarefas = JSON.parse(localStorage.getItem('arrTarefas'))
    }

    // marcar tudo que esta no Local Storage o card X com card == -1
    for (let i = 0; i < arrTarefas.length; i++) {
        if (arrTarefas[i].card == cardNum) {
            arrTarefas[i].card = -1
        }
    }
    // aux da funcao que vai remover por card == -1
    let filtered = arrTarefas.filter(function(cardNumber) {
        return cardNumber.card != -1
    })
    
    // add tudo de novo
    for (let i = 0; i < listItems.length; i++) {
        filtered.push({card: cardNum, text: listItems[i].textContent})
    }
    
    localStorage.setItem('arrTarefas', JSON.stringify(filtered))
}

const load = () => {
    if (localStorage.getItem('arrTarefas')) {
        let arrTarefas = JSON.parse(localStorage.getItem('arrTarefas'))

        for (let i = 0; i < arrTarefas.length; i++) {
            // buscar os LIs do card todo
            if (arrTarefas[i].card == 0) {
                // add o texto dentro do card todo
                let li = document.createElement('li')
                li.textContent = arrTarefas[i].text
                ulCardTodo.appendChild(li)

                verificarVazio(null, document.getElementById('card-todo'))
            }

            // buscar os LIs do card doing
            else if (arrTarefas[i].card == 1) {
                // add o texto dentro do card doing
                let li = document.createElement('li')
                li.textContent = arrTarefas[i].text
                ulCardDoing.appendChild(li)

                verificarVazio(null, document.getElementById('card-doing'))
            }

            // buscar os LIs do card done
            else if (arrTarefas[i].card == 2) {
                // add o texto dentro do card done
                let li = document.createElement('li')
                li.textContent = arrTarefas[i].text
                ulCardDone.appendChild(li)

                verificarVazio(null, document.getElementById('card-done'))
            }
        }
    }
}

// Add dentro do card de ToDo o novo item de lista, i.e. tarefa
const addTarefa = () => {
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

    save(0)

    inputTarefa.value = ''
}       

// Eu preciso clicar em um item de uma lista e entao, a partir desse clique, saber exatamente
// qual o item, para entao pegar o texto dentro dele e passar para o proximo card
const transitarTarefa = (e) => {
    const liTarget = e.target // aponta para o item li que foi clicado
    const ulParent = liTarget.parentElement // aponta para o ul que e pai do li
    const cardTarget = ulParent.parentElement.parentElement // aponta para o card pai do li: todo, doing ou done
    const cardTargetIdName = cardTarget.getAttribute('id') // retorna o id do card de origem
    
    let cardCode = null // cardCode vai determinar o card de origem e de destino
    if (cardTargetIdName == 'card-todo') cardCode = 0
    else if (cardTargetIdName == 'card-doing') cardCode = 1
    else if (cardTargetIdName == 'card-done') cardCode = 2

    // definir o card de destino com base no card code
    if (cardCode == 0) cardDestino = document.getElementsByClassName('cards')[cardCode+1]
    else if (cardCode == 1) cardDestino = document.getElementsByClassName('cards')[cardCode+1]
    else if (cardCode == 2) cardDestino = null // null porque nao existe um card de destino depois do ultimo card

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

    save(0)
    save(1)
    save(2)
}

// Reponsavel por checar se alguma mudanca de estilo precisa ser feita,
// ele deve ser chamado toda vez que uma tarefa for adicionada, ou transitada de um card para o outro, ou removida
const verificarVazio = (origem, destino) => {
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
const modificarEstiloVazio = (ulOrigParent, ulDestParent, addEstilo) => {
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

// Executa uma funcao quando o usuario clica em uma tecla no teclado
inputTarefa.addEventListener("keyup", function(event) {
  // Numero 13 eh a tecla "Enter" do teclado
  if (event.keyCode === 13) {
    // Cancele a acao padrao, se necessario
    event.preventDefault();
    // Trigger o botao com um clique
    btnAddTarefa.click();
  }
});

ulCardTodo.onclick = transitarTarefa
ulCardDoing.onclick = transitarTarefa
ulCardDone.onclick = transitarTarefa

btnAddTarefa.onclick = addTarefa

// verificar se os cards estao vazios ao carregar a pagina
verificarVazio(document.querySelector('#card-todo'), null)
verificarVazio(document.querySelector('#card-doing'), null)
verificarVazio(document.querySelector('#card-done'), null)

load()