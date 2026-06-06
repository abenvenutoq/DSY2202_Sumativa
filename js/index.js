document.addEventListener('DOMContentLoaded', () => {

    //localStorage.removeItem(APP_AUTOS);

    if (!localStorage.getItem(APP_AUTOS)) {
        localStorage.setItem(APP_AUTOS, JSON.stringify(VEHICULOS));
    }

    const autosData = JSON.parse(localStorage.getItem(APP_AUTOS)) || [];

    const autosDisponibles = autosData.filter(auto => auto.disponible === true);

    const autosMezclados = [...autosDisponibles].sort(() => 0.5 - Math.random());
    
    const autosAMostrar = autosMezclados.slice(0, 3);

    const contenedorDestacados = document.getElementById('vehiculos-destacados');

    if (contenedorDestacados) {
        contenedorDestacados.innerHTML = "";
        
        autosAMostrar.forEach(auto => {

            const formatPrecio = new Intl.NumberFormat('es-CL').format(auto.precio);
            const tipoBadgeColor = auto.tipo === 'Sedán' ? 'bg-primary' : 'bg-info text-dark';
            
            const cardHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm car-card">
                    <img src="${auto.imagen}" class="card-img-top" alt="${auto.tipo} ${auto.marca}">
                    <div class="card-body d-flex flex-column">
                        <div>
                            <span class="badge ${tipoBadgeColor} mb-2">${auto.tipo}</span>
                            <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
                            <p class="card-text text-muted small">Excelente rendimiento y comodidad para tus viajes en la ciudad o carretera.</p>
                        </div>
                        
                        <ul class="list-unstyled mb-4 mt-auto">
                            <li>🛣️ Rinde: ${auto.rendimiento}</li>
                            <li>⚙️ Transmisión: ${auto.transmision}</li>
                            <li>👥 Pasajeros: ${auto.pasajeros}</li>
                            <li>🕧 Año: ${auto.anio}</li>
                        </ul>
                        
                        <div class="d-flex justify-content-between align-items-center border-top pt-3">
                            <span class="fs-5 fw-bold text-primary">${formatPrecio} / día</span>
                            <button class="btn btn-outline-primary btn-reservar" data-vehiculo="${auto.marca} ${auto.modelo}">Reservar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            contenedorDestacados.innerHTML += cardHTML;
        });
    }
});

