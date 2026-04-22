// Register.jsx
import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Forms.css";

const Register = () => {
  return (
    <>
      <div className="contenedor">

        <div className="formulario">
          <h2>Registro</h2>

          <form>

            <div className="input-group">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre"
              />
            </div>

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
              Registrarse
            </button>

          </form>

          <div className="newaccount">
            ¿Ya tienes cuenta?{" "}
            <Link to="/">Ingresa</Link>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Register;