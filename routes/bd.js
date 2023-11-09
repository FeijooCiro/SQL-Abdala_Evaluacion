let mysql = require('mysql')

let conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TP46'
})

conexion.connect(function (error) {
  if (error)
    console.log('Problemas de conexion con mysql.')
  else
    console.log('Se inicio conexion.')
})


module.exports = conexion