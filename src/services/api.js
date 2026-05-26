const BASE_URL = 'http://localhost:8080/spendyapi/v1';

// ─── USUARIOS ────────────────────────────────
export const loginUsuario = async (correo, contraseña) => {
    const res = await fetch(`${BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const mensaje = errorData?.detail
            || errorData?.message
            || errorData?.mensaje
            || 'Correo o contraseña incorrectos';
        throw new Error(mensaje);
    }

    return res.json();
};
export const registrarUsuario = async (datos) => {

    try {

        const res = await fetch(`${BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        console.log("STATUS:", res.status);

        const texto = await res.text();

        console.log("RESPUESTA BACK:", texto);

        if (!res.ok) {
            throw new Error(texto);
        }

        return texto ? JSON.parse(texto) : {};

    } catch (error) {

        console.error("ERROR COMPLETO:", error);

        throw error;
    }
};
// ─── GASTOS ──────────────────────────────────
export const obtenerGastos = async () => {
    const res = await fetch(`${BASE_URL}/gastos`);
    if (!res.ok) throw new Error('Error al obtener gastos');
    return res.json();
};

export const crearGasto = async (datos) => {
    const res = await fetch(`${BASE_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const mensaje = errorData?.detail || errorData?.message || 'Error al crear gasto';
        throw new Error(mensaje);
    }
    return res.json();
};

export const actualizarGasto = async (id, datos) => {
    const res = await fetch(`${BASE_URL}/gastos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const mensaje = errorData?.detail || errorData?.message || 'Error al actualizar gasto';
        throw new Error(mensaje);
    }
    return res.json();
};

export const eliminarGasto = async (id) => {
    const res = await fetch(`${BASE_URL}/gastos/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar gasto');
};

// ─── CATEGORÍAS ──────────────────────────────
export const obtenerCategorias = async () => {
    const res = await fetch(`${BASE_URL}/categorias`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
};

// ─── COMERCIOS ───────────────────────────────
export const obtenerComercios = async () => {
    const res = await fetch(`${BASE_URL}/comercios`);
    if (!res.ok) throw new Error('Error al obtener comercios');
    return res.json();
};