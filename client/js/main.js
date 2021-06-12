const btnMenu = document.querySelector("#boton-menu");
const menuNav = document.querySelector("#navegacion-principal");
const logo = document.querySelector("#LogoEmpresa");

document.addEventListener("DOMContentLoaded", function () {

    cambiarResolucionImagen();

})

function cambiarResolucionImagen(){
    if(screen.width  < 768){
        const arraySlider = document.querySelectorAll(".imagen-slider");
        for(let i = 0; i < arraySlider.length; i++){
            const numero = i + 1;
            arraySlider[i].removeAttribute("src");
            arraySlider[i].setAttribute("src", "imagenes/slider"+numero+"compu.jpg");
        }
    }
    else{
        const arraySlider = document.querySelectorAll(".imagen-slider");
        for(let i = 0; i < arraySlider.length; i++){
            const numero = i + 1 ;
            arraySlider[i].removeAttribute("src");
            arraySlider[i].setAttribute("src", "imagenes/slider"+numero+"compug.jpg");
        }
    }
}