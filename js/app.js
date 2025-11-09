/*
© 2020-2021 Carlos González Marco
Última actualización:  11/06/2024
*/

var gallery_status = 0;
var view_grid = true;
var collapsed_list = null;
var jsonfilepublic = null;

document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page === "gallery.html") {
        loadJSON("../../data/music.json", "container", "fillMUS");
    } else if (page === "makers.html") {
        // pass
    } else {
        loadPage("./pages/main.html", "destination");
    }

    document.getElementById("year").innerHTML = new Date().getFullYear();
});

function listenAudio() {
    // Audio activado
    let audioElements = document.querySelectorAll("audio");

    audioElements.forEach((audioElement) => {
        audioElement.addEventListener("play", () => {
            audioElements.forEach((otherAudioElement) => {
                if (otherAudioElement !== audioElement) {
                    otherAudioElement.pause();
                    otherAudioElement.currentTime = 0;
                }
            });
        });
    });
}

function toggleGrid() {
    if (view_grid) {
        view_grid = false;
    } else {
        view_grid = true;
    }

    collapsed_list = verify_collapsed();
    loadPage("./pages/main.html", "destination");
}

function updateGrid() {
    if (view_grid) {
        document.getElementById("grid-button").innerHTML = "list_alt";
    } else {
        document.getElementById("grid-button").innerHTML = "grid_view";
    }

    collapsed_list = verify_collapsed(collapsed_list);
}

function verify_collapsed(p_list = null) {
    var divs = document.querySelectorAll(".category");

    // get all collapsed divs
    if (p_list == null) {
        var p_list = [];

        for (i = 0; i < divs.length; i++) {
            if (divs[i].classList.contains("collapsed")) {
                p_list.push(0);
            } else {
                p_list.push(1);
            }
        }

        return p_list;

        // set all opened divs
    } else {
        for (i = 0; i < divs.length; i++) {
            if ((p_list[i] == 1) & divs[i].classList.contains("collapsed")) {
                divs[i].classList.remove("collapsed");
            }

            if ((p_list[i] == 0) & !divs[i].classList.contains("collapsed")) {
                divs[i].classList.add("collapsed");
            }
        }

        return null;
    }
}

function printCV() {
    openAllTabs();
    window.print();
}

function printMUS() {
    gallery_status = 1;
    showGallery();

    var slides = document.getElementsByClassName("mySlides");
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove("fade");
    }
    window.print();
    window.location.reload();
}

function openAllTabs() {
    var categories = document.getElementsByClassName("category");

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].classList.contains("collapsed")) {
            categories[i].classList.remove("collapsed");
        }
    }
}

function closeAllTabs() {
    var categories = document.getElementsByClassName("category");

    for (var i = 0; i < categories.length; i++) {
        if (!categories[i].classList.contains("collapsed")) {
            categories[i].classList.add("collapsed");
        }
    }
}

function openTab(event) {
    var category = event.target.parentElement.parentElement.parentElement;

    if (category.classList.contains("collapsed")) {
        category.classList.remove("collapsed");
    } else {
        category.classList.add("collapsed");
    }

    closeOtherTabs(category);
}

function closeOtherTabs(category) {
    var categories = document.getElementsByClassName("category");

    for (var i = 0; i < categories.length; i++) {
        if (categories[i] !== category) {
            categories[i].classList.add("collapsed");
        }
    }
}

function loadJSON(name, container, func) {
    const urlJSON = name;
    const request = new XMLHttpRequest();
    request.open("GET", urlJSON);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        jsonfilepublic = request.response;
        window[func](request.response, container);
        listenAudio();
        // fillCV(request.response, container);
    };
}

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

function loadPage(origin, destination, e) {
    (e || window.event).preventDefault();

    fetch(origin)
        .then((response) => response.text())
        .then((html) => {
            document.getElementById(destination).innerHTML = html;

            if (origin === "./pages/main.html") {
                loadJSON("./data/cv.json", "container", "fillCV");
            } else if (origin === "./pages/music.html") {
                loadJSON("music", "container", "fillMUS");
            }
        })
        .catch((error) => {
            console.warn(error);
        });
}

