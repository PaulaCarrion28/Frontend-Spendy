import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { obtenerUsuario, haySession } from '../helpers/local-storage'
import { alertaExito, alertaError } from '../helpers/alerts'
import { obtenerMetodosPago, crearMetodoPago } from '../services/api'

const FRANQUICIAS=['Visa','Mastercard','American Express','PSE','Nequi','Daviplata','Efectivo','Otro']
const FRANC_ICON={Visa:'ti-credit-card',Mastercard:'ti-credit-card','American Express':'ti-credit-card',PSE:'ti-building-bank',Nequi:'ti-device-mobile',Daviplata:'ti-device-mobile',Efectivo:'ti-cash',Otro:'ti-wallet'}
const FRANC_BG={Visa:'#eff6ff',Mastercard:'#fef2f2','American Express':'#f0fdf4',PSE:'#f1f5f9',Nequi:'#f5f3ff',Daviplata:'#fff7ed',Efectivo:'#f0fdf4',Otro:'#f1f5f9'}
const FRANC_COLOR={Visa:'#2563eb',Mastercard:'#dc2626','American Express':'#16a34a',PSE:'#475569',Nequi:'#7c3aed',Daviplata:'#ea580c',Efectivo:'#16a34a',Otro:'#475569'}
const INIT={nombre:'',franquicia:'',estado:true,descripcion:''}

const MetodosPago=()=>{
    const [metodos,setMetodos]=useState([])
    const [cargando,setCargando]=useState(true)
    const [modal,setModal]=useState(false)
    const [form,setForm]=useState(INIT)
    const [search,setSearch]=useState('')
    const [saving,setSaving]=useState(false)
    const navigate=useNavigate()
    const usuario=obtenerUsuario()

    useEffect(()=>{
        if(!haySession()){navigate('/login');return}
        obtenerMetodosPago().then(m=>setMetodos(m.filter(x=>x.usuario?.id===usuario?.id))).catch(()=>alertaError('Error','No se pudieron cargar')).finally(()=>setCargando(false))
    },[navigate])

    const guardar=async e=>{
        e.preventDefault()
        if(!form.nombre||!form.franquicia){alertaError('Campos vacíos','Ingresa nombre y selecciona franquicia');return}
        setSaving(true)
        try{
            const saved=await crearMetodoPago({...form,usuario:{id:usuario.id}})
            setMetodos(p=>[...p,saved])
            alertaExito('¡Guardado!','Método de pago creado')
            setModal(false)
        }catch(err){alertaError('Error',err.message)}
        finally{setSaving(false)}
    }

    const filtered=metodos.filter(m=>m.nombre?.toLowerCase().includes(search.toLowerCase())||m.franquicia?.toLowerCase().includes(search.toLowerCase()))

    return(
        <div className="app-layout">
            <Header/>
            <div className="main-content">
                <div className="topbar">
                    <div><div className="topbar-title">Métodos de Pago</div><div className="topbar-sub">{cargando?'Cargando...':`${filtered.length} métodos`}</div></div>
                    <button className="btn-green" onClick={()=>{setForm(INIT);setModal(true)}}><i className="ti ti-plus"/> Nuevo Método</button>
                </div>
                <div className="page-content">
                    <div className="card-clean" style={{padding:16,marginBottom:20}}><div style={{position:'relative'}}><i className="ti ti-search" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:16}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o franquicia..." className="input-clean" style={{paddingLeft:38}}/></div></div>
                    {cargando
                        ?<div className="row g-3">{[1,2,3].map(i=><div key={i} className="col-md-4"><div className="card-clean" style={{padding:20}}><div className="skeleton" style={{height:40,width:40,borderRadius:10,marginBottom:12}}/><div className="skeleton" style={{height:14,width:'60%',marginBottom:8}}/><div className="skeleton" style={{height:12,width:'40%'}}/></div></div>)}</div>
                        :filtered.length===0
                            ?<div className="card-clean"><div className="empty-state"><i className="ti ti-credit-card-off"/><p>Sin métodos de pago</p></div></div>
                            :<div className="row g-3">
                                {filtered.map(m=>(
                                    <div key={m.id} className="col-sm-6 col-lg-4">
                                        <div className="card-clean-hover" style={{padding:20}}>
                                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                                                <div style={{width:44,height:44,borderRadius:12,background:FRANC_BG[m.franquicia]||'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <i className={`ti ${FRANC_ICON[m.franquicia]||'ti-wallet'}`} style={{fontSize:20,color:FRANC_COLOR[m.franquicia]||'#475569'}}/>
                                                </div>
                                                <span className={m.estado?'badge-green':'badge-red'}>{m.estado?'Activo':'Inactivo'}</span>
                                            </div>
                                            <div style={{fontWeight:600,color:'#1e293b',marginBottom:4}}>{m.nombre}</div>
                                            <div style={{fontSize:13,color:'#94a3b8'}}>{m.franquicia}</div>
                                            {m.descripcion&&<div style={{fontSize:12,color:'#94a3b8',marginTop:6,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{m.descripcion}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
                <Footer/>
            </div>
            {modal&&(
                <div className="modal-overlay" onClick={()=>setModal(false)}>
                    <div className="modal-box" onClick={e=>e.stopPropagation()}>
                        <div className="modal-header"><span className="modal-title">Nuevo Método de Pago</span><button className="modal-close" onClick={()=>setModal(false)}><i className="ti ti-x"/></button></div>
                        <div className="modal-body">
                            <form onSubmit={guardar}>
                                <div style={{marginBottom:14}}><label className="form-label-clean">Nombre del método</label><input value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} placeholder="Ej: Tarjeta Débito Bancolombia" className="input-clean"/></div>
                                <div style={{marginBottom:14}}>
                                    <label className="form-label-clean">Franquicia</label>
                                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                                        {FRANQUICIAS.map(f=>(
                                            <button key={f} type="button" onClick={()=>setForm(p=>({...p,franquicia:f}))}
                                                style={{padding:'10px 4px',borderRadius:10,border:`1.5px solid ${form.franquicia===f?'#16a34a':'#e2e8f0'}`,background:form.franquicia===f?'#f0fdf4':'white',cursor:'pointer',textAlign:'center',transition:'all 0.15s'}}>
                                                <i className={`ti ${FRANC_ICON[f]||'ti-wallet'}`} style={{fontSize:18,color:form.franquicia===f?'#16a34a':'#94a3b8',display:'block',marginBottom:4}}/>
                                                <span style={{fontSize:11,fontWeight:500,color:form.franquicia===f?'#16a34a':'#64748b'}}>{f}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{marginBottom:14}}>
                                    <label className="form-label-clean">Estado</label>
                                    <button type="button" onClick={()=>setForm(p=>({...p,estado:!p.estado}))}
                                        style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${form.estado?'#bbf7d0':'#e2e8f0'}`,background:form.estado?'#f0fdf4':'white',cursor:'pointer',fontSize:14,color:form.estado?'#16a34a':'#64748b'}}>
                                        <i className={`ti ${form.estado?'ti-circle-check':'ti-circle'}`} style={{fontSize:18}}/>{form.estado?'Activo':'Inactivo'}
                                    </button>
                                </div>
                                <div style={{marginBottom:16}}><label className="form-label-clean">Descripción (opcional)</label><textarea value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))} className="input-clean" style={{resize:'none'}} rows={2}/></div>
                                <div style={{display:'flex',gap:10}}><button type="button" className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={()=>setModal(false)}>Cancelar</button><button type="submit" className="btn-green" style={{flex:1,justifyContent:'center'}} disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default MetodosPago
