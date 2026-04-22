import './Header.css'
import logo from '../assets/logo.jpeg'
function Header() {
    return (
    <header className="header">
        <img src={logo} alt="logo" />
        <span className="logo-text">Spendy</span>
    </header>
    )
}

export default Header