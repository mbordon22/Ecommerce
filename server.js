const express = require('express');
const expHbs = require("express-handlebars");
const expSession = require("express-session");
const dbProductos = require('./dbProductos.js');
const dbUsuarios = require('./dbUsuarios.js');

const path = require('path');
const PUERTO = 3000;

const app = express();

/*** Configuración de Handlebars para Express ***/
app.engine(
    "handlebars",
    expHbs({
        defaultLayout: "main-layout",
        layoutsDir: "views/layouts",
    })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
/************************************************/

//Obtener datos mediante json
app.use(express.json());

//LLave secreta para sesion
app.use(
    expSession({
        secret: ["proyecto ecommerce ComIT"],
    })
);

//Directorio de archivos estaticos
app.use(express.static(path.join(__dirname, "client")));


/* ------------------------------------------------Pantalla de INICIO---------------------------------------- */
app.get("/", (req, res) => {

    dbProductos.consultarTodos(
        "pc_escritorio",
        (err) => {
            console.log("Ocurrio un error");
        },
        (productos) => {
            res.render("inicio", {
                titulo: "Inicio",
                productos: productos.slice(0, 3),
                tituloProductos: "Todos los Productos"
            })
        }
    )

})


/* ------------------------------------------------Pantalla de PRODUCTOS---------------------------------------- */
app.get("/productos", (req, res) => {
    const categoria = req.query.categoria || '';
    console.log(categoria);

    dbProductos.consultarTodos(
        categoria,
        (err) => {
            console.log("Ocurrio un error");
        },
        (productos) => {
            res.render("productos", {
                titulo: "Productos",
                productos,
                tituloProductos: "Todos los Productos"
            })
        }
    )
})


/* ------------------------------------------------Pantalla de DETALLE PRODUCTO---------------------------------------- */
app.get("/producto", (req, res) => {
    const idProducto = parseInt(req.query.id);

    if (idProducto > 0) {
        dbProductos.porId(
            idProducto,
            (err) => {
                console.log("Error");
            },
            (producto) => {
                res.render("producto", {
                    titulo: producto.nombre,
                    producto: producto,
                })
            }
        )
    }

})


/* ------------------------------------------------Pantalla de LOGIN---------------------------------------- */
app.get("/login", (rq, res) => {
    res.sendFile(path.join(__dirname, "client", "login.html"));
})

app.post("/login", (req, res) => {

    /* console.log(req.body); */
    const usuario = req.body.usuario;
    const pass = req.body.pass;
    let respuesta = {
        respuesta : "error"
    };

    dbUsuarios.TraerUsuario(
        usuario,
        pass,
        (err) => {
            console.log("Error: " + err);
        },
        (datos) => {
            if(datos){
                req.session.Usuario = datos.UsuarioNick;
                req.session.Nombre = datos.UsuarioNombre;
                req.session.Rol = datos.UsuarioRol;

                //Si encontramos el usuario y clave en la bd mandamos la respuesta de exito
                respuesta["respuesta"] = "exito";
            }
            res.json(respuesta);
        }
    )
})

/* ------------------------------------------------Pantalla de LOGOUT---------------------------------------- */
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});


/* ------------------------------------------------Pantallas de Administracion---------------------------------------- */
app.get("/administrarProductos", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    res.sendFile(path.join(__dirname, "client", "administrarProductos.html"));
})

app.get("/administrarUsuarios", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    res.sendFile(path.join(__dirname, "client", "administrarUsuarios.html"));
})





app.listen(PUERTO, () => {
    console.log("Escuchando puerto " + PUERTO);
})