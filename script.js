const questionForm = document.getElementById("questionForm");

const questionName = document.getElementById("questionName");
const difficulty = document.getElementById("difficulty");
const topic = document.getElementById("topic");
const revisionDate = document.getElementById("revisionDate");
const topicFilter = document.getElementById("topicFilter");
const difficultyFilter = document.getElementById("difficultyFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");

const totalCount = document.getElementById("total");
const solvedCount = document.getElementById("solved");
const pendingCount = document.getElementById("pending");
const streakCount = document.getElementById("streakCount");
const revisionStatus = document.getElementById("revisionStatus");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let questions = JSON.parse(localStorage.getItem("leetcodeQuestions")) || [];
let editingQuestion = null;

questionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = {
        name: questionName.value.trim(),
        difficulty: difficulty.value,
        topic: topic.value.trim(),
        revisionDate:revisionDate.value,
        solved: false
    };

    if (editingQuestion !== null) {
    editingQuestion.name = question.name;
    editingQuestion.difficulty = question.difficulty;
    editingQuestion.topic = question.topic;
    editingQuestion.revisionDate = question.revisionDate;
    editingQuestion = null;
} else {
    questions.push(question);
}
    updateTopicFilter();
    saveQuestions();

    displayQuestions();

    questionForm.reset();
    editingQuestion = null;
});

function updateDashboard() {
    totalCount.textContent = questions.length;

    const solved = questions.filter(function (question) {
        return question.solved;
    }).length;

    solvedCount.textContent = solved;
    pendingCount.textContent = questions.length - solved;
    const progress = questions.length === 0
    ? 0
    : Math.round((solved / questions.length) * 100);

progressText.textContent = progress + "% Completed";
progressFill.style.width = progress + "%";
}
function updateTopicProgress() {
    const topicProgress = document.getElementById("topicProgress");

    const topicData = {};

    questions.forEach(function (question) {
        const topicName = question.topic || "Other";

        if (!topicData[topicName]) {
            topicData[topicName] = {
                total: 0,
                solved: 0
            };
        }

        topicData[topicName].total++;

        if (question.solved) {
            topicData[topicName].solved++;
        }
    });

    topicProgress.innerHTML = "";

    Object.keys(topicData).forEach(function (topicName) {
        const data = topicData[topicName];

        const percentage = Math.round(
            (data.solved / data.total) * 100
        );

        const topicItem = document.createElement("p");

        topicItem.textContent =
            topicName + ": " +
            data.solved + "/" +
            data.total +
            " solved (" +
            percentage +
            "%)";

        topicProgress.appendChild(topicItem);
    });
}
function updateDifficultyProgress() {
    const difficultyProgress = document.getElementById("difficultyProgress");

    const difficultyData = {
        Easy: { total: 0, solved: 0 },
        Medium: { total: 0, solved: 0 },
        Hard: { total: 0, solved: 0 }
    };

    questions.forEach(function (question) {
        if (difficultyData[question.difficulty]) {
            difficultyData[question.difficulty].total++;

            if (question.solved) {
                difficultyData[question.difficulty].solved++;
            }
        }
    });

    difficultyProgress.innerHTML = "";

    Object.keys(difficultyData).forEach(function (level) {
        const data = difficultyData[level];

        if (data.total === 0) {
            return;
        }

        const percentage = Math.round(
            (data.solved / data.total) * 100
        );

        const difficultyItem = document.createElement("p");

        difficultyItem.textContent =
            level + ": " +
            data.solved + "/" +
            data.total +
            " solved (" +
            percentage +
            "%)";

        difficultyProgress.appendChild(difficultyItem);
    });
}
function updateAchievements() {
    const achievements = document.getElementById("achievements");

    const solvedCountValue = questions.filter(function (question) {
        return question.solved;
    }).length;

    achievements.innerHTML = "";

    if (solvedCountValue >= 5) {
        const achievement = document.createElement("p");
        achievement.textContent = "🎯 5 Questions Solved";
        achievements.appendChild(achievement);
    }

    if (solvedCountValue >= 10) {
        const achievement = document.createElement("p");
        achievement.textContent = "🔥 10 Questions Solved";
        achievements.appendChild(achievement);
    }

    if (solvedCountValue >= 25) {
        const achievement = document.createElement("p");
        achievement.textContent = "🏆 25 Questions Solved";
        achievements.appendChild(achievement);
    }

    if (achievements.children.length === 0) {
    const achievement = document.createElement("p");
    achievement.textContent = "🚀 Solve 5 questions to unlock your first achievement!";
    achievements.appendChild(achievement);
}
}
function updateTopicFilter() {
    const currentTopic = topicFilter.value;

    const topics = [...new Set(
        questions.map(function (question) {
            return question.topic;
        })
    )];

    topicFilter.innerHTML = '<option value="all">All Topics</option>';

    topics.forEach(function (topicName) {
        const option = document.createElement("option");
        option.value = topicName;
        option.textContent = topicName;
        topicFilter.appendChild(option);
    });

    if (topics.includes(currentTopic)) {
        topicFilter.value = currentTopic;
    }
}
function applyFilters() {
    const selectedTopic = topicFilter.value;
    const selectedDifficulty = difficultyFilter.value;
    const selectedStatus = statusFilter.value;
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredQuestions = questions.filter(function (question) {
        const topicMatch =
            selectedTopic === "all" || question.topic === selectedTopic;

        const difficultyMatch =
            selectedDifficulty === "all" ||
            question.difficulty === selectedDifficulty;

        const statusMatch =
    selectedStatus === "all" ||
    (selectedStatus === "solved" && question.solved) ||
    (selectedStatus === "pending" && !question.solved);

const searchMatch = question.name
    .toLowerCase()
    .includes(searchText);

return topicMatch && difficultyMatch && statusMatch && searchMatch;
    });

    displayQuestions(filteredQuestions);
}
topicFilter.addEventListener("change", applyFilters);
difficultyFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);
function displayQuestions(list = questions) {
    const questionList = document.getElementById("questionList");
    questionList.innerHTML = "";

    list.forEach(function (question) {
        const item = document.createElement("div");
        item.className = "question-item";

        const title = document.createElement("h3");
        title.textContent = question.name;

        const details = document.createElement("p");
        details.textContent =
            "Topic: " + question.topic +
            " | Difficulty: " + question.difficulty;

        item.appendChild(title);
item.appendChild(details);
if (question.revisionDate) {
    const revision = document.createElement("p");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const revisionDate = new Date(question.revisionDate);
    revisionDate.setHours(0, 0, 0, 0);

    if (revisionDate.getTime() === today.getTime()) {
        revision.classList.add("due-today");
        } else if (revisionDate < today) {
    revision.textContent = "🔴 Revision Overdue";
    revision.classList.add("overdue");
} else {
    revision.textContent = "🟡 Next Revision: " + question.revisionDate;
    revision.classList.add("upcoming");
}

    item.appendChild(revision);
}

const status = document.createElement("p");
status.textContent = question.solved
    ? "Status: Solved"
    : "Status: Pending";
item.appendChild(status);

const solveButton = document.createElement("button");
solveButton.textContent = question.solved
    ? "Mark as Pending"
    : "Mark as Solved";

solveButton.addEventListener("click", function () {
    question.solved = !question.solved;
    if (question.solved) {
    const today = new Date().toDateString();
    let practiceDates = JSON.parse(localStorage.getItem("practiceDates")) || [];

    if (!practiceDates.includes(today)) {
        practiceDates.push(today);
        localStorage.setItem("practiceDates", JSON.stringify(practiceDates));
    }

    updateStreak();
}
    saveQuestions();
    updateDashboard();
    displayQuestions();
});
item.appendChild(solveButton);
const revisedButton = document.createElement("button");
revisedButton.textContent = "Mark as Revised";

revisedButton.addEventListener("click", function () {
    const nextRevision = new Date();
nextRevision.setDate(nextRevision.getDate() + 3);
question.revisionDate = nextRevision.toISOString().split("T")[0];
    saveQuestions();
    updateRevisionStatus();
    displayQuestions();
});

item.appendChild(revisedButton);
const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function () {
    editingQuestion = question;

    questionName.value = question.name;
    difficulty.value = question.difficulty;
    topic.value = question.topic;
    revisionDate.value = question.revisionDate || "";

    questionName.focus();
});
item.appendChild(editButton);
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", function () {
    const index = questions.indexOf(question);
    questions.splice(index, 1);

    saveQuestions();
    updateDashboard();
    updateRevisionStatus();
    displayQuestions();
});

item.appendChild(deleteButton);
questionList.appendChild(item);
    });
}
function saveQuestions() {
    localStorage.setItem(
        "leetcodeQuestions",
        JSON.stringify(questions)
    );
}
updateDashboard();
updateTopicFilter();
displayQuestions();
function updateStreak() {
    let practiceDates = JSON.parse(localStorage.getItem("practiceDates")) || [];

    let streak = 0;
    const dates = new Set(practiceDates);

    for (let i = 0; ; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        if (dates.has(date.toDateString())) {
            streak++;
        } else {
            break;
        }
    }

    streakCount.textContent =
        streak + (streak === 1 ? " Day" : " Days");
}
function updateRevisionStatus() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dueToday = 0;
    let overdue = 0;
    let upcoming = 0;

    questions.forEach(function (question) {
        if (!question.revisionDate) {
            return;
        }

        const revisionDate = new Date(question.revisionDate);
        revisionDate.setHours(0, 0, 0, 0);

        if (revisionDate.getTime() === today.getTime()) {
            dueToday++;
        } else if (revisionDate < today) {
            overdue++;
        } else {
            upcoming++;
        }
    });

    revisionStatus.textContent =
        "Today: " + dueToday +
        " | Overdue: " + overdue +
        " | Upcoming: " + upcoming;
}
updateRevisionStatus();
updateStreak();
updateTopicProgress();
updateDifficultyProgress();
updateAchievements();