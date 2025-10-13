
//--------------Ingreso monto---------------------
let ingreso = 0

const in_ingresoMensual = document.getElementById("ingreso-mensual")
const btn_guardarIngreso = document.getElementById("guardarIngreso")
const spn_mostrarIngreso = document.getElementById("mostrarIngreso")
const p_alertaIngreso = document.getElementById("alertaIngreso")

btn_guardarIngreso.addEventListener("click",guardarIngreso)

cargarIngresos()

function cargarIngresos(){
    const ingresoGuardado = localStorage.getItem("ingreso")
    if(ingresoGuardado){
        ingreso = parseFloat(ingresoGuardado)
        spn_mostrarIngreso.textContent = `$${ingreso}`
    }
    in_ingresoMensual.value = ""
}

function guardarIngreso(){

    let valor = parseFloat(in_ingresoMensual.value)

    if (valor <= 0 || isNaN(valor)){
        p_alertaIngreso.textContent = "El monto ingresado es incorrecto, revise los campos"
    } else{
        ingreso = valor

        localStorage.setItem("ingreso",ingreso)
        cargarIngresos()
        p_alertaIngreso.textContent = ""
    }

}

//--------------Gastos---------------------
const in_nombreGasto = document.getElementById("nombre-gasto")
const in_montoGasto = document.getElementById("monto-gasto")
const btn_agregarGasto = document.getElementById("agregarGasto")
const spn_mostarGastos = document.getElementById("mostrarGasto")
const ul_listaGastos = document.getElementById("listaGastos")
const p_alertaGasto = document.getElementById("alertaGasto")


const gastos = JSON.parse(localStorage.getItem("gastos")) || []

btn_agregarGasto.addEventListener("click",agregarGasto)

cargarGastos()

function cargarGastos (){
    
    ul_listaGastos.innerHTML = ""

    gastos.forEach((gasto, indice) => {

        const liLista = document.createElement("li")
        liLista.textContent = `${gasto.nombre}: $${gasto.monto}`
        ul_listaGastos.appendChild(liLista)

        const btn_eliminarGasto = document.createElement("button")
        btn_eliminarGasto.textContent = "Eliminar"
        liLista.appendChild(btn_eliminarGasto)
        btn_eliminarGasto.addEventListener("click",() => eliminarGasto(indice))

        const btn_editarGasto = document.createElement("button")
        btn_editarGasto.textContent = "Editar"
        liLista.appendChild(btn_editarGasto)
        btn_editarGasto.addEventListener("click",() => editarGasto(indice))
    })

    const totalGastos = gastos.reduce((gastoAcumulado,gasto) => gastoAcumulado + gasto.monto,0)
    spn_mostarGastos.textContent= `$${totalGastos}`

    let spn_mostrarRestante = document.getElementById("mostrarRestante")
    let ahorro = ingreso - totalGastos
    localStorage.setItem("ahorro",ahorro)
    spn_mostrarRestante.textContent = `$${ahorro}`

}

function agregarGasto(){
    const nombreGasto = in_nombreGasto.value
    const montoGasto = parseFloat(in_montoGasto.value)

    if (nombreGasto === "" || montoGasto <= 0 || isNaN(montoGasto)){
        p_alertaGasto.textContent = "El gasto ingresado es incorrecto, revise los campos"
    }  else {
        gastos.push({
            nombre: nombreGasto,
            monto: montoGasto
        })

        localStorage.setItem("gastos",JSON.stringify(gastos))
        cargarGastos()
        p_alertaGasto.textContent = ""
        in_montoGasto.value = ""
        in_nombreGasto.value = ""
    }
}
//---------------Eliminar Gasto------------------------

function eliminarGasto(indice){
    gastos.splice(indice,1)
    localStorage.setItem("gastos",JSON.stringify(gastos))
    cargarGastos()
}

//--------------Editar Gasto------------------

function editarGasto (indice){
    const gasto = gastos[indice]
    in_nombreGasto.value = gasto.nombre
    in_montoGasto.value = gasto.monto

    gastos.splice(indice,1)
    localStorage.setItem("gastos",JSON.stringify(gastos))
    cargarGastos()
}
