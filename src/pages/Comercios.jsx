import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { haySession } from '../helpers/local-storage'
import { alertaExito, alertaError } from '../helpers/alerts'
import { obtenerComercios, crearComercio } from '../services/api'

const INIT={nit:'',nombre:'',actividad:'',correo:'',telefono:'',tipoComercio:'Fisico',direccion:'',url:'',descripcion:''}

const Comercios=()=>{
    const [comercios,setComercios]=useState([])
    const [cargando,setCargando]=useState(true)
    const [modal,setModal]=useState(false)
    const [form,setForm]=useState(INIT)
    const [search,setSearch]=useState('')
    const [saving,setSaving]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        if(!haySession()){navigate('/login');return}
        obtenerComercios().then(setComercios).catch(()=>alertaError('Error','No se pudieron cargar')).finally(()=>setCargando(false))
    },[navigate])

    const hc=e=>setForm(p=>({...p,[e.target.name]:e.target.value}))

    const guardar=async e=>{
        e.preventDefault()
        if(!form.nit||!form.nombre||!form.actividad||!form.correo||!form.telefono||!form.direccion){alertaError('Campos vacíos','Completa todos los campos obligatorios');return}
        setSaving(true)
        try{
            const saved=await crearComercio(form)
            setComercios(p=>[...p,saved])
            alertaExito('¡Guardado!','Comercio registrado')
            setModal(false)
        }catch(err){alertaError('Error',err.message)}
        finally{setSaving(false)}
    }

    const filtered=comercios.filter(c=>c.nombre?.toLowerCase().includes(search.toLowerCase())||c.nit?.includes(search))

    return(
        <div className="app-layout">
            <Header/>
            <div className="main-content">
                <div className="topbar">
                    <div><div className="topbar-title">Comercios</div><div className="topbar-sub">{cargando?'Cargando...':`${filtered.length} de ${comercios.length}`}</div></div>
                    <button className="btn-green" onClick={()=>{setForm(INIT);setModal(true)}}><i className="ti ti-plus"/> Nuevo Comercio</button>
                </div>
                <div className="page-content">
                    <div className="card-clean" style={{padding:16,marginBottom:20}}><div style={{position:'relative'}}><i className="ti ti-search" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:16}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o NIT..." className="input-clean" style={{paddingLeft:38}}/></div></div>
                    <div className="card-clean" style={{overflow:'hidden'}}><div style={{overflowX:'auto'}}>
                        <table className="table-clean">
                            <thead><tr><th>Nombre</th><th>NIT</th><th>Actividad</th><th>Tipo</th><th>Contacto</th></tr></thead>
                            <tbody>
                                {cargando?[1,2,3].map(i=><tr key={i}>{[1,2,3,4,5].map(j=><td key={j}><div className="skeleton" style={{height:14,borderRadius:6}}/></td>)}</tr>)
                                :filtered.length===0?<tr><td colSpan={5}><div className="empty-state"><i className="ti ti-building-off"/><p>Sin comercios aún</p></div></td></tr>
                                :filtered.map(c=>(
                                    <tr key={c.id}>
                                        <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:8,background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center'}}><i className="ti ti-building-store" style={{color:'#64748b',fontSize:14}}/></div><span style={{fontWeight:500,color:'#1e293b'}}>{c.nombre}</span></div></td>
                                        <td><span style={{fontFamily:'monospace',fontSize:12,color:'#94a3b8'}}>{c.nit}</span></td>
                                        <td style={{color:'#64748b',fontSize:13}}>{c.actividad}</td>
                                        <td><span className={c.tipoComercio==='Virtual'?'badge-blue':'badge-green'}>{c.tipoComercio}</span></td>
                                        <td style={{fontSize:12,color:'#94a3b8'}}>{c.correo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div></div>
                </div>
                <Footer/>
            </div>
            {modal&&(
                <div className="modal-overlay" onClick={()=>setModal(false)}>
                    <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
                        <div className="modal-header"><span className="modal-title">Nuevo Comercio</span><button className="modal-close" onClick={()=>setModal(false)}><i className="ti ti-x"/></button></div>
                        <div className="modal-body">
                            <form onSubmit={guardar}>
                                <div className="form-grid-2" style={{marginBottom:14}}>
                                    {[{n:'nit',l:'NIT',p:'900123456-1'},{n:'nombre',l:'Nombre',p:'Supermercado'},{n:'actividad',l:'Actividad',p:'Venta de alimentos'},{n:'correo',l:'Correo',t:'email',p:'contacto@co.com'},{n:'telefono',l:'Teléfono',p:'6041234567'}].map(({n,l,t='text',p})=>(
                                        <div key={n}><label className="form-label-clean">{l}</label><input type={t} name={n} value={form[n]} onChange={hc} placeholder={p} className="input-clean"/></div>
                                    ))}
                                    <div><label className="form-label-clean">Tipo</label><select name="tipoComercio" value={form.tipoComercio} onChange={hc} className="input-clean"><option value="Fisico">Físico</option><option value="Virtual">Virtual</option></select></div>
                                </div>
                                <div style={{marginBottom:12}}><label className="form-label-clean">Dirección</label><input name="direccion" value={form.direccion} onChange={hc} placeholder="Cra 65 # 44-40" className="input-clean"/></div>
                                <div style={{marginBottom:12}}><label className="form-label-clean">URL (opcional)</label><input name="url" value={form.url} onChange={hc} placeholder="https://..." className="input-clean"/></div>
                                <div style={{marginBottom:16}}><label className="form-label-clean">Descripción</label><textarea name="descripcion" value={form.descripcion} onChange={hc} className="input-clean" style={{resize:'none'}} rows={2}/></div>
                                <div style={{display:'flex',gap:10}}><button type="button" className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={()=>setModal(false)}>Cancelar</button><button type="submit" className="btn-green" style={{flex:1,justifyContent:'center'}} disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Comercios
