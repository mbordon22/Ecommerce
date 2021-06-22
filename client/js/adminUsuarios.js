const formUsuarios = document.querySelector("#formUsuarios");
const nombreUsuario = document.querySelector("#nombreUsuario");
const nickUsuario = document.querySelector("#nickUsuario");
const claveUsuario = document.querySelector("#claveUsuario");
const reClaveUsuario = document.querySelector("#reClaveUsuario");
const tipoOperacion = document.querySelector("#tipoOperacion");
const btnReset = document.querySelector("#btnReset");
const tbodyUsuarios = document.querySelector("#tbodyUsuarios");
const idUsuario = document.querySelector("#idUsuario");
const rolUsuario = document.querySelector("#rolUsuario");


document.addEventListener("DOMContentLoaded", function () {
    obtenerListaUsuarios();
    formUsuarios.addEventListener("submit", guardarUsuario);
    //btnReset.addEventListener("click", resetearFormulario);
})

function guardarUsuario(e) {
    e.preventDefault();

    if (tipoOperacion.value === "INSERT") {
        insertarUsuario();
    } else if (tipoOperacion.value === "UPDATE") {
        editarUsuario();
    }
}

function insertarUsuario() {

    if (!nombreUsuario.value || nickUsuario.value < 1 || !claveUsuario.value || !reClaveUsuario.value || rolUsuario == 0 ||claveUsuario.value !== reClaveUsuario.value) {
        alert("Llenar todos los campos");
        return;
    } else {
        const data = {
            nombre : nombreUsuario.value,
            usuario : nickUsuario.value,
            clave : claveUsuario.value,
            rol: rolUsuario.value
        }

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/adminUsuarios/cargarUsuario");

        xhr.onload = function () {
            if (xhr.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.mensaje === 'exito') {
                    location.reload();
                }
            }
        }

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }
}

function editarUsuario() {
    const id = idUsuario.value;

    const data = {
        id: id,
        nombre : nombreUsuario.value,
        usuario : nickUsuario.value,
        clave : claveUsuario.value,
        rol : rolUsuario.value
    }

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/adminUsuarios/actualizarUsuario");

    xhr.onload = function () {
        if (xhr.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);
            if (respuesta.mensaje === 'exito') {
                location.reload();
            }
        }
    }

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

}

function eliminarUsuario(e) {
    const id = e.target.getAttribute("data-id");
    const confirmacion = confirm("Va a eliminar un usuario, ¿Confirmar?");

    if (confirmacion) {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "/adminUsuarios/delete?id=" + id);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.mensaje === "exito") {
                    e.target.parentElement.parentElement.remove();
                }
            }
        }
        xhr.send()
    }
}

function obtenerListaUsuarios() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', '/adminUsuarios/obtenerUsuarios');

    xhr.onload = function () {
        if (xhr.status == 200) {
            const respuesta = JSON.parse(xhr.responseText);

            respuesta.forEach(element => {

                const fila = document.createElement("tr");
                const tdNombre = document.createElement("td");
                const tdUsuario = document.createElement("td");
                const tdRol = document.createElement("td");
                const tdAcciones = document.createElement("td");
                const btnEditar = document.createElement("button");
                const btnEliminar = document.createElement("button");

                //Nombre
                tdNombre.innerHTML = element.nombre;
                fila.appendChild(tdNombre);

                //Usuario
                tdUsuario.innerHTML = element.nick;
                fila.appendChild(tdUsuario);

                //Usuario
                tdRol.innerHTML = element.rol;
                fila.appendChild(tdRol);

                //Acciones
                btnEditar.classList.add("btn", "btn-primary", "mr-md-2");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener('click', function () { //Le agrego una funcion al boton que rellena los campos con los datos del producto
                    const id = element.id;
                    tipoOperacion.value = "UPDATE";
                    nombreUsuario.value = element.nombre;
                    nickUsuario.value = element.nick
                    rolUsuario.value = element.rol;
                    idUsuario.value = element.id;

                    nombreUsuario.focus();
                });


                btnEliminar.classList.add("btn", "btn-danger", "mt-2", "mt-md-0", "ml-md-2");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.setAttribute("data-id", element.id);
                btnEliminar.addEventListener('click', eliminarUsuario); //Le agrego la funcion al boton para poder eliminar el producto

                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);

                tbodyUsuarios.appendChild(fila);
            });
        }
    }
    xhr.send();
}

function resetearFormulario() {
    formUsuarios.reset();
    tipoOperacion.value = "INSERT";
}