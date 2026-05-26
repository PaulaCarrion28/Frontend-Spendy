import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { alertaExitoRedirigir, alertaError } from "../helpers/alerts"
import "./Forms.css"
 
const Register = () => {
 
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cargando, setCargando] = useState(false)
 
    const navigate = useNavigate()
 
    const handleSubmit = async (e) => {
        e.preventDefault()
 
        // Validación de campos vacíos
        if (!nombre || !email || !password) {
            alertaError("Campos vacíos", "Por favor completa todos los campos")
            return
        }
 
        // Validación de contraseña
        if (password.length < 6) {
            alertaError("Contraseña muy corta", "La contraseña debe tener al menos 6 caracteres")
            return
        }
 
        setCargando(true)
 
        // Leemos los usuarios guardados en localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
 
        // Verificamos si el email ya está registrado
        const yaExiste = usuarios.find(u => u.email === email)
        if (yaExiste) {
            alertaError("Email ya registrado", "Ya existe una cuenta con ese correo")
            setCargando(false)
            return
        }
 
        // Creamos el nuevo usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            email,
            password,
        }
 
        // Lo agregamos a la lista y guardamos en localStorage
        usuarios.push(nuevoUsuario)
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
 
        // Mostramos en consola para verificar (F12 → Console)
        console.log("✅ Usuario registrado:", nuevoUsuario)
        console.log("📋 Todos los usuarios:", usuarios)
 
        setCargando(false)
 
        alertaExitoRedirigir(
            "¡Registro exitoso!",
            "Tu cuenta fue creada. Ahora puedes iniciar sesión",
            "/login",
            navigate
        )
    }
 
    return (
        <>
           
            <div className="contenedor">
                <div className="formulario">
                    <h2>Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Correo</label>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Tipo de documento</label>
                            <input
                            
                            />
                        </div>
                        
                        <button type="submit" disabled={cargando}>
                            {cargando ? "Registrando..." : "Registrarse"}
                        </button>
                    </form>
                    <div className="newaccount">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login">Ingresar</Link>
                    </div>
                </div>
                <Footer />
            </div>
            
        </>
    )
}
 
export default Register