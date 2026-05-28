import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { haySession } from '../helpers/local-storage'
import { alertaExito, alertaError } from '../helpers/alerts'
import { obtenerCategorias, crearCategoria, obtenerGastos } from '../services/api'

const ESTADOS=[{v:'Activo',l:'Activo'},{v:'Inactivo',l:'Inactivo'}]
const PRIORIDADES=[{v:'Baja',l:'Baja'},{v:'Media',l:'Media'},{v:'Alta',l:'Alta'}]
const TIPOS=[{v:'Fija',l:'Fija'},{v:'Variable',l:'Variable'},{v:'Ocasional',l:'Ocasional'}]
const BADGE={Alta:'badge-red',Media:'badge-amber',Baja:'badge-green',Activo:'badge-green',Inactivo:'badge-red',Fija:'badge-blue',Variable:'badge-purple',Ocasional:'badge-slate'}
const INIT={nombre:'',fechaCreacion:'',responsable:'',edad:'',justificacion:'',presupuestoAsignado:'',montoGastado:'',estado:'Activo',prioridad:'Media',tipo:'Variable',gasto:''}

const Categorias = () => {
    const [cats,setCats]=useState([])
    const [gastos,setGastos]=useState([])
    const [cargando,setCargando]=useState(true)
    const [modal,setModal]=useState(false)
    const [form,setForm]=useState(INIT)
    const [search,setSearch]=useState('')
    const [saving,setSaving]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        if(!haySession()){navigate('/login');return}
        Promise.all([obtenerCategorias(),obtenerGastos()]).then(([c,g])=>{setCats(c);setGastos(g)}).catch(()=>alertaError('Error','No se pudieron cargar')).finally(()=>setCargando(false))
    },[navigate])

    const hc=e=>setForm(p=>({...p,[e.target.name]:e.target.value}))

    const guardar=async e=>{
        e.preventDefault()
        if(!form.nombre||!form.fechaCreacion||!form.responsable||!form.estado||!form.prioridad||!form.tipo){alertaError('Campos vacíos','Completa los campos obligatorios');return}
        setSaving(true)
        try{
            const saved=await crearCategoria({...form,edad:Number(form.edad)||0,presupuestoAsignado:Number(form.presupuestoAsignado)||0,montoGastado:Number(form.montoGastado)||0,gasto:form.gasto?{id:Number(form.gasto)}:null})
            setCats(p=>[...p,saved])
            alertaExito('¡Guardado!','Categoría creada correctamente')
            setModal(false)
        }catch(err){alertaError('Error',err.message)}
        finally{setSaving(false)}
    }

    const filtered=cats.filter(c=>c.nombre?.toLowerCase().includes(search.toLowerCase()))

    return(
        <div className="app-layout">
            <Header/>
            <div className="main-content">
                <div className="topbar">
                    <div><div className="topbar-title">Categorías</div><div className="topbar-sub">{cargando?'Cargando...':`${filtered.length} de ${cats.length}`}</div></div>
                    <button className="btn-green" onClick={()=>{setForm(INIT);setModal(true)}}><i className="ti ti-plus"/> Nueva Categoría</button>
                </div>
                <div className="page-content">
                    <div className="card-clean" style={{padding:16,marginBottom:20}}><div style={{position:'relative'}}><i className="ti ti-search" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:16}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar categoría..." className="input-clean" style={{paddingLeft:38}}/></div></div>
                    <div className="card-clean" style={{overflow:'hidden'}}><div style={{overflowX:'auto'}}>
                        <table className="table-clean">
                            <thead><tr><th>Nombre</th><th>Responsable</th><th>Presupuesto</th><th>Estado</th><th>Prioridad</th><th>Tipo</th></tr></thead>
                            <tbody>
                                {cargando?[1,2,3].map(i=><tr key={i}>{[1,2,3,4,5,6].map(j=><td key={j}><div className="skeleton" style={{height:14,borderRadius:6}}/></td>)}</tr>)
                                :filtered.length===0?<tr><td colSpan={6}><div className="empty-state"><i className="ti ti-tag-off"/><p>Sin categorías aún</p></div></td></tr>
                                :filtered.map(c=>(
                                    <tr key={c.id}>
                                        <td style={{fontWeight:500,color:'#1e293b'}}>{c.nombre}</td>
                                        <td style={{color:'#64748b',fontSize:13}}>{c.responsable}</td>
                                        <td style={{fontWeight:600}}>${(c.presupuestoAsignado||0).toLocaleString('es-CO')}</td>
                                        <td><span className={BADGE[c.estado]||'badge-slate'}>{c.estado}</span></td>
                                        <td><span className={BADGE[c.prioridad]||'badge-slate'}>{c.prioridad}</span></td>
                                        <td><span className={BADGE[c.tipo]||'badge-slate'}>{c.tipo}</span></td>
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
                    <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:580}}>
                        <div className="modal-header"><span className="modal-title">Nueva Categoría</span><button className="modal-close" onClick={()=>setModal(false)}><i className="ti ti-x"/></button></div>
                        <div className="modal-body">
                            <form onSubmit={guardar}>
                                <div className="form-grid-2" style={{marginBottom:14}}>
                                    {[{n:'nombre',l:'Nombre',p:'Alimentación'},{n:'fechaCreacion',l:'Fecha',t:'date'},{n:'responsable',l:'Responsable',p:'Nombre'},{n:'edad',l:'Edad',t:'number',p:'25'},{n:'presupuestoAsignado',l:'Presupuesto',t:'number',p:'500000'},{n:'montoGastado',l:'Monto Gastado',t:'number',p:'0'}].map(({n,l,t='text',p})=>(
                                        <div key={n}><label className="form-label-clean">{l}</label><input type={t} name={n} value={form[n]} onChange={hc} placeholder={p} className="input-clean"/></div>
                                    ))}
                                    {[{n:'estado',l:'Estado',opts:ESTADOS},{n:'prioridad',l:'Prioridad',opts:PRIORIDADES},{n:'tipo',l:'Tipo',opts:TIPOS}].map(({n,l,opts})=>(
                                        <div key={n}><label className="form-label-clean">{l}</label><select name={n} value={form[n]} onChange={hc} className="input-clean">{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
                                    ))}
                                    <div><label className="form-label-clean">Gasto relacionado</label><select name="gasto" value={form.gasto} onChange={hc} className="input-clean"><option value="">— Ninguno —</option>{gastos.map(g=><option key={g.id} value={g.id}>{g.descripcion}</option>)}</select></div>
                                </div>
                                <div style={{marginBottom:16}}><label className="form-label-clean">Justificación</label><textarea name="justificacion" value={form.justificacion} onChange={hc} placeholder="Descripción opcional..." className="input-clean" style={{resize:'none'}} rows={2}/></div>
                                <div style={{display:'flex',gap:10}}><button type="button" className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={()=>setModal(false)}>Cancelar</button><button type="submit" className="btn-green" style={{flex:1,justifyContent:'center'}} disabled={saving}>{saving?<><span className="spinner" style={{marginRight:6}}/>Guardando...</>:'Guardar'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Categorias
