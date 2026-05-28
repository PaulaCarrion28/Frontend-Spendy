import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { obtenerUsuario, guardarUsuario } from '../helpers/local-storage'
import { alertaExito, alertaError } from '../helpers/alerts'
import { actualizarUsuario } from '../services/api'
import { obtenerIniciales } from '../helpers/generador'

const GENEROS=[{v:'Masculino',l:'Masculino'},{v:'Femenino',l:'Femenino'}]
const TIPOS=[{v:'Cedula',l:'Cédula'},{v:'Pasaporte',l:'Pasaporte'},{v:'Extranjeria',l:'Extranjería'}]

const MiPerfil=()=>{
    const navigate=useNavigate()
    const usuario=obtenerUsuario()
    const [editMode,setEditMode]=useState(false)
    const [saving,setSaving]=useState(false)
    const [showPass,setShowPass]=useState(false)
    const [form,setForm]=useState({nombres:usuario?.nombres||'',telefono:usuario?.telefono||'',edad:usuario?.edad||'',salario:usuario?.salario||'',genero:usuario?.genero||'',tipoDocumento:usuario?.tipoDocumento||'',contraseña:''})

    const hc=e=>setForm(p=>({...p,[e.target.name]:e.target.value}))
    const iniciales=obtenerIniciales(usuario?.nombres)

    const guardar=async e=>{
        e.preventDefault()
        if(!form.nombres||!form.telefono){alertaError('Campos vacíos','Nombre y teléfono son obligatorios');return}
        setSaving(true)
        try{
            const payload={nombres:form.nombres,telefono:form.telefono,edad:Number(form.edad)||usuario.edad,salario:Number(form.salario)||usuario.salario,genero:form.genero||usuario.genero,tipoDocumento:form.tipoDocumento||usuario.tipoDocumento,...(form.contraseña.trim()&&{contrasena:form.contraseña.trim()})}
            const updated=await actualizarUsuario(usuario.id,payload)
            guardarUsuario({...usuario,...updated})
            alertaExito('¡Actualizado!','Tu perfil fue guardado correctamente')
            setForm(p=>({...p,contraseña:''}))
            setEditMode(false)
        }catch(err){alertaError('Error',err.message)}
        finally{setSaving(false)}
    }

    const cancelar=()=>{setForm({nombres:usuario?.nombres||'',telefono:usuario?.telefono||'',edad:usuario?.edad||'',salario:usuario?.salario||'',genero:usuario?.genero||'',tipoDocumento:usuario?.tipoDocumento||'',contraseña:''});setEditMode(false)}

    const INFO=[{l:'Correo',v:usuario?.correo,icon:'ti-mail'},{l:'Documento',v:`${usuario?.tipoDocumento} ${usuario?.documento}`,icon:'ti-fingerprint'}]
    const EDITABLE=[{l:'Nombres',n:'nombres',icon:'ti-user'},{l:'Teléfono',n:'telefono',icon:'ti-phone'},{l:'Edad',n:'edad',icon:'ti-calendar'},{l:'Salario',n:'salario',icon:'ti-wallet',fmt:v=>v?`$${Number(v).toLocaleString('es-CO')}`:''},{l:'Género',n:'genero',icon:'ti-gender-bigender'},{l:'Tipo Doc.',n:'tipoDocumento',icon:'ti-id'}]

    return(
        <div className="app-layout">
            <Header/>
            <div className="main-content">
                <div className="topbar">
                    <div><div className="topbar-title">Mi Perfil</div><div className="topbar-sub">Gestiona tu información personal</div></div>
                    {!editMode&&<button className="btn-outline" onClick={()=>setEditMode(true)}><i className="ti ti-pencil"/> Editar</button>}
                </div>
                <div className="page-content">
                    <div style={{maxWidth:600}}>
                        <div className="card-clean" style={{padding:28}}>
                            {/* Avatar */}
                            <div style={{display:'flex',alignItems:'center',gap:16,paddingBottom:20,marginBottom:20,borderBottom:'1px solid #e2e8f0'}}>
                                <div style={{width:60,height:60,borderRadius:16,background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#16a34a',flexShrink:0}}>{iniciales}</div>
                                <div>
                                    <div style={{fontSize:18,fontWeight:600,color:'#1e293b'}}>{usuario?.nombres}</div>
                                    <div style={{fontSize:13,color:'#94a3b8'}}>{usuario?.correo}</div>
                                    <span className="badge-green" style={{marginTop:6,display:'inline-block'}}>Sesión activa</span>
                                </div>
                            </div>

                            {/* Read-only */}
                            <div style={{marginBottom:20}}>
                                <div style={{fontSize:10,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Datos no editables</div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                                    {INFO.map(({l,v,icon})=>(
                                        <div key={l} style={{display:'flex',alignItems:'center',gap:10,background:'#f8fafc',borderRadius:12,padding:'12px 14px',border:'1px solid #e2e8f0'}}>
                                            <div style={{width:32,height:32,borderRadius:8,background:'white',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><i className={`ti ${icon}`} style={{color:'#94a3b8',fontSize:14}}/></div>
                                            <div><div style={{fontSize:11,color:'#94a3b8'}}>{l}</div><div style={{fontSize:13,fontWeight:500,color:'#475569'}}>{v||'—'}</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!editMode
                                ?<div>
                                    <div style={{fontSize:10,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Información personal</div>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                                        {EDITABLE.map(({l,n,icon,fmt})=>(
                                            <div key={n} style={{display:'flex',alignItems:'center',gap:10,background:'#f8fafc',borderRadius:12,padding:'12px 14px',border:'1px solid #e2e8f0'}}>
                                                <div style={{width:32,height:32,borderRadius:8,background:'white',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><i className={`ti ${icon}`} style={{color:'#94a3b8',fontSize:14}}/></div>
                                                <div><div style={{fontSize:11,color:'#94a3b8'}}>{l}</div><div style={{fontSize:13,fontWeight:500,color:'#475569'}}>{fmt?fmt(usuario?.[n]):usuario?.[n]||'—'}</div></div>
                                            </div>
                                        ))}
                                        <div style={{display:'flex',alignItems:'center',gap:10,background:'#f8fafc',borderRadius:12,padding:'12px 14px',border:'1px solid #e2e8f0'}}>
                                            <div style={{width:32,height:32,borderRadius:8,background:'white',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><i className="ti ti-lock" style={{color:'#94a3b8',fontSize:14}}/></div>
                                            <div><div style={{fontSize:11,color:'#94a3b8'}}>Contraseña</div><div style={{fontSize:13,fontWeight:500,color:'#475569'}}>••••••••</div></div>
                                        </div>
                                    </div>
                                </div>
                                :<form onSubmit={guardar}>
                                    <div style={{fontSize:10,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:12}}>Editar información</div>
                                    <div className="form-grid-2" style={{marginBottom:14}}>
                                        <div><label className="form-label-clean">Nombres</label><input name="nombres" value={form.nombres} onChange={hc} className="input-clean" placeholder="Tu nombre"/></div>
                                        <div><label className="form-label-clean">Teléfono</label><input name="telefono" value={form.telefono} onChange={hc} className="input-clean" placeholder="3001234567"/></div>
                                        <div><label className="form-label-clean">Edad</label><input type="number" name="edad" value={form.edad} onChange={hc} className="input-clean"/></div>
                                        <div><label className="form-label-clean">Salario (COP)</label><input type="number" name="salario" value={form.salario} onChange={hc} className="input-clean"/></div>
                                        <div><label className="form-label-clean">Género</label><select name="genero" value={form.genero} onChange={hc} className="input-clean">{GENEROS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
                                        <div><label className="form-label-clean">Tipo Documento</label><select name="tipoDocumento" value={form.tipoDocumento} onChange={hc} className="input-clean">{TIPOS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
                                    </div>
                                    <div style={{marginBottom:20}}>
                                        <label className="form-label-clean">Nueva contraseña</label>
                                        <div style={{position:'relative'}}>
                                            <input name="contraseña" type={showPass?'text':'password'} value={form.contraseña} onChange={hc} placeholder="Dejar vacío para no cambiar" className="input-clean" style={{paddingRight:40}}/>
                                            <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',border:'none',background:'none',color:'#94a3b8',cursor:'pointer',fontSize:16,padding:0}}><i className={`ti ${showPass?'ti-eye-off':'ti-eye'}`}/></button>
                                        </div>
                                    </div>
                                    <div style={{display:'flex',gap:10}}>
                                        <button type="button" className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={cancelar}><i className="ti ti-x"/> Cancelar</button>
                                        <button type="submit" className="btn-green" style={{flex:1,justifyContent:'center'}} disabled={saving}>{saving?<><span className="spinner" style={{marginRight:6}}/>Guardando...</>:<><i className="ti ti-check"/> Guardar</>}</button>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    )
}
export default MiPerfil
