
const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULTIMO_NIVEL = 10
const USUARIO = 1
const MAQUINA = 0

class Juego {
    constructor() {
        console.log('Inicio el juego')
        this.inicializar()
        this.generarSecuencia()

        setTimeout(() => {
            this.siguienteNivel()
        }, 1000);

    }

    inicializar() {
        //Se debe poner esta linea para que la funcionn elegir color siempre quede atada al this global que es e juego
        this.elegirColor = this.elegirColor.bind(this)

        this.toggleBtnEmpezar()       
        this.nivel = 1
        //Si la variable dentro de un objeto tiene el mismo nombre del valor que contiene no es necesario reasignarlo
        //celeste: celeste =>  celeste
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    toggleBtnEmpezar(){
        if( btnEmpezar.classList.contains('hide') ){
            btnEmpezar.classList.remove('hide')
        }else{
            btnEmpezar.classList.add('hide')
        }
    }

    generarSecuencia() {
        //NO es necesario definir el atributo. Se puede definir una variable como atributo y 
        //utilizarla con la palabra this. quedara guardada como atributo de la clase
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(item => Math.floor(Math.random() * 4))        
    }

    siguienteNivel() {
        console.log(`Nivel ${this.nivel}`)
        // debugger;
        this.subnivel = 0
        this.iluminarSecuencia()
        this.asignarEventClick()
    }

    iluminarSecuencia() {
        let tiempoEntreColores = 1000 - (this.nivel*(1000*0.05))
        for (let i = 0; i < this.nivel; i++) {
            let color = this.transformarNumeroAColor(this.secuencia[i])
            setTimeout(() => {
                this.iluminarColor(color, MAQUINA)
                console.log(`Ilumino el color ${color}`)
            }, tiempoEntreColores * i);
        }
    }

    transformarNumeroAColor(numero) {
        switch (numero) {
            case 0:
                return 'celeste'
            case 1:
                return 'violeta'
            case 2:
                return 'naranja'
            case 3:
                return 'verde'
        }
    }

    transformarColorANumero(color) {
        switch (color) {
            case 'celeste':
                return 0
            case 'violeta':
                return 1
            case 'naranja':
                return 2
            case 'verde':
                return 3
        }
    }

    iluminarColor(color, origen) {
        this.colores[color].classList.add('light')
        this.apagarColor(color, origen)
    }

    apagarColor(color, origen) {
        let tiempoDeIluminacion = 0;
        if(origen === USUARIO){
            tiempoDeIluminacion = 300 
        }else if(origen === MAQUINA){
            tiempoDeIluminacion = 350 - (this.nivel*(350*0.03))
        }

        setTimeout(() => {
            this.colores[color].classList.remove('light')
        }, tiempoDeIluminacion);
    }

    asignarEventClick() {
        this.colores.celeste.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
        this.colores.verde.addEventListener('click', this.elegirColor)
    }

    eliminarEventClick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
    }

    elegirColor(ev) {
        let nombreColor = ev.target.dataset.color
        let numeroColor = this.transformarColorANumero(nombreColor)
        this.iluminarColor(nombreColor,USUARIO)
        console.log(`Presiono el color ${nombreColor}`)

        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++
            console.log(`subnivel ${this.subnivel} del nivel ${this.nivel}`)

            if (this.subnivel === this.nivel) {
                this.nivel++
                this.eliminarEventClick()
                if (this.nivel === (ULTIMO_NIVEL + 1)) {
                    this.ganoElJuego()
                } else {
                    console.log(`Paso al siguiente nivel`)
                    setTimeout(() => {
                        this.siguienteNivel()
                    }, 1500);
                }
            } else {
                console.log(`Juego en curso del nivel ${this.nivel}`)
            }
        } else {
            this.perdioElJuego()
            console.log(`perdio en el nivel ${this.nivel}`)
        }
    }

    ganoElJuego() {

        swal('Simon Dice!', 'Felicitaciones, Ganaste el juego!', 'success')
            .then(() => {
                this.inicializar()
            })
    }

    perdioElJuego() {
        swal('Simon Dice!', 'Lo sentimos perdiste el juego :(', 'error')
            .then((()=>{
                this.eliminarEventClick()
                this.inicializar()
            }))
    }
}

function empezarJuego() {
    window.juego = new Juego()
}