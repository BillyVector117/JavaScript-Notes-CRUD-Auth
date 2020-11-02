const router = require('express').Router() // Requerir express y su modulo router para crear rutas

// Requerir el modelo de datos para cada nota
const Note = require('../models/Note'); // Con Note podremos realizar el crud

// Middleware al entrar a cualquier ruta, asi identificara si tiene acceso a ciertas páginas
const {isAuthenticated} = require('../helpers/auth') // Requiere modulo para usar su método authenticated (asegurar paginas para los no-logeados)

// Enrutador que crea las ruta para las notas ( ...notes/... )
// Creación de ruta /notes ( index de las notas )
router.get('/notes', isAuthenticated, async (req, res) => { // Cuando entre a esta URL renderiza un archivo notes (su index)
    // Consulta a la base de datos para capturar todos los documentos DEL USUARIO ACTUAL
    const notes = await Note.find({user: req.user.id}).lean().sort({date: 'desc'}) // De todo el modelo (  Note ) busca todos los documentos en los que su propiedad user sea igual al id de las notas, de manera descendente (ASI EN EL FRONT SE MOSTRARA CORRECTAMENTE)
    console.log(notes)
    res.render('notes/all-notes', { notes }) // Renderiza el archivo all-notes( muestra todos los documentos creados ) ádemas, enviale como parametro notes ( los documentos recien capturados de la base de datos )
}) 

//Creación de ruta ( GET ) /add (agrega una nueva nota)
router.get('/notes/add', isAuthenticated, (req, res) => { // Cuando entre a esta URL renderiza un archivo newNote ( Para crear una nueva nota )
    res.render('notes/newNote') // Directorio archivo newNote
})

//Creación de ruta ( PUT ) /edit/edit-note/:id ( envia los datos editados de una nota )
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => { // Ruta de la nota al editarla ( Dar submit en 'Guardar cambios' )
    const { title, description } = req.body // guarda las propiedades title y description del formulario editadó ( Destructuración de objetos, ES6 )
    await Note.findByIdAndUpdate(req.params.id, { title, description }) // Desde el modelo de datos, busca por id ( le pasamos el id de la nota editada y actualiza sus campos remplazando los mismos valores pero ahora actualizados ( title, description ))
    req.flash('success_msg', 'Note updated Successfully!') // Mensaje de flash nota actualizada correctamente
    res.redirect('/notes') // Redirecciona a la pagina principal de notas para ver los cambios.
})

//Creación de ruta ( EDIT ) /edit/:id ( editar una nota ), el :id es el _id dinamico de cada documento/nota
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => { // Cuando entre a esta URL renderiza un archivo edit ( un nuevo formulario para editar la nota ( independientes por su id ))
    const note = await Note.findById(req.params.id).lean() // Consulta a la DB que devuelve una nota ( clickeada para editar )
    res.render('notes/edit-note', { note })
})

//Creación de ruta (DELETE) /edit/:id (elimina una nota)
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => { // Ruta de la nota a eliminar
    const note = await Note.findByIdAndDelete(req.params.id).lean() // Consulta a la DB por id ( la nota clickeada ) y elimina esa nota.
    req.flash('error_msg', 'Note deleted Successfully!') // Mensaje de flash nota eliminada correctamente
    res.redirect('/notes') // Redireccionar a todas las tareas una vez eliminada la seleccionada.
})

//Cuando el form de submit, los datos se enviaran a través de una dirección ( POST )
router.post('/notes/newNote', isAuthenticated, async (req, res) => { // Dirección de envio de los datos del form
    //Obtiene dos propiedades del cuerpo de la respuesta ( datos del form, titulo y descripción )
    const { title, description } = req.body; // Destructuración de objetos ( ES6 ), capturamos dos propiedades del form (req)
    const errors =  [] // arreglo de errores ( si los hay ), cada error se insertara dentro del arreglo
    // Validaciones
    if (!title) { // Si el titulo esta vacio ... Agrega un error al arreglo con un mensaje
        errors.push({text: 'The note must have a Title'}) // Mensaje error 1
    }
    if (!description) { // Si la descripción esta vacia ... Agrega un error al arreglo con un mensaje
        errors.push({text: 'The note must have a Description'}) // Mensaje error 2
    }
    if (errors.length > 0 ) { // Si hay al menos un error renderiza de nuevo la página ( form ) para poder enviarle el mensajes de alerta y que el usuario corrija los inputs
        res.render('notes/newNote', { // Renderizar la misma página ( form )  con datos adicionales que se usaran para enviar alertas y dejar el autocompletado: 
            errors, // Se guardan los errores acumulados de la verificación de errores ( errors es un array )
            title,
            description
        }) 
    } else { // Si no existen errores instanciamos un objeto en moongose y creamos el documento ( objeto )
        const newNote = new Note({ title, description }) // Instanciar un objeto de la clase Note ( requiere el titulo y description correctos del formulario )
        const fine = 'DATA SENT SUCCESSFULLY'
        newNote.user = req.user.id // Le pasamos el id del user a la nota creada en su propiedad .user ( newNote.user es una propiedad del modelo de datos de newNote y req.user.id es el id de la nota recien creada )
        await newNote.save() // Almacenar nota en la DB ( PROCESO ASINCRONO, PUEDE SER REMPLAZADO POR PROMISES ( .then, catch ) )
        req.flash('success_msg', 'Note added Successfully!')
        console.log(`${ fine } :
        Note created: `, newNote ) // La nota se guarda una vez termina el proceso asincrono anterior
        res.redirect('/notes') // Redirecciona a la vista notes (para visualizar todas las notas creadas)
    }
})
module.exports = router