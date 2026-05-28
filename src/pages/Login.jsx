import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { guardarToken, guardarUsuario } from '../helpers/local-storage'
import { alertaExitoRedirigir, alertaError } from '../helpers/alerts'
import { loginUsuario } from '../services/api'

const Login = () => {
    const [correo, setCorreo]         = useState('')
    const [contraseña, setContraseña] = useState('')
    const [cargando, setCargando]     = useState(false)
    const [showPass, setShowPass]     = useState(false)
    const [error, setError]           = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!correo || !contraseña) {
            setError('Por favor completa todos los campos')
            return
        }
        setCargando(true)
        try {
            const usuario = await loginUsuario(correo, contraseña)
            guardarToken('token-' + usuario.id)
            guardarUsuario(usuario)
            alertaExitoRedirigir('¡Bienvenido!', `Hola ${usuario.nombres}`, '/dashboard', navigate)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="auth-wrapper">
            {/* Panel izquierdo verde */}
            <div className="auth-left">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-cash" style={{ color: 'white', fontSize: 18 }} />
                        </div>
                        <span style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>Spendy</span>
                    </div>
                    <h2 style={{ color: 'white', fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>
                        Toma el control<br />de tus finanzas
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.6 }}>
                        Registra tus gastos, organiza por categorías y toma mejores decisiones financieras.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { icon: 'ti-chart-pie',    text: 'Visualiza tus gastos por categoría' },
                        { icon: 'ti-shield-check', text: 'Tu información segura y privada' },
                        { icon: 'ti-credit-card',  text: 'Gestiona todos tus métodos de pago' },
                    ].map(({ icon, text }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className={`ti ${icon}`} style={{ color: 'white', fontSize: 16 }} />
                            </div>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{text}</span>
                        </div>
                    ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© 2026 Spendy</p>
            </div>

            {/* Panel derecho */}
            <div className="auth-right">
                <div className="auth-card animate-up">
                    <div className="auth-logo">
                        <div className="auth-logo-icon"><i className="ti ti-cash" /></div>
                        <span>Spendy</span>
                    </div>
                    <h1 className="auth-title">Iniciar sesión</h1>
                    <p className="auth-sub">Ingresa tus credenciales para continuar</p>

                    {error && (
                        <div className="alert-error">
                            <i className="ti ti-alert-circle" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label-clean">Correo electrónico</label>
                            <div style={{ position: 'relative' }}>
                                <i className="ti ti-mail" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }} />
                                <input
                                    type="email"
                                    className="input-clean"
                                    style={{ paddingLeft: 38 }}
                                    placeholder="usuario@correo.com"
                                    value={correo}
                                    onChange={e => setCorreo(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="form-label-clean">Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <i className="ti ti-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }} />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="input-clean"
                                    style={{ paddingLeft: 38, paddingRight: 38 }}
                                    placeholder="••••••••"
                                    value={contraseña}
                                    onChange={e => setContraseña(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: 0 }}>
                                    <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} />
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn-green w-100 justify-content-center" disabled={cargando}>
                            {cargando ? <><span className="spinner me-2" />Verificando...</> : 'Ingresar'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
