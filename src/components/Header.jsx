import { NavLink, useNavigate } from 'react-router-dom'
import { obtenerUsuario, cerrarSesion } from '../helpers/local-storage'
import { obtenerIniciales } from '../helpers/generador'

const NAV_ITEMS = [
    { to: '/dashboard',    label: 'Dashboard',       icon: 'ti-layout-dashboard' },
    { to: '/gastos',       label: 'Mis Gastos',       icon: 'ti-receipt' },
    { to: '/categorias',   label: 'Categorías',       icon: 'ti-tag' },
    { to: '/comercios',    label: 'Comercios',        icon: 'ti-building-store' },
    { to: '/metodos-pago', label: 'Métodos de Pago',  icon: 'ti-credit-card' },
    { to: '/mi-perfil',    label: 'Mi Perfil',        icon: 'ti-user-circle' },
]

function Header() {
    const navigate  = useNavigate()
    const usuario   = obtenerUsuario()
    const iniciales = obtenerIniciales(usuario?.nombres)

    const handleLogout = () => {
        cerrarSesion()
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <i className="ti ti-cash" />
                </div>
                <span>Spendy</span>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <p className="sidebar-nav-label">Menú</p>
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                    >
                        <i className={`ti ${icon}`} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{iniciales}</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{usuario?.nombres || 'Usuario'}</div>
                        <div className="sidebar-user-email">{usuario?.correo || ''}</div>
                    </div>
                    <button className="btn-logout-icon" onClick={handleLogout} title="Cerrar sesión">
                        <i className="ti ti-logout" style={{ fontSize: 16 }} />
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Header
