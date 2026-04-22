import Swal from "sweetalert2";

export function redirectAlert(title, message, icon, url) {
    let timerInterval;
    Swal.fire({
        title: title,
        html: message + " <b></b> milisegundos.",
        timer: 2000,
        timerProgressBar: true,
        icon: icon,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
            window.location.href = url /* Consultar como hacer la redireccion con useNavigate o Navigate */
        }
    })
}

export function generalAlert() {
    
}