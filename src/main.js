import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// Defino aqui as Cores dos cartões:
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    rocketseat: ["#0D6F5D", "#C3129C"],
    default: ["black", "gray"],
  }

  // Modifico o Background dos cartões aqui:
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
// Variável para selecionar qual é o tipo do cartão:
globalThis.setCardType = setCardType

//***********************************************************************
//*********** DEFINIÇÕES DO CÓDIGO DE SEGURANÇA DO CARTÃO: **************
//***********************************************************************
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)


//***********************************************************************
//***********  DATA DE EXPIRAÇÃO DO CARTÃO: *****************************
//***********************************************************************
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),   	// DE: Crio uma data, pego o ano, e slice (pego os dois ultimos dígitos) depois transformo em string
      to: String(new Date().getFullYear() + 10).slice(2),	// PARA:
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern) // Ativo a máscara que eu criei.

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [ // Crio um Array com máscaras
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  // Valido cada vez que o valor é digitado, essa é a função do dispatch.
  dispatch: function (appended, dynamicMasked) { 
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")    // se é digitado algo que não é numérico aqui eu simplesmente não permito a adição.
    const foundMask = dynamicMasked.compiledMasks.find(function (item) { 
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)


// Adição do botão para adicionar...
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()		// Aqui eu não permito que o site recarregue como é o padrão ...
})

// Modificação da tela em tempo real:
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value  // IF ternário: A === B ? (if)  : senão.
  // === é para dizer que é igual e também do mesmo tipo
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code){
  const ccSecutiry = document.querySelector(".cc-security .value")
  
  ccSecutiry.innerText = code.length === 0 ? "123" : code
}




cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}




expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}