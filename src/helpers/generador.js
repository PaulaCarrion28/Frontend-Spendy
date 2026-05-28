// Genera un ID único simple
export const generarId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// Formatea un número como moneda colombiana
export const formatearMoneda = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor)

// Formatea fecha ISO a formato legible
export const formatearFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Obtiene las iniciales de un nombre
export const obtenerIniciales = (nombre = '') =>
    nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
