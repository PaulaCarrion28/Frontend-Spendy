// App.jsx — punto de entrada principal
// El enrutamiento está centralizado en src/router/router.jsx
// main.jsx usa RouterProvider con el router importado
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'

function App() {
    return <RouterProvider router={router} />
}

export default App