function fillCV(json, container) {
    // Destino
    var body = document.getElementById(container);

    for (var i = 0; i < json.category.length; i++) {
        // CATEGORÍAS

        // Icono
        var icon = document.createElement("div");
        icon.classList.add("icon");
        var icon_img = document.createElement("img");
        icon_img.src = json.category[i].icon;
        icon_img.alt = json.category[i].icon.replace(/^.*[\\\/]/, "").slice(0, -4);
        icon.appendChild(icon_img);

        // Título
        var title = document.createElement("div");
        title.classList.add("title");
        var title_button = document.createElement("button");
        title_button.innerHTML = json.category[i].title;
        title_button.onclick = function (event) {
            openTab(event);
        };
        title.appendChild(title_button);

        // Cabecera
        var head = document.createElement("div");
        head.classList.add("head");
        head.appendChild(icon);
        head.appendChild(title);

        // Contenido
        var content = document.createElement("div");

        if (view_grid) {
            content.classList.add("contentblock");
        } else {
            content.classList.add("content");
        }

        for (var j = 0; j < json.category[i].entry.length; j++) {
            // ENTRADAS

            // Fecha
            var date = document.createElement("div");
            date.classList.add("date");

            if (view_grid) {
                let txt_date = json.category[i].entry[j].date;

                let part1 = "";
                let part2 = txt_date;
                let part3 = "";

                if (txt_date.includes("</span>")) {
                    // Partimos la cadena en la primera y segunda parte
                    let parts1 = txt_date.split('">');
                    part1 = parts1[0] + '">';

                    // Luego partimos la segunda parte en la segunda y tercera parte
                    let parts2 = parts1[1].split("</span>");
                    part2 = parts2[0];
                    part3 = "</span>";
                }

                // part2 = part2.replaceAll(/ /g, ""); // Reemplaza espacios por nada
                part2 = part2.replaceAll(/<br\/>/g, ""); // Reemplaza <br/> por nada
                part2 = part2.replaceAll(/<p>/g, ", "); // Reemplaza <p> por ", "
                part2 = part2.replaceAll(/<\/p>/g, ""); // Reemplaza </p> por nada

                date.innerHTML = part1 + part2 + part3;
            } else {
                var date_ul = document.createElement("ul");
                var date_li = document.createElement("li");
                date_li.innerHTML = json.category[i].entry[j].date;
                date_ul.appendChild(date_li);
                date.appendChild(date_ul);
            }

            // Logotipo
            var logo = document.createElement("img");
            logo.src = json.category[i].entry[j].logo;

            // Título
            var content_title = document.createElement("div");
            content_title.classList.add("title");
            if (logo.src.slice(logo.src.length - 3) == "png" || logo.src.slice(logo.src.length - 3) == "svg") {
                content_title.appendChild(logo);
            }
            content_title.innerHTML += json.category[i].entry[j].title;

            // Centro
            var centre = document.createElement("div");
            centre.classList.add("centre");
            centre.innerHTML = json.category[i].entry[j].centre;

            // Descripción
            var description = document.createElement("div");
            description.classList.add("description");
            description.innerHTML = json.category[i].entry[j].description;

            // Subentradas
            var subentries = document.createElement("div");

            if (json.category[i].entry[j].subentries) {
                var subdetails = document.createElement("details");
                var subsummary = document.createElement("summary");
                subsummary.innerText = "Centros";
                subdetails.appendChild(subsummary);
                for (let k = 0; k < json.category[i].entry[j].subentries.length; k++) {
                    var subbutton = document.createElement("a");
                    subbutton.innerHTML = json.category[i].entry[j].subentries[k].title;
                    subbutton.href = json.category[i].entry[j].subentries[k].link;
                    subbutton.target = "_blank";
                    subbutton.classList.add("subbutton");
                    subdetails.appendChild(subbutton);
                }
                subentries.appendChild(subdetails);
            }

            // Entrada

            if (view_grid) {
                var entry = document.createElement("div");
                entry.classList.add("entryblock");

                entry.appendChild(date);
                entry.appendChild(content_title);
                entry.appendChild(centre);
                entry.appendChild(description);
                subentries.innerHTML != "" ? entry.appendChild(subentries) : null;
            } else {
                var entry = document.createElement("div");
                entry.classList.add("entry");

                var rightblock = document.createElement("div");
                rightblock.classList.add("rightblock");

                rightblock.appendChild(content_title);
                rightblock.appendChild(centre);
                rightblock.appendChild(description);
                subentries.innerHTML != "" ? rightblock.appendChild(subentries) : null;

                entry.appendChild(date);
                entry.appendChild(rightblock);
            }

            // Añadir entrada
            content.appendChild(entry);
        }

        // Categoría
        var category = document.createElement("div");
        category.classList.add("category");

        if (i !== 0) {
            category.classList.add("collapsed");
        }

        category.appendChild(head);
        category.appendChild(content);

        body.appendChild(category);
    }

    updateGrid();
    body.appendChild(document.createElement("br"));
}

