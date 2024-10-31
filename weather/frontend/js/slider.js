let currentSlide = 0;

function showSlide(index) {
    const slider = document.querySelector('.slider');
    const totalSlides = document.querySelectorAll('.slide').length;

    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    const translateValue = -currentSlide * 100 + '%';
    slider.style.transform = 'translateX(' + translateValue + ')';
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function startAutomaticSlideShow() {
    setInterval(nextSlide, 5000);
}

startAutomaticSlideShow();





document.addEventListener("DOMContentLoaded", function () {
    const scrollButton = document.getElementById("scrollButton");

    window.addEventListener("scroll", function () {
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        // Show the button when scrolled 20%
        if (scrollPercentage > 20) {
            scrollButton.style.display = "block";
        } else {
            scrollButton.style.display = "none";
        }
    });

    scrollButton.addEventListener("click", function () {
        // Scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
