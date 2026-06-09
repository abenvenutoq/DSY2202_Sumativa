document.addEventListener("DOMContentLoaded", function () {
    
    // Redirección según rol
    let sesionActual = null;
    if (typeof protegerPaginas === "function") {
        sesionActual = protegerPaginas(["admin"]);
    } else {
        sesionActual = getSesion();
    }
    
    // Si ususario tiene rol distinto de "admin" lo redirige a index
    if (!sesionActual || sesionActual.rol !== "admin") {
        window.location.href = "index.html";
        return;
    }

    // Obtenemos form y llamamos funcion para agregar vehiculo
    const formAgregar = document.getElementById("form-agregar-vehiculo");
    
    if (formAgregar) {
        formAgregar.addEventListener("submit", function (e) {

            e.preventDefault();

            procesarNuevoVehiculo();
        });
    }
});

// Capturamos los datos del formulario y aplicamos validaciones
function procesarNuevoVehiculo() {

    const marca = document.getElementById("add-marca").value;
    const modelo = document.getElementById("add-modelo").value.trim();
    const anioValor = document.getElementById("add-anio").value.trim();
    const tipo = document.getElementById("add-tipo").value;
    const transmision = document.getElementById("add-transmision").value;
    const precioValor = document.getElementById("add-precio").value.trim();
    let imagen = document.getElementById("add-imagen").value.trim();

    let formularioValido = true;

    // Validar Marca
    if (marca === "Seleccione Marca") {
        marcarInvalido("add-marca", "add-marca-error", "La marca es obligatoria.");
        formularioValido = false;
    } else {
        marcarValido("add-marca", "add-marca-error");
    }

    // Malidar tipo
    if (tipo === "Seleccione Tipo") {
        marcarInvalido("add-tipo", "add-tipo-error", "El tipo es obligatoria.");
        formularioValido = false;
    } else {
        marcarValido("add-tipo", "add-tipo-error");
    }

    // Validar Transmisión
    if (transmision === "Seleccione Transmisión") {
        marcarInvalido("add-transmision", "add-transmision-error", "La transmision es obligatoria.");
        formularioValido = false;
    } else {
        marcarValido("add-transmision", "add-transmision-error");
    }

    // 2. Validar Modelo
    if (modelo === "") {
        marcarInvalido("add-modelo", "add-modelo-error", "El modelo es obligatorio.");
        formularioValido = false;
    } else {
        marcarValido("add-modelo", "add-modelo-error");
    }

    // 3. Validar Año
    const anio = parseInt(anioValor);
    if (anioValor === "") {
        marcarInvalido("add-anio", "add-anio-error", "El año es obligatorio.");
        formularioValido = false;
    } else if (isNaN(anio) || anio < 2000 || anio > 2027) {
        marcarInvalido("add-anio", "add-anio-error", "Ingrese un año válido (2000 - 2027).");
        formularioValido = false;
    } else {
        marcarValido("add-anio", "add-anio-error");
    }

    // 4. Validar Precio
    const precio = parseInt(precioValor);
    if (precioValor === "") {
        marcarInvalido("add-precio", "add-precio-error", "El precio es obligatorio.");
        formularioValido = false;
    } else if (isNaN(precio) || precio < 1000) {
        marcarInvalido("add-precio", "add-precio-error", "El precio mínimo es de $1.000.");
        formularioValido = false;
    } else {
        marcarValido("add-precio", "add-precio-error");
    }

    // Si algún campo falló, frenamos la ejecución aquí
    if (!formularioValido) {
        return;
    }

    // Si todo correcto continuamos con el save
    if (imagen === "") {
        imagen = "img/autos/auto_placeholder.jpg"; 
    }

    // Obtenemos lista de vehiculos
    const listaVehiculos = getVehiculos();

    // Generamos nuevo ID
    let nuevoId = 1;
    if (listaVehiculos.length > 0) {
        const maxId = Math.max(...listaVehiculos.map(auto => auto.id));
        nuevoId = maxId + 1;
    }

    // Construimos el objeto
    const nuevoVehiculo = {
        id: nuevoId,
        marca: marca,
        modelo: modelo,
        tipo: tipo,
        anio: anio,
        precio: precio,
        disponible: true,             
        transmision: transmision,
        pasajeros: 5,                 
        rendimiento: "No especificado",
        imagen: imagen
    };

    // Empujamos el objeto y guardamos
    listaVehiculos.push(nuevoVehiculo);
    saveVehiculos(listaVehiculos);

    alert(`¡Éxito! El ${marca} ${modelo} ha sido integrado a la flota correctamente.`);
    window.location.href = "admin_panel.html";
}