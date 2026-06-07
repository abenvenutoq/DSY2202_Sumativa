## Introducción proyecto "BequianRent"

Proyecto web para rentar vehiculos, visitantes pueden ver vehiculos, ver su disponibilidad, precio, tipo, consumo. Los clientes podran ver y realizar sus propias reservas, el administrador podra ver todas las reservas y cambiar los datos de ellas. 

## Que pantallas deberia tener para esta sumativa?

- index.html
- login.html
- registro.html
- mi_perfil.html
- editar_perfil.html (Creado nuevo formulario)
- recovery.html (Eliminado, se crea modal en login.html)
- ver_autos.html
- mis_reservas.html
- admin_panel.html
- reservar_auto.html

## Que formularios necesito? 

- registro de clientes
    - nombre (Obligatorio, distinto de null o espacio vacío)
    - apellido (Obligatorio, distinto de null o espacio vacío)
    - rut (Obligatorio, utilizar modulo 11)
    - correo (Obligatorio, regex formato correo válido)
    - teléfono (obligatorio, regex 9 digitos)
    - contraseña (Obligatorio, 1 mayus, 1 simbolo especial, entre 8 y 16 caracteres)
    - repetir contraseña (Obligario e identica a contraseña)
    - dirección (Opcional, distinto de espacio en blanco)

- registro reservas
    - fecha desde
    - fecha hasta

- recuperar contraseña
    - correo (Debe existir)
    - contraseña nueva (misma validación que registro)
    - repetir contraseña (identica a contraseña nueva)

- editar_perfil
    - nombre (Obligatorio, distinto de null o espacio vacío)
    - apellido (Obligatorio, distinto de null o espacio vacío)
    - rut (No se puede editar)
    - correo (No se puede editar)
    - teléfono (obligatorio, regex 9 digitos)
    - contraseña (Obligatorio, 1 mayus, 1 simbolo especial, entre 8 y 16 caracteres)
    - repetir contraseña (Obligario e identica a contraseña)
    - dirección (Opcional, distinto de espacio en blanco)

## Roles principales

- cliente
- admin


## Credencial de Administrador default para pruebas

correo: admin@admin.cl
contraseña: qwerty123

## Credenciales de Usuario default para pruebas

correo: cliente@cliente.cl
contraseña: qwerty123


## Necesito 

- Diseñar logo 
- Imagenes de vehiculos para tarjetas 
    - Toyota 4 vehiculos
    - Volkswagen 4 vehiculos
    - Mazda 4 vehiculos.
