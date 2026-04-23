import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Expenses from "../pages/Expenses"
 
// Cada objeto es una pantalla de la app
// path: la URL que aparece en el navegador
// element: el componente que se muestra
export const router = createBrowserRouter([
    {
        path: "/",           // Pantalla inicial → Login
        element: <Login />
    },
    {
        path: "/login",      // También va al Login
        element: <Login />
    },
    {
        path: "/register",   // Pantalla de registro
        element: <Register />
    },
    {
        path: "/dashboard",  // Panel principal del usuario
        element: <Dashboard />
    },
    {
        path: "/expenses",   // Pantalla de gastos
        element: <Expenses />
    },
])