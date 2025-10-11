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