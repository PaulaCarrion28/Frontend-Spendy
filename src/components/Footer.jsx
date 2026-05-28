function Footer() {
    return (
        <footer style={{ textAlign: 'center', padding: '16px 32px', fontSize: 12, color: '#94a3b8', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
            © {new Date().getFullYear()} Spendy — Gestión de Gastos Personales
        </footer>
    )
}
export default Footer
