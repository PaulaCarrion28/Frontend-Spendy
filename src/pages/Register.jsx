import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
//import { alertaExitoRedirigir, alertaError } from "../helpers/alerts"
import {alertaRegistroExitoso, alertaError} from "../helpers/alerts"
import { registrarUsuario } from "../services/api"
import "./Forms.css"

const Register = () => {

    const [form, setForm] = useState({
        nombres: "",
        correo: "",
        contraseña: "",
        documento: "",
        tipoDocumento: "Cedula",
        edad: "",
        telefono: "",
        salario: "",
        genero: "Masculino"
    })

    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación
        if (
            !form.nombres ||
            !form.correo ||
            !form.contraseña ||
            !form.documento ||
            !form.edad ||
            !form.telefono ||
            !form.salario
        ) {
            alertaError(
                "Campos vacíos",
                "Por favor completa todos los campos"
            )
            return
        }

        if (form.contraseña.length < 6) {
            alertaError(
                "Contraseña muy corta",
                "La contraseña debe tener al menos 6 caracteres"
            )
            return
        }

        setCargando(true)

        try {

            const usuarioData = {
                ...form,
                edad: parseInt(form.edad),
                salario: parseFloat(form.salario)
            }

            console.log(usuarioData)

            await registrarUsuario(usuarioData)

            alertaRegistroExitoso(
                "¡Registro exitoso!",
                "Tu cuenta fue creada correctamente",
                "/login",
                navigate
            )

        } catch (error) {

            console.error(error)

            alertaError(
                "Error al registrar",
                error.message || "No se pudo registrar el usuario"
            )

        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <div className="contenedor">

                <div className="formulario">

                    <h2>Registro</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>Nombre completo</label>

                            <input
                                type="text"
                                name="nombres"
                                placeholder="Ingresa tu nombre"
                                value={form.nombres}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Correo</label>

                            <input
                                type="email"
                                name="correo"
                                placeholder="Ingresa tu correo"
                                value={form.correo}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>

                            <input
                                type="password"
                                name="contraseña"
                                placeholder="Mínimo 6 caracteres"
                                value={form.contraseña}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de documento</label>

                            <select
                                name="tipoDocumento"
                                value={form.tipoDocumento}
                                onChange={handleChange}
                            >
                                <option value="Cedula">
                                    Cédula
                                </option>

                                <option value="Extranjeria">
                                    Extranjería
                                </option>

                                <option value="Pasaporte">
                                    Pasaporte
                                </option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Número de documento</label>

                            <input
                                type="text"
                                name="documento"
                                placeholder="Número de documento"
                                value={form.documento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Edad</label>

                            <input
                                type="number"
                                name="edad"
                                placeholder="Tu edad"
                                value={form.edad}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Teléfono</label>

                            <input
                                type="text"
                                name="telefono"
                                placeholder="Tu teléfono"
                                value={form.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Salario</label>

                            <input
                                type="number"
                                name="salario"
                                placeholder="Tu salario"
                                value={form.salario}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Género</label>

                            <select
                                name="genero"
                                value={form.genero}
                                onChange={handleChange}
                            >
                                <option value="Masculino">
                                    Masculino
                                </option>

                                <option value="Femenino">
                                    Femenino
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                        >
                            {
                                cargando
                                    ? "Registrando..."
                                    : "Registrarse"
                            }
                        </button>

                    </form>

                    <div className="newaccount">
                        ¿Ya tienes cuenta?{" "}

                        <Link to="/login">
                            Ingresar
                        </Link>
                    </div>

                </div>

                <Footer />

            </div>
        </>
    )
}

export default Register