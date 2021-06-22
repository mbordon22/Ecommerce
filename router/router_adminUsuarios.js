const express = require("express");
const router = express.Router();
const path = require('path');

const dbUsuarios = require('../dbUsuarios');  //Funciones base de datos


router.get("/", (req, res) => {
    if (!req.session.Usuario || req.session.Rol !== 'Administrador') {
        res.redirect("/adminProductos");
        return;
    }

    res.sendFile(path.join(__dirname, "../client/administrarUsuarios.html"));
})

//Una vez que se realiza el submit del registro
router.post("/cargarUsuario", function (req, res) {
    if (!req.session.Usuario || req.session.Rol !== 'Administrador') {
        res.redirect("/adminProductos");
        return;
    }

    const nombreUsuario = req.body.nombre;
    const nickUsuario = req.body.usuario;
    const claveUsuario = req.body.clave;
    const rolUsuario = req.body.rol;

    const usuario = {
        nombre: nombreUsuario,
        nick: nickUsuario,
        clave: claveUsuario,
        rol: rolUsuario
    }

    dbUsuarios.insertarUsuario(
        usuario,
        (err) => {
            res.json({
                mensaje: "error"
            });
        },
        (resultado) => {
            res.json({
                mensaje: "exito"
            });
        }
    )
})


//Peticion de lista de productos cargados en la bd para mostrar al aldministrador 
router.get("/obtenerUsuarios", (req, res) => {
    if (!req.session.Usuario || req.session.Rol !== 'Administrador') {
        res.redirect("/adminProductos");
        return;
    }

    dbUsuarios.consultarTodos(
        (err) => {
            res.json({
                mensje: 'error'
            });
        },
        (productos) => {
            productos2 = productos.map(element => {
                return ({
                    id: element._id.toString(),
                    nombre: element.nombre,
                    nick: element.nick,
                    rol: element.rol
                })
            })

            res.json(productos2);
        }
    )
})

//update del producto sin foto
router.post("/actualizarUsuario", (req, res) => {
    if (!req.session.Usuario || req.session.Rol !== 'Administrador') {
        res.redirect("/adminProductos");
        return;
    }
    const idUsuario = req.body.id;
    const nombreUsuario = req.body.nombre;
    const nickUsuario = req.body.usuario;
    const claveUsuario = req.body.clave;
    const rolUsuario = req.body.rol;

    const usuario = {
        id: idUsuario,
        nombre: nombreUsuario,
        nick: nickUsuario,
        clave: claveUsuario,
        rol: rolUsuario
    }

    dbUsuarios.actualizarUsuario(
        usuario,
        (err) => {
            console.log(err);
            res.json({
                mensaje: 'error'
            });
        },
        (resultado) => {
            res.json({
                mensaje: 'exito'
            });
        }
    );

})


//Delete del producto
router.get("/delete", (req, res) => {
    if (!req.session.Usuario || req.session.Rol !== 'Administrador') {
        res.redirect("/adminProductos");
        return;
    }

    //Obtenemos los datos por query
    const id = req.query.id;


    dbUsuarios.borrarUsuario(
        id,
        (err) => {
            console.log(err);
            res.json({
                mensaje: 'error'
            });
        },
        (resultado) => {
            res.json({
                mensaje: 'exito'
            });
        }
    )
})

module.exports = router;