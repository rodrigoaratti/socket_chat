var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('usuario') || !params.has('sala')) {
    alert(params.get('usuario'))
    window.location = 'index.html'
    throw new Error('El nombre del usuario y la sala son obligatorios');

}

var usuario = {
    usuario: params.get('usuario'),
    sala: params.get('sala')
}
socket.on('connect', function() {
    socket.emit('entrarChat', usuario, (resp) => {
        console.log(resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('crearMensaje', (mensaje) => {
    console.log(`${mensaje.usuario} > ${mensaje.mensaje}`);
})

socket.on('listaPersonas', (mensaje) => {
    console.log('Lista de Personas', mensaje);
})

// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje)
})