import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { obtenerUsuario, haySession } from '../helpers/local-storage'
import { alertaExito, alertaError, alertaConfirmar } from '../helpers/alerts'
import { obtenerGastos, crearGasto, actualizarGasto, eliminarGasto, obtenerComercios, obtenerMetodosPago } from '../services/api'
import { formatearMoneda } from '../helpers/generador'

const ICONOS = [
    {key:'💸',icon:'ti-cash'},{key:'🛒',icon:'ti-shopping-cart'},{key:'🏠',icon:'ti-home'},
    {key:'🚗',icon:'ti-car'},{key:'🍔',icon:'ti-tools-kitchen-2'},{key:'🎬',icon:'ti-movie'},
    {key:'💊',icon:'ti-pill'},{key:'✈️',icon:'ti-plane'},{key:'📚',icon:'ti-book'},
    {key:'👕',icon:'ti-shirt'},{key:'💡',icon:'ti-bulb'},{key:'📱',icon:'ti-device-mobile'},
]
const ICON_MAP = Object.fromEntries(ICONOS.map(i=>[i.key,i.icon]))
const INIT_FORM = { descripcion:'', fecha:'', valor:'', icono:'💸', esNecesario:false, ubicacion:'', comercio:'', metodoPago:'' }

const Expenses = () => {
    const [gastos,    setGastos]    = useState([])
    const [comercios, setComercios] = useState([])
    const [metodos,   setMetodos]   = useState([])
    const [cargando,  setCargando]  = useState(true)
    const [modal,     setModal]     = useState(null)
    const [form,      setForm]      = useState(INIT_FORM)
    const [search,    setSearch]    = useState('')
    const [saving,    setSaving]    = useState(false)
    const navigate = useNavigate()
    const usuario = obtenerUsuario()

    useEffect(() => {
        if (!haySession()) { navigate('/login'); return }
        cargarDatos()
    }, [navigate])

    const cargarDatos = async () => {
        setCargando(true)
        try {
            const [g, c, m] = await Promise.all([obtenerGastos(), obtenerComercios(), obtenerMetodosPago()])
            setGastos(g.filter(x => x.usuario?.id === usuario?.id))
            setComercios(c)
            setMetodos(m.filter(x => x.usuario?.id === usuario?.id))
        } catch(e) { alertaError('Error', 'No se pudieron cargar los datos') }
        finally { setCargando(false) }
    }

    const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

    const abrirNuevo  = () => { setForm(INIT_FORM); setModal('nuevo') }
    const abrirEditar = (g) => { setForm({ descripcion:g.descripcion||'', fecha:g.fecha||'', valor:g.valor||'', icono:g.icono||'💸', esNecesario:g.esNecesario||false, ubicacion:g.ubicacion||'', comercio:g.comercio?.id||'', metodoPago:g.metodoPago?.id||'', _id:g.id }); setModal('editar') }

    const guardar = async (e) => {
        e.preventDefault()
        if (!form.descripcion || !form.fecha || !form.valor) { alertaError('Campos vacíos','Completa descripción, fecha y valor'); return }
        if (Number(form.valor) < 0) { alertaError('Valor inválido','El valor no puede ser negativo'); return }
        setSaving(true)
        try {
            const payload = { descripcion:form.descripcion, fecha:form.fecha, valor:Number(form.valor), icono:form.icono, esNecesario:form.esNecesario, ubicacion:form.ubicacion,
                usuario:{ id: usuario.id },
                comercio:   form.comercio   ? { id:Number(form.comercio)   } : null,
                metodoPago: form.metodoPago ? { id:Number(form.metodoPago) } : null,
            }
            if (modal === 'nuevo') {
                const nuevo = await crearGasto(payload)
                setGastos(p => [...p, nuevo])
            } else {
                const actualizado = await actualizarGasto(form._id, payload)
                setGastos(p => p.map(x => x.id===actualizado.id ? actualizado : x))
            }
            alertaExito('¡Guardado!', modal==='nuevo' ? 'Gasto creado correctamente' : 'Gasto actualizado')
            setModal(null)
        } catch(err) { alertaError('Error', err.message) }
        finally { setSaving(false) }
    }

    const eliminar = async (g) => {
        const ok = await alertaConfirmar('¿Eliminar gasto?', `Se eliminará "${g.descripcion}"`)
        if (!ok) return
        try {
            await eliminarGasto(g.id)
            setGastos(p => p.filter(x => x.id !== g.id))
            alertaExito('Eliminado', 'El gasto fue eliminado')
        } catch { alertaError('Error','No se pudo eliminar') }
    }

    const filtered = gastos.filter(g =>
        g.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
        g.ubicacion?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="app-layout">
            <Header />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <div className="topbar-title">Mis Gastos</div>
                        <div className="topbar-sub">{cargando ? 'Cargando...' : `${filtered.length} de ${gastos.length} registros`}</div>
                    </div>
                    <button className="btn-green" onClick={abrirNuevo}><i className="ti ti-plus" /> Nuevo Gasto</button>
                </div>

                <div className="page-content">
                    {/* Buscador */}
                    <div className="card-clean" style={{ padding:16, marginBottom:20 }}>
                        <div style={{ position:'relative' }}>
                            <i className="ti ti-search" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', fontSize:16 }} />
                            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por descripción o ubicación..." className="input-clean" style={{ paddingLeft:38 }} />
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="card-clean" style={{ overflow:'hidden' }}>
                        <div style={{ overflowX:'auto' }}>
                            <table className="table-clean">
                                <thead>
                                    <tr><th>Gasto</th><th>Fecha</th><th>Valor</th><th>Tipo</th><th>Ubicación</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {cargando
                                        ? [1,2,3,4].map(i=><tr key={i}>{[1,2,3,4,5,6].map(j=><td key={j}><div className="skeleton" style={{height:14,borderRadius:6}}/></td>)}</tr>)
                                        : filtered.length === 0
                                            ? <tr><td colSpan={6}><div className="empty-state"><i className="ti ti-receipt-off"/><p>Sin gastos registrados</p></div></td></tr>
                                            : filtered.map(g => (
                                                <tr key={g.id}>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                            <div style={{ width:32,height:32,borderRadius:8,background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                                                                <i className={`ti ${ICON_MAP[g.icono]||'ti-cash'}`} style={{ color:'#64748b',fontSize:14 }} />
                                                            </div>
                                                            <span style={{ fontWeight:500,color:'#1e293b' }}>{g.descripcion}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize:13,color:'#64748b' }}>{g.fecha}</td>
                                                    <td style={{ fontWeight:600,color:'#1e293b' }}>{formatearMoneda(g.valor||0)}</td>
                                                    <td><span className={g.esNecesario?'badge-green':'badge-amber'}>{g.esNecesario?'Necesario':'Opcional'}</span></td>
                                                    <td style={{ fontSize:13,color:'#94a3b8' }}>{g.ubicacion||'—'}</td>
                                                    <td>
                                                        <div style={{ display:'flex',gap:6 }}>
                                                            <button className="btn-edit-soft" onClick={()=>abrirEditar(g)}><i className="ti ti-pencil" style={{fontSize:13}}/> Editar</button>
                                                            <button className="btn-danger-soft" onClick={()=>eliminar(g)}><i className="ti ti-trash" style={{fontSize:13}}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={()=>setModal(null)}>
                    <div className="modal-box" onClick={e=>e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{modal==='nuevo'?'Nuevo Gasto':'Editar Gasto'}</span>
                            <button className="modal-close" onClick={()=>setModal(null)}><i className="ti ti-x"/></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={guardar}>
                                <div style={{marginBottom:14}}>
                                    <label className="form-label-clean">Descripción</label>
                                    <input name="descripcion" value={form.descripcion} onChange={hc} placeholder="Ej: Supermercado" className="input-clean"/>
                                </div>
                                <div className="form-grid-2" style={{marginBottom:14}}>
                                    <div>
                                        <label className="form-label-clean">Fecha</label>
                                        <input type="date" name="fecha" value={form.fecha} onChange={hc} className="input-clean"/>
                                    </div>
                                    <div>
                                        <label className="form-label-clean">Valor (COP)</label>
                                        <input type="number" name="valor" value={form.valor} onChange={hc} placeholder="0" min="0" className="input-clean"/>
                                    </div>
                                </div>
                                <div style={{marginBottom:14}}>
                                    <label className="form-label-clean">Icono</label>
                                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                                        {ICONOS.map(({key,icon})=>(
                                            <button key={key} type="button" onClick={()=>setForm(p=>({...p,icono:key}))}
                                                style={{width:36,height:36,borderRadius:8,border:`1.5px solid ${form.icono===key?'#16a34a':'#e2e8f0'}`,background:form.icono===key?'#f0fdf4':'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                                                <i className={`ti ${icon}`} style={{fontSize:16,color:form.icono===key?'#16a34a':'#94a3b8'}}/>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{marginBottom:14}}>
                                    <label className="form-label-clean">Ubicación</label>
                                    <input name="ubicacion" value={form.ubicacion} onChange={hc} placeholder="Ej: Centro Comercial" className="input-clean"/>
                                </div>
                                <div className="form-grid-2" style={{marginBottom:14}}>
                                    <div>
                                        <label className="form-label-clean">Comercio</label>
                                        <select name="comercio" value={form.comercio} onChange={hc} className="input-clean">
                                            <option value="">— Ninguno —</option>
                                            {comercios.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label-clean">Método de pago</label>
                                        <select name="metodoPago" value={form.metodoPago} onChange={hc} className="input-clean">
                                            <option value="">— Ninguno —</option>
                                            {metodos.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{marginBottom:20}}>
                                    <button type="button" onClick={()=>setForm(p=>({...p,esNecesario:!p.esNecesario}))}
                                        style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${form.esNecesario?'#bbf7d0':'#e2e8f0'}`,background:form.esNecesario?'#f0fdf4':'white',cursor:'pointer',fontSize:14,color:form.esNecesario?'#16a34a':'#64748b',transition:'all 0.15s'}}>
                                        <i className={`ti ${form.esNecesario?'ti-circle-check':'ti-circle'}`} style={{fontSize:18}}/>
                                        {form.esNecesario ? 'Sí, es necesario' : 'No es necesario'}
                                    </button>
                                </div>
                                <div style={{display:'flex',gap:10}}>
                                    <button type="button" className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={()=>setModal(null)}>Cancelar</button>
                                    <button type="submit" className="btn-green" style={{flex:1,justifyContent:'center'}} disabled={saving}>
                                        {saving ? <><span className="spinner" style={{marginRight:6}}/>Guardando...</> : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Expenses
