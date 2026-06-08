document.addEventListener("DOMContentLoaded", function () {
    // Proteger la pantalla
    let sesionActual = null;
    if (typeof protegerPaginas === "function") {
        sesionActual = protegerPaginas(["admin", "cliente"]);
    } else {
        sesionActual = getSesion();
    }
    
    if (!sesionActual) {
        window.location.href = "login.html";
        return;
    }

    // Obtener el ID del vehículo desde la URL (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const idVehiculoUrl = urlParams.get('id');

    // Buscamos el vehículo
    // Si no existiera la constante, intentamos leer desde localStorage
    const listaVehiculos = JSON.parse(localStorage.getItem("bequianrent_autos")) || (typeof VEHICULOS !== 'undefined' ? VEHICULOS : []);
    const vehiculoSeleccionado = listaVehiculos.find(auto => auto.id == idVehiculoUrl);

    // Si el vehículo no existe o no se pasó un ID válido, redirigir
    if (!vehiculoSeleccionado) {
        alert("Vehículo no seleccionado o no encontrado.");
        window.location.href = "ver_autos.html";
        return;
    }

    // Renderizar los datos del vehículo en la columna izquierda
    renderizarDatosVehiculo(vehiculoSeleccionado);

    // Configurar restricciones y lógica de fechas
    const inputDesde = document.getElementById("fechaDesde");
    const inputHasta = document.getElementById("fechaHasta");
    const resumenDias = document.getElementById("resumen-dias");
    const resumenTotal = document.getElementById("resumen-total");
    const alertaError = document.getElementById("reserva-error-alerta");

    // Impedir reservar fechas pasadas (Mínimo hoy)
    const hoy = new Date().toISOString().split("T")[0];
    inputDesde.min = hoy;
    inputHasta.min = hoy;

    // Escuchar cambios en las fechas para calcular el total en tiempo real
    [inputDesde, inputHasta].forEach(input => {
        input.addEventListener("change", function() {
            alertaError.classList.add("d-none");
            
            // Forzar que 'fechaHasta' no pueda ser menor a 'fechaDesde'
            if (inputDesde.value) {
                inputHasta.min = inputDesde.value;
            }

            calcularPrecios(inputDesde.value, inputHasta.value, vehiculoSeleccionado.precio);
        });
    });

    // Procesar el envío del Formulario (Guardar Reserva)
    const formReserva = document.getElementById("formReserva");
    formReserva.addEventListener("submit", function(e) {
        e.preventDefault();

        const fDesde = inputDesde.value;
        const fHasta = inputHasta.value;

        // Validaciones extras de negocio
        if (new Date(fHasta) < new Date(fDesde)) {
            mostrarError("La fecha de devolución no puede ser anterior a la fecha de retiro.");
            return;
        }

        const milisegundosPorDia = 24 * 60 * 60 * 1000;
        const totalDias = Math.round((new Date(fHasta) - new Date(fDesde)) / milisegundosPorDia) + 1;
        const totalPagar = totalDias * vehiculoSeleccionado.precio;

        // Traer reservas existentes de localStorage para autoincrementar el ID
        const reservasExistentes = JSON.parse(localStorage.getItem("bequianrent_reservas")) || [];
        const nuevoId = reservasExistentes.length > 0 ? Math.max(...reservasExistentes.map(r => r.id)) + 1 : 1;

        // CONVERSIÓN DE FECHAS: Pasamos de YYYY-MM-DD (HTML) a DD-MM-YYYY
        const fechaDesdeFormateada = convertirFechaAFormatoLocal(fDesde);
        const fechaHastaFormateada = convertirFechaAFormatoLocal(fHasta);

        // Creamos el objeto de la reserva respetando tus nombres de atributos
        const nuevaReserva = {
            id: nuevoId,
            id_vehiculo: vehiculoSeleccionado.id,
            correo_cliente: sesionActual.correo,
            rut_cliente: sesionActual.rut || sesionActual.rut_cliente || "No registrado",
            fechaDesde: fechaDesdeFormateada,
            fechaHasta: fechaHastaFormateada,
            total: totalPagar
        };

        // Cambiamos el vehiculos a no disponible
        vehiculoSeleccionado.disponible = false;
        localStorage.setItem("bequianrent_autos", JSON.stringify(listaVehiculos));

        // Guardar en LocalStorage
        reservasExistentes.push(nuevaReserva);
        saveReservas(reservasExistentes);

        alert("¡Reserva realizada con éxito! Serás redirigido a tu panel.");
        
        window.location.href = "mis_reservas.html";
    });
});

// Renderiza una tarjeta del vehiculo a reservar
function renderizarDatosVehiculo(auto) {
    const card = document.getElementById("detalle-vehiculo-card");
    const precioCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(auto.precio);

    card.innerHTML = `
        <img src="${auto.imagen || 'img/auto-placeholder.png'}" class="card-img-top p-3 rounded" alt="${auto.marca}" style="max-height: 280px; object-fit: cover; background-color: #f1f3f5;">
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <span class="badge bg-dark mb-2">${auto.tipo || 'Vehículo'}</span>
                <h3 class="card-title fw-bold text-dark mb-1">${auto.marca} ${auto.modelo}</h3>
                <p class="text-muted mb-3">Año modelo: ${auto.anio}</p>
                
                <div class="row g-2 mb-4">
                    <div class="col-6"><i class="fa-solid fa-gears text-primary me-2"></i>${auto.transmision || 'Manual'}</div>
                    <div class="col-6"><i class="fa-solid fa-users text-primary me-2"></i>${auto.pasajeros || 5} Pasajeros</div>
                    <div class="col-12 mt-2"><i class="fa-solid fa-gas-pump text-primary me-2"></i>Rendimiento: ${auto.rendimiento || 'N/A'}</div>
                </div>
            </div>
            
            <div class="border-top pt-3 text-end">
                <span class="text-muted d-block fs-7">Valor por día arriendo:</span>
                <span class="fs-3 fw-bold text-primary">${precioCLP}</span>
            </div>
        </div>
    `;
}

// Calculamos precio total a pegar dependiendo de la cantidad de dias
function calcularPrecios(desde, hasta, precioPorDia) {
    const resumenDias = document.getElementById("resumen-dias");
    const resumenTotal = document.getElementById("resumen-total");

    if (!desde || !hasta) {
        resumenDias.textContent = "0 días";
        resumenTotal.textContent = "$0";
        return;
    }

    const fecha1 = new Date(desde);
    const fecha2 = new Date(hasta);

    if (fecha2 >= fecha1) {
        const milisegundosPorDia = 24 * 60 * 60 * 1000;
        const totalDias = Math.round((fecha2 - fecha1) / milisegundosPorDia) + 1; 
        const totalDinero = totalDias * precioPorDia;

        resumenDias.textContent = `${totalDias} ${totalDias === 1 ? 'día' : 'días'}`;
        resumenTotal.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalDinero);
    } else {
        resumenDias.textContent = "0 días";
        resumenTotal.textContent = "$0";
    }
}

// Mensajes de error
function mostrarError(mensaje) {
    const alertaError = document.getElementById("reserva-error-alerta");
    alertaError.textContent = mensaje;
    alertaError.classList.remove("d-none");
}

// Convierte fechas a String.
function convertirFechaAFormatoLocal(fechaHtml) {
    if (!fechaHtml) return "";
    const partes = fechaHtml.split("-"); 
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}