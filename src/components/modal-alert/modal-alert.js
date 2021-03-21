const modalAlert = document.querySelector ('.modal__alert'),
        modalAlertContent = document.querySelector ('.modal__alert-content_title'),
        modalAlertAbout = document.querySelector ('.modal__alert-content_about'),
        modalAlertInfo = document.querySelector ('.modal__alert-info');

modalAlert.addEventListener('click', event => {
    if (event.target.closest('.cross__alert') || event.target.classList.contains('modalAlert')) {
        document.body.style.overflow = '';
        modalAlert.classList.add('hide');
        modalAlertInfo.classList.add('hide');
    }
});

modalAlertAbout.addEventListener('click', (event) => {
    event.preventDefault();
    modalAlertInfo.classList.remove('hide');
});