import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { alertaRegistroExitoso, alertaError } from '../helpers/alerts'
import { registrarUsuario } from '../services/api'

const INIT = { nombres:'', correo:'', contraseña:'', tipoDocumento:'Cedula', documento:'', edad:'', telefono:'', salario:'', genero:'Masculino' }

// CORRECCIÓN: Field definido FUERA del componente para evitar re-mount en cada tecla
function Field({ label, name, type='text', placeholder, opts, value, onChange }) {
    return (
        <div>
            <label className="form-label-clean">{label}</label>
            {opts
                ? <select name={name} value={value} onChange={onChange} className="input-clean">
                    {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="input-clean" />
            }
        </div>
    )
}

const Register = () => {
    const [form, setForm]         = useState(INIT)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { nombres, correo, contraseña, documento, edad, telefono, salario } = form
        if (!nombres || !correo || !contraseña || !documento || !edad || !telefono || !salario) {
            alertaError('Campos vacíos', 'Por favor completa todos los campos')
            return
        }
        if (contraseña.length < 6) {
            alertaError('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres')
            return
        }
        setCargando(true)
        try {
            await registrarUsuario({ ...form, edad: parseInt(form.edad), salario: parseFloat(form.salario) })
            alertaRegistroExitoso(form.nombres, navigate)
        } catch (err) {
            alertaError('Error al registrar', err.message || 'No se pudo registrar el usuario')
        } finally { setCargando(false) }
    }

    return (
        <div style={{ minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
            <div style={{ width:'100%', maxWidth:640 }} className="animate-up">
                <div style={{ textAlign:'center', marginBottom:24 }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:12 }}>
                        <div className="auth-logo-icon"><i className="ti ti-cash" /></div>
                        <span style={{ fontWeight:600, fontSize:17, color:'#1e293b' }}>Spendy</span>
                    </div>
                    <h1 style={{ fontSize:22, fontWeight:600, color:'#1e293b', marginBottom:4 }}>Crear cuenta</h1>
                    <p style={{ color:'#94a3b8', fontSize:14 }}>Completa tus datos para empezar</p>
                </div>

                <div className="card-clean" style={{ padding:32 }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-2" style={{ marginBottom:16 }}>
                            <Field label="Nombres completos"   name="nombres"       placeholder="Ana García"     value={form.nombres}       onChange={handleChange} />
                            <Field label="Tipo de documento"   name="tipoDocumento" value={form.tipoDocumento}   onChange={handleChange}
                                opts={[{value:'Cedula',label:'Cédula'},{value:'Pasaporte',label:'Pasaporte'},{value:'Extranjeria',label:'Extranjería'}]} />
                            <Field label="Número de documento" name="documento"     placeholder="1234567890"     value={form.documento}     onChange={handleChange} />
                            <Field label="Edad"                name="edad"          type="number" placeholder="25" value={form.edad}         onChange={handleChange} />
                            <Field label="Correo electrónico"  name="correo"        type="email" placeholder="ana@correo.com" value={form.correo} onChange={handleChange} />
                            <Field label="Teléfono"            name="telefono"      placeholder="3001234567"     value={form.telefono}      onChange={handleChange} />
                            <Field label="Salario (COP)"       name="salario"       type="number" placeholder="2500000" value={form.salario} onChange={handleChange} />
                            <Field label="Género"              name="genero"        value={form.genero}          onChange={handleChange}
                                opts={[{value:'Masculino',label:'Masculino'},{value:'Femenino',label:'Femenino'}]} />
                        </div>
                        <div style={{ marginBottom:24 }}>
                            <label className="form-label-clean">Contraseña</label>
                            <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Mínimo 6 caracteres" className="input-clean" />
                        </div>
                        <div style={{ display:'flex', gap:12 }}>
                            <button type="button" className="btn-outline" style={{ flex:1, justifyContent:'center' }} onClick={() => navigate('/login')}>
                                <i className="ti ti-arrow-left" /> Volver
                            </button>
                            <button type="submit" className="btn-green" style={{ flex:1, justifyContent:'center' }} disabled={cargando}>
                                {cargando ? <><span className="spinner" style={{ marginRight:6 }} />Registrando...</> : <><i className="ti ti-user-plus" /> Crear cuenta</>}
                            </button>
                        </div>
                    </form>
                    <p className="auth-footer-text">
                        ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
