function startGame() {
    localStorage.setItem("gameStarted", "true");
    localStorage.removeItem("gameScene");
    window.location.href = "game.html";
}

function continueGame() {
    if (localStorage.getItem("gameStarted") === "true") {
        window.location.href = "game.html";
    } else {
        alert("У вас пока нет начатых расследований.");
    }
}

function openArchive() {
    alert("Дело №001 — Палата №13\n\nДругие дела засекречены.");
}

function showOffice() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = false;

    localStorage.setItem("gameScene", "office");
}

function openLetter() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = false;

    document.body.classList.add("office-background");

    localStorage.setItem("gameScene", "letter");
}

function acceptCase() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = true;
    document.getElementById("clinicScene").hidden = true;

    document.body.classList.remove("office-background");

    document.getElementById("walkingScene").hidden = false;

    localStorage.setItem("gameScene", "walking");

    setTimeout(function () {
        showClinic();
    }, 9000);
}

function showClinic() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = true;
    document.getElementById("walkingScene").hidden = true;
    document.getElementById("clinicScene").hidden = false;

    document.body.classList.remove("office-background");

    localStorage.setItem("gameScene", "clinic");
}

// Загрузка фотографий

const nursePhotos = {};

for (let i = 1; i <= 3; i++) {
    nursePhotos[i] = new Image();
    nursePhotos[i].src = `images/nurse${i}.png`;
}

// Плавная смена фотографий

let currentNursePhoto = 1;
let requestedNursePhoto = 1;

async function changeNursePhoto(number) {
    if (requestedNursePhoto === number) {
        return;
    }

    requestedNursePhoto = number;

    let image = document.getElementById("nurseImage");
    let path = `images/nurse${number}.png`;

    try {
        await nursePhotos[number].decode();
    } catch {
        requestedNursePhoto = currentNursePhoto;
        return;
    }

    if (requestedNursePhoto !== number) {
        return;
    }

    let overlay = document.createElement("div");

    overlay.className = "nurse-overlay";
    overlay.style.backgroundImage = `url('${path}')`;

    image.after(overlay);

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            overlay.classList.add("visible");

            setTimeout(function () {
                if (requestedNursePhoto === number) {
                    image.style.backgroundImage = `url('${path}')`;
                    currentNursePhoto = number;
                }

                overlay.remove();
            }, 450);
        });
    });
}

// Регистратура

function enterClinic() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("clinicScene").hidden = true;
    document.getElementById("receptionScene").hidden = false;
    document.getElementById("dialogueBox").hidden = true;

    currentNursePhoto = 1;
    requestedNursePhoto = 1;

    document.getElementById("nurseImage").style.backgroundImage =
        "url('images/nurse1.png')";

    document.getElementById("dialogueText").textContent =
        "Добрый вечер. Вы что-то хотели?";

    document.getElementById("dialogueChoices").innerHTML = `
        <button onclick="nurseAnswer(1)">
            Я хотел бы поговорить с врачом.
        </button>

        <button onclick="nurseAnswer(2)">
            Мне нужна информация об одном пациенте.
        </button>
    `;

    localStorage.setItem("gameScene", "reception");

    setTimeout(function () {
        changeNursePhoto(2);

        document.getElementById("dialogueBox").hidden = false;
    }, 2000);
}

// Диалог с медсестрой

function nurseAnswer(answer) {
    let text = document.getElementById("dialogueText");
    let choices = document.getElementById("dialogueChoices");

    if (answer === 1) {
        text.textContent =
            "Сейчас только дежурный врач на месте. У вас что-то срочное?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(4)">
                Это касается одного из ваших бывших пациентов.
            </button>

            <button onclick="nurseAnswer(5)">
                Мне нужно обсудить события ноября 2019 года.
            </button>
        `;
    }

    if (answer === 2 || answer === 4) {
        text.textContent = "Как его зовут?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(6)">
                Не знаю имени. У меня есть только номер — 013.
            </button>

            <button onclick="nurseAnswer(7)">
                Он поступил к вам в ноябре 2019 года.
            </button>
        `;
    }

    if (answer === 5 || answer === 7) {
        changeNursePhoto(3);

        text.textContent =
            "2019 год? О каком пациенте идёт речь?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(6)">
                Пациент №013.
            </button>
        `;
    }

    if (answer === 6) {
        changeNursePhoto(3);

        text.textContent = "Простите, а вы ему кто?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(8)">
                Я частный детектив.
            </button>

            <button onclick="nurseAnswer(9)">
                Я его родственник.
            </button>

            <button onclick="nurseAnswer(10)">
                Предпочту не отвечать на этот вопрос.
            </button>
        `;
    }

    // Частный детектив

    if (answer === 8) {
        text.textContent =
            "Детектив? Что именно вы расследуете?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(11)">
                Исчезновение одного из ваших пациентов.
            </button>

            <button onclick="nurseAnswer(12)">
                Пока не могу разглашать подробности.
            </button>
        `;
    }

    // Родственник

    if (answer === 9) {
        text.textContent =
            "Тогда назовите его фамилию.";

        choices.innerHTML = `
            <button onclick="nurseAnswer(13)">
                К сожалению, у меня нет этой информации.
            </button>

            <button onclick="nurseAnswer(14)">
                Простите, я соврал. Я частный детектив.
            </button>
        `;
    }

    // Отказ отвечать

    if (answer === 10) {
        text.textContent =
            "В таком случае ничем не могу вам помочь.";

        choices.innerHTML = `
            <button onclick="nurseAnswer(15)">
                Хорошо. Могу я поговорить с дежурным врачом?
            </button>

            <button onclick="nurseAnswer(16)">
                Вы ведь знаете, о ком я говорю?
            </button>
        `;
    }

    // Первый переход к осмотру

    if (answer === 11) {
        text.textContent =
            "Вам лучше поговорить с врачом. Подождите, я его позову.";

        choices.innerHTML = "";
    }

    if (answer === 12) {
        text.textContent =
            "Тогда я тоже не могу предоставить вам никакой информации.";

        choices.innerHTML = `
            <button onclick="nurseAnswer(17)">
                Кто из врачей работал здесь в ноябре 2019 года?
            </button>

            <button onclick="nurseAnswer(18)">
                А вы сами работали здесь в то время?
            </button>
        `;
    }

    if (answer === 13) {
        text.textContent =
            "Вы не знаете фамилию своего родственника?";

        choices.innerHTML = `
            <button onclick="nurseAnswer(14)">
                Простите, я соврал. Я частный детектив.
            </button>
        `;
    }

    if (answer === 14) {
        text.textContent =
            "Зачем тогда было врать?";

        choices.innerHTML = "";
    }

    // Второй переход к осмотру

    if (answer === 15) {
        text.textContent =
            "Одну минуту, я узнаю, свободен ли он.";

        choices.innerHTML = "";
    }

    if (answer === 16) {
        text.textContent =
            "Я уже ответила на ваш вопрос.";

        choices.innerHTML = `
            <button onclick="nurseAnswer(15)">
                Могу я поговорить с дежурным врачом?
            </button>
        `;
    }

    if (answer === 17) {
        text.textContent =
            "Насколько я помню, доктор Волков. Он сегодня дежурит. Могу его позвать.";

        choices.innerHTML = `
            <button onclick="nurseAnswer(15)">
                Да, пожалуйста.
            </button>
        `;
    }

    if (answer === 18) {
        text.textContent =
            "Да. Но я не понимаю, какое отношение это имеет ко мне.";

        choices.innerHTML = "";
    }
}

// Восстановление прогресса

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("prologue")) {

        let scene = localStorage.getItem("gameScene");

        if (scene === "office") {
            showOffice();
        }

        if (scene === "letter") {
            openLetter();
        }

        if (scene === "walking") {
            acceptCase();
        }

        if (scene === "clinic") {
            showClinic();
        }

        if (scene === "reception") {
            enterClinic();
        }
    }
});