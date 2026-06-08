document.addEventListener('DOMContentLoaded', () => {
    
    //Get data desde APP_AUTOS
    const autosData = getVehiculos();

    // Referencias al DOM
    const contenedorAutos = document.getElementById('contenedor-autos');
    const msgSinResultados = document.getElementById('sin-resultados');
    const contadorResultados = document.getElementById('contador-resultados');
    
    const formFiltros = document.getElementById('formFiltros');
    const selectMarca = document.getElementById('filtro-marca');
    const selectAnio = document.getElementById('filtro-anio');
    const selectDisponible = document.getElementById('filtro-disponible');
    const btnLimpiar = document.getElementById('btn-limpiar');


    //Poblar select del filtro

    // Mapea las marcas de los vehiculos guardados en memoria y elimina los duplicados con SET
    const marcasUnicas = [...new Set(autosData.map(auto => auto.marca))].sort();
    marcasUnicas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        selectMarca.appendChild(option);
    });

    // Mapea los años de los vehiculos guardados en memoria y elimina los duplicados con SET
    const aniosUnicos = [...new Set(autosData.map(auto => auto.anio))].sort((a, b) => b - a);
    aniosUnicos.forEach(anio => {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectAnio.appendChild(option);
    });


    // Funciones para mostrar tarjetas
    function renderizarAutos(listaAutos) {

        contenedorAutos.innerHTML = "";
        contenedorAutos.appendChild(msgSinResultados);

        // Contador al pie del filtro
        contadorResultados.textContent = `Mostrando ${listaAutos.length} vehículos`;

        if (listaAutos.length === 0) {
            msgSinResultados.classList.remove('d-none');
            return;
        }

        msgSinResultados.classList.add('d-none');

        listaAutos.forEach(auto => {
            const formatPrecio = new Intl.NumberFormat('es-CL').format(auto.precio);
            const tipoBadgeColor = auto.tipo === 'Sedán' ? 'bg-primary' : 'bg-info text-dark';
            
            const estadoBadge = auto.disponible 
                ? `<span class="badge bg-success mb-2 ms-1">Disponible</span>` 
                : `<span class="badge bg-danger mb-2 ms-1">No Disponible</span>`;
                
            const disableBtn = auto.disponible ? '' : 'disabled';
            const textBtn = auto.disponible ? 'Reservar' : 'No Disponible';

            
            const claseNoDisponible = auto.disponible ? '' : 'no-disponible';

            const cardHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm car-card ${claseNoDisponible}">
                    
                    <img src="${auto.imagen}" class="card-img-top ${claseNoDisponible}" alt="${auto.tipo} ${auto.marca}">
                    
                    <div class="card-body d-flex flex-column">
                        <div>
                            <span class="badge ${tipoBadgeColor} mb-2">${auto.tipo}</span>
                            ${estadoBadge}
                            <h5 class="card-title fw-bold">${auto.marca} ${auto.modelo}</h5>
                            <p class="card-text text-muted small">${auto.descripcion}</p>
                        </div>
                        <hr>
                        <ul class="list-unstyled mb-4 mt-auto small">
                            <li><i class="fa-solid fa-route"></i> Rinde: ${auto.rendimiento}</li>
                            <li><i class="fa-solid fa-gear"></i> Transmisión: ${auto.transmision}</li>
                            <li><i class="fa-solid fa-user-group"></i> Pasajeros: ${auto.pasajeros}</li>
                            <li><i class="fa-solid fa-clock-rotate-left"></i> Año: ${auto.anio}</li>
                        </ul>
                        
                        <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                            <span class="fs-5 fw-bold text-primary">$${formatPrecio} / día</span>
                            <button class="btn btn-outline-primary btn-reservar" data-vehiculo="${auto.marca} ${auto.modelo}" ${disableBtn} onclick="window.location.href='reservar_auto.html?id=${auto.id}'">
                                ${textBtn}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            contenedorAutos.insertAdjacentHTML('beforeend', cardHTML);
        });
    }


    // Funcion para filtrar flota autos
    function aplicarFiltros() {
        const valMarca = selectMarca.value;
        const valAnio = selectAnio.value;
        const valDisponible = selectDisponible.value;

        const filtrados = autosData.filter(auto => {
            if (valMarca && auto.marca !== valMarca) return false;
            if (valAnio && auto.anio.toString() !== valAnio) return false;
            
            if (valDisponible) {
                const booleanBuscado = (valDisponible === "true");
                if (auto.disponible !== booleanBuscado) return false;
            }

            return true; 
        });

        renderizarAutos(filtrados);
    }


    // Evento para filtrar con cada cambio en los select. 
    formFiltros.addEventListener('change', aplicarFiltros);

    // Limpiar filtros
    btnLimpiar.addEventListener('click', function (e){
        e.preventDefault();
        formFiltros.reset();
        renderizarAutos(autosData);
    });


    // Mostrar todos al ingresar a la pagina 
    renderizarAutos(autosData);

});