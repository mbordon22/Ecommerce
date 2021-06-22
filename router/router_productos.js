const express = require('express');
const router = express.Router();
const dbProductos = require("../dbProductos");
const path = require('path');

//Directorio de archivos estaticos
router.use(express.static(path.join(__dirname, "../client")));


/* ------------------------------------------------Pantalla de PRODUCTOS---------------------------------------- */
router.get("/", (req, res) => {
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
                    foto: element.foto,
                    cantidad: element.cantidad
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
router.get("/detalleProducto", (req, res) => {
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
                descripcion: producto.descripcion,
                cantidad: producto.cantidad
            }

            res.render("producto", {
                titulo: producto.nombre,
                producto: producto2,
            })
        }
    )

})

module.exports = router;