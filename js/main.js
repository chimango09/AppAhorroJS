
//--------------Ingreso monto---------------------
let ingreso = 0

const in_ingresoMensual = document.getElementById("ingreso-mensual")
const btn_guardarIngreso = document.getElementById("guardarIngreso")
const spn_mostrarIngreso = document.getElementById("mostrarIngreso")

btn_guardarIngreso.addEventListener("click",guardarIngreso)

cargarIngresos()

function cargarIngresos(){
    const ingresoGuardado = localStorage.getItem("ingreso")
    if(ingresoGuardado){
        ingreso = parseFloat(ingresoGuardado)
        spn_mostrarIngreso.textContent = `$${ingreso}`
    }
}

function guardarIngreso(){

    let valor = parseFloat(in_ingresoMensual.value)

    if (valor <= 0 || isNaN(valor)){
        alert("Por favor ingrese un monto valido.")
    } else{
        ingreso = valor

        localStorage.setItem("ingreso",ingreso)
        cargarIngresos()
    }

}

//--------------Gastos---------------------
const in_nombreGasto = document.getElementById("nombre-gasto")
const in_montoGasto = document.getElementById("monto-gasto")
const btn_agregarGasto = document.getElementById("agregarGasto")
const spn_mostarGastos = document.getElementById("mostrarGasto")
const ul_listaGastos = document.getElementById("listaGastos")


const gastos = JSON.parse(localStorage.getItem("gastos")) || []

btn_agregarGasto.addEventListener("click",agregarGasto)

cargarGastos()

function cargarGastos (){
    ul_listaGastos.innerHTML = ""
    gastos.forEach((gasto) => {
        const liLista = document.createElement("li")
        liLista.textContent = `${gasto.nombre}: $${gasto.monto}`
        ul_listaGastos.appendChild(liLista)
    })

    const totalGastos = gastos.reduce((gastoAcumulado,gasto) => gastoAcumulado = gastoAcumulado + gasto.monto,0)
    spn_mostarGastos.textContent= `$${totalGastos}`
}

function agregarGasto(){
    const nombreGasto = in_nombreGasto.value
    const montoGasto = parseFloat(in_montoGasto.value)

    if (nombreGasto === "" || montoGasto <= 0 || isNaN(montoGasto)){
        alert("Nombre o monto invalido, por favor revise los campos e ingrese nuevamente")
    }  else {
        gastos.push({
            nombre: nombreGasto,
            monto: montoGasto
        })

        localStorage.setItem("gastos",JSON.stringify(gastos))
        cargarGastos()
    }
}