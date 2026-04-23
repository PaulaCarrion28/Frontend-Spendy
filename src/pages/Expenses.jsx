import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { alertaExito, alertaError } from "../helpers/alerts"
import "./Expenses.css"

const Expenses = () => {

    const [concepto, setConcepto] = useState("")
    const [monto, setMonto] = useState("")
    const [categoria, setCategoria] = useState("")
    const [fecha, setFecha] = useState("")
    const [cargando, setCargando] = useState(false)

    const CATEGORIAS = [
        "Alimentación",
        "Transporte",
        "Entretenimiento",
        "Salud",
        "Educación",
        "Ropa",
        "Servicios",
        "Otros",
    ]
 
    const handleSubmit = (e) => {
        e.preventDefault()
 
        if (!concepto || !monto || !categoria || !fecha) {
            alertaError("Campos vacíos", "Por favor completa todos los campos")
            return
        }
 
        if (isNaN(monto) || Number(monto) <= 0) {
            alertaError("Monto inválido", "El monto debe ser un número mayor a 0")
            return
        }
 
        setCargando(true)
 
        // Creamos el objeto del nuevo gasto
        const nuevoGasto = {
            id: Date.now(),
            concepto,
            monto: Number(monto),
            categoria,
            fecha,
        }
 
        // Leemos los gastos existentes y agregamos el nuevo
        const gastosExistentes = JSON.parse(localStorage.getItem("gastos")) || []
        gastosExistentes.push(nuevoGasto)
        localStorage.setItem("gastos", JSON.stringify(gastosExistentes))
 
        // Mostramos en consola para verificar
        console.log("✅ Gasto guardado:", nuevoGasto)
        console.log("📋 Todos los gastos:", gastosExistentes)
 
        setCargando(false)
 
        // Alerta de éxito
        alertaExito("¡Gasto registrado!", `Se guardó "${concepto}" por $${monto}`)
 
        // Limpiamos el formulario
        setConcepto("")
        setMonto("")
        setCategoria("")
        setFecha("")
    }
 
    return (
        <>
            <Header />
 
            <div className="expenses-container">
 
                <div className="expenses-back">
                    <Link to="/dashboard" className="btn-back">← Volver al panel</Link>
                </div>
 
                <div className="expenses-form-card">
                    <h2>Registrar nuevo gasto</h2>
 
                    <form onSubmit={handleSubmit}>
 
                        <div className="input-group">
                            <label>Concepto</label>
                            <input
                                type="text"
                                placeholder="Ej: Almuerzo, Bus, Netflix..."
                                value={concepto}
                                onChange={(e) => setConcepto(e.target.value)}
                            />
                        </div>
 
                        <div className="input-group">
                            <label>Monto ($)</label>
                            <input
                                type="number"
                                placeholder="Ej: 15000"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                min="0"
                            />
                        </div>
 
                        <div className="input-group">
                            <label>Categoría</label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="">Selecciona una categoría</option>
                                {CATEGORIAS.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
 
                        <div className="input-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
 
                        <button type="submit" disabled={cargando}>
                            {cargando ? "Guardando..." : "Guardar gasto"}
                        </button>
 
                    </form>
                </div>
            </div>
 
            <Footer />
        </>
    )
}
 
export default Expenses