const btnSubmit = document.querySelector("#btnSubmit");
const formLogin = document.querySelector("#formLogin");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.querySelector("#usuario").value;
    const pass = document.querySelector("#pass").value;

    if (usuario !== "" && pass !== "") {

        const data = {
            usuario,
            pass
        };

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/login");

        xhr.onload = function() {
            if(xhr.status == 200){
                const respuesta = JSON.parse(xhr.responseText);

                const mensajeError = document.querySelector("#mensajeError");
                if(respuesta.respuesta === "exito"){
                    window.location.href = "/adminProductos";
                    
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