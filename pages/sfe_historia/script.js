document.addEventListener("DOMContentLoaded", function () {
    loadJSON("content.json", "timeline_container", "fill_timeline");
});

function loadJSON(name, container, func) {
    const urlJSON = name;
    const request = new XMLHttpRequest();
    request.open("GET", urlJSON);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        window[func](request.response, container);
        // fillCV(request.response, container);
    };
}

function timeline_show(button) {
    // Obtén el div que está justo antes del botón
    var div = button.nextElementSibling;
    var fa = document.createElement("i");
    button.innerHTML = "";
    // Verifica si el div actualmente está oculto
    if (div.style.display === "none" || div.classList.contains("hidden")) {
        div.style.display = "block";
        div.classList.remove("hidden");
        fa.classList.add("fa");
        fa.classList.add("fa-chevron-up");
        fa.ariaHidden = "true";
        button.appendChild(fa);
    } else {
        div.style.display = "none";
        div.classList.add("hidden");
        fa.classList.add("fa");
        fa.classList.add("fa-chevron-down");
        fa.ariaHidden = "true";
        button.appendChild(fa);
    }
}

function fill_timeline(json, container) {
    var body = document.getElementById(container);
    console.log(json.periodos[0].leyes[0].escudo);

    for (var i = 0; i < json.periodos.length; i++) {
        var table = document.createElement("table");

        var t_head = document.createElement("tr");
        t_head.appendChild(Object.assign(document.createElement("th"), { textContent: "Escudo" }));
        t_head.appendChild(Object.assign(document.createElement("th"), { textContent: "Denominación" }));
        t_head.appendChild(Object.assign(document.createElement("th"), { textContent: "Descripción" }));
        t_head.appendChild(Object.assign(document.createElement("th"), { textContent: "Marco legal" }));
        t_head.appendChild(Object.assign(document.createElement("th"), { textContent: "Período" }));
        table.appendChild(t_head);

        var t_head = document.createElement("tr");
        var td = Object.assign(document.createElement("td"));
        var img = Object.assign(document.createElement("img"), { src: json.periodos[i].escudo, alt: "" });
        td.appendChild(img);
        t_head.appendChild(td);
        t_head.appendChild(Object.assign(document.createElement("td"), { textContent: json.periodos[i].nombre }));
        t_head.appendChild(Object.assign(document.createElement("td"), { textContent: json.periodos[i].descripcion }));
        t_head.appendChild(Object.assign(document.createElement("td"), { textContent: json.periodos[i].marco }));
        t_head.appendChild(Object.assign(document.createElement("td"), { textContent: json.periodos[i].periodo }));
        table.appendChild(t_head);

        var div = Object.assign(document.createElement("div"), { className: "timeline" });

        for (var j = 0; j < json.periodos[i].leyes.length; j++) {
            console.log((j + 1) % 2);
            var subdib = Object.assign(document.createElement("div"), { className: "container" });
            if ((j + 1) % 2 == 0) {
                subdib.classList.add("right");
            } else {
                subdib.classList.add("left");
            }

            var ssdiv = Object.assign(document.createElement("p"), { className: "content" });
            var h2 = Object.assign(document.createElement("h2"), { textContent: json.periodos[i].leyes[j].fecha + " " });
            var img = Object.assign(document.createElement("img"), { src: json.periodos[i].leyes[j].escudo, alt: "" });
            h2.appendChild(img);
            ssdiv.appendChild(h2);
            ssdiv.appendChild(Object.assign(document.createElement("p"), { className: "title", textContent: json.periodos[i].leyes[j].nombre }));
            ssdiv.appendChild(Object.assign(document.createElement("p"), { className: "author", textContent: "Promotor: " + json.periodos[i].leyes[j].promotor }));
            ssdiv.appendChild(Object.assign(document.createElement("a"), { className: "link", textContent: "Enlace al documento", href: json.periodos[i].leyes[j].enlace, target: "_blank" }));
            ssdiv.appendChild(Object.assign(document.createElement("p"), { className: "desc", textContent: json.periodos[i].leyes[j].descripcion }));

            subdib.appendChild(ssdiv);
            div.appendChild(subdib);
        }

        var button = Object.assign(document.createElement("button"), { className: "show" });

        var fa = document.createElement("i");
        fa.classList.add("fa");
        fa.classList.add("fa-chevron-up");
        fa.ariaHidden = "true";
        button.appendChild(fa);

        button.onclick = function () {
            timeline_show(this);
        };

        body.appendChild(table);
        body.appendChild(button);
        body.appendChild(div);
    }
}
