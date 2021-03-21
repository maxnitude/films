const modal = document.querySelector('.modal'),
        tvCardImgModal = document.querySelector('.modal__poster-image'),
        modalTitle = document.querySelector('.modal__title'),
        genresList = document.querySelector('.genres-list'),
        rating  = document.querySelector('.rating'),
        description = document.querySelector('.description');

modal.addEventListener('click', event => {
        if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
            document.body.style.overflow = '';
            modal.classList.add('modal-hide');
        }
    });
    
document.addEventListener('keydown', event => {
        if (event.key == 'Escape') {
            document.body.style.overflow = '';
            modal.classList.add('modal-hide');
        }
    });