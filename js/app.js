const APP_USUARIOS = "bequianrent_usuarios";
const APP_SESION = "bequianrent_sesion";
const APP_RESERVAS = "bequianrent_reservas";
const APP_AUTOS = "bequianrent_autos";

const USUARIOS = [
    {
        nombre: "Angelo",
        apellido: "Benvenuto",
        rut: "15940700-4",
        correo: "admin@admin.cl",
        telefono: "963083858",
        direccion: "Av. Maria Elena 370",
        password: "qwerty123",
        rol: "admin"
    },
    {
        nombre: "Maria",
        apellido: "Quilobran",
        rut: "9843565-4",
        correo: "cliente@cliente.cl",
        telefono: "987654321",
        direccion: "Av. Maria Elena 370",
        password: "qwerty123",
        rol: "cliente"
    }
]

const VEHICULOS = [
    // --- TOYOTA (4) ---
    { id: 1, marca: "Toyota", modelo: "Corolla", tipo: "Sedán", anio: 2024, precio: 35000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "15 km/l", imagen: "img/autos/toyota_corolla.jpg", descripcion: "Sedán confiable, cómodo y seguro. Ideal para ciudad y viajes largos con excelente rendimiento." },
    { id: 2, marca: "Toyota", modelo: "Yaris", tipo: "Sedán", anio: 2023, precio: 28000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "17 km/l", imagen: "img/autos/toyota_yaris.jpg", descripcion: "Económico y práctico. Un sedán compacto perfecto para el día a día y fácil de estacionar." },
    { id: 3, marca: "Toyota", modelo: "Yaris HB", tipo: "Hatchback", anio: 2024, precio: 29000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "16.5 km/l", imagen: "img/autos/toyota_yaris_hb.jpg", descripcion: "Diseño juvenil y versátil. Su formato hatchback ofrece gran agilidad en el tráfico urbano." },
    { id: 4, marca: "Toyota", modelo: "Camry", tipo: "Sedán", anio: 2025, precio: 50000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14 km/l", imagen: "img/autos/toyota_camry.jpg", descripcion: "Lujo y amplitud. Un sedán ejecutivo con marcha suave, tecnología avanzada y máxima comodidad." },

    // --- VOLKSWAGEN (4) ---
    { id: 5, marca: "Volkswagen", modelo: "Golf", tipo: "Hatchback", anio: 2023, precio: 32000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "16 km/l", imagen: "img/autos/vw_golf.jpg", descripcion: "Un clásico moderno. Hatchback de manejo deportivo, interior refinado y excelente estabilidad." },
    { id: 6, marca: "Volkswagen", modelo: "Polo", tipo: "Hatchback", anio: 2024, precio: 27000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "18 km/l", imagen: "img/autos/vw_polo.jpg", descripcion: "Ágil y eficiente. Hatchback urbano con tecnología alemana, ideal para moverte por la ciudad." },
    { id: 7, marca: "Volkswagen", modelo: "Virtus", tipo: "Sedán", anio: 2024, precio: 30000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "15.5 km/l", imagen: "img/autos/vw_virtus.jpg", descripcion: "Sedán espacioso con gran maletero. Excelente conectividad y seguridad para toda la familia." },
    { id: 8, marca: "Volkswagen", modelo: "Jetta", tipo: "Sedán", anio: 2025, precio: 42000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14.8 km/l", imagen: "img/autos/vw_jetta.jpg", descripcion: "Potencia y elegancia. Sedán robusto con manejo dinámico y confort premium en cada viaje." },

    // --- MAZDA (4) ---
    { id: 9, marca: "Mazda", modelo: "3 Sedán", tipo: "Sedán", anio: 2024, precio: 38000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14.5 km/l", imagen: "img/autos/mazda3sedan.jpg", descripcion: "Diseño elegante y manejo dinámico. Interior premium y tecnología que te conecta con el camino." },
    { id: 10, marca: "Mazda", modelo: "3 Sport", tipo: "Hatchback", anio: 2024, precio: 39000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "14.2 km/l", imagen: "img/autos/mazda3sport.jpg", descripcion: "Hatchback deportivo y audaz. Líneas fluidas y una experiencia de conducción emocionante." },
    { id: 11, marca: "Mazda", modelo: "2 Sedán", tipo: "Sedán", anio: 2023, precio: 26000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "16.8 km/l", imagen: "img/autos/mazda2sedan.jpg", descripcion: "Eficiencia con estilo. Un sedán subcompacto ágil, económico y con acabados de alta calidad." },
    { id: 12, marca: "Mazda", modelo: "2 Sport", tipo: "Hatchback", anio: 2023, precio: 27000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "16.3 km/l", imagen: "img/autos/mazda2sport.jpg", descripcion: "Divertido y compacto. Hatchback ideal para la ciudad con gran respuesta y diseño cautivador." }
];


function initApp(){
    let usuarios = getUsuario();

    if(usuarios.length === 0){
        saveUsuarios(USUARIOS);
    }

    let vehiculos = getVehiculos();
    
    if(vehiculos.length === 0){
        saveVehiculos(VEHICULOS); 
    }

}

//FUNCIONES PARA USUARIOS LOCALSTORAGE
function getUsuario(){
    return JSON.parse(localStorage.getItem(APP_USUARIOS)) || [];
}

function saveUsuarios(usuarios){
    localStorage.setItem(APP_USUARIOS, JSON.stringify(usuarios));
}

//FUNCIONES PARA VEHICULOS
function getVehiculos(){
    return JSON.parse(localStorage.getItem(APP_AUTOS)) || [];
}

function saveVehiculos(vehiculos){
    localStorage.setItem(APP_AUTOS, JSON.stringify(vehiculos));
}


//FUNCIONES PARA RESERVAS LOCALSTORAGE
function getReservas(){
    return JSON.parse(localStorage.getItem(APP_RESERVAS)) || [];
}

function saveReservas(reservas){
    localStorage.setItem(APP_RESERVAS, JSON.stringify(reservas));
}

//FUNCONES PARA SESIONES 
function getSesion(){
    return JSON.parse(sessionStorage.getItem(APP_SESION));
}

function saveSesion(usuario){
    const sesion = {
        loged: true,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        rut: usuario.rut
    };

    sessionStorage.setItem(APP_SESION, JSON.stringify(sesion));
}

function closeSesion(){
    sessionStorage.removeItem(APP_SESION);
    window.location.href = "login.html";
}

// PROTECCION DE PAGINAS
function protegerPaginas(rolesPermitidos){

    const sesion = getSesion();

    if(!sesion || !sesion.loged){
        window.location.href = "login.html";
        return null;
    }

    if(rolesPermitidos && !rolesPermitidos.includes(sesion.rol)) {
        if(sesion.rol === "admin"){
            window.location.href = "admin_panel.html";
        }else {
            window.location.href = "mis_reservas.html";
        }

        return null;
    }

    return sesion;
}


// FUNCIONES DE VALIDACION
function isEmpty(valor){
    return valor.trim() === "";
}

function isValidEmail(correo){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

function isPasswordSecure(password){
    const largoCorrecto = password.length >= 8 && password.length <= 16;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[!@#$%&*]/.test(password);

    return largoCorrecto && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial;
}

function isPhoneNumber(telefono){
    const telRegex = /^[0-9]{9}$/;
    return telRegex.test(telefono);
}

function validarRutChileno(rutCompleto) {
    if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) return false;
    
    const partes = rutCompleto.split("-");
    const cuerpo = partes[0];
    const dvIngresado = partes[1].toLowerCase();
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    let dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = "0";
    else if (dvEsperado === 10) dvEsperado = "k";
    else dvEsperado = dvEsperado.toString();
    
    return dvIngresado === dvEsperado;
}

function validDireccion(direccion){
    if(!direccion){
        return true;
    }
    return direccion.trim().length > 0;
}


//Funcion para actualizar el menu (Navbar)
function actualizarNavbar(){
    const menu = document.getElementById("menuNavegacion");

    if(!menu) return;

    const sesion = getSesion();

    if(!sesion || !sesion.loged) {

        menu.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="ver_autos.html">Nuestra Flota</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span id="user-name-nav">Mi Cuenta</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            
                            <li><a class="dropdown-item" href="login.html">Iniciar Sesión</a></li>
                            <li><a class="dropdown-item" href="registro.html">Registrarse</a></li>
                            
                        </ul>
                    </li>
        `;
        return;
    }

    if(sesion.rol === "admin") {

        menu.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="ver_autos.html">Nuestra Flota</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span id="user-name-nav"><i class="fa-solid fa-user-gear" style="color: rgb(255, 0, 0);"></i> ${sesion.nombre}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            
                            <li><a class="dropdown-item" href="mi_perfil.html">Mi Perfil</a></li>
                            <li><a class="dropdown-item" href="mis_reservas.html">Mis Reservas</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="admin_panel.html">Admin Panel</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
                            
                        </ul>
                    </li>
        `;
        return;
    }

    menu.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" aria-current="page" href="index.html">Inicio</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="ver_autos.html">Nuestra Flota</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span id="user-name-nav"><i class="fa-solid fa-user" style="color: rgb(116, 192, 252);"></i> ${sesion.nombre}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                
                <li><a class="dropdown-item" href="mi_perfil.html">Mi Perfil</a></li>
                <li><a class="dropdown-item" href="mis_reservas.html">Mis Reservas</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
                
            </ul>
        </li>
    `;

}
// Funcion para cerrar sesion, eliminamos la sesion del sessionStorage y redirigimos al login
function cerrarSesion(){
    sessionStorage.removeItem(APP_SESION);
    window.location.href = "login.html";
}


// Funcion para validar el formulario de registro, se llama desde el evento submit del formulario 
function marcarInvalido(idInput, idNombre, mensaje){

    const campo = document.getElementById(idInput);
    const error = document.getElementById(`${idInput}-error`);

    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    
    if (error) {
        error.innerHTML = mensaje;
    }
}

function marcarValido(idInput, idError){

    const campo = document.getElementById(idInput);
    const error = document.getElementById(`${idInput}-error`);
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");

    if (error) {
        error.innerHTML = "";
    }
}

// Función para mostrar/ocultar contraseña al mantener presionado el "ojito"
function configurarOjito(idInput, idOjito) {
    const input = document.getElementById(idInput);
    const ojito = document.getElementById(idOjito);

    // Si no existe el input no hace nada, evita errores.
    if (!input || !ojito) {
        return; 
    }

    const mostrarPassword = () => input.type = "text";
    const ocultarPassword = () => input.type = "password";

    ojito.addEventListener("mousedown", mostrarPassword);
    ojito.addEventListener("mouseup", ocultarPassword);
    ojito.addEventListener("mouseleave", ocultarPassword);

    ojito.addEventListener("touchstart", function(e) {
        e.preventDefault();
        mostrarPassword();
    });

    ojito.addEventListener("touchend", ocultarPassword);
}

// Evento al cargar pagina, cargamos datos
document.addEventListener("DOMContentLoaded", function () {
  initApp();
  actualizarNavbar();
});








