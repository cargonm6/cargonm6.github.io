let score = 0;
var questions;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cuestionarios").value = "v0";
});

function changeJSON(sel) {
    document.getElementById("result-box").style = "display: block";
    document.getElementById("app").innerHTML = "";

    fetch("json/" + sel.value + ".json")
        .then((response) => response.json())
        .then((data) => {
            // Barajar aleatoriamente las preguntas
            data.preguntas = shuffleArray(data.preguntas);
            renderQuestions(data.preguntas);
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
            const input = document.createElement(question.multiple ? "input" : "input");
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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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

    document.getElementById("result").innerHTML = `Puntuación: ${score}/${questionContainers.length}`;
    document.getElementById("result").className = "";
    if (score / questionContainers.length >= 0.5) {
        document.getElementById("result").classList.add("tick");
    } else {
        document.getElementById("result").classList.add("cross");
    }
}

function restore(input = false) {
    const questionContainers = document.querySelectorAll(".question-container");
    document.getElementById("result").innerHTML = "";

    questionContainers.forEach((questionContainer) => {
        const inputs = questionContainer.querySelectorAll("input");
        const labels = questionContainer.querySelectorAll("label");
        const tick = questionContainer.firstChild.querySelector(".tick");
        const cross = questionContainer.firstChild.querySelector(".cross");

        if (input == true) {
            inputs.forEach((input) => {
                input.checked = false;
            });
        }

        labels.forEach((label) => {
            label.classList.remove("correct-answer", "wrong-answer");
        });

        if (tick) {
            questionContainer.firstChild.removeChild(tick);
        } else if (cross) {
            questionContainer.firstChild.removeChild(cross);
        }
    });
}

function getCorrectAnswers(question) {
    return question.respuestas.filter((answer) => answer.verdadera).map((answer) => answer.opcion);
}

function areAllCorrect(inputs, correctAnswers) {
    const selectedAnswers = Array.from(inputs)
        .filter((input) => input.checked)
        .map((input) => input.value);

    return selectedAnswers.length === correctAnswers.length && selectedAnswers.every((answer) => correctAnswers.includes(answer));
}