function loadImage(img) {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("modal-content");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };
}

function showGallery() {
    var gallery = document.getElementById("gallery");
    if (gallery_status == 0) {
        gallery.style = "display: block;";
        img_show.style = "display: none;";
        gallery_status = 1;
    } else {
        gallery.style = "display: none;";
        img_show.style = "display: block;";
        gallery_status = 0;
    }
}

function parseYearRange(value) {
    if (!value || typeof value !== "string") return null;
    value = value.trim();

    // Ejemplo: "1860-1900"
    const range = value.match(/^(\d{3,4})\s*-\s*(\d{3,4})$/);
    if (range) {
        return { min: parseInt(range[1]), max: parseInt(range[2]) };
    }

    // Ejemplo: "~ 1950" o "< 1961"
    const approx = value.match(/^[~<>\s]*([0-9]{3,4})$/);
    if (approx) {
        const year = parseInt(approx[1]);
        return { min: year, max: year };
    }

    // Ejemplo: "1880"
    const single = value.match(/^(\d{3,4})$/);
    if (single) {
        const year = parseInt(single[1]);
        return { min: year, max: year };
    }

    return null; // no válido
}

function fillMUS(json, container) {
    // Destino
    var body = document.getElementById(container);

    gallery_status = 0;
    let minYearGlobal = Infinity;
    let maxYearGlobal = -Infinity;

    var hide_button = document.createElement("button");
    hide_button.textContent = "Mostrar/ocultar galería";
    hide_button.setAttribute("onclick", "showGallery()");
    hide_button.classList.add("gallery_btn");
    body.appendChild(hide_button);

    var gallery = document.createElement("div");
    gallery.setAttribute("id", "gallery");
    gallery.classList.add("gallery");

    for (var i = 0; i < json.instruments.length; i++) {
        var content = document.createElement("div");
        content.style = "display: inline-block;";

        var div_img = document.createElement("div");
        div_img.setAttribute("title", json.instruments[i].name);
        div_img.setAttribute("onclick", "currentSlide(" + (i + 1) + "); showGallery()");
        div_img.classList.add("gallery_subdiv");

        var txt_img = document.createElement("p");
        txt_img.textContent = "(" + (i + 1).toString() + ") " + json.instruments[i].name;

        var ins_img = document.createElement("img");
        ins_img.setAttribute("src", json.instruments[i].image);
        ins_img.setAttribute("alt", json.instruments[i].name);

        div_img.appendChild(ins_img);
        div_img.appendChild(txt_img);

        content.appendChild(div_img);
        gallery.appendChild(content);

        // === CALCULAR RANGO GLOBAL DE AÑOS ===
        const parsed = parseYearRange(json.instruments[i].const_year);
        if (parsed) {
            if (parsed.min < minYearGlobal) minYearGlobal = parsed.min;
            if (parsed.max > maxYearGlobal) maxYearGlobal = parsed.max;
        }
    }

    // márgenes
    if (minYearGlobal !== Infinity) {
        minYearGlobal -= 10;
        maxYearGlobal += 10;
    }

    body.appendChild(gallery);

    var img_show = document.createElement("div");
    img_show.setAttribute("id", "img_show");

    var buttons = document.createElement("div");
    buttons.classList.add("dots");

    var slideshow = document.createElement("div");
    slideshow.classList.add("slideshow-container");

    for (var i = 0; i < json.instruments.length; i++) {
        // Botones de desplazamiento
        var button = document.createElement("span");
        button.classList.add("dot");
        if (i == 0) {
            button.classList.add("active");
        }
        button.setAttribute("onclick", "currentSlide(" + (i + 1).toString() + ")");
        button.setAttribute("id", "button_" + (i + 1));
        buttons.appendChild(button);

        // Contenido
        var content = document.createElement("div");
        content.classList.add("mySlides", "fade");

        // Número de panel
        var numbers = document.createElement("div");
        numbers.classList.add("numbertext");
        numbers.innerText = (i + 1).toString() + " / " + json.instruments.length.toString();

        // Imagen del instrumento y logotipo(s) de marca
        var images = document.createElement("div");
        images.classList.add("images");

        var ins_img = document.createElement("img");
        ins_img.classList.add("instrument");
        ins_img.setAttribute("src", json.instruments[i].image);
        ins_img.setAttribute("alt", json.instruments[i].name);
        ins_img.setAttribute("title", json.instruments[i].name);
        ins_img.onclick = function () {
            loadImage(this);
        };
        images.appendChild(ins_img);

        var div_trademark = document.createElement("div");
        div_trademark.classList.add("trademark");
        for (var j = 0; j < json.instruments[i].trademark.length; j++) {
            var tra_img = document.createElement("img");
            tra_img.setAttribute("src", json.instruments[i].trademark[j].image);
            tra_img.setAttribute("alt", json.instruments[i].trademark[j].name);
            tra_img.setAttribute("title", json.instruments[i].trademark[j].name);
            div_trademark.appendChild(tra_img);
        }
        images.appendChild(div_trademark);

        // Texto de contenido

        var div_text = document.createElement("div");
        div_text.classList.add("text");

        var ul_text = document.createElement("ul");

        if (json.instruments[i].type != "") {
            var li_1 = document.createElement("li");
            li_1.innerHTML = "<b>Tipo:</b>&ensp;" + json.instruments[i].type;
            ul_text.appendChild(li_1);
        }

        if (json.instruments[i].company != "") {
            var li_2 = document.createElement("li");
            li_2.innerHTML = "<b>Marca:</b>&ensp;" + json.instruments[i].company;
            ul_text.appendChild(li_2);
        }

        if (json.instruments[i].const_year != "") {
            var li_3 = document.createElement("li");
            li_3.innerHTML = "<b>Año de construcción:</b>&ensp;" + json.instruments[i].const_year;
            ul_text.appendChild(li_3);
        }

        if (json.instruments[i].const_place != "") {
            var li_4 = document.createElement("li");
            li_4.innerHTML = "<b>Lugar de construcción:</b>&ensp;" + json.instruments[i].const_place;
            ul_text.appendChild(li_4);
        }

        if (json.instruments[i].model != "") {
            var li_5 = document.createElement("li");
            li_5.innerHTML = "<b>Modelo:</b>&ensp;" + json.instruments[i].model;
            ul_text.appendChild(li_5);
        }

        if (json.instruments[i].serialno != "") {
            var li_6 = document.createElement("li");
            li_6.innerHTML = "<b>Número de serie:</b>&ensp;" + json.instruments[i].serialno;
            ul_text.appendChild(li_6);
        }

        if (json.instruments[i].tunning != "") {
            var li_7 = document.createElement("li");
            li_7.innerHTML = "<b>Afinación:</b>&ensp;" + json.instruments[i].tunning;
            ul_text.appendChild(li_7);
        }

        if (json.instruments[i].system != "") {
            var li_8 = document.createElement("li");
            li_8.innerHTML = "<b>Mecanismo:</b>&ensp;" + json.instruments[i].system;
            ul_text.appendChild(li_8);
        }

        if (json.instruments[i].hlink != "") {
            var li_8 = document.createElement("li");
            li_8.innerHTML = "<b>Enlace:</b>&ensp;" + json.instruments[i].hlink;
            ul_text.appendChild(li_8);
        }

        var subdiv = document.createElement("div");

        if (json.instruments[i].description != "") {
            var hr_text = document.createElement("hr");
            var p_in = document.createElement("p");
            p_in.innerHTML = "<b>Descripción:</b>&ensp;" + json.instruments[i].description;
            subdiv.appendChild(hr_text);
            subdiv.appendChild(p_in);
        }

        div_text.appendChild(ul_text);
        div_text.appendChild(subdiv);

        // === TIMELINE ===
        const parsed = parseYearRange(json.instruments[i].const_year);
        if (parsed && minYearGlobal !== Infinity) {
            const range = maxYearGlobal - minYearGlobal;

            const timeline = document.createElement("div");
            timeline.classList.add("timeline");
            timeline.id = "timeline_" + (i + 1);
            timeline.style.position = "relative";
            timeline.style.margin = "20px 50px";
            timeline.style.height = "60px";

            const isSingleYear = parsed.min === parsed.max;

            if (!isSingleYear) {
                // Barra azul para rangos
                const bar = document.createElement("div");
                const left = ((parsed.min - minYearGlobal) / range) * 100 -0.5;
                const width = ((parsed.max - parsed.min) / range) * 100;
                bar.style.position = "absolute";
                bar.style.left = left + "%";
                bar.style.width = width + "%";
                bar.style.top = "20px";
                bar.style.height = "14px";
                bar.style.background = "#4b8bff";
                bar.style.borderRadius = "3px";
                timeline.appendChild(bar);
            }

            // Línea roja
            const centerPercent = (((parsed.min + parsed.max) / 2 - minYearGlobal) / range) * 100;
            const centerLine = document.createElement("div");
            centerLine.style.position = "absolute";
            centerLine.style.left = centerPercent -0.5 + "%";
            centerLine.style.top = "13px";
            centerLine.style.height = "30px"; // todo el timeline
            centerLine.style.width = "2px";
            centerLine.style.background = "red";
            timeline.appendChild(centerLine);

            const tickLabel = document.createElement("span");
            if (!isSingleYear) {
                tickLabel.textContent = "ca. " + parseInt((parsed.min + parsed.max) / 2);
            } else {
                tickLabel.textContent = parseInt((parsed.min + parsed.max) / 2);
            }
            tickLabel.style.position = "absolute";
            tickLabel.style.left = "calc(" + centerPercent + "% + 5px)";
            tickLabel.style.top = "4px";
            tickLabel.style.bottom = "-18px";
            tickLabel.style.fontSize = "11px";
            tickLabel.style.color = "red";
            timeline.appendChild(tickLabel);

            // Eje de años global
            const axis = document.createElement("div");
            axis.style.position = "absolute";
            axis.style.bottom = "0";
            axis.style.left = "0";
            axis.style.width = "100%";
            axis.style.borderTop = "2px solid #333";

            const step = Math.ceil(range / 6);
            for (let y = minYearGlobal; y <= maxYearGlobal; y += step) {
                const tick = document.createElement("div");
                tick.style.position = "absolute";
                tick.style.left = ((y - minYearGlobal) / range) * 100 - 0.5 + "%";
                tick.style.height = "6px";
                tick.style.width = "1px";
                tick.style.background = "#333";
                tick.style.bottom = "0";
                axis.appendChild(tick);

                const tickLabel = document.createElement("span");
                tickLabel.textContent = y;
                tickLabel.style.position = "absolute";
                tickLabel.style.left = ((y - minYearGlobal) / range) * 100 + "%";
                tickLabel.style.bottom = "-18px";
                tickLabel.style.fontSize = "11px";
                tickLabel.style.transform = "translateX(-50%)";
                axis.appendChild(tickLabel);
            }

            timeline.appendChild(axis);
            content.appendChild(timeline);
        }

        content.appendChild(numbers);
        content.appendChild(images);
        content.appendChild(div_text);

        //

        slideshow.appendChild(content);
    }

    // Flechas de desplazamiento

    var lnk_prev = document.createElement("a");
    lnk_prev.classList.add("prev");
    lnk_prev.setAttribute("onclick", "plusSlides(-1)");
    lnk_prev.textContent = "❮";
    slideshow.appendChild(lnk_prev);

    var lnk_next = document.createElement("a");
    lnk_next.classList.add("next");
    lnk_next.setAttribute("onclick", "plusSlides(+1)");
    lnk_next.textContent = "❯";
    slideshow.appendChild(lnk_next);

    img_show.appendChild(buttons);
    img_show.appendChild(slideshow);

    body.appendChild(img_show);
}
