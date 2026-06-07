document.addEventListener("DOMContentLoaded", function() {

    const formRegistro = document.getElementById("formRegistro");

    formRegistro.addEventListener("submit", function(event) {
        event.preventDefault();


        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value;
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let formularioValido = true;

        if (isEmpty(nombre)) {
            marcarInvalido("nombre", "nombre-error", "El nombre es obligatorio");
            formularioValido = false;
        } else {
            marcarValido("nombre", "nombre-error");
        }

        if (isEmpty(apellido)) {
            marcarInvalido("apellido", "apellido-error", "El apellido es obligatorio");
            formularioValido = false;
        } else {
            marcarValido("apellido", "apellido-error");
        }

        if (!validarRutChileno(rut)) {
            marcarInvalido("rut", "rut-error", "Ingresa un RUT chileno válido (ej: 12345678-K)");
            formularioValido = false;
        } else {
            marcarValido("rut", "rut-error");
        }

        const usuarios = getUsuario();

        if (!isValidEmail(correo)) {
            marcarInvalido("correo", "correo-error", "Ingresa un formato de correo electrónico válido");
            formularioValido = false;
        } else {
            const correoExistente = usuarios.some(usuario => usuario.correo === correo);
            
            if (correoExistente) {
                marcarInvalido("correo", "correo-error", 'Este correo ya está registrado, para recuperar tu contraseña ve a la página de <a href="login.html" class="text-decoration-underline fw-bold text-reset">inicio de sesión</a>');
                formularioValido = false;
            } else {
                marcarValido("correo", "correo-error");
            }
        }

        if (!isPhoneNumber(telefono)) {
            marcarInvalido("telefono", "telefono-error", "El teléfono debe tener exactamente 9 dígitos");
            formularioValido = false;
        } else {
            marcarValido("telefono", "telefono-error");
        }

        if (!validDireccion(direccion)){
            marcarInvalido("direccion", "direccion-error", "La dirección no puede estar compuesta solo de espacios vacíos");
            formularioValido = false;
        } else {
            marcarValido("direccion", "direccion-error");   
        }

        if (!isPasswordSecure(password)) {
            marcarInvalido("password", "password-error", "Debe ser entre 8 y 16 caracteres, incluir 1 mayúscula, 1 número y 1 caracter especial (!@#$%&*)");
            formularioValido = false;
        } else {
            marcarValido("password", "password-error");
        }

        if (isEmpty(confirmPassword)) {
            marcarInvalido("confirmPassword", "confirmPassword-error", "Debes confirmar tu contraseña");
            formularioValido = false;
        } else if (password !== confirmPassword) {
            marcarInvalido("confirmPassword", "confirmPassword-error", "Las contraseñas no coinciden");
            formularioValido = false;
        } else {
            marcarValido("confirmPassword", "confirmPassword-error");
        }

        if (!formularioValido) {
            return;
        }

        const nuevoUsuario = {
            nombre: nombre,
            apellido: apellido,
            rut: rut,
            correo: correo,
            telefono: telefono,
            direccion: direccion,
            password: password,
            rol: "cliente"
        };

        usuarios.push(nuevoUsuario);
        saveUsuarios(usuarios);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        formRegistro.reset();
        window.location.href = "login.html";

    })

});