const express = require("express");
const multer = require('multer');
const fs = require('fs').promises;
const {v4: uuidv4} = require('uuid');
const router = express.Router();
const path = require('path');

const dbProductos = require('../dbProductos');  //Funciones base de datos

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../client/imagenes"));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase()); //Guardamos la imagen con un id unico generado con la libreria uuid
    }
})

const upload = multer({
    storage
});


router.get("/", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    res.sendFile(path.join(__dirname, "../client/administrarProductos.html"));
})

//Una vez que se realiza el submit del registro
router.post("/cargarProducto", upload.single('imagenProducto'), function (req, res) {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseFloat(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const imagenProducto = req.file.filename;
    const descripcionProducto = req.body.descripcionProducto;
    const cantidadProducto = parseInt(req.body.cantidadProducto);

    const producto = {
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        foto: imagenProducto,
        descripcion: descripcionProducto,
        cantidad : cantidadProducto
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
router.get("/obtenerProductos", (req, res) => {
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
                    cantidad : element.cantidad
                })
            })

            res.json(productos2);
        }
    )
})

//update del producto sin foto
router.post("/actualizarSinFoto", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }
    const idProducto = req.body.idProducto;
    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseFloat(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const descripcionProducto = req.body.descripcionProducto;
    const cantidadProducto = req.body.cantidadProducto;

    const producto = {
        id: idProducto,
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        descripcion: descripcionProducto,
        cantidad : cantidadProducto
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
router.post("/actualizarConFoto", upload.single('imagenProducto'), (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    const idProducto = req.body.idProducto;
    const nombreProducto = req.body.nombreProducto;
    const precioProducto = parseFloat(req.body.precioProducto);
    const categoriaProducto = req.body.categoriaProducto;
    const descripcionProducto = req.body.descripcionProducto;
    const imagenProducto = req.file.filename;
    const imagenAnterior = req.body.imagenAnterior;
    const cantidadProducto = req.body.cantidadProducto;

    const producto = {
        id: idProducto,
        nombre: nombreProducto,
        precio: precioProducto,
        categoria: categoriaProducto,
        descripcion: descripcionProducto,
        foto: imagenProducto,
        cantidad : cantidadProducto
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
            res.json({
                mensaje: 'exito'
            });
        }
    );

})

//Delete del producto
router.get("/delete", (req, res) => {
    if (!req.session.Usuario) {
        res.redirect("/login");
        return;
    }

    //Obtenemos los datos por query
    const id = req.query.id;
    const img = req.query.img;
    
    //Eliminamos la imagen vieja
    fs.unlink(path.join("client/imagenes", img))
        .then(() => {
            console.log("Imagen Eliminada");
        }).catch((err) => {
            console.log("Ocurrio un error: " + err);
        });


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

module.exports = router;