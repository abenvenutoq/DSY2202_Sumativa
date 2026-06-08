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
    const panelTitulo = document.getElementById("panel-titulo");

    // Limpiar clases activas del submenú
    btnUsuarios.classList.remove("active");
    btnReservas.classList.remove("active");

    if (vista === 'usuarios') {
        btnUsuarios.classList.add("active");
        panelTitulo.textContent = "Usuarios Registrados";
        renderizarUsuarios();
    } else if (vista === 'reservas') {
        btnReservas.classList.add("active");
        panelTitulo.textContent = "Reservas Realizadas";
        renderizarReservas();
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
        // Agregar estilo custome al badge de roles

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
                </tr>
            </thead>
            <tbody>
    `;

    reservas.forEach(reserva => {
        
        // CORRECCIÓN 1 Y 2: Comparamos sin toLowerCase porque los ID son números. 
        // Usamos '==' en vez de '===' por si el ID de la reserva se guardó como texto ("1" == 1)
        const datosVehiculo = vehiculos.find(vehiculo => vehiculo.id == reserva.id_vehiculo);

        // Formateamos el precio a formato moneda chilena CLP por presentación
        const precioFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(reserva.total || reserva.precio);

        // CORRECCIÓN 3: Si el vehículo existe, sacamos sus datos. Si no, ponemos "Vehículo no encontrado"
        const textoVehiculo = datosVehiculo 
            ? `${datosVehiculo.marca} ${datosVehiculo.modelo} (${datosVehiculo.anio})` 
            : "Vehículo no encontrado";

        html += `
            <tr>
                <td class="fw-bold text-primary">#${reserva.id}</td>
                <td>${reserva.correo_cliente || reserva.correo}</td>
                <td>${reserva.rut_cliente || reserva.rut || 'No registrado'}</td>
                <td>${datosVehiculo.marca} ${datosVehiculo.modelo}</td>
                <td>${datosVehiculo.id}</td>
                <td>${reserva.fechaDesde}</td>
                <td>${reserva.fechaHasta}</td>
                <td class="fw-semibold text-success">${precioFormateado}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
}