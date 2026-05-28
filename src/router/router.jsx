import { createBrowserRouter } from 'react-router-dom'
import Login        from '../pages/Login'
import Register     from '../pages/Register'
import Dashboard    from '../pages/Dashboard'
import Expenses     from '../pages/Expenses'
import Categorias   from '../pages/Categorias'
import Comercios    from '../pages/Comercios'
import MetodosPago  from '../pages/MetodosPago'
import MiPerfil     from '../pages/MiPerfil'

export const router = createBrowserRouter([
    { path: '/',              element: <Login /> },
    { path: '/login',         element: <Login /> },
    { path: '/register',      element: <Register /> },
    { path: '/dashboard',     element: <Dashboard /> },
    { path: '/gastos',        element: <Expenses /> },
    { path: '/categorias',    element: <Categorias /> },
    { path: '/comercios',     element: <Comercios /> },
    { path: '/metodos-pago',  element: <MetodosPago /> },
    { path: '/mi-perfil',     element: <MiPerfil /> },
])
