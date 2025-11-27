let slideIndex = 1;

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && gallery_status === 0) {
        plusSlides(-1);
        updateModal();
    } else if (event.key === "ArrowRight" && gallery_status === 0) {
        plusSlides(+1);
        updateModal();
    } else if (event.key === "Escape") {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }
});

function updateModal() {
    var modalImg = document.getElementById("modal-content");
    var captionText = document.getElementById("caption");

    var number = document.getElementsByClassName("dot active")[0].id.substring(7);
    console.log(number);
    var img = document.getElementsByClassName("mySlides")[Number(number) - 1].getElementsByTagName("img")[0];

    console.log(img);

    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
}

// Next/previous controls
function plusSlides(n) {
    showSlides((slideIndex += n));

    // Ocultar todas las marcas
    const marks = document.querySelectorAll(".timeline-mark");
    marks.forEach(m => m.style.display = "none");

    // Mostrar solo la del instrumento actual
    const activeMark = document.getElementById("timeline_mark_" + (slideIndex - 1));
    if (activeMark) activeMark.style.display = "block";
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides((slideIndex = n));

    // Ocultar todas las marcas
    const marks = document.querySelectorAll(".timeline-mark");
    marks.forEach(m => m.style.display = "none");

    // Mostrar solo la del instrumento actual
    const activeMark = document.getElementById("timeline_mark_" + (slideIndex - 1));
    if (activeMark) activeMark.style.display = "block";
}

function showSlides(n) {
    try {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";

        // Mostrar solo la timeline correspondiente
        const timelines = document.querySelectorAll(".timeline");
        timelines.forEach((t) => (t.style.display = "none"));

        const activeTimeline = document.getElementById("timeline_" + slideIndex);
        if (activeTimeline) {
            activeTimeline.style.display = "block";
        }
    } catch (e) {
        console.log(e);
    }
}
