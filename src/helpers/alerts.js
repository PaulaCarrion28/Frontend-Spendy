import Swal from 'sweetalert2'

const baseConfig = {
    customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel',
    }
}

export const alertaExitoRedirigir = (titulo, mensaje, url, navigate) => {
    Swal.fire({
        ...baseConfig,
        title: titulo,
        text: mensaje,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    }).then(() => navigate(url))
}

export const alertaError = (titulo, mensaje) => {
    Swal.fire({
        ...baseConfig,
        title: titulo,
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#16a34a',
    })
}

export const alertaExito = (titulo, mensaje) => {
    Swal.fire({
        ...baseConfig,
        title: titulo,
        text: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#16a34a',
        timer: 2000,
        showConfirmButton: false,
    })
}

export const alertaConfirmar = async (titulo, mensaje) => {
    const resultado = await Swal.fire({
        ...baseConfig,
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#ef4444',
        reverseButtons: true,
    })
    return resultado.isConfirmed
}

export const alertaRegistroExitoso = (nombre, navigate) => {
    Swal.fire({
        title: `¡Bienvenido, ${nombre}! 🎉`,
        text: 'Tu cuenta fue creada correctamente',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        confirmButtonColor: '#16a34a',
    }).then(() => navigate('/login'))
}
