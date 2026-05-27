import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { guardarToken, guardarUsuario } from "../helpers/local-storage"
import { alertaExitoRedirigir, alertaError } from "../helpers/alerts"
import { loginUsuario } from "../services/api"
import "./Forms.css"

const Login = () => {

    const [correo, setCorreo] = useState("")           
    const [contraseña, setContraseña] = useState("")  
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!correo || !contraseña) {
            alertaError("Campos vacíos", "Por favor completa todos los campos")
            return
        }

        setCargando(true)

        try {
            const usuario = await loginUsuario(correo, contraseña)

            guardarToken("token-" + usuario.id)
            guardarUsuario(usuario)

            alertaExitoRedirigir(
                "¡Bienvenido!",
                `Hola ${usuario.nombres}, has iniciado sesión`,  // ← nombres, no nombre
                "/dashboard",
                navigate
            )
        } catch (error) {
            alertaError("Error", error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <div className="contenedor">
                <div className="formulario">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Correo</label>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
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
                <Footer />
            </div>
        </>
    )
}

export default Login