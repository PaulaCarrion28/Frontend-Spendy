// Login.jsx
import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Forms";

const Login = () => {
  return (
    <>
      <div className="contenedor">

        <div className="formulario">
          <h2>Iniciar Sesión</h2>

          <form>

            <div className="input-group">
              <label>Correo</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button type="submit">
              Ingresar
            </button>

          </form>

          <div className="newaccount">
            ¿No tienes cuenta?{" "}
            <Link to="/register">
              Regístrate
            </Link>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Login;