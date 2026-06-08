document.addEventListener("DOMContentLoaded", function () {
    
    // Verificar si el usuario tiene sesión activa
    const sesionActual = getSesion();

    if (!sesionActual) {
        // Si no hay sesión, expulsar al login
        window.location.href = "login.html";
        return;
    }

    // Si la sesión es válida, renderizar sus reservas
    renderizarMisReservas(sesionActual);
});

function renderizarMisReservas(usuario) {
    const contenedor = document.getElementById("contenedor-mis-reservas");
    
    // Obtenemos reservas y vehiculos
    const todasLasReservas = getReservas();
    const todosLosVehiculos = getVehiculos();

    // Filtrar reservas por cliente
    const misReservas = todasLasReservas.filter(reserva => reserva.correo_cliente === usuario.correo);

    // Si el usuario no tiene ninguna reserva muestra mensaje
    if (misReservas.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-car-side fa-4x text-muted mb-3"></i>
                <h3 class="text-muted fw-bold">Aún no tienes reservas</h3>
                <p class="text-secondary">¡Anímate a explorar nuestra flota y planifica tu próximo viaje!</p>
                <a href="ver_autos.html" class="btn btn-primary mt-3 px-4 py-2 fw-semibold">Ver Vehículos</a>
            </div>
        `;
        return;
    }

    // Si tiene reservas, recorremos la lista y creamos las tarjetas HTML
    let html = "";
    
    misReservas.forEach(reserva => {
        // Buscamos los datos del vehículo para extraer la imagen, marca y modelo
        const auto = todosLosVehiculos.find(v => v.id == reserva.id_vehiculo);
        
        // Creamos variables seguras por si el vehículo fue borrado del sistema
        const marcaModelo = auto ? `${auto.marca} ${auto.modelo}` : "Vehículo Desconocido";
        const anio = auto ? `(${auto.anio})` : "";
        const imagen = auto && auto.imagen ? auto.imagen : "img/autos/auto_placeholder.jpg"; // Imagen por defecto si no hay foto
        
        // Formateamos el precio total a pesos chilenos
        const precioFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(reserva.total || 0);

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 car-card">
                    
                    <img src="${imagen}" class="card-img-top p-3" alt="${marcaModelo}" style="background-color: #f8f9fa; height: 220px; object-fit: contain;">
                    
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title fw-bold mb-0 text-dark">${marcaModelo} <span class="text-muted fs-6 fw-normal">${anio}</span></h5>
                            <span class="badge bg-dark fs-7">#${reserva.id}</span>
                        </div>
                        
                        <div class="mt-2 flex-grow-1 bg-light p-3 rounded border">
                            <div class="d-flex align-items-center mb-2 text-dark">
                                <i class="fa-solid fa-calendar-check text-primary me-3 fs-5"></i>
                                <div>
                                    <span class="d-block small text-muted">Fecha de Retiro</span>
                                    <span class="fw-semibold">${reserva.fechaDesde}</span>
                                </div>
                            </div>
                            <div class="d-flex align-items-center text-dark">
                                <i class="fa-solid fa-calendar-xmark text-danger me-3 fs-5"></i>
                                <div>
                                    <span class="d-block small text-muted">Fecha de Devolución</span>
                                    <span class="fw-semibold">${reserva.fechaHasta}</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-3 mt-3 d-flex justify-content-between align-items-center border-top">
                            <span class="text-muted fw-semibold">Total Pagado:</span>
                            <span class="fs-4 fw-bold text-success">${precioFormateado}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}