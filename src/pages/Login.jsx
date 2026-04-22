import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./Forms.css";
import { validarLogin } from "../helpers/local-storage";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const recargaLogin = (e) => {
    e.preventDefault();
    const usuarioAutenticado = validarLogin(email, password);

    if (usuarioAutenticado) {
      localStorage.setItem('sesion_activa', JSON.stringify(usuarioAutenticado));
      navigate('/');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    /* Clase main-screen: Controla que el Footer siempre esté al fondo */
    <div className="main-screen">
      <div className="contenedor">
        <div className="formulario">
          <h2>Iniciar Sesión</h2>

          <form onSubmit={recargaLogin}>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit">Ingresar</button>
          </form>

          <div className="newaccount">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;