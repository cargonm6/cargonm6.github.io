// variables globales
let score = 0;
let questions;
let randomize = true;

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa el selector a "none" y el checkbox a true
  document.getElementById("cuestionarios").value = "none";
  document.getElementById("checkrandom").checked = true;
});

function changeRandom(check) {
  // Cambia el estado de la variable
  randomize = check.checked;

  // Recarga el JSON abierto
  if (document.getElementById("cuestionarios").value != "none") {
    changeJSON(document.getElementById("cuestionarios"));
  }
}

function changeJSON(sel) {
  // Muestra el bloque de respuesta
  document.getElementById("result-box").style = "display: block";

  // Añade el bloque para volver al inicio (reiniciar)
  let return_link = document.createElement("a");
  return_link.innerHTML =
    '<i class="fa-solid fa-house"></i>&nbsp;Volver al inicio';
  return_link.href = "JavaScript: location.reload(true);";

  let print_link = document.createElement("a");
  print_link.style.float = "right";
  print_link.innerHTML = '<i class="fa-solid fa-print"></i>&nbsp;Imprimir';
  print_link.href = "javascript:void(0);";
  // Adjuntar un evento de clic al enlace para imprimir la página
  print_link.addEventListener("click", function () {
    window.print();
  });

  // Vacía el contenedor de cuestionarios
  let container = document.getElementById("app");
  container.innerHTML = "";

  let div_links = document.createElement("div");
  div_links.id = "div_links";
  div_links.style.display = "block";
  div_links.appendChild(return_link);
  div_links.appendChild(print_link);
  container.appendChild(div_links);

  // Carga el JSON en función del valor del selector
  fetch("json/" + sel.value + ".json")
    .then((response) => response.json())
    .then((data) => {
      // Barajar aleatoriamente las preguntas
      data.preguntas = shuffleArray(data.preguntas);
      renderQuestions(data.preguntas);
      restore();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderQuestions(data) {
  const appContainer = document.getElementById("app");
  questions = data;
  questions.forEach((question, index) => {
    // Barajar aleatoriamente las respuestas
    question.respuestas = shuffleArray(question.respuestas);

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${question.enunciado}`;
    questionContainer.appendChild(questionText);

    question.respuestas.forEach((answer) => {
      const input = document.createElement(
        question.multiple ? "input" : "input"
      );
      input.type = question.multiple ? "checkbox" : "radio";
      input.name = `question_${index}`;
      input.value = answer.opcion;
      input.id = `${index}_${answer.opcion}`;

      const label = document.createElement("label");
      label.textContent = answer.opcion;
      label.htmlFor = `${index}_${answer.opcion}`;

      questionContainer.appendChild(input);
      questionContainer.appendChild(label);
      questionContainer.appendChild(document.createElement("br"));
    });

    appContainer.appendChild(questionContainer);
  });
}

// Función para barajar aleatoriamente un array
function shuffleArray(array) {
  if (randomize == true) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  return array;
}

function showResults() {
  restore(false);
  score = 0;
  const questionContainers = document.querySelectorAll(".question-container");

  questionContainers.forEach((questionContainer, index) => {
    const inputs = questionContainer.querySelectorAll("input");
    const correctAnswers = getCorrectAnswers(questions[index]);

    inputs.forEach((input) => {
      const label = input.nextElementSibling;

      if (input.checked && correctAnswers.includes(input.value)) {
        label.classList.add("correct-answer");
      } else if (input.checked && !correctAnswers.includes(input.value)) {
        label.classList.add("wrong-answer");
      } else if (!input.checked && correctAnswers.includes(input.value)) {
        label.classList.add("correct-answer");
      }
    });

    const mark = document.createElement("span");

    questionContainer.firstChild.appendChild(mark);

    if (inputs.length > 0 && areAllCorrect(inputs, correctAnswers)) {
      score += 1;
      mark.className = "tick";
      mark.textContent = " ✓";
    } else {
      mark.className = "cross";
      mark.textContent = " ✗";
    }
  });

  document.getElementById(
    "result"
  ).innerHTML = `Puntuación: ${score}/${questionContainers.length}`;
  document.getElementById("result").className = "";
  if (score / questionContainers.length >= 0.5) {
    document.getElementById("result").classList.add("tick");
  } else {
    document.getElementById("result").classList.add("cross");
  }
}

function restore(input = false) {
  // Vacía el contenedor de resultado
  const questionContainers = document.querySelectorAll(".question-container");
  document.getElementById("result").innerHTML = "";

  // Por cada pregunta...
  questionContainers.forEach((questionContainer) => {
    // Si se debe restaurar el formulario completo, reinicia todos los checkbox
    if (input == true) {
      const inputs = questionContainer.querySelectorAll("input");
      inputs.forEach((input) => {
        input.checked = false;
      });
    }

    // Retira si la respuesta es correcta o no
    const labels = questionContainer.querySelectorAll("label");
    labels.forEach((label) => {
      label.classList.remove("correct-answer", "wrong-answer");
    });

    // Elimina los símbolos de tick y cross
    const tick = questionContainer.firstChild.querySelector(".tick");
    const cross = questionContainer.firstChild.querySelector(".cross");
    if (tick) {
      questionContainer.firstChild.removeChild(tick);
    } else if (cross) {
      questionContainer.firstChild.removeChild(cross);
    }
  });
}

function getCorrectAnswers(question) {
  // Devuelve la relación de respuestas correctas
  return question.respuestas
    .filter((answer) => answer.verdadera)
    .map((answer) => answer.opcion);
}

function areAllCorrect(inputs, correctAnswers) {
  // Indica si el número de aciertos es el número total de respuestas correctas de la pregunta
  const selectedAnswers = Array.from(inputs)
    .filter((input) => input.checked)
    .map((input) => input.value);

  return (
    selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every((answer) => correctAnswers.includes(answer))
  );
}
