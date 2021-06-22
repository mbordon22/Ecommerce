const express = require('express');
const router = express.Router();
const expSession = require("express-session");
const dbUsuarios = require("../dbUsuarios");
const path = require('path');

//LLave para sesion
router.use(
    expSession({
        secret: ["proyecto ecommerce ComIT"],
    })
);

//Directorio de archivos estaticos
router.use(express.static(path.join(__dirname, "../client")));

/* ------------------------------------------------Pantalla de LOGIN---------------------------------------- */
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/login.html"));
})

/* Inicio de sesión */
router.post("/", (req, res) => {
    const usuario = req.body.usuario;
    const pass = req.body.pass;

    dbUsuarios.TraerUsuario(
        usuario,
        pass,
        (err) => {
            console.log("Error: " + err);
        },
        (datos) => {
            if (datos) {
                req.session.Usuario = datos.nick;
                req.session.Nombre = datos.nombre;
                req.session.Rol = datos.rol;
            }
            res.json({respuesta: "exito"});
        }
    )
})

/* ------------------------------------------------LOGOUT---------------------------------------- */
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});


module.exports = router;