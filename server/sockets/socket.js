const { io } = require('../server');

const { Usuarios } = require('../classes/Usuarios')

const { crearMensaje } = require('../ultils/utils')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.usuario || !data.sala) {
            return callback({ ok: false, msg: 'El nombre y la sala son  obligatorios' })
        }
        client.join(data.sala);
        let personas = usuarios.agregarPersona(client.id, data.usuario, data.sala)

        client.broadcast.to(data.sala).emit('listaPersonas', { personas: usuarios.getPersonasxSala(data.sala) });
        callback({ ok: true, conectados: usuarios.getPersonasxSala(data.sala) })

    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.removePersona(client.id);
        console.log("disconect", personaBorrada.sala);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `El usuario ${personaBorrada.nombre} abandonó el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', { personas: usuarios.getPersonasxSala(personaBorrada.sala) });
    });

    client.on('crearMensaje', (data) => {
        let persona = personas.getPersonaById(client.id);
        client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje(persona.nombre, data.mensaje))
    })

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersonaById(client.id);
        client.broadcast.to(data.destino).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});