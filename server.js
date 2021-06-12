const express = require('express');
const expHbs = require("express-handlebars");

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

app.get("/", (req, res) => {
    res.render("inicio", {
        titulo : "Inicio"
    });
})

app.listen(PUERTO, () => {
    console.log("Escuchando puerto "+ PUERTO);
})