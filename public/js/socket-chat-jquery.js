// const e = require("express");

var params = new URLSearchParams(window.location.search);
var usuario = params.get('nombre');
var sala = params.get('sala');

var divUsuarios = $('#divUsuarios');
var divChatBox = $('#divChatbox');

var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');

function renderizarUsuarios(personas) {
    html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '<a href="javascript:void(0)" data-id="' + personas[i].id + '"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    // console.log(html);
    divUsuarios.html(html)
}

divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

})

formEnviar.on('submit', function(evento) {
    evento.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    socket.emit('crearMensaje', {
        nombre: usuario,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('');
        txtMensaje.focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });
})

function renderizarMensaje(mensaje, yo) {
    var fecha = new Date(mensaje.fecha)
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    html = '';
    adminClass = 'info';
    if (mensaje.usuario === 'Administrador')
        adminclass = 'danger';

    console.log(adminclass);
    if (yo) {
        html += '<li class="reverse animated fadeIn">';
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.usuario + '</h5>';
        html += '       <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '      <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '       <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.usuario != 'Administrador')
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.usuario + '</h5>';
        html += '    <div class="box bg-light-' + adminclass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatBox.append(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}