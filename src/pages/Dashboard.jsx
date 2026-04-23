import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { obtenerUsuario, cerrarSesion, haySession } from "../helpers/local-storage"
import "./Dashboard.css"
 
const Dashboard = () => {
 
    const [gastos, setGastos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [total, setTotal] = useState(0)
 
    const navigate = useNavigate()
    const usuario = obtenerUsuario()
 
    // useEffect se ejecuta automáticamente al entrar al dashboard (HU08)
    useEffect(() => {
    if (!haySession()) {
        navigate("/login")
        return
    }

    const cargarGastos = () => {
        const gastosGuardados = JSON.parse(localStorage.getItem("gastos")) || []
        setGastos(gastosGuardados)
        const suma = gastosGuardados.reduce((acc, gasto) => acc + Number(gasto.monto), 0)
        setTotal(suma)
        setCargando(false)
        console.log("📊 Gastos cargados:", gastosGuardados)
    }

    cargarGastos()
}, [navigate])
 
    const handleLogout = () => {
        cerrarSesion()
        navigate("/login")
    }
 
    return (
        <>
            <Header />
 
            <div className="dashboard-container">
 
                <div className="dashboard-welcome">
                    <h1>¡Hola, {usuario?.nombre || "Usuario"}! 👋</h1>
                    <button className="btn-logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
 
                <div className="dashboard-summary">
                    <div className="summary-card">
                        <span className="summary-label">Total de gastos</span>
                        <span className="summary-amount">${total.toLocaleString()}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Número de gastos</span>
                        <span className="summary-amount">{gastos.length}</span>
                    </div>
                </div>
 
                <div className="dashboard-actions">
                    <Link to="/expenses" className="btn-primary">
                        + Agregar gasto
                    </Link>
                </div>
 
                <div className="dashboard-list">
                    <h2>Gastos recientes</h2>
 
                    {cargando && <p className="loading">Cargando gastos...</p>}
 
                    {!cargando && gastos.length === 0 && (
                        <p className="empty">No tienes gastos registrados aún.</p>
                    )}
 
                    {!cargando && gastos.map((gasto) => (
                        <div key={gasto.id} className="gasto-item">
                            <div className="gasto-info">
                                <span className="gasto-concepto">{gasto.concepto}</span>
                                <span className="gasto-categoria">{gasto.categoria}</span>
                            </div>
                            <span className="gasto-monto">${Number(gasto.monto).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
 
            </div>
 
            <Footer />
        </>
    )
}
 
export default Dashboard