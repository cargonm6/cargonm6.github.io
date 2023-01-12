/*
© 2020-2021 Carlos González Marco
Última actualización:  28/10/2021
*/

// document.addEventListener("DOMContentLoaded", function () {
//   loadPage("./pages/cv.html", "destination");
// });



// --------------------

document.addEventListener("DOMContentLoaded", function () {
  loadPage("./pages/main.html", "destination");

  document.getElementById("year").innerHTML = new Date().getFullYear();
});

function printCV() {
  openAllTabs();
  window.print();
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
  const urlJSON = "./data/" + name + ".json";
  const request = new XMLHttpRequest();
  request.open("GET", urlJSON);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    window[func](request.response, container);
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
        loadJSON("cv", "container", "fillCV");
      }
      else if (origin === "./pages/music.html") {
        loadJSON("music", "container", "fillMUS");
      }
      else if (origin === "./pages/pci.html") {
        loadJSON("pci", "container", "fillPCI");
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
    content.classList.add("content");

    for (var j = 0; j < json.category[i].entry.length; j++) {
      // Fecha
      var date = document.createElement("div");
      date.classList.add("date");
      var date_ul = document.createElement("ul");
      var date_li = document.createElement("li");
      date_li.innerHTML = json.category[i].entry[j].date;
      date_ul.appendChild(date_li);
      date.appendChild(date_ul);

      // Logotipo
      var logo = document.createElement("img");
      logo.src = json.category[i].entry[j].logo;

      // Título
      var content_title = document.createElement("div");
      content_title.classList.add("title");
      if (logo.src.slice(logo.src.length - 3) == "png") { content_title.appendChild(logo); }
      content_title.innerHTML += json.category[i].entry[j].title;

      // Centro
      var centre = document.createElement("div");
      centre.classList.add("centre");
      centre.innerHTML = json.category[i].entry[j].centre;

      // Descripción
      var description = document.createElement("div");
      description.classList.add("description");
      description.innerHTML = json.category[i].entry[j].description;

      // Entrada
      var entry = document.createElement("div");
      entry.classList.add("entry");

      var rightblock = document.createElement("div");
      rightblock.classList.add("rightblock");

      rightblock.appendChild(content_title);
      rightblock.appendChild(centre);
      rightblock.appendChild(description);

      entry.appendChild(date);
      entry.appendChild(rightblock);

      // Añadir entrada
      content.appendChild(entry);
    }

    // Categoría
    var category = document.createElement("div");
    category.classList.add("category");

    //if (i !== 0) {
    category.classList.add("collapsed");
    //}

    category.appendChild(head);
    category.appendChild(content);

    body.appendChild(category);
  }
  body.appendChild(document.createElement("br"));
}

function loadImage(img) {
  console.log(img.src)
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
  }
}

function fillMUS(json, container) {
  // Destino
  var body = document.getElementById(container);

  var buttons = document.createElement("div");
  buttons.classList.add("dots");

  var slideshow = document.createElement("div");
  slideshow.classList.add("slideshow-container");

  for (var i = 0; i < json.instruments.length; i++) {

    // Botones de desplazamiento
    var button = document.createElement("span");
    button.classList.add("dot");
    if (i == 0) { button.classList.add("active"); }
    button.setAttribute('onclick', "currentSlide(" + (i + 1).toString() + ")");
    button.setAttribute('id', "button_" + (i + 1))
    buttons.appendChild(button);

    // Contenido
    var content = document.createElement("div");
    content.classList.add("mySlides", "fade");

    // Número de panel
    var numbers = document.createElement("div");
    numbers.classList.add("numbertext");
    numbers.innerText = (i + 1).toString() + " / " + (json.instruments.length).toString();
    content.appendChild(numbers);

    // Imagen del instrumento
    var ins_img = document.createElement("img");
    ins_img.setAttribute("src", json.instruments[i].image);
    ins_img.setAttribute("alt", json.instruments[i].name);
    ins_img.setAttribute("title", json.instruments[i].name);
    ins_img.onclick = function () { loadImage(this) }
    content.appendChild(ins_img);

    // Logotipo(s) de marca
    var div_trademark = document.createElement("div");
    div_trademark.classList.add("trademark");
    for (var j = 0; j < json.instruments[i].trademark.length; j++) {
      var tra_lnk = document.createElement("a");
      tra_lnk.setAttribute("href", json.instruments[i].trademark[j].link);
      var tra_img = document.createElement("img");
      tra_img.setAttribute("src", json.instruments[i].trademark[j].image);
      tra_img.setAttribute("alt", json.instruments[i].trademark[j].name);
      tra_img.setAttribute("title", json.instruments[i].trademark[j].name);
      tra_lnk.appendChild(tra_img);
      div_trademark.appendChild(tra_lnk);
    }
    content.appendChild(div_trademark);

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

    if (json.instruments[i].description != "") {
      var li_9 = document.createElement("li");
      li_9.innerHTML = "<b>Descripción:</b>&ensp;" + json.instruments[i].description;
      ul_text.appendChild(li_9);
    }

    div_text.appendChild(ul_text);
    content.appendChild(div_text);

    slideshow.appendChild(content);
  }

  // Flechas de desplazamiento

  var lnk_prev = document.createElement("a");
  lnk_prev.classList.add("prev");
  lnk_prev.setAttribute('onclick', "plusSlides(-1)");
  lnk_prev.textContent = "❮";
  slideshow.appendChild(lnk_prev);

  var lnk_next = document.createElement("a");
  lnk_next.classList.add("next");
  lnk_next.setAttribute('onclick', "plusSlides(+1)");
  lnk_next.textContent = "❯";
  slideshow.appendChild(lnk_next);

  body.appendChild(buttons);
  body.appendChild(slideshow);

}

function fillPCI(json, container) {
  // alert("¡Página en desarrollo!");
  // Destino
  var body = document.getElementById(container);
  var form = document.createElement("form");

  var button = document.createElement("button");
  button.textContent = "Calcular";
  button.onclick = function () { calc_pci(); }

  body.appendChild(button);

  body.appendChild(document.createElement("hr"));

  var fieldset = document.createElement("fieldset");
  var fieldname = document.createElement("legend");
  fieldname.textContent = "Pavement data";
  fieldset.appendChild(fieldname);
  var input = document.createElement("input");
  var label = document.createElement("label");
  input.type = "number";
  input.value = 0.0;
  input.id = "width";
  label.textContent = "width";
  fieldset.appendChild(label);
  fieldset.appendChild(input);
  fieldset.appendChild(label);
  fieldset.appendChild(input);
  var input = document.createElement("input");
  var label = document.createElement("label");
  input.type = "number";
  input.value = 0.0;
  input.id = "length";
  label.textContent = "length";
  fieldset.appendChild(label);
  fieldset.appendChild(input);
  fieldset.appendChild(label);
  fieldset.appendChild(input);
  form.appendChild(fieldset);

  for (var i = 0; i < json.distresses.length; i++) {
    // Campo
    var fieldset = document.createElement("fieldset");
    var fieldname = document.createElement("legend");
    fieldname.textContent = json.distresses[i].name.charAt(0).toUpperCase() + json.distresses[i].name.slice(1) + " (" + json.distresses[i].type + ")";
    fieldset.appendChild(fieldname);

    for (var j = 0; j < json.distresses[i].severities.length; j++) {
      var input = document.createElement("input");
      var label = document.createElement("label");
      input.type = "number";
      input.value = 0.0;
      input.id = i + "_" + j;
      label.textContent = json.distresses[i].severities[j].name;
      fieldset.appendChild(label);
      fieldset.appendChild(input);
    }

    form.appendChild(fieldset);
  }

  body.appendChild(form);

}

function calc_pci() {
  var pci = new PCI();
  pci.set_section(document.getElementById("width").value, document.getElementById("length").value)
  pci.data;

}

class PCI {
  constructor() {
    this.survey_width = 0.0;
    this.section_length = 500.0;
    this.section_area = this.survey_width * this.section_length;
    this.pci = 0.0;
    this.dmg_density = 0.0;

    this.distress = {
      "distress_01": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_02": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_03": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_04": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_05": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_06": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_07": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_08": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_09": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_10": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_11": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_12": [[0.0, 0.0, 0.0]],
      "distress_13": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_14": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_15": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_16": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_17": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_18": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      "distress_19": [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]]
    };

  }

  set_section(p_survey_width = 0.0, p_section_length = 500.0) {
    this.survey_width = p_survey_width;
    this.section_length = p_section_length;
    this.section_area = this.survey_width * this.section_length;
    console.log("ok");
  }

  get data() {
    console.log(this.survey_width);
    console.log(this.section_length);
    console.log(this.section_area);
    console.log(this.pci);
    console.log(this.dmg_density);
    console.log(this.distress);
  }
}