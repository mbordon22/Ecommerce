const formProductos = document.querySelector("#formProductos");
const nombreProducto = document.querySelector("#nombreProducto");
const categoriaProducto = document.querySelector("#categoriaProducto");
const precioProducto = document.querySelector("#precioProducto");
const imagenProducto = document.querySelector("#imagenProducto");
const tipoOperacion = document.querySelector("#tipoOperacion");
const btnReset = document.querySelector("#btnReset");
const tbodyProductos = document.querySelector("#tbodyProductos");
const descripcionProducto = document.querySelector("#descripcionProducto");
const idProducto = document.querySelector("#idProducto");
const imagenAnterior = document.querySelector("#imagenAnterior");


document.addEventListener("DOMContentLoaded", function(){
    obtenerListaProductos();
    formProductos.addEventListener("submit", guardarProducto);
    btnReset.addEventListener("click", resetearFormulario);
})

function guardarProducto(e){
    e.preventDefault();

    if(tipoOperacion.value === "INSERT"){
        insertarProducto();
    }
    else if(tipoOperacion.value === "UPDATE"){
        editarProducto();
    }
}

function insertarProducto(){
    
    if(!nombreProducto.value || categoriaProducto.value < 1 || !precioProducto.value){
        alert("Llenar todos los campos");
        return;
    }
    else{
        const data =  new FormData(formProductos);
        data.set("categoriaProducto", obtenerStringCategoria(categoriaProducto.value)); //Envia la categoria como string

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/cargarProducto");

        xhr.onload = function(){
            if(xhr.status === 200){
                const respuesta = JSON.parse(xhr.responseText);
                if(respuesta.mensaje === 'exito'){
                    location.reload();
                }
            }
        }
        
        xhr.send(data);
    }
}

function editarProducto(){
    const id = idProducto.value;

    if(imagenProducto.files.length === 0){        //Si no actualiza la imagen sigue la misma

        const data =  {
            idProducto : idProducto.value,
            nombreProducto : nombreProducto.value,
            precioProducto: precioProducto.value,
            categoriaProducto : obtenerStringCategoria(categoriaProducto.value),
            descripcionProducto : descripcionProducto.value
        }

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/producto/actualizarSinFoto");

        xhr.onload = function(){
            if(xhr.status === 200){
                const respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                if(respuesta.mensaje === 'exito'){
                    location.reload();
                }
            }
        }

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }
    else{
        const data =  new FormData(formProductos);
        data.set("categoriaProducto", obtenerStringCategoria(categoriaProducto.value)); //Envia la categoria como string
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/producto/actualizarConFoto");

        xhr.onload = function(){
            if(xhr.status === 200){
                const respuesta = JSON.parse(xhr.responseText);
                if(respuesta.mensaje === 'exito'){
                    location.reload();
                }
            }
        }
        
        xhr.send(data);
    }
}

function eliminarProducto(e){
    const id = e.target.getAttribute("data-id");
    const confirmacion = confirm("Va a eliminar un producto, ¿Confirmar?");

    if(confirmacion){
        const xhr = new XMLHttpRequest();

        xhr.open("GET","/producto/delete?id="+id);

        xhr.onload = function(){
            if(xhr.status === 200){
                const respuesta = JSON.parse(xhr.responseText);
                if(respuesta.mensaje === "exito"){
                    e.target.parentElement.parentElement.remove();
                }
            }
        }
        xhr.send()
    }
}

function obtenerListaProductos(){
    const xhr = new XMLHttpRequest();

    xhr.open('GET','/obtenerProductos');

    xhr.onload = function(){
        if(xhr.status == 200) {
            const respuesta = JSON.parse(xhr.responseText);

            respuesta.forEach(element => {

                const fila = document.createElement("tr");
                const tdImagen = document.createElement("td");
                const imagen = document.createElement("img");
                const tdNombre = document.createElement("td");
                const tdPrecio = document.createElement("td");
                const tdCategoria = document.createElement("td");
                const tdAcciones = document.createElement("td");
                const btnEditar = document.createElement("button");
                const btnEliminar = document.createElement("button");

                //Imagen
                imagen.setAttribute("src","imagenes/"+element.foto);
                imagen.classList.add("imagen-tabla");
                tdImagen.appendChild(imagen);
                fila.appendChild(tdImagen);

                //Nombre
                tdNombre.innerHTML = element.nombre;
                fila.appendChild(tdNombre);

                //Precio
                tdPrecio.innerHTML = "$"+element.precio;
                fila.appendChild(tdPrecio);

                //Categoria
                tdCategoria.innerHTML = element.categoria;
                fila.appendChild(tdCategoria);

                //Acciones
                btnEditar.classList.add("btn","btn-primary","mr-md-2");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener('click', function(){ //Le agrego una funcion al boton que rellena los campos con los datos del producto
                    const id = element.id;
                    tipoOperacion.value = "UPDATE";
                    nombreProducto.value = element.nombre;
                    precioProducto.value = element.precio
                    categoriaProducto.value = obtenerIdCategoria(element.categoria);
                    descripcionProducto.value = element.descripcion;
                    idProducto.value = element.id;
                    imagenAnterior.value = element.foto;

                    nombreProducto.focus();
                });


                btnEliminar.classList.add("btn","btn-danger","mt-2","mt-md-0","ml-md-2");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.setAttribute("data-id",element.id);
                btnEliminar.addEventListener('click', eliminarProducto);    //Le agrego la funcion al boton para poder eliminar el producto
                
                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);

                tbodyProductos.appendChild(fila);
            });
        }
    }
    xhr.send();
}

function obtenerStringCategoria(valorCat){
    valorCat = parseInt(valorCat);
    if(valorCat === 1){
        return "PC Escritorio";
    }
    if(valorCat === 2){
        return "Notebooks";
    }
    if(valorCat === 3){
        return "Componentes";
    }
}

function obtenerIdCategoria(cat){
    if(cat === "PC Escritorio"){
        return 1;
    }
    if(cat === "Notebooks"){
        return 2;
    }
    if(cat === "Componentes"){
        return 3;
    }
}

function resetearFormulario(){
    formProductos.reset();
    tipoOperacion.value = "INSERT";
}
