const express = require('express');
const expHbs = require("express-handlebars");
const expSession = require("express-session");
const multer = require('multer');
const fs = require('fs').promises;
const {
    v4: uuidv4
} = require('uuid');
const dbProductos = require('./dbProductos.js');
const dbUsuarios = require('./dbUsuarios.js');

const path = require('path');
const e = require('express');
const PUERTO = 3000;
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "client", "imagenes"));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase()); //Guardamos la imagen con un id unico generado con la libreria uuid
    }
})
const upload = multer({
    storage
});

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


/* ------------------------------------------------Pantalla de INICIO---------------------------------------- */
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


/* ------------------------------------------------Pantalla de PRODUCTOS---------------------------------------- */
app.get("/productos", (req, res) => {
    const categoria = req.query.categoria || '';
    let titulo = "Todos los productos";

    if (categoria !== '') {
        titulo = categoria;
    }

    dbProductos.consultarPorCategoria(
        categoria,
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

            res.render("productos", {
                titulo: "Productos",
                productos: productos2,
                tituloProductos: titulo
            })
        }
    )
})


/* ------------------------------------------------Pantalla de DETALLE PRODUCTO---------------------------------------- */
app.get("/producto", (req, res) => {
    const idProducto = req.query.id;

    dbProductos.consultarPorId(
        idProducto,
        (err) => {
            console.log("Error");
        },
        (producto) => {

            producto2 = {
                id: producto._id.toString(),
                nombre: producto.nombre,
                precio: producto.precio,
                foto: producto.foto,
                descripcion: producto.descripcion
            }

            res.render("producto", {
                titulo: producto.nombre,
                producto: producto2,
            })
        }
    )

})

/* Pantalla de CARRITO */
app.get("/carrito", (req,res) => {
    res.render("carrito", {
        titulo: "Carrito",
        /* productos: productos2.slice(0, 3),
        tituloProductos: "Todos los Productos" */
    })
})


/* ------------------------------------------------Pantalla de LOGIN---------------------------------------- */
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "login.html"));
})

app.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const pass = req.body.pass;
    let respuesta = {
        respuesta: "error"
    };

    dbUsuarios.TraerUsuario(
        usuario,
        pass,
        (err) => {
            console.log("Error: " + err);
        },
        (datos) => {
            if (datos) {
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
/* ---------------------- PRODUCTOS --------------------------*/
app.get("/administrarProductos", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    res.sendFile(path.join(__dirname, "client", "administrarProductos.html"));
})

//Una vez que se realiza el submit del registro
app.post("/cargarProducto", upload.single('imagenProducto'), function (req, res) {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseInt(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const imagenProducto = req.file.filename;
    const descripcionProducto = req.body.descripcionProducto;

    const producto = {
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        foto: imagenProducto,
        descripcion: descripcionProducto
    }

    dbProductos.insertarProducto(
        producto,
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
app.get("/obtenerProductos", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    dbProductos.consultarTodos(
        (err) => {
            res.json({
                mensje: 'error'
            });
        },
        (productos) => {
            productos2 = productos.map(element => {
                return ({
                    id: element._id.toString(),
                    categoria: element.categoria,
                    nombre: element.nombre,
                    precio: element.precio,
                    foto: element.foto,
                    descripcion: element.descripcion,
                })
            })

            res.json(productos2);
        }
    )
})

//update del producto sin foto
app.post("/producto/actualizarSinFoto", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }
    const idProducto = req.body.idProducto;
    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseInt(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const descripcionProducto = req.body.descripcionProducto;

    const producto = {
        id: idProducto,
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        descripcion: descripcionProducto
    }

    dbProductos.actualizarProductoSinFoto(
        producto,
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

//update del producto con foto
app.post("/producto/actualizarConFoto", upload.single('imagenProducto'), (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    const idProducto = req.body.idProducto;
    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseInt(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const descripcionProducto = req.body.descripcionProducto;
    const imagenProducto = req.file.filename;
    const imagenAnterior = req.body.imagenAnterior;

    const producto = {
        id: idProducto,
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        descripcion: descripcionProducto,
        foto: imagenProducto,
    }

    //Eliminamos la imagen vieja
    fs.unlink(path.join("client/imagenes/", imagenAnterior))
        .then(() => {
            console.log("Imagen Eliminada");
        }).catch((err) => {
            console.log("Ocurrio un error: " + err);
        });


    //ACTUALIZAMOS LOS DATOS CON LA NUEVA IMAGEN
    dbProductos.actualizarProductoConFoto(
        producto,
        (err) => {
            console.log(err);
            res.json({
                mensaje: 'error'
            });
        },
        (resultado) => {
            console.log(resultado);
            res.json({
                mensaje: 'exito'
            });
        }
    );

})

//Delete del producto
app.get("/producto/delete", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    const id = req.query.id;
    //res.json({mensaje: 'exito'});

    dbProductos.borrarProducto(
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



/*----------------------------- USUARIOS ---------------------*/
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