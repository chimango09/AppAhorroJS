const in_nombreGasto = document.getElementById("nombre-gasto")
const in_montoGasto = document.getElementById("monto-gasto")
const btn_agregarGasto = document.getElementById("agregarGasto")
const spn_mostarGastos = document.getElementById("mostrarGasto")
const ul_listaGastos = document.getElementById("listaGastos")
const p_alertaGasto = document.getElementById("alertaGasto")
const dt_fechaGasto = document.getElementById("fecha-gasto")
const sl_categoriaGasto = document.getElementById("categoria-gasto")

const gastos = JSON.parse(localStorage.getItem("gastos")) || []


async function cargarCategorias() {
    const respuesta = await fetch("./db/categorias.json")
    const data = await respuesta.json()

    const categorias = data.categorias

    categorias.forEach(categoria => {
        const opcion = document.createElement("option")
        opcion.value = categoria
        opcion.textContent = categoria
        sl_categoriaGasto.appendChild(opcion)
    })
}


btn_agregarGasto.addEventListener("click", async () => {
    try{
        const nombreGasto = in_nombreGasto.value
        const montoGasto = parseFloat(in_montoGasto.value)
        const fechaGasto = dt_fechaGasto.value
        const categoriaGasto = sl_categoriaGasto.value

        if (nombreGasto === "" || montoGasto <= 0 || isNaN(montoGasto)|| fechaGasto === ""){
                await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Campos incompletos o erroneos, revise por favor y reintente",
            })
            return
        }
        gastos.push({
            nombre: nombreGasto,
            monto: montoGasto,
            fecha: fechaGasto,
            categoria: categoriaGasto
        })

        localStorage.setItem("gastos",JSON.stringify(gastos))
        
        in_montoGasto.value = ""
        in_nombreGasto.value = ""
        dt_fechaGasto.value = ""
        
        await Swal.fire({
            title: "Gasto cargado correctamente",
            icon: "success",
            text: `Se cargo ${nombreGasto} con $${montoGasto}`,
            draggable: true
        
    });
    cargarGastos()

    }
    catch{
        console.error(error)
        await Swal.fire({
            icon: "error",
            title: "Error",
            text: "El gasto no pudo ser agregado",
        });
    } finally {
        Swal.fire({
            icon: "info",
            title: "Operación finalizada",
            showConfirmButton: false,
            timer: 1500
        });
    }
})

cargarGastos()

function cargarGastos (){
    
    ul_listaGastos.innerHTML = ""

    gastos.forEach((gasto, indice) => {

        const liLista = document.createElement("li")
        liLista.textContent = `${gasto.nombre}: $${gasto.monto} Categoria: ${gasto.categoria} Fecha: ${gasto.fecha}`
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

    const ingresosGuardados= JSON.parse(localStorage.getItem("ingresos")) || []
    const totalIngresos = ingresosGuardados.reduce((ingresosAcumulado,ingreso)=>ingresosAcumulado + ingreso.monto,0)

    
    let ahorro = totalIngresos - totalGastos
    localStorage.setItem("ahorro",ahorro)

    let spn_mostrarRestante = document.getElementById("mostrarRestante")
    spn_mostrarRestante.textContent = `$${ahorro}`
    

}
//---------------Eliminar Gasto------------------------

function eliminarGasto(indice){

    Swal.fire({
            title: "¿Esta seguro de eliminar el gasto?",
            text: "Si elimina esto no podra revertirlo!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, quiero eliminarlo!"
        }).then((result) => {
        if (result.isConfirmed) {
            gastos.splice(indice,1)
            localStorage.setItem("gastos",JSON.stringify(gastos))
            Swal.fire({
                title: "Eliminado!",
                text:  `El gasto fue eliminado`,
                icon: "success"
            });
            cargarGastos()
            actualizarRestante()
        }
        });
}

//--------------Editar Gasto------------------

function editarGasto (indice){
    const gasto = gastos[indice]

    Swal.fire({
        title: "¿Esta seguro que quiere editar el gasto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Editar"
    }).then((result) => {
    if (result.isConfirmed) {

        in_nombreGasto.value = gasto.nombre
        in_montoGasto.value = gasto.monto
        dt_fechaGasto.value = gasto.fecha
        sl_categoriaGasto.value = gasto.categoria

        gastos.splice(indice,1)
        localStorage.setItem("gastos",JSON.stringify(gastos))
        cargarGastos()

        actualizarRestante()
        Swal.fire({
        title: "Editando",
        text: "El gasto fue cargado en los campos para ser editado",
        icon: "info"
        });
    }
    });
}
cargarCategorias()