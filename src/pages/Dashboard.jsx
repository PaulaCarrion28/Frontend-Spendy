import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { obtenerUsuario, haySession } from '../helpers/local-storage'
import { obtenerGastos, obtenerCategorias, obtenerMetodosPago } from '../services/api'
import { formatearMoneda } from '../helpers/generador'

const ICON_MAP = { '💸':'ti-cash','🛒':'ti-shopping-cart','🏠':'ti-home','🚗':'ti-car','🍔':'ti-tools-kitchen-2','🎬':'ti-movie','💊':'ti-pill','✈️':'ti-plane','📚':'ti-book','👕':'ti-shirt','💡':'ti-bulb','📱':'ti-device-mobile' }

const Dashboard = () => {
    const [gastos,    setGastos]    = useState([])
    const [cats,      setCats]      = useState([])
    const [metodos,   setMetodos]   = useState([])
    const [cargando,  setCargando]  = useState(true)
    const navigate = useNavigate()
    const usuario = obtenerUsuario()

    useEffect(() => {
        if (!haySession()) { navigate('/login'); return }
        const cargar = async () => {
            try {
                const [g, c, m] = await Promise.all([obtenerGastos(), obtenerCategorias(), obtenerMetodosPago()])
                setGastos(g.filter(x => x.usuario?.id === usuario?.id))
                setCats(c)
                setMetodos(m.filter(x => x.usuario?.id === usuario?.id))
            } catch (e) { console.error(e) }
            finally { setCargando(false) }
        }
        cargar()
    }, [navigate])

    const totalGastado  = gastos.reduce((s, g) => s + (g.valor || 0), 0)
    const necesarios    = gastos.filter(g => g.esNecesario).length
    const recientes     = [...gastos].sort((a,b) => new Date(b.fecha)-new Date(a.fecha)).slice(0,5)
    const hora          = new Date().getHours()
    const saludo        = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

    const STATS = [
        { label:'Total gastado',    value: formatearMoneda(totalGastado), icon:'ti-cash',        color:'#f0fdf4', iconColor:'#16a34a' },
        { label:'Mis gastos',       value: gastos.length,                 icon:'ti-receipt',     color:'#eff6ff', iconColor:'#2563eb' },
        { label:'Categorías',       value: cats.length,                   icon:'ti-tag',         color:'#f5f3ff', iconColor:'#7c3aed' },
        { label:'Métodos de pago',  value: metodos.length,                icon:'ti-credit-card', color:'#fffbeb', iconColor:'#d97706' },
    ]

    return (
        <div className="app-layout">
            <Header />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <div className="topbar-title">{saludo}, {usuario?.nombres?.split(' ')[0]} 👋</div>
                        <div className="topbar-sub">Resumen de tu actividad financiera</div>
                    </div>
                </div>

                <div className="page-content">
                    {/* Stats */}
                    <div className="row g-3 mb-4">
                        {STATS.map(({ label, value, icon, color, iconColor }) => (
                            <div className="col-6 col-lg-3" key={label}>
                                <div className="stat-card animate-up">
                                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                                        <div>
                                            <div className="stat-label">{label}</div>
                                            <div className="stat-value">{value}</div>
                                        </div>
                                        <div className="stat-icon" style={{ background: color }}>
                                            <i className={`ti ${icon}`} style={{ color: iconColor }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row g-4">
                        {/* Gastos recientes */}
                        <div className="col-lg-8">
                            <div className="card-clean">
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 20px 0' }}>
                                    <h6 style={{ fontWeight:600, color:'#1e293b', margin:0 }}>Gastos recientes</h6>
                                    <Link to="/gastos" style={{ fontSize:13, color:'#16a34a', textDecoration:'none', fontWeight:500 }}>Ver todos →</Link>
                                </div>
                                <div style={{ padding:'12px 8px' }}>
                                    {cargando
                                        ? [1,2,3].map(i => <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px' }}><div className="skeleton" style={{ width:36,height:36,borderRadius:10 }}/><div style={{flex:1}}><div className="skeleton" style={{height:12,width:'60%',marginBottom:6}}/><div className="skeleton" style={{height:10,width:'40%'}}/></div><div className="skeleton" style={{height:14,width:60}}/></div>)
                                        : recientes.length === 0
                                            ? <div className="empty-state"><i className="ti ti-receipt-off" /><p>Sin gastos aún</p><Link to="/gastos" className="btn-green" style={{marginTop:12,display:'inline-flex'}}>+ Nuevo gasto</Link></div>
                                            : recientes.map(g => (
                                                <div key={g.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:10, transition:'background 0.1s' }}
                                                    onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                                        <div style={{ width:36,height:36,borderRadius:10,background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                                                            <i className={`ti ${ICON_MAP[g.icono]||'ti-cash'}`} style={{ color:'#64748b',fontSize:16 }} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize:14,fontWeight:500,color:'#1e293b' }}>{g.descripcion}</div>
                                                            <div style={{ fontSize:12,color:'#94a3b8' }}>{g.fecha}{g.ubicacion ? ` · ${g.ubicacion}` : ''}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign:'right' }}>
                                                        <div style={{ fontSize:14,fontWeight:600,color:'#1e293b' }}>{formatearMoneda(g.valor||0)}</div>
                                                        <span className={g.esNecesario ? 'badge-green' : 'badge-amber'}>{g.esNecesario ? 'Necesario' : 'Opcional'}</span>
                                                    </div>
                                                </div>
                                            ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Resumen */}
                        <div className="col-lg-4">
                            <div className="card-clean" style={{ padding:20 }}>
                                <h6 style={{ fontWeight:600, color:'#1e293b', marginBottom:16 }}>Resumen</h6>
                                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                                    {[
                                        { label:'Gastos necesarios',    val:necesarios,           bg:'#f0fdf4', color:'#16a34a' },
                                        { label:'Gastos opcionales',    val:gastos.length-necesarios, bg:'#fffbeb', color:'#d97706' },
                                        { label:'Métodos de pago',      val:metodos.length,       bg:'#f5f3ff', color:'#7c3aed' },
                                    ].map(({ label, val, bg, color }) => (
                                        <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:bg, borderRadius:10, padding:'10px 14px' }}>
                                            <span style={{ fontSize:13,color:'#475569' }}>{label}</span>
                                            <span style={{ fontSize:18,fontWeight:700,color }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:8 }}>
                                    <Link to="/gastos" className="btn-green" style={{ justifyContent:'center' }}>
                                        <i className="ti ti-plus" /> Nuevo gasto
                                    </Link>
                                    <Link to="/metodos-pago" className="btn-outline" style={{ justifyContent:'center' }}>
                                        <i className="ti ti-credit-card" /> Método de pago
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard
