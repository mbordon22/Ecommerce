const mongoClient = require("mongodb").MongoClient;

const url = "mongodb+srv://mbordon22:Maximiliano41384334@cluster0.cy3xo.mongodb.net/test";

// Declaro la función consultarTodos
function consultarTodos(categoria,cbError, cbDatos) {

    // Conexión. Función asincrónica. Recibe por callback error o cliente.
    mongoClient.connect(url, function(err, client) {
  
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
      colProductos.find({categoria : RegExp(categoria) }).toArray(function(err, datos) {
  
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

function porNombre(nombre, cbErr, cbListaProductos) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, function (err, client) {
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
    colProductos.find({ nombre: RegExp(nombre) }).toArray(function (err, datos) {
      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error convirtiendo la consulta a Array:", err);
        cbErr(err);
        return;
      }

      console.log(datos);

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbListaProductos(datos);
    });
  });
}

function porId(id, cbErr, cbProducto) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, function (err, client) {
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
    colProductos.findOne({ id: id }, function (err, datos) {
      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al consultar:", err);
        cbErr(err);
        return;
      }

      console.log(datos);

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbProducto(datos);
    });
  });
}

function porPrecio(precioMin, precioMax, cbErr, cbProductos) {
  // TODO: implementar consulta a la base de datos por rango de precios


  // cbErr("bla bla bla")
}

module.exports = {
    consultarTodos,
    porId,
};
