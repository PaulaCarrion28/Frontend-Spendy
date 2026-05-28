const BASE_URL = '/spendyapi/v1'

// ─── USUARIOS ────────────────────────────────────────────────
export const loginUsuario = async (correo, contraseña) => {
    const res = await fetch(`${BASE_URL}/usuarios`)
    if (!res.ok) throw new Error('No se pudo conectar al servidor')
    const usuarios = await res.json()
    const encontrado = usuarios.find(
        u => u.correo === correo && (u.contrasena === contraseña || u.contraseña === contraseña)
    )
    if (!encontrado) throw new Error('Correo o contraseña incorrectos')
    return encontrado
}

export const registrarUsuario = async (datos) => {
    const res = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    const texto = await res.text()
    if (!res.ok) throw new Error(texto || 'Error al registrar usuario')
    return texto ? JSON.parse(texto) : {}
}

export const actualizarUsuario = async (id, datos) => {
    const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al actualizar usuario')
    return res.json()
}

// ─── GASTOS ──────────────────────────────────────────────────
export const obtenerGastos = async () => {
    const res = await fetch(`${BASE_URL}/gastos`)
    if (!res.ok) throw new Error('Error al obtener gastos')
    return res.json()
}

export const crearGasto = async (datos) => {
    const res = await fetch(`${BASE_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear gasto')
    return res.json()
}

export const actualizarGasto = async (id, datos) => {
    const res = await fetch(`${BASE_URL}/gastos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al actualizar gasto')
    return res.json()
}

export const eliminarGasto = async (id) => {
    const res = await fetch(`${BASE_URL}/gastos/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar gasto')
}

// ─── CATEGORÍAS ──────────────────────────────────────────────
export const obtenerCategorias = async () => {
    const res = await fetch(`${BASE_URL}/categorias`)
    if (!res.ok) throw new Error('Error al obtener categorías')
    return res.json()
}

export const crearCategoria = async (datos) => {
    const res = await fetch(`${BASE_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear categoría')
    return res.json()
}

// ─── COMERCIOS ───────────────────────────────────────────────
export const obtenerComercios = async () => {
    const res = await fetch(`${BASE_URL}/comercios`)
    if (!res.ok) throw new Error('Error al obtener comercios')
    return res.json()
}

export const crearComercio = async (datos) => {
    const res = await fetch(`${BASE_URL}/comercios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear comercio')
    return res.json()
}

// ─── MÉTODOS DE PAGO ─────────────────────────────────────────
export const obtenerMetodosPago = async () => {
    const res = await fetch(`${BASE_URL}/metodosPago`)
    if (!res.ok) throw new Error('Error al obtener métodos de pago')
    return res.json()
}

export const crearMetodoPago = async (datos) => {
    const res = await fetch(`${BASE_URL}/metodosPago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear método de pago')
    return res.json()
}
