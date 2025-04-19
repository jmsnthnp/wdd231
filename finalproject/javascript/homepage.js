document.addEventListener('DOMContentLoaded', function() {
    const movieContainers = document.querySelectorAll('.upcoming-movie-container > div');
    movieContainers.forEach(container => {
        const moviePoster = container.querySelector('img');
        const dialog = container.querySelector('dialog');

        moviePoster.addEventListener('click', function() {
            dialog.showModal(); 
        });

        dialog.addEventListener('click', function(event) {
            if (event.target === dialog) {
                dialog.close(); 
            }
        });
    });
});