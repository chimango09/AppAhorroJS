//-----------------Ingresos----------------
let ingresos = JSON.parse(localStorage.getItem("ingresos")) || []

const in_ingresoMensual = document.getElementById("ingreso-mensual")
const btn_guardarIngreso = document.getElementById("guardarIngreso")
const spn_mostrarIngreso = document.getElementById("mostrarIngreso")
const p_alertaIngreso = document.getElementById("alertaIngreso")
const ul_listaIngresos = document.getElementById("listaIngresos")
const dt_ingresoFecha = document.getElementById("fecha-ingreso")
const spn_monstarRestante = document.getElementById("mostrarRestante")

btn_guardarIngreso.addEventListener("click", async () =>{
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
        
        const btn_editarIngreso = document.createElement("button")
        btn_editarIngreso.textContent ="Editar ingreso"
        btn_editarIngreso.addEventListener("click", () => editarIngreso(indice))
        li.appendChild(btn_eliminarIngreso)
        li.appendChild(btn_editarIngreso)
        ul_listaIngresos.appendChild(li)
    });

    spn_mostrarIngreso.textContent = `$${total}`
}

function eliminarIngreso(indice){
    const ingreso = ingresos [indice]

    Swal.fire({
        title: "¿Esta seguro de eliminar el ingreso?",
        text: "Si elimina esto no podra revertirlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminarlo!"
    }).then((result) => {
    if (result.isConfirmed) {
        ingresos.splice(indice,1)
        localStorage.setItem("ingresos", JSON.stringify(ingresos))
        mostrarIngresos()
        actualizarRestante()
        Swal.fire({
        title: "Eliminado!",
        text: "El ingreso fue eliminado",
        icon: "success"
        });
    }
    });
}

function editarIngreso(indice){
    const ingreso = ingresos[indice]
    Swal.fire({
        title: "¿Esta seguro que quiere editar el ingreso?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Editar"
    }).then((result) => {
    if (result.isConfirmed) {

        in_ingresoMensual.value = ingreso.monto
        dt_ingresoFecha.value = ingreso.fecha

        ingresos.splice(indice,1)
        localStorage.setItem("ingresos", JSON.stringify(ingresos))

        mostrarIngresos()
        actualizarRestante()
        Swal.fire({
        title: "Editando",
        text: "El ingreso fue cargado en los campos para ser editado",
        icon: "info"
        });
    }
    });
}

function actualizarRestante(){
    const gastos = JSON.parse(localStorage.getItem("gastos")||"[]")
    const totalGastos = gastos.reduce((gastoAcumulado, gasto) => gastoAcumulado + gasto.monto, 0)
    const totalIngresos = ingresos.reduce((ingresoAcumulado, ingreso) => ingresoAcumulado + ingreso.monto, 0)
    spn_monstarRestante.textContent = `$${totalIngresos-totalGastos}`
}

mostrarIngresos()
actualizarRestante()
