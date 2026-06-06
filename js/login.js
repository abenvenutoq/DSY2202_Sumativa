// Cargamos contenido del DOM
document.addEventListener("DOMContentLoaded", function () {

    
    const formLogin = document.getElementById("formLogin");
    const txtCorreo = document.getElementById("login-correo");
    const txtPassword = document.getElementById("login-password");
    const alertError = document.getElementById("login-error");

    // Quitar estilo de error al escribir
    [txtCorreo, txtPassword].forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("is-invalid");
            alertError.classList.add("d-none");
        });
    });

    formLogin.addEventListener("submit", function (e) {

        e.preventDefault();

        let isValid = true;

        // Validación simple de campos vacíos
        if (txtCorreo.value.trim() === "") {
            txtCorreo.classList.add("is-invalid");
            isValid = false;
        }
        if (txtPassword.value.trim() === "") {
            txtPassword.classList.add("is-invalid");
            isValid = false;
        }

        if (isValid) {
            // 1. Traemos la lista de clientes registrados desde el LocalStorage
            const clientesGuardados = JSON.parse(localStorage.getItem("bequianrent_usuarios")) || [];
            
            // 2. Buscamos si existe un cliente que tenga el MISMO correo y la MISMA contraseña ingresada
            const usuarioValido = clientesGuardados.find(
                cliente => cliente.correo === txtCorreo.value && cliente.password === txtPassword.value
            );

            // 3. Verificamos el resultado
            if (usuarioValido) {
                // ¡Éxito! Las credenciales coinciden
                
                const usuarioActual = {
                    nombre: usuarioValido.nombre, // Usamos el nombre real con el que se registró
                    correo: usuarioValido.correo
                };

                saveSesion(usuarioValido);
                
                // Mostramos mensaje de éxito y redirigimos
                alertError.classList.remove("alert-danger");
                alertError.classList.add("alert-success");
                alertError.textContent = `¡Bienvenido de nuevo, ${usuarioValido.nombre}! Redirigiendo...`;
                alertError.classList.remove("d-none");

                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1500);

            } else {
                // Error: Correo no existe o contraseña incorrecta
                alertError.classList.remove("alert-success");
                alertError.classList.add("alert-danger");
                alertError.textContent = "Correo o contraseña incorrectos. Verifica tus datos o regístrate.";
                alertError.classList.remove("d-none");
            }

        } else {
            alertError.classList.remove("alert-success");
            alertError.classList.add("alert-danger");
            alertError.textContent = "Por favor completa todos los campos.";
            alertError.classList.remove("d-none");
        }
    });
});