const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

require('dotenv').config({path: 'variables.env'});


//Trae un solo usuario para el login
function TraerUsuario(usuario, pass, cbErr, cbProducto) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(process.env.BD_URL, function (err, client) {
    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbErr(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEcommerce = client.db("ProyectoEcommerce");
    const colUsuarios = dbEcommerce.collection("Usuarios");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colUsuarios.findOne({nick : usuario, clave : pass }, function (err, datos) {
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

//Consulta todos los usuarios
function consultarTodos(cbError, cbDatos) {

  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(process.env.BD_URL, function (err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEcommerce = client.db("ProyectoEcommerce");
    const colUsuarios = dbEcommerce.collection("Usuarios");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colUsuarios.find().toArray(function (err, datos) {

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

//INSERT DE UN USUARIO
function insertarUsuario(usuario, cbError, cbDatos) {
  mongoClient.connect(process.env.BD_URL, (err, client) => {
    if (err) {
      console.log('Hubo un error conectando con el servidor: ' + err);
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEcommerce = client.db("ProyectoEcommerce");
    const colUsuarios = dbEcommerce.collection("Usuarios");

    //Realizo el insert
    colUsuarios.insertOne(usuario, function (err, datos) {

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

//UPDATE DE UN USUARIO
function actualizarUsuario(usuario, cbError, cbDatos){
  mongoClient.connect(process.env.BD_URL, (err, client) => {
    if (err) {
      console.log('Hubo un error conectando con el servidor: ' + err);
      cbError(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEcommerce = client.db("ProyectoEcommerce");
    const colUsuarios = dbEcommerce.collection("Usuarios");

    //Realizo el insert
    colUsuarios.updateOne({
      _id: mongo.ObjectId(usuario.id)
    },
    {
      $set: {
        nombre : usuario.nombre,
        nick: usuario.nick,
        clave: usuario.clave,
        rol: usuario.rol,
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

//DELETE DE UN USUARIO
function borrarUsuario(id, cbError, cbResultado) {

  mongoClient.connect(process.env.BD_URL, function (err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      cbError(err);
      return;
    }

    const dbEcommerce = client.db("ProyectoEcommerce");
    const colUsuarios = dbEcommerce.collection("Usuarios");

    colUsuarios.deleteOne({
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
    TraerUsuario,
    consultarTodos,
    insertarUsuario,
    actualizarUsuario,
    borrarUsuario
};
