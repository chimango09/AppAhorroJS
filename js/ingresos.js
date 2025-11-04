//-----------------Ingresos----------------
let ingresos = JSON.parse(localStorage.getItem("ingresos")) || []

const in_ingresoMensual = document.getElementById("ingreso-mensual")
const btn_guardarIngreso = document.getElementById("guardarIngreso")
const spn_mostrarIngreso = document.getElementById("mostrarIngreso")
const p_alertaIngreso = document.getElementById("alertaIngreso")
const ul_listaIngresos = document.getElementById("listaIngresos")
const dt_ingresoFecha = document.getElementById("fecha-ingreso")
const spn_monstarRestante = document.getElementById("mostrarRestante")

btn_guardarIngreso.addEventListener("click", async () =>{   // <-- async
    try{
        let valor = parseFloat(in_ingresoMensual.value)
        let fecha = dt_ingresoFecha.value

        if (isNaN(valor) || valor <= 0 || fecha === ""){
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Campos incompletos o erroneos, revise por favor y reintente",
            })
            return
        }

        ingresos.push ({ monto: valor, fecha: fecha })
        localStorage.setItem("ingresos", JSON.stringify(ingresos))

        in_ingresoMensual.value = ""
        dt_ingresoFecha.value = ""
        
        await Swal.fire({
            title: "Ingreso cargado correctamente",
            icon: "success",
            text: `Se ingresaron $${valor}`,
            draggable: true
        });

        mostrarIngresos()
        actualizarRestante()

    } 
    catch (error) {
        console.error(error)
        await Swal.fire({
            icon: "error",
            title: "Error",
            text: "El ingreso no pudo ser agregado",
        });
    } 
    finally {
        Swal.fire({
            icon: "info",
            title: "Operación finalizada",
            showConfirmButton: false,
            timer: 1500
        });
    }
})  

function mostrarIngresos(){
    ul_listaIngresos.innerHTML = ""
    let total = 0

    ingresos.forEach((i,indice) => {
        
        const li = document.createElement("li")
        total += i.monto
        
        li.textContent= `${i.fecha}: $${i.monto}` 

        const btn_eliminarIngreso = document.createElement("button")
        btn_eliminarIngreso.textContent = "Eliminar ingreso"
        btn_eliminarIngreso.addEventListener("click", () => eliminarIngreso(indice))

        li.appendChild(btn_eliminarIngreso)
        ul_listaIngresos.appendChild(li)
    });

    spn_mostrarIngreso.textContent = `$${total}`
}

function eliminarIngreso(indice){
    ingresos.splice(indice,1)
    localStorage.setItem("ingresos", JSON.stringify(ingresos))
    mostrarIngresos()
    actualizarRestante()
}

function actualizarRestante(){
    const gastos = JSON.parse(localStorage.getItem("gastos")||"[]")
    const totalGastos = gastos.reduce((gastoAcumulado, gasto) => gastoAcumulado + gasto.monto, 0)
    const totalIngresos = ingresos.reduce((ingresoAcumulado, ingreso) => ingresoAcumulado + ingreso.monto, 0)
    spn_monstarRestante.textContent = `$${totalIngresos-totalGastos}`
}

mostrarIngresos()
actualizarRestante()
