class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);

        return this.personas;
    }

    getPersonaById(id) {
        let persona = this.personas.filter(pers => { return pers.id === id })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasxSala(sala) {

        let personas_sala = this.personas.filter(pers => { return pers.sala === sala });

        return personas_sala;
    }

    removePersona(id) {
        let persona_borrada = this.getPersonaById(id);

        let personas_tmp = this.personas.filter(pers => { return pers.id != id })
        this.personas = personas_tmp;
        return persona_borrada;
    }

}

module.exports = { Usuarios };