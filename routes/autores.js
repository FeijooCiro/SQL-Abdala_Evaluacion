let express = require('express')
let router = express.Router()

let bd = require('./bd')

//Creación de la tabla
router.get('/creartabla', function (req, res, next) {
    bd.query('drop table if exists autores', function (error, resultado) {
        if (error) {
            console.log(error)
            return
        }
    })
    bd.query('create table autores (' +
        'idAutores int NOT NULL primary key auto_increment, ' +
        'nombre varchar(50) not null, ' +
        'apellido varchar(50) not null, ' +
        'fechaNacimiento date not null, ' +
        'nacionalidad varchar(50) not null, ' +
        'mejorObra varchar(50) not null, ' +
        'anioPublicacion int not null, ' +
        'edadPublicacion int not null' +
        ')', function (error, resultado) {
            if (error) {
                console.log(error)
                return
            }
    })
    res.render('mensaje', { mensaje: 'La tabla se creó correctamente.' })
})

//Alta de registros
router.get('/incluir', function (req, res, next) {
    res.render('incluirdatos')
})

router.post('/incluir', function (req, res, next) {
    const registro = {
        idAutores: req.body.idAutores,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fechaNacimiento: req.body.fechaNacimiento,
        nacionalidad: req.body.nacionalidad,
        mejorObra: req.body.mejorObra,
        anioPublicacion: req.body.anioPublicacion,
        edadPublicacion: req.body.edadPublicacion
    }
    bd.query('insert into autores set ?', registro, function (error, resultado) {
        if (error) {
            console.log(error)
            return
        }
    })
    res.render('mensaje', { mensaje: 'La carga se efectuó correctamente.' })
})


//Listado de registros
router.get('/listado', function (req, res, next) {
    bd.query('select * from autores', function (error, filas) {
        if (error) {
            console.log('error en el listado' + error)
            return
        }
        res.render('listarcompleto', { autores: filas })
    })
})

//Listado de registros que tengan como nacionalidad Argentino
router.get('/SegListado', function (req, res, next) {
    bd.query(`select * from autores where nacionalidad = 'Argentino'`, function (error, filas) {
        if (error) {
            console.log('error en el listado' + error)
            return
        }
        res.render('listarcompleto', { autores: filas })
    })
})

//Listado de registros con año de publicación entre 1960 a 1980
router.get('/TerListado', function (req, res, next) {
    bd.query(`select * from autores where anioPublicacion Between '1960' And '1980'`, function (error, filas) {
        if (error) {
            console.log('error en el listado' + error)
            return
        }
        res.render('listarcompleto', { autores: filas })
    })
})

//Calculo del promedio de publicación
router.get('/Promedio', function (req, res, next) {
    bd.query(`select AVG(anioPublicacion) AS promedio from autores`, function (error, filas) {
        if (error) {
            console.log('error en el listado', error)
            return
        }
        res.render('mensaje', {mensaje: 'El promedio es: ' + filas[0].promedio})
    })
})

//Modificacion
router.get('/modificacion', function (req, res, next) {
    res.render('consultamodificacion')
})

router.post('/modificar', function (req, res, next) {
    bd.query('SELECT nombre, apellido, fechaNacimiento, nacionalidad, mejorObra, anioPublicacion, edadPublicacion FROM autores WHERE idAutores=?', [req.body.idAutores], function (error, filas) {
        if (error) {
            console.log('Error en la consulta:', error)
            return
        }
        if (filas.lenght > 0) {
            res.render('formulariomodifica', { autores: filas })
        } else {
            res.render('mensaje', { mensaje: 'No existe el ID del autor ingresado.' })
        }
    })
})

router.post('/confirmarmodifica', function (req, res, next) {
    const registro = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fechaNacimiento: req.body.fechaNacimiento,
        nacionalidad: req.body.nacionalidad,
        mejorObra: req.body.mejorObra,
        anioPublicacion: req.body.anioPublicacion,
        edadPublicacion: req.body.edadPublicacion
    }

    console.log('ID del autor a actualizar:', req.body.idAutores)
    bd.query('UPDATE autores SET ? WHERE idAutores = ?', [registro, parseInt({idAutores:req.body.idAutores})], function (error, resultados) {
        if (error) {
            console.log('Error en la consulta:', error)
            res.status(500).send('Error en la consulta de actualización')
            return
        } 
        res.render('mensaje', { mensaje: resultados.affectedRows > 0 ? 'Datos del autor actualizados correctamente.' : 'No se encontró el autor con la ID proporcionada.' })
    })
})

//Eliminacion
router.get('/eliminacion', function (req, res, next) {
    res.render('consultaeliminacion')
})

router.post('/eliminar', function (req, res, next) {
    bd.query('delete FROM autores WHERE idAutores = ?', [req.body.idAutores], function (error, filas) {
        if (error) {
            console.log('Error en la consulta:', error)
            return
        }
        if (filas.affectedRows > 0) {
            res.render('mensaje', { mensaje: 'Autor eliminado.' })
        } else {
            res.render('mensaje', { mensaje: 'No existe el ID del autor ingresado.' })
        }
    })
})

module.exports = router