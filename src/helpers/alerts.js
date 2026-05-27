import Swal from 'sweetalert2'

export const alertaExitoRedirigir = (titulo, mensaje, url, navigate) => {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    }).then(() => {
        navigate(url)
    })
}

export const alertaError = (titulo, mensaje) => {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#007bff',
    })
}

export const alertaExito = (titulo, mensaje) => {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#007bff',
    })
}

export const alertaConfirmar = async (titulo, mensaje) => {
    const resultado = await Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
    })
    return resultado.isConfirmed
}

export const alertaRegistroExitoso = (
    nombre,
    navigate
) => {

    Swal.fire({

        title: `¡Bienvenido ${nombre}! 🎉`,

        text: "Tu cuenta fue creada correctamente",

        width: 600,

        padding: "3em",

        color: "#716add",

        background: "#fff",

        backdrop: `
            rgba(0,0,123,0.4)
            url("https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif")
            left top
            no-repeat
        `,

        timer: 5000,

        timerProgressBar: true,

        showConfirmButton: false

    }).then(() => {

        navigate("/login")

    })
}