function startGame() {
    localStorage.setItem("gameStarted", "true");
    localStorage.removeItem("gameScene");
    localStorage.removeItem("journalEntries");

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

// Кабинет детектива

function showOffice() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = false;

    localStorage.setItem("gameScene", "office");
}

// Анонимное письмо

function openLetter() {
    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = false;

    document.body.classList.add("office-background");

    localStorage.setItem("gameScene", "letter");
}

// Дорога до клиники

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

// Прибытие

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

for (let i = 1; i <= 5; i++) {
    nursePhotos[i] = new Image();
    nursePhotos[i].src = `images/nurse${i}.png`;
}

nursePhotos[6] = new Image();
nursePhotos[6].src = "images/emptyReception.png";

const receptionPhoto = new Image();
receptionPhoto.src = "images/reception.png";

const journalPhoto = new Image();
journalPhoto.src = "images/journal.png";

// Плавная смена фотографий

let currentNursePhoto = 1;
let requestedNursePhoto = 1;

async function changeNursePhoto(number) {

    if (requestedNursePhoto === number) {
        return;
    }

    requestedNursePhoto = number;

    let image = document.getElementById("nurseImage");
    let path = nursePhotos[number].src;

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

    await new Promise(function (resolve) {

        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                overlay.classList.add("visible");

                setTimeout(function () {

                    if (requestedNursePhoto === number) {

                        image.style.backgroundImage =
                            `url('${path}')`;

                        currentNursePhoto = number;
                    }

                    overlay.remove();

                    resolve();

                }, 450);

            });

        });

    });
}

// Вход в регистратуру

function enterClinic() {

    document.getElementById("prologue").hidden = true;
    document.getElementById("clinicScene").hidden = true;
    document.getElementById("receptionScene").hidden = false;
    document.getElementById("dialogueBox").hidden = true;
    document.getElementById("deskButton").hidden = true;

    document.getElementById("journalButton").hidden = false;

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

    // Первый вариант ухода медсестры

    if (answer === 11) {

        text.textContent =
            "Вам лучше поговорить с врачом. Подождите, я его позову.";

        choices.innerHTML = "";

        setTimeout(nurseLeaves, 2500);
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

    // Второй вариант ухода медсестры

    if (answer === 15) {

        text.textContent =
            "Одну минуту, я узнаю, свободен ли он.";

        choices.innerHTML = "";

        setTimeout(nurseLeaves, 2500);
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

// Медсестра уходит

async function nurseLeaves() {

    document.getElementById("dialogueBox").hidden = true;

    await changeNursePhoto(4);

    await new Promise(resolve => setTimeout(resolve, 750));

    await changeNursePhoto(5);

    await new Promise(resolve => setTimeout(resolve, 950));

    await changeNursePhoto(6);

    showEmptyReception();
}

// Пустая регистратура

function showEmptyReception() {

    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = true;
    document.getElementById("walkingScene").hidden = true;
    document.getElementById("clinicScene").hidden = true;

    document.getElementById("inspectionScene").hidden = true;
    document.getElementById("objectWindow").hidden = true;

    document.getElementById("receptionScene").hidden = false;
    document.getElementById("dialogueBox").hidden = true;
    document.getElementById("deskButton").hidden = false;
    document.getElementById("journalButton").hidden = false;

    document.body.classList.remove("office-background");

    let image = document.getElementById("nurseImage");

    image.classList.remove("approach");

    image.style.backgroundImage =
        "url('images/emptyReception.png')";

    currentNursePhoto = 6;
    requestedNursePhoto = 6;

    localStorage.setItem("gameScene", "emptyReception");
}

// Приближение к стойке

function approachDesk() {

    let image = document.getElementById("nurseImage");

    document.getElementById("deskButton").hidden = true;

    image.classList.add("approach");

    setTimeout(function () {

        showInspection();

        image.classList.remove("approach");

    }, 1200);
}

// Осмотр рабочего стола

function showInspection() {

    document.getElementById("prologue").hidden = true;
    document.getElementById("office").hidden = true;
    document.getElementById("letterScreen").hidden = true;
    document.getElementById("walkingScene").hidden = true;
    document.getElementById("clinicScene").hidden = true;
    document.getElementById("receptionScene").hidden = true;

    document.body.classList.remove("office-background");

    document.getElementById("inspectionScene").hidden = false;
    document.getElementById("objectWindow").hidden = true;
    document.getElementById("journalButton").hidden = false;

    localStorage.setItem("gameScene", "inspection");

    prepareObjects();
}

// Подготовка интерактивных предметов

function prepareObjects() {

    let room = document.querySelector(".inspection-room");

    let objects = document.querySelectorAll(".desk-object");

    objects.forEach(function (object) {

        object.style.backgroundSize =
            `${room.clientWidth}px ${room.clientHeight}px`;

        object.style.backgroundPosition =
            `-${object.offsetLeft}px -${object.offsetTop}px`;

    });
}

// Личный дневник детектива

let currentObject = null;

let currentJournalTab = "clues";

let currentJournalPage = 0;

let journalEntries = [];

try {

    journalEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
    );

    if (!Array.isArray(journalEntries)) {
        journalEntries = [];
    }

} catch {

    journalEntries = [];

}

// Информация об уликах

const clueData = {

    calendar: {

        id: "calendar",

        category: "clues",

        title: "Подозрительная дата",

        thought:
            "Странно... Почему на её столе до сих пор лежит календарь за 2019 год? И почему отмечено именно 15 ноября?",

        description:
            "На календаре за ноябрь 2019 года красным отмечено 15 число. Возможно, эта дата связана с пациентом №013.",

        image: "images/calendar.png",

        date: "25.11.2026"

    },

    medical: {

        id: "medical",

        category: "people",

        title: "Елена Сидорова",

        thought:
            "Старшая медсестра... Возможно, она знает гораздо больше, чем говорит.",

        description:
            "Сидорова Елена Викторовна. Старшая медсестра. Необходимо выяснить, работала ли она здесь в ноябре 2019 года.",

        image: "images/medical.png",

        date: "25.11.2026"

    }

};

// Осмотр отдельного предмета

function inspectObject(name) {

    currentObject = name;

    document.getElementById("objectPhoto").src =
        `images/${name}.png`;

    document.getElementById("objectWindow").hidden = false;

    let thought = document.getElementById("detectiveThought");

    let button = document.getElementById("saveClueButton");

    let clue = clueData[name];

    if (clue) {

        thought.hidden = false;

        document.getElementById("thoughtText").textContent =
            clue.thought;

        let saved = journalEntries.some(function (entry) {

            return entry.id === name;

        });

        button.disabled = saved;

        button.textContent = saved
            ? "Уже записано"
            : "Записать в дневник";

    } else {

        thought.hidden = true;

    }
}

// Закрытие осмотра

function closeObject() {

    document.getElementById("objectWindow").hidden = true;

    currentObject = null;
}

// Открытие дневника

function openJournal() {

    document.getElementById("journalWindow").hidden = false;

    renderJournal();
}

// Закрытие дневника

function closeJournal() {

    document.getElementById("journalWindow").hidden = true;
}

// Сохранение улики

function saveClue() {

    let clue = clueData[currentObject];

    if (!clue) {
        return;
    }

    let saved = journalEntries.some(function (entry) {

        return entry.id === clue.id;

    });

    if (saved) {
        return;
    }

    journalEntries.push(clue);

    localStorage.setItem(
        "journalEntries",
        JSON.stringify(journalEntries)
    );

    let button = document.getElementById("saveClueButton");

    button.textContent = "Улика записана";
    button.disabled = true;

    currentJournalTab = clue.category;

    currentJournalPage = journalEntries.filter(function (entry) {

        return entry.category === clue.category;

    }).length - 1;

    renderJournal();
}

// Переключение разделов

function showJournalTab(category) {

    currentJournalTab = category;

    currentJournalPage = 0;

    renderJournal();
}

// Перелистывание страниц

function changeJournalPage(direction) {

    let entries = journalEntries.filter(function (entry) {

        return entry.category === currentJournalTab;

    });

    let nextPage = currentJournalPage + direction;

    if (nextPage >= 0 && nextPage < entries.length) {

        currentJournalPage = nextPage;

        renderJournal();

    }
}

// Отображение записей в дневнике

function renderJournal() {

    let container = document.getElementById("journalEntries");

    let pageNumber = document.getElementById("journalPageNumber");

    let entries = journalEntries.filter(function (entry) {

        return entry.category === currentJournalTab;

    });

    container.innerHTML = "";

    if (entries.length === 0) {

        currentJournalPage = 0;

        container.innerHTML = `
            <p class="empty-journal">
                Пока нет записей...
            </p>
        `;

        pageNumber.textContent = "1 / 1";

        return;
    }

    currentJournalPage = Math.max(
        0,
        Math.min(currentJournalPage, entries.length - 1)
    );

    let entry = entries[currentJournalPage];

    container.innerHTML = `

        <div class="journal-entry">

            <p class="journal-date">
                ${entry.date}
            </p>

            <h3>${entry.title}</h3>

            <img src="${entry.image}" alt="${entry.title}">

            <p>${entry.description}</p>

        </div>

    `;

    pageNumber.textContent =
        `${currentJournalPage + 1} / ${entries.length}`;
}

// Закрытие окон через Escape

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        let journal = document.getElementById("journalWindow");

        let object = document.getElementById("objectWindow");

        if (journal && !journal.hidden) {

            closeJournal();

        } else if (object && !object.hidden) {

            closeObject();

        }
    }
});

// Обновление расположения предметов

window.addEventListener("resize", function () {

    let scene = document.getElementById("inspectionScene");

    if (scene && !scene.hidden) {

        prepareObjects();

    }
});

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

        if (scene === "emptyReception") {
            showEmptyReception();
        }

        if (scene === "inspection") {
            showInspection();
        }
    }
});