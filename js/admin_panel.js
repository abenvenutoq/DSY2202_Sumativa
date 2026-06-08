document.addEventListener("DOMContentLoaded", function () {
    // Proteger la pantalla (Solo Administradores pueden verla)
    const sesionActual = protegerPaginas(["admin"]);
    
    if (!sesionActual || sesionActual.rol !== "admin") {
        window.location.href = "index.html";
        return;
    }

    // Cargar la vista por defecto al entrar (Usuarios)
    cambiarVista('usuarios');
});

function cambiarVista(vista) {
    const btnUsuarios = document.getElementById("btn-usuarios");
    const btnReservas = document.getElementById("btn-reservas");
    const btnVehiculos = document.getElementById("btn-vehiculos");
    const panelTitulo = document.getElementById("panel-titulo");

    // Limpiar clases activas del submenú
    btnUsuarios.classList.remove("active");
    btnReservas.classList.remove("active");
    if (btnVehiculos) btnVehiculos.classList.remove("active");

    if (vista === 'usuarios') {
        btnUsuarios.classList.add("active");
        panelTitulo.textContent = "Usuarios Registrados";
        renderizarUsuarios();
    } else if (vista === 'reservas') {
        btnReservas.classList.add("active");
        panelTitulo.textContent = "Reservas Realizadas";
        renderizarReservas();
    } else if (vista === 'vehiculos') {
        if (btnVehiculos) btnVehiculos.classList.add("active");
        panelTitulo.textContent = "Inventario de Vehículos";
        renderizarVehiculos();
    }
}

// Funcion para renderizar usuarios en tabla
function renderizarUsuarios() {
    const contenedor = document.getElementById("panel-tabla-contenedor");
    const contador = document.getElementById("panel-contador");
    
    // Obtenemos usuarios guardados
    const usuarios = getUsuario();
    contador.textContent = usuarios.length;

    if (usuarios.length === 0) {
        contenedor.innerHTML = `<div class="alert alert-info text-center">No hay usuarios registrados en el sistema.</div>`;
        return;
    }

    let html = `
        <table class="table table-striped table-hover align-middle text-nowrap">
            <thead class="table-dark">
                <tr>
                    <th>RUT</th>
                    <th>Nombre Completo</th>
                    <th>Correo Electrónico</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                </tr>
            </thead>
            <tbody>
    `;

    usuarios.forEach(user => {
        let badgeRol;
        if(user.rol === 'admin'){
            badgeRol = '<span class="badge bg-admin">Administrador</span>';
        } else {
            badgeRol = '<span class="badge bg-cliente">Cliente</span>';
        }
        html += `
            <tr>
                <td class="fw-semibold">${user.rut || 'N/A'}</td>
                <td>${user.nombre} ${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.telefono || 'N/A'}</td>
                <td>${badgeRol}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
}

// Funcion para renderizar reservas en tabla
function renderizarReservas() {
    const contenedor = document.getElementById("panel-tabla-contenedor");
    const contador = document.getElementById("panel-contador");
    
    // Traemos las reservas y vehiculos de tu base de datos local
    const vehiculos = getVehiculos();
    const reservas = getReservas();

    contador.textContent = reservas.length;

    if (reservas.length === 0) {
        contenedor.innerHTML = `<div class="alert alert-info text-center">No se han registrado reservas en el sistema aún.</div>`;
        return;
    }

    let html = `
        <table class="table table-striped table-hover align-middle text-nowrap">
            <thead class="table-dark">
                <tr>
                    <th>ID Reserva</th>
                    <th>Cliente (Email)</th>
                    <th>Rut Cliente</th>
                    <th>Vehículo</th>
                    <th>Id Vehiculo</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Término</th>
                    <th>Total Pagado</th>
                    <th class="text-center">Acciones</th> </tr>
            </thead>
            <tbody>
    `;

    reservas.forEach(reserva => {
        const datosVehiculo = vehiculos.find(vehiculo => vehiculo.id == reserva.id_vehiculo);

        // Formateamos el precio a formato moneda chilena CLP por presentación
        const precioFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(reserva.total || reserva.precio);

        // Si el vehículo existe, sacamos sus datos. Si no, ponemos "Vehículo no encontrado"
        const textoVehiculo = datosVehiculo 
            ? `${datosVehiculo.marca} ${datosVehiculo.modelo} (${datosVehiculo.anio})` 
            : "Vehículo no encontrado";

        html += `
            <tr>
                <td class="fw-bold text-primary">#${reserva.id}</td>
                <td>${reserva.correo_cliente || reserva.correo}</td>
                <td>${reserva.rut_cliente || reserva.rut || 'No registrado'}</td>
                
                <td>${textoVehiculo}</td>
                <td>${datosVehiculo ? datosVehiculo.id : 'N/A'}</td>
                
                <td>${reserva.fechaDesde}</td>
                <td>${reserva.fechaHasta}</td>
                <td class="fw-semibold text-success">${precioFormateado}</td>
                
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1 fw-semibold text-dark" onclick="editarReserva(${reserva.id})">
                        <i class="fa-solid fa-pen-to-square me-1"></i>Editar
                    </button>
                    <button class="btn btn-danger btn-sm fw-semibold" onclick="eliminarReserva(${reserva.id})">
                        <i class="fa-solid fa-trash me-1"></i>Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
}

// Elimina una reserva del sistema y libera el vehículo asociado
function eliminarReserva(idReserva) {
    // Confirmar eliminación
    const confirmar = confirm(`¿Está seguro de que desea eliminar la reserva #${idReserva}? El vehículo asignado volverá a estar disponible.`);
    
    if (!confirmar) return; // Si cancela, no hacemos nada

    // Obtener los arreglos actualizados desde el LocalStorage
    const listaReservas = getReservas();
    const listaVehiculos = getVehiculos();

    // Encontrar la reserva que queremos eliminar
    const reservaAEliminar = listaReservas.find(res => res.id == idReserva);

    if (reservaAEliminar) {
        // Buscar el vehículo asociado a esa reserva y volver a poner disponible = true
        const vehiculoAsociado = listaVehiculos.find(auto => auto.id == reservaAEliminar.id_vehiculo);
        if (vehiculoAsociado) {
            vehiculoAsociado.disponible = true;
        }

        // Filtrar la lista de reservas para sacar la que borramos
        const nuevasReservas = listaReservas.filter(res => res.id != idReserva);

        // Guardar los cambios de vuelta en el LocalStorage

        saveReservas(nuevasReservas);
        saveVehiculos(listaVehiculos);

        alert("Reserva eliminada con éxito y vehículo liberado.");
        
        // Volver a dibujar la tabla para ver los cambios de inmediato
        renderizarReservas();
    } else {
        alert("Error: No se encontró la reserva seleccionada.");
    }
}


// Funcion para modificar las fechas
function editarReserva(idReserva) {
    const listaReservas = JSON.parse(localStorage.getItem("bequianrent_reservas")) || [];
    const reservaAEditar = listaReservas.find(res => res.id == idReserva);

    if (!reservaAEditar) {
        alert("Reserva no encontrada.");
        return;
    }

    // Solicita nuevas fechas propmt
    const nuevaFechaDesde = prompt("Modificar fecha de retiro (DD-MM-YYYY):", reservaAEditar.fechaDesde);
    if (nuevaFechaDesde === null) return; 

    const nuevaFechaHasta = prompt("Modificar fecha de devolución (DD-MM-YYYY):", reservaAEditar.fechaHasta);
    if (nuevaFechaHasta === null) return;

    if (nuevaFechaDesde.trim() === "" || nuevaFechaHasta.trim() === "") {
        alert("Las fechas no pueden quedar vacías.");
        return;
    }

    // Actualizamos los campos de la reserva encontrada
    reservaAEditar.fechaDesde = nuevaFechaDesde;
    reservaAEditar.fechaHasta = nuevaFechaHasta;

    // Guardamos la lista modificada en el LocalStorage
    saveReservas(listaReservas);
    
    alert("Fechas de reserva actualizadas correctamente.");
    
    // Refrescamos la tabla
    renderizarReservas();
}

// Renderizamos lista de vehiculos
function renderizarVehiculos() {
    const contenedor = document.getElementById("panel-tabla-contenedor");
    const contador = document.getElementById("panel-contador");
    
    // Leemos de localStorage o de la constante original si está vacío
    const vehiculos = JSON.parse(localStorage.getItem("bequianrent_autos")) || (typeof VEHICULOS !== 'undefined' ? VEHICULOS : []);
    contador.textContent = vehiculos.length;

    if (vehiculos.length === 0) {
        contenedor.innerHTML = `<div class="alert alert-info text-center">No hay vehículos registrados en el sistema.</div>`;
        return;
    }

    let html = `
        <table class="table table-striped table-hover align-middle text-nowrap">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Vehículo</th>
                    <th>Tipo / Transmisión</th>
                    <th>Precio x Día</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    vehiculos.forEach(auto => {
        // Formatear precio a CLP
        const precioFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(auto.precio);
        
        // Badge dinámico según disponibilidad
        const badgeEstado = auto.disponible 
            ? '<span class="badge bg-success">Disponible</span>' 
            : '<span class="badge bg-danger">Arrendado / Ocupado</span>';
            
        // Validar si existe imagen o usar placeholder
        const imgUrl = auto.imagen || 'img/autos/auto_placeholder.jpg';

        html += `
            <tr>
                <td class="fw-bold">#${auto.id}</td>
                <td>
                    <img src="${imgUrl}" alt="${auto.marca}" class="rounded border bg-light" style="height: 40px; width: 65px; object-fit: contain; padding: 2px;">
                </td>
                <td>
                    <span class="fw-semibold d-block text-dark">${auto.marca} ${auto.modelo}</span>
                    <small class="text-muted">Año: ${auto.anio}</small>
                </td>
                <td>
                    <span class="d-block small fw-medium">${auto.tipo}</span>
                    <small class="text-muted">${auto.transmision || 'N/A'}</small>
                </td>
                <td class="fw-bold text-primary">${precioFormateado}</td>
                <td>${badgeEstado}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm fw-semibold text-dark" onclick="editarVehiculo(${auto.id})">
                        <i class="fa-solid fa-pen-to-square me-1"></i>Editar
                    </button>
                    <button class="btn btn-danger btn-sm fw-semibold ms-1" onclick="eliminarVehiculo(${auto.id})">
                        <i class="fa-solid fa-trash me-1"></i>Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <div class="d-flex justify-content-end mt-3 pt-2 border-top">
            <a href="agregar_vehiculo.html" class="btn btn-success fw-semibold shadow-sm px-4">
                <i class="fa-solid fa-circle-plus me-2"></i>Agregar Nuevo Vehículo
            </a>
        </div>
        
    `;

    contenedor.innerHTML = html;
}

// Funcion para editar vehiculos
function editarVehiculo(idVehiculo) {
    const listaVehiculos = getVehiculos();
    const auto = listaVehiculos.find(v => v.id == idVehiculo);

    if (!auto) {
        alert("Error: Vehículo no encontrado.");
        return;
    }

    // Modificar precio mediante prompt
    const nuevoPrecioStr = prompt(`Modificar precio de arriendo diario para ${auto.marca} ${auto.modelo}:`, auto.precio);
    if (nuevoPrecioStr === null) return; 

    const nuevoPrecio = parseInt(nuevoPrecioStr);
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("Por favor, ingrese un monto numérico válido y mayor a $0.");
        return;
    }

    // Mooficiar disponibilidad mediante prompt SI O NO
    const cambiarEstado = confirm(`¿Desea cambiar el estado actual del vehículo?\nEstado Actual: ${auto.disponible ? 'DISPONIBLE' : 'ARRENDADO'}\n\nPresione [Aceptar] para cambiar el estado, o [Cancelar] para mantenerlo.`);

    // Aplicar los cambios al objeto en memoria
    auto.precio = nuevoPrecio;
    if (cambiarEstado) {
        auto.disponible = !auto.disponible;
    }

    // Guardar datos 
    saveVehiculos(listaVehiculos);
    
    alert(`¡${auto.marca} ${auto.modelo} actualizado correctamente!`);
    
    // Refrescar la tabla en tiempo real
    renderizarVehiculos();
}

// Funcion para eliminar el vehiculo
function eliminarVehiculo(idVehiculo) {
    const listaVehiculos = getVehiculos();
    
    // Buscamos el vehiculo por id
    const autoAEliminar = listaVehiculos.find(v => v.id == idVehiculo);

    if (!autoAEliminar) {
        alert("Error: No se encontró el vehículo seleccionado.");
        return;
    }

    // Confirmación de seguridad en promntp
    const confirmacion = confirm(`¿Estás completamente seguro de que deseas eliminar el ${autoAEliminar.marca} ${autoAEliminar.modelo} de la flota?\n\nEsta acción no se puede deshacer.`);

    if (confirmacion) {
        // Filtrar el arreglo para excluir el vehículo
        const nuevaLista = listaVehiculos.filter(v => v.id != idVehiculo);

        // Guardar la nueva lista en LocalStorage
        saveVehiculos(nuevaLista);

        // Notificar en prompt y actualizar tabla
        alert(`El vehículo ${autoAEliminar.marca} ha sido eliminado exitosamente.`);
        renderizarVehiculos(); 
    }
}