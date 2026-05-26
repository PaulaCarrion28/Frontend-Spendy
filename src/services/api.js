const BASE_URL = '/spendyapi/v1';

// ─── USUARIOS ────────────────────────────────────────────
export const registrarUsuario = async (datos) => {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
};

export const loginUsuario = async (credenciales) => {
  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales)
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
};

// ─── GASTOS ──────────────────────────────────────────────
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
  if (!res.ok) throw new Error('Error al crear gasto');
  return res.json();
};

export const actualizarGasto = async (id, datos) => {
  const res = await fetch(`${BASE_URL}/gastos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al actualizar gasto');
  return res.json();
};

export const eliminarGasto = async (id) => {
  const res = await fetch(`${BASE_URL}/gastos/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar gasto');
};

// ─── CATEGORÍAS ──────────────────────────────────────────
export const obtenerCategorias = async () => {
  const res = await fetch(`${BASE_URL}/categorias`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
};

// ─── COMERCIOS ───────────────────────────────────────────
export const obtenerComercios = async () => {
  const res = await fetch(`${BASE_URL}/comercios`);
  if (!res.ok) throw new Error('Error al obtener comercios');
  return res.json();
};