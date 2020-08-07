const { io } = require('../server');

const { Usuarios } = require('../classes/Usuarios')

const { crearMensaje } = require('../ultils/utils')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({ ok: false, msg: 'El nombre y la sala son  obligatorios' })
        }
        client.join(data.sala);
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala)
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `El usuario ${data.nombre} entró el chat`))
        client.broadcast.to(data.sala).emit('listaPersona', { personas: usuarios.getPersonasxSala(data.sala) });
        callback({ ok: true, conectados: usuarios.getPersonasxSala(data.sala) })

    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.removePersona(client.id);

        console.log("disconect", personaBorrada.sala);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `El usuario ${personaBorrada.nombre} abandonó el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', { personas: usuarios.getPersonasxSala(personaBorrada.sala) });
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersonaById(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje)
    })

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersonaById(client.id);

        client.broadcast.to(data.destino).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});