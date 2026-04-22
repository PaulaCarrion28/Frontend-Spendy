// src/helpers/local-storage.js

export const getUsuarios = () => JSON.parse(localStorage.getItem('usuarios')) || [];

export const registrarUsuario = (nuevoUsuario) => {
    const usuarios = getUsuarios();
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

export const validarLogin = (email, password) => {
    const usuarios = getUsuarios();
    return usuarios.find(u => u.email === email && u.password === password);
};