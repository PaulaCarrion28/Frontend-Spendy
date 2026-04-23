import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { guardarToken, guardarUsuario } from "../helpers/local-storage"
import { alertaExitoRedirigir, alertaError } from "../helpers/alerts"
import "./Forms.css"
 
const Login = () => {
 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cargando, setCargando] = useState(false)
 
    const navigate = useNavigate()
 
    const handleSubmit = (e) => {
        e.preventDefault()
 
        // Validación de campos vacíos
        if (!email || !password) {
            alertaError("Campos vacíos", "Por favor completa todos los campos")
            return
        }
 
        setCargando(true)
 
        // Leemos los usuarios guardados en localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
 
        // Buscamos si existe un usuario con ese email y contraseña
        const usuarioEncontrado = usuarios.find(
            u => u.email === email && u.password === password
        )
 
        // Mostramos en consola lo que está pasando (F12 → Console)
        console.log("🔍 Intentando login con:", { email, password })
        console.log("📋 Usuarios registrados:", usuarios)
 
        if (usuarioEncontrado) {
            // Login exitoso — guardamos sesión en localStorage
            guardarToken("token-simulado-" + usuarioEncontrado.id)
            guardarUsuario(usuarioEncontrado)
 
            console.log("✅ Login exitoso:", usuarioEncontrado)
 
            setCargando(false)
 
            alertaExitoRedirigir(
                "¡Bienvenido!",
                `Hola ${usuarioEncontrado.nombre}, has iniciado sesión`,
                "/dashboard",
                navigate
            )
        } else {
            // Credenciales incorrectas
            console.log("❌ Credenciales incorrectas")
            alertaError("Credenciales incorrectas", "El email o la contraseña no son válidos")
            setCargando(false)
        }
    }
 
    return (
        <>
            <Header />
            <div className="contenedor">
                <div className="formulario">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
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
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={cargando}>
                            {cargando ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                    <div className="newaccount">
                        ¿No tienes cuenta?{" "}
                        <Link to="/register">Regístrate</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
 
export default Login
