document.addEventListener("DOMContentLoaded", function () {
    
    // Verificamos si hay una sesión activa usando la función de app.js
    const sesion = protegerPaginas(["cliente", "admin"]);

    // Si no hay sesión, redirigimos al login por seguridad
    if (!sesion) {
        window.location.href = "login.html";
        return;
    }

    // Traemos todos los usuarios registrados
    const usuarios = getUsuario();

    // Buscamos el registro completo del usuario logueado usando su correo
    const datosUsuario = usuarios.find(u => u.correo.toLowerCase() === sesion.correo.toLowerCase());

    if (datosUsuario) {
        
        // Elementos de la columna izquierda (Resumen)
        document.getElementById("resumenNombre").textContent = `${datosUsuario.nombre} ${datosUsuario.apellido || ""}`.trim();
        
        const rolElemento = document.getElementById("resumenRol");
        rolElemento.textContent = (datosUsuario.rol || "Cliente").toUpperCase();
        
        // Si es administrador, le ponemos color rojo (danger) y cambiamos el icono
        if (datosUsuario.rol === "admin") {
            rolElemento.classList.replace("bg-primary", "bg-danger");
            document.getElementById("avatarIcon").className = "fa-solid fa-user-gear";
        }

        // Elementos de la columna derecha (Detalles)
        document.getElementById("perfilNombre").textContent = `${datosUsuario.nombre} ${datosUsuario.apellido || ""}`.trim();
        document.getElementById("perfilCorreo").textContent = datosUsuario.correo;
        
        // Operadores ternarios para manejar datos que podrían estar vacíos
        document.getElementById("perfilRut").textContent = datosUsuario.rut ? datosUsuario.rut : "No registrado";
        document.getElementById("perfilTelefono").textContent = datosUsuario.telefono ? `+56 ${datosUsuario.telefono}` : "No registrado";
        document.getElementById("perfilDireccion").textContent = datosUsuario.direccion ? datosUsuario.direccion : "No registrada";

    } else {
        console.error("No se encontraron los datos completos del usuario.");
    }
});