const APP_USUARIOS = "bequianrent_usuarios";
const APP_SESION = "bequianrent_sesion";
const APP_RESERVAS = "bequianrent_reservas";
const APP_AUTOS = "bequianrent_autos";


const ADMIN_DEFAULT = {
    nombre: "Admin",
    correo: "administracion@bequianrent.cl",
    password: "*Pass123",
    rol: "admin"
}

const VEHICULOS = [
    // --- TOYOTA (4) ---
    { id: 1, marca: "Toyota", modelo: "Corolla", tipo: "Sedán", anio: 2024, precio: 35000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "15 km/l", imagen: "img/autos/toyota_corolla.jpg" },
    { id: 2, marca: "Toyota", modelo: "Yaris", tipo: "Sedán", anio: 2023, precio: 28000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "17 km/l", imagen: "img/autos/toyota_yaris.jpg" },
    { id: 3, marca: "Toyota", modelo: "Yaris HB", tipo: "Hatchback", anio: 2024, precio: 29000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "16.5 km/l", imagen: "img/autos/yaris_hb.jpg" },
    { id: 4, marca: "Toyota", modelo: "Camry", tipo: "Sedán", anio: 2025, precio: 50000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14 km/l", imagen: "img/autos/toyota_camry.jpg" },

    // --- VOLKSWAGEN (4) ---
    { id: 5, marca: "Volkswagen", modelo: "Golf", tipo: "Hatchback", anio: 2023, precio: 32000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "16 km/l", imagen: "img/autos/vw_golf.jpg" },
    { id: 6, marca: "Volkswagen", modelo: "Polo", tipo: "Hatchback", anio: 2024, precio: 27000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "18 km/l", imagen: "img/autos/vw_polo.jpg" },
    { id: 7, marca: "Volkswagen", modelo: "Virtus", tipo: "Sedán", anio: 2024, precio: 30000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "15.5 km/l", imagen: "img/autos/vw_virtus.jpg" },
    { id: 8, marca: "Volkswagen", modelo: "Jetta", tipo: "Sedán", anio: 2025, precio: 42000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14.8 km/l", imagen: "img/autos/vw_jetta.jpg" },

    // --- MAZDA (4) ---
    { id: 9, marca: "Mazda", modelo: "Mazda 3 Sedán", tipo: "Sedán", anio: 2024, precio: 38000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "14.5 km/l", imagen: "img/autos/mazda3sedan.jpg" },
    { id: 10, marca: "Mazda", modelo: "Mazda 3 Sport", tipo: "Hatchback", anio: 2024, precio: 39000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "14.2 km/l", imagen: "img/autos/mazda3sport.jpg" },
    { id: 11, marca: "Mazda", modelo: "Mazda 2 Sedán", tipo: "Sedán", anio: 2023, precio: 26000, disponible: true, transmision: "Manual", pasajeros: 5, rendimiento: "16.8 km/l", imagen: "img/autos/mazda2sedan.jpg" },
    { id: 12, marca: "Mazda", modelo: "Mazda 2 Sport", tipo: "Hatchback", anio: 2023, precio: 27000, disponible: true, transmision: "Automática", pasajeros: 5, rendimiento: "16.3 km/l", imagen: "img/autos/mazda2sport.jpg" }
];


function initApp(){
    let usuarios = getUsuario();

    const existeAdmin = usuarios.some(usuario => usuario.correo === ADMIN_DEFAULT.correo);

    if(!existeAdmin){
        usuarios.push(ADMIN_DEFAULT);
        saveUsuarios(usuarios);
    }

    if (!localStorage.getItem(APP_RESERVAS)){
        localStorage.setItem(APP_RESERVAS, JSON.stringify([]));
    }

    let vehiculos = getVehiculos();

    const existeVehiculos = vehiculos.some(vehiculo => vehiculo.id === VEHICULOS.id);

    if(!existeVehiculos){
        vehiculos.push(VEHICULOS);
        saveVehiculos(vehiculos);
    }

    if(!localStorage.getItem(APP_AUTOS)){
        localStorage.setItem(APP_AUTOS, JSON.stringify([]));
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
        rol: usuario.rol
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


//Evento al cargar pagina, cargamos datos
document.addEventListener("DOMContentLoaded", function () {
  initApp();
});






