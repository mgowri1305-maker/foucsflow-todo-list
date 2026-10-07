/* =========================
   VARIABLES
========================= */

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

const clearCompleted =
    document.getElementById("clearCompleted");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const filters =
    document.querySelectorAll(".filter");


let tasks = JSON.parse(
    localStorage.getItem("focusFlowTasks")
) || [];

let currentFilter = "all";


/* =========================
   DATE
========================= */

const today = new Date();

document.getElementById("date").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "focusFlowTasks",
        JSON.stringify(tasks)
    );
}


/* =========================
   ADD TASK
========================= */

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        taskInput.focus();

        return;
    }

    const newTask = {

        id: Date.now(),

        text: text,

        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    taskInput.focus();

    renderTasks();
}


/* =========================
   DISPLAY TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);
    }


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {

            li.classList.add("completed");
        }


        /* Checkbox */

        const check = document.createElement("div");

        check.className = "check";

        check.addEventListener("click", () => {

            toggleTask(task.id);

        });


        /* Text */

        const text = document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        /* Delete Button */

        const deleteBtn =
            document.createElement("button");

        deleteBtn.className = "delete-btn";

        deleteBtn.innerHTML = "×";

        deleteBtn.title = "Delete task";

        deleteBtn.addEventListener("click", () => {

            deleteTask(task.id);

        });


        li.appendChild(check);

        li.appendChild(text);

        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });


    updateStats();
}


/* =========================
   COMPLETE TASK
========================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;

    });

    saveTasks();

    renderTasks();
}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


/* =========================
   STATISTICS
========================= */

function updateStats() {

    const remaining =
        tasks.filter(task => !task.completed).length;

    const completed =
        tasks.filter(task => task.completed).length;

    const total = tasks.length;


    taskCount.textContent = remaining;


    let progress = 0;

    if (total > 0) {

        progress =
            Math.round((completed / total) * 100);
    }


    progressFill.style.width =
        progress + "%";

    progressText.textContent =
        progress + "%";
}


/* =========================
   CLEAR COMPLETED
========================= */

clearCompleted.addEventListener("click", () => {

    tasks =
        tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();
});


/* =========================
   FILTERS
========================= */

filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });
});


/* =========================
   ADD BUTTON
========================= */

addBtn.addEventListener("click", addTask);


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addTask();
    }
});


/* =========================
   FIRST LOAD
========================= */

renderTasks();