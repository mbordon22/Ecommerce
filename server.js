const express = require('express');
const expHbs = require("express-handlebars");
const productos = require('./productos.json');

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

app.use(express.static(path.join(__dirname, "client")));


/* ------------------------------------------------Pantalla de INICIO---------------------------------------- */
app.get("/", (req, res) => {

    let resultado = productos;

    resultado = resultado.filter(producto => producto.categoria === "pc_escritorio");

    res.render("inicio", {
        titulo : "Inicio",
        productos : resultado.slice(0,3)
    });
})

/* ------------------------------------------------Pantalla de PRODUCTOS---------------------------------------- */
app.get("/productos", (req, res) => {
    res.render("productos", {
        titulo : "Productos",
        productos
    })
})



app.listen(PUERTO, () => {
    console.log("Escuchando puerto "+ PUERTO);
})