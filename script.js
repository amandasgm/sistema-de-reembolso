// - Selecionando elementos do formulario
const form = document.querySelector("form") // para saber quando vai acontecer o evento de submit
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// - Selecionando elementos da lista
const expenseList = document.querySelector("ul")

// - Selecionando elementos da header do aside
const expenseQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector("aside header h2")


//----------: VALIDANDO INPUT (#amount) PARA QUE RECEBA SOMENTE NÚMEROS
// Captura o evento do input
amount.oninput = () => {
  // Obtem o valor atual do input e remove os caracteres não numericos
  let valueFormated = amount.value.replace(/\D/g, "") 

  // Transforma o valor em centavos
  valueFormated = Number(valueFormated) / 100

  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(valueFormated) 
}

//----------: FORMATAÇÃO DE MOEDA (Real Brasileiro)
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado (sem o retorno o input recebe undefined)
  return value
}

//----------: OBSERVANDO O EVENTO DE SUBMIT DO FORMULÁRIO
// Captura o evento de submit do formulario para obter os valores digitados
form.onsubmit = (e) => {
  e.preventDefault() // previne o comportamento padrão de recarregar a pagina ao enviar

  // Cria novos objetos para armazenar propriedades das despesas
  const newExpense = {
    id: new Date().getTime(),
    expense_name: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text, // dentro das opções de category, pegue o texto(.text) do item selecionado([selectedIndex]) 
    amount: amount.value,
    create_at: new Date(), // pega data e hora atual da criação
  }

  expenseAdd(newExpense) // chamando a função de adicionar a despesa na lista
} 

//----------: ADICIONANDO UMA NOVA DESPESA NA LISTA
function expenseAdd(newExpense){
  try {
    // Cria o elemento para adicionar na lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o icone da categoria de acordo com a categoria
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)

    // Cria a div com titulo e categoria
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense_name

    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    const expenseInfo = document.createElement("div") // div
    expenseInfo.classList.add("expense-info")

    // Cria o elemento do valor da despesa
    const expenseAmount = document.createElement('span')
    const amountSimbol = document.createElement('small')

    amountSimbol.textContent = 'R$'
    expenseAmount.classList.add('expense-amount')
    expenseAmount.textContent = newExpense.amount

    // Cria o icone de remove
    const removeIcon = document.createElement('img')
    removeIcon.setAttribute('src', 'img/remove.svg')
    removeIcon.classList.add("remove-icon")

    // Adiciona os elementos no item e o item na lista
    expenseList.append(expenseItem) // ul -> li
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon) // li -> img | div | span | img
    expenseInfo.append(expenseName, expenseCategory) // div -> strong | span
    expenseAmount.prepend(amountSimbol)  // span -> small

    updateTotals() // dps de adicionar cada item, chama a função de atualização de quantidade e valor totais
    formClear()

  } catch (error) {
    alert("Não foi possível adicionar a despesa na lista.")
    console.log(error)
  }
}

//----------: ATUALIZANDO A QUANTIDADE DE DESPESAS NA LISTA E O VALOR TOTAL
function updateTotals(newExpense){
  try {
    // do: Quantidade de despesas 
    // Recupera todos os items (li) da lista (ul)
    const itemsList = expenseList.children
    const itemsCount = itemsList.length
    
    // Atualiza a quantidade de items da lista 
    expenseQuantity.textContent = `${itemsCount} ${itemsCount > 1 ? "despesas" : "despesa"}`

    // do: Valor total
    // Variável para incrementar o total
    let total = 0

    // - Percorrendo CADA ITEM (li) da lista (ul)
    for (let item = 0; item < itemsCount; item++ ){ // para cada item dentro da itemsList
      const itemAmount = itemsList[item].querySelector(".expense-amount") // [item] - acessa o item que esta no momento. 
      
      // Remove caracteres não númericos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent
      .replace(/[^\d,]/g, "")
      .replace(",", ".")

      // Coverte o valor para float para receber os centavos
      value = parseFloat(value)

      // Verifica se é um número válido
      if(isNaN(value)){
        return alert ("Não foi possível calcular o total.")
      }

      // Incrementa o valor total
      total += value
    }

    // expenseTotal.textContent = formatCurrencyBRL(total) // serviria se o R$ nao tivesse 
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"
    
    // Formata o valor e remove o R$ que sera exibido pela small com estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor total formatado
    expenseTotal.append(symbolBRL, total)


  } catch (error) {
    alert("algo deu errado")
    console.log(error)
  }
}

//----------: OBSERVANDO O EVENTO DE CLIQUIE NA LISTA - REMOVER ALGUM ITEM DA LISTA
// Observa o evento que acontecer dentro dessa lista (ul)
expenseList.addEventListener("click", (event) => { // quando alguem clicar em alguma coisa dessa lista
  // Verifica se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {  // se o elemento clicado contem a classe 'remove-icon'
    // Obtem a li pai do elemento clicado (item inteiro)
    const item = event.target.closest(".expense")

    // Remove o item da lista
    item.remove()
  }

  // Atualiza os totais
  updateTotals()
})

//----------: LIMPANDO OS CAMPOS APÓS ADICIONADOS
function formClear() {
  amount.value = ""
  expense.value = ""
  category.value = ""

  expense.focus() // deixando o cursor focado no input
}







// EXPLICANDO: classList é um objeto que possui propriedades
/*
  .add() - adiciona uma classe
  .remove() - remove uma classe
  .contains() - verifica se contain uma classe

*/
