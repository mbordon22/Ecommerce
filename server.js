const express = require('express');
const expHbs = require("express-handlebars");
const expSession = require("express-session");

const dbProductos = require('./dbProductos.js');

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

//LLave para sesion
app.use(
    expSession({
        secret: ["proyecto ecommerce ComIT"],
    })
);

//Directorio de archivos estaticos
app.use(express.static(path.join(__dirname, "client")));

// create application/json
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({
    extended: true
}));


//Pantalla de INICIO
app.get("/", (req, res) => {

    dbProductos.consultarPorCategoria(
        "PC Escritorio",
        (err) => {
            console.log("Ocurrio un error");
        },
        (productos) => {

            productos2 = productos.map(element => {
                return ({
                    id: element._id.toString(),
                    nombre: element.nombre,
                    precio: element.precio,
                    foto: element.foto
                })
            })

            res.render("inicio", {
                titulo: "Inicio",
                productos: productos2.slice(0, 3),
                tituloProductos: "Todos los Productos"
            })
        }
    )

})

//Productos
const routerProductos = require('./router/router_productos');
app.use("/productos", routerProductos);


//Login
const routerLogin = require('./router/router_login');
app.use("/login", routerLogin);


//Administrdor de Productos
const routerAdminProductos = require('./router/router_adminProductos');
app.use("/adminProductos", routerAdminProductos);


//Administrador de Usuarios
const routerAdminUsuarios = require('./router/router_adminUsuarios');
app.use("/adminUsuarios", routerAdminUsuarios);


/* Pantalla de CARRITO */
app.get("/carrito", (req,res) => {
    res.render("carrito", {
        titulo: "Carrito",
        /* productos: productos2.slice(0, 3),
        tituloProductos: "Todos los Productos" */
    })
})



app.listen(PUERTO, () => {
    console.log("Escuchando puerto " + PUERTO);
})