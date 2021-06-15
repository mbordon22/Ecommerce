const btnSubmit = document.querySelector("#btnSubmit");

btnSubmit.addEventListener("click", function(e) {
    e.preventDefault();

    const usuario = document.querySelector("#usuario").value;
    const pass = document.querySelector("#pass").value;

    if (usuario !== "" && pass !== "") {

        const data = {
            usuario : usuario,
            pass:  pass
        }

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/login");

        xhr.onload = function() {
            if(xhr.status == 200){
                const respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);

                const mensajeError = document.querySelector("#mensajeError");
                if(respuesta.respuesta === "exito"){
                    window.location.href = "/administrarProductos";
                    
                } else {
                    mensajeError.textContent = "Usuario o Clave incorrectos";
                    mensajeError.style.color = "red";
                }
            }

        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }

});