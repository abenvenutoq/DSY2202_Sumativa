
// Función para mostrar el Modal de recuperación de contraseña
window.abrirModalRecuperar = function() {
    const form = document.getElementById('formRecuperar');
    if(form) form.reset();
    
    const alerta = document.getElementById('recuperar-alerta');
    if(alerta) alerta.className = "alert d-none"; 
    
    const inputs = ['recuperar-correo', 'recuperar-password', 'recuperar-confirmPassword'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if(input) input.classList.remove('is-valid', 'is-invalid');
    });

    const modal = new bootstrap.Modal(document.getElementById('modalRecuperar'));
    modal.show();
}


// Carga del DOM
document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");
    const txtCorreo = document.getElementById("login-correo");
    const txtPassword = document.getElementById("login-password");
    const alertError = document.getElementById("login-error");

    if (formLogin && txtCorreo && txtPassword && alertError) {

        // Quitamos estilo error al escribir en los campos
        [txtCorreo, txtPassword].forEach(input => {
            input.addEventListener("input", () => {
                input.classList.remove("is-invalid");
                alertError.classList.add("d-none");
            });
        });

        // Quitamos estilos de error al escribir en los campos del modal de recuperación
        const inputsModal = ['recuperar-correo', 'recuperar-password', 'recuperar-confirmPassword'];

        inputsModal.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener("input", () => {
                    input.classList.remove("is-invalid", "is-valid");
                    
                    const mensajeError = document.getElementById(`${id}-error`);
                    if (mensajeError) {
                        mensajeError.innerHTML = "";
                    }

                    const alerta = document.getElementById('recuperar-alerta');
                    if (alerta) alerta.className = "alert d-none";
                });
            }
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
                // Traemos la lista de clientes registrados desde el LocalStorage
                const clientesGuardados = JSON.parse(localStorage.getItem("bequianrent_usuarios")) || [];
                
                // Buscamos si existe un cliente con credenciales válidas
                const usuarioValido = clientesGuardados.find(
                    cliente => cliente.correo === txtCorreo.value && cliente.password === txtPassword.value
                );

                // Si encontramos un usuario válido, guardamos su sesión y redirigimos al index, sino mostramos un error
                if (usuarioValido) {
                    const usuarioActual = {
                        nombre: usuarioValido.nombre,
                        correo: usuarioValido.correo
                    };

                    saveSesion(usuarioValido);
                    
                    alertError.classList.remove("alert-danger");
                    alertError.classList.add("alert-success");
                    alertError.textContent = `¡Bienvenido de nuevo, ${usuarioValido.nombre}! Redirigiendo...`;
                    alertError.classList.remove("d-none");

                    setTimeout(() => {
                        window.location.href = "index.html"; 
                    }, 1500);

                } else {
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
    }

    // Recuperar contraseña
    const formRecuperar = document.getElementById('formRecuperar');
    
    if (formRecuperar) {
        formRecuperar.addEventListener('submit', function (e) {
            e.preventDefault();

            const correo = document.getElementById('recuperar-correo').value.trim().toLowerCase();
            const password = document.getElementById('recuperar-password').value.trim();
            const confirmPassword = document.getElementById('recuperar-confirmPassword').value.trim();
            const alerta = document.getElementById('recuperar-alerta');

            let formularioValido = true;

            // Validamos el correo
            if (!correo || !isValidEmail(correo)) {
                marcarInvalido("recuperar-correo", "recuperar-correo-error", "Ingresa un correo electrónico válido");
                formularioValido = false;
            } else {
                marcarValido("recuperar-correo", "recuperar-correo-error");
            }

            // Validamos la nueva contraseña
            if (!isPasswordSecure(password)) {
                marcarInvalido("recuperar-password", "recuperar-password-error", "Debe tener entre 8 y 16 caracteres, 1 mayúscula, 1 número y 1 especial (!@#$%&*)");
                formularioValido = false;
            } else {
                marcarValido("recuperar-password", "recuperar-password-error");
            }

            // Validamos que las contraseñas coincidan
            if (!confirmPassword || password !== confirmPassword) {
                marcarInvalido("recuperar-confirmPassword", "recuperar-confirmPassword-error", "Las contraseñas no coinciden");
                formularioValido = false;
            } else {
                marcarValido("recuperar-confirmPassword", "recuperar-confirmPassword-error");
            }

            if (!formularioValido) return;

            const usuarios = JSON.parse(localStorage.getItem(APP_USUARIOS)) || [];
            const indexUsuario = usuarios.findIndex(u => u.correo.toLowerCase() === correo);

            // Si encontramos el usuario, actualizamos su contraseña, sino mostramos un error
            if (indexUsuario !== -1) {
                usuarios[indexUsuario].password = password;
                localStorage.setItem(APP_USUARIOS, JSON.stringify(usuarios));
                
                alerta.className = "alert alert-success";
                alerta.innerHTML = "¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.";
                
                setTimeout(() => {
                    const modalEl = document.getElementById('modalRecuperar');
                    const modalInstancia = bootstrap.Modal.getInstance(modalEl);
                    modalInstancia.hide();
                }, 2500);
            } else {
                alerta.className = "alert alert-danger";
                alerta.innerHTML = "Este correo no se encuentra registrado en nuestro sistema.";
            }
        });

        // llamamos funciones para ver y ocultar contraseña
        configurarOjito("recuperar-password", "ojo-recup-pass");
        configurarOjito("recuperar-confirmPassword", "ojo-recup-confirm");
        
    }

    // Por alguna razon al cerrar el Modal me da una advertencia
    // Sinceramente no se como este evento logra solucionarlo, pero lo encontré en StackOverflow

    /*
    Blocked aria-hidden on an element because its descendant retained focus. The focus must not be hidden from assistive technology users. 
    Avoid using aria-hidden on a focused element or its ancestor. Consider using the inert attribute instead, which will also prevent focus. 
    For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
    
    Element with focus: <button.btn-close>

    Ancestor with aria-hidden: <div.modal fade#modalRecuperar> 
    
    https://stackoverflow.com/questions/79159883/warning-blocked-aria-hidden-on-an-element-because-its-descendant-retained-focu
    */

    const modalRecuperarEl = document.getElementById('modalRecuperar');
    if (modalRecuperarEl) {
        modalRecuperarEl.addEventListener('hide.bs.modal', function () {
            if (document.activeElement && modalRecuperarEl.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        });
    }

    // llamamos funciones para ver y ocultar contraseña
    configurarOjito("login-password", "ojo-login-password");

});