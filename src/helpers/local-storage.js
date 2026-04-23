export const guardarToken = (token) => {
    localStorage.setItem("token", token)
}
 
// Lee el token guardado
export const obtenerToken = () => {
    return localStorage.getItem("token")
}
 
// Elimina el token (para cerrar sesión)
export const eliminarToken = () => {
    localStorage.removeItem("token")
}
 
// Verifica si hay una sesión activa
// Retorna true si hay token, false si no hay
export const haySession = () => {
    return localStorage.getItem("token") !== null
}
 
 
// ── DATOS DEL USUARIO ────────────────────────
 
// Guarda la info del usuario (nombre, email, etc.)
export const guardarUsuario = (usuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario))
}
 
// Lee la info del usuario guardada
export const obtenerUsuario = () => {
    const data = localStorage.getItem("usuario")
    return data ? JSON.parse(data) : null
}
 
// Elimina los datos del usuario
export const eliminarUsuario = () => {
    localStorage.removeItem("usuario")
}
 
 
// ── CERRAR SESIÓN COMPLETO ───────────────────
 
// Limpia TODO lo guardado (token + usuario)
// Se usa cuando el usuario hace logout
export const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
}