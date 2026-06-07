document.addEventListener("DOMContentLoaded", function () {
    
    // Verificar si el usuario tiene sesión activa al cargar la página
    const sesionActual = getSesion();

    console.log("Sesión actual:", sesionActual); // Debug: Verificar el contenido de la sesión

    if (!sesionActual) {
        
        // Si no hay sesión, expulsar al login
        window.location.href = "login.html";
        return;
    }

    // Obtener datos de la base de datos para el usuario actual
    let clientes = getUsuario() || [];
    
    // Buscar la posición del usuario actual en la base de datos usando el correo
    const indexUsuario = clientes.findIndex(cliente => cliente.correo === sesionActual.correo);
    
    if (indexUsuario === -1) {
        // Si por error la sesión existe pero el cliente no está en la BD, limpiar y expulsar
        localStorage.removeItem(APP_SESION);
        window.location.href = "login.html";
        return;
    }

    // Datos completos del cliente desde la base de datos
    const misDatos = clientes[indexUsuario];

    // Enlazamos los elementos del formulario y alertas
    const formUpdate = document.getElementById("formUpdate");
    const txtNombre = document.getElementById("nombre");
    const txtApellido = document.getElementById("apellido");
    const txtRut = document.getElementById("rut");
    const txtCorreo = document.getElementById("correo");
    const txtTelefono = document.getElementById("telefono");
    const txtDireccion = document.getElementById("direccion");
    const txtPassword = document.getElementById("password");
    const txtConfirmPassword = document.getElementById("confirmPassword");
    
    const alertSuccess = document.getElementById("alert-success");
    const alertError = document.getElementById("alert-error");

    // Cargamos los datos del cliente en el formulario, los campos de RUT y Correo son readonly por seguridad
    txtNombre.value = misDatos.nombre;
    txtApellido.value = misDatos.apellido;
    txtRut.value = misDatos.rut;
    txtTelefono.value = misDatos.telefono;
    txtCorreo.value = misDatos.correo;
    
    // Validar si los opcionales dicen "No especificada" para mostrar vacío
    txtDireccion.value = misDatos.direccion !== "No especificada" ? misDatos.direccion : "";

    // Limpiar errores visuales al escribir
    const inputs = [txtNombre, txtApellido, txtTelefono, txtPassword];
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("is-invalid");
        });
    });

    // Evento para guardar los datos actualizados del perfil
    formUpdate.addEventListener("submit", function (evento) {
        evento.preventDefault();
        
        let isValid = true;
        
        // Validacion de nombre simplemente que no esté vacío
        if (isEmpty(txtNombre.value.trim())) {
            marcarInvalido("nombre", "nombre-error", "El nombre es obligatorio");
            isValid = false;
        } else {
            marcarValido("nombre", "nombre-error");
        }

        // Validacion de apellido simplemente que no esté vacío
        if (isEmpty(txtApellido.value.trim())) {
            marcarInvalido("apellido", "apellido-error", "El apellido es obligatorio");
            isValid = false;
        } else {
            marcarValido("apellido", "apellido-error");
        }

        // Validacion de teléfono (exactamente 9 dígitos)
        if (!isPhoneNumber(txtTelefono.value.trim())) {
            marcarInvalido("telefono", "telefono-error", "El teléfono debe tener exactamente 9 dígitos");
            isValid = false;
        } else {
            marcarValido("telefono", "telefono-error");
        }

        // Validacion de dirección simplemente que no este compuesta solo por espacios
        if (!validDireccion(txtDireccion.value.trim())){
            marcarInvalido("direccion", "direccion-error", "La dirección no puede estar compuesta solo de espacios vacíos");
            isValid = false;
        } else {
            marcarValido("direccion", "direccion-error");   
        }

        // Validacion de contraseña (8-16 caracteres, 1 mayúscula, 1 número, 1 caracter especial)
        if (!isPasswordSecure(txtPassword.value)) {
            marcarInvalido("password", "password-error", "Debe ser entre 8 y 16 caracteres, incluir 1 mayúscula, 1 número y 1 caracter especial (!@#$%&*)");
            isValid = false;
        } else {
            marcarValido("password", "password-error");
        }

        // Validacion de confirmación de contraseña
        if (isEmpty(txtConfirmPassword.value)) {
            marcarInvalido("confirmPassword", "confirmPassword-error", "Debes confirmar tu contraseña");
            isValid = false;
        } else if (txtPassword.value !== txtConfirmPassword.value) {
            marcarInvalido("confirmPassword", "confirmPassword-error", "Las contraseñas no coinciden");
            isValid = false;
        } else {
            marcarValido("confirmPassword", "confirmPassword-error");
        }

        if (isValid) {
            // Actualizar el registro en el arreglo 'clientes'
            clientes[indexUsuario].nombre = txtNombre.value.trim();
            clientes[indexUsuario].apellido = txtApellido.value.trim();
            clientes[indexUsuario].telefono = txtTelefono.value.trim();
            clientes[indexUsuario].direccion = txtDireccion.value.trim() || "No especificada";
            clientes[indexUsuario].password = txtPassword.value;

            // Sobrescribir la base de datos completa en LocalStorage
            localStorage.setItem("bequianrent_usuarios", JSON.stringify(clientes));

            // Si el nombre cambió, actualizar también el objeto de sesión para que el Navbar reaccione
            if (sesionActual.nombre !== txtNombre.value.trim()) {
                sesionActual.nombre = txtNombre.value.trim();
                localStorage.setItem("bequianrent_usuario", JSON.stringify(sesionActual));
                
                // Forzar actualización del Navbar global, el avatar y el texto en perfil
                if(typeof actualizarNavbar === "function") actualizarNavbar();
            }

            alert("Datos actualizados correctamente. Volviendo al perfil.");
            formUpdate.reset();
            window.location.href = "mi_perfil.html";

        } else {
            // Mostrar mensaje de error
            alertSuccess.classList.add("d-none");
            alertError.textContent = "Por favor, completa correctamente los campos obligatorios.";
            alertError.classList.remove("d-none");
        }
    });

    // llamamos funciones para ver y ocultar contraseña
    configurarOjito("password", "ojo-password");
    configurarOjito("confirmPassword", "ojo-confirmPassword");

});