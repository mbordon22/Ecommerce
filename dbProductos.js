const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

const middleware = { useUnifiedTopology: true };

const url = "mongodb+srv://mbordon22:Maximiliano41384334@cluster0.cy3xo.mongodb.net/test";


/* ------------------------------------------ CONSULTA --------------------------------- */
// Declaro la función consultarTodos
function consultarTodos(cbError, cbDatos) {

  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, middleware,function (err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colProductos.find().toArray(function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error convirtiendo la consulta a Array:", err);
        cbError(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbDatos(datos);
    });

  });

}

function consultarPorCategoria(categoria, cbError, cbDatos) {

  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, middleware, function (err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colProductos.find({
      categoria: RegExp(categoria)
    }).toArray(function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error convirtiendo la consulta a Array:", err);
        cbError(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbDatos(datos);
    });

  });

}

function consultarPorId(id, cbErr, cbProducto) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, middleware, function (err, client) {
    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbErr(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colProductos.findOne({
      _id: mongo.ObjectId(id)
    }, function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al consultar:", err);
        cbErr(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbProducto(datos);
    });
  });
}

/* --------------------------------------- INSERT ------------------------------- */
function insertarProducto(producto, cbError, cbDatos) {
  mongoClient.connect(url, middleware, (err, client) => {
    if (err) {
      console.log('Hubo un error conectando con el servidor: ' + err);
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    //Realizo el insert
    colProductos.insertOne(producto, function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al insertar:", err);
        cbErr(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbDatos(datos);
    });
  })
}

/*------------------------------------------ UPDATE --------------------------------------*/
function actualizarProductoSinFoto(producto, cbError, cbDatos){
  mongoClient.connect(url, middleware, (err, client) => {
    if (err) {
      console.log('Hubo un error conectando con el servidor: ' + err);
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    //Realizo el insert
    colProductos.updateOne({
      _id: mongo.ObjectId(producto.id)
    },
    {
      $set: {
        nombre : producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        descripcion : producto.descripcion,
        cantidad : producto.cantidad
      },
    }, function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al insertar:", err);
        cbError(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbDatos(datos);
    });
  })
}

function actualizarProductoConFoto(producto, cbError, cbDatos){
  mongoClient.connect(url, middleware, (err, client) => {
    if (err) {
      console.log('Hubo un error conectando con el servidor: ' + err);
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    //Realizo el insert
    colProductos.updateOne({
      _id: mongo.ObjectId(producto.id)
    },
    {
      $set: {
        nombre : producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        descripcion : producto.descripcion,
        foto : producto.foto,
        cantidad : producto.cantidad
      },
    }, function (err, datos) {

      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al insertar:", err);
        cbError(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbDatos(datos);
    });
  })
}

/* ----------------------------------------- DELETE --------------------------------- */
function borrarProducto(id, cbError, cbResultado) {

  mongoClient.connect(url, middleware, function (err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      cbError(err);
      return;
    }

    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Productos");

    colProductos.deleteOne({
      _id: mongo.ObjectId(id)
    }, function (err, resultado) {

      client.close();

      if (err) {
        console.log("Hubo un error al consultar:", err);
        cbError(err);
        return;
      }

      cbResultado(resultado);
    });

  });

}

module.exports = {
  consultarTodos,
  consultarPorCategoria,
  consultarPorId,
  insertarProducto,
  actualizarProductoSinFoto,
  actualizarProductoConFoto,
  borrarProducto,
};