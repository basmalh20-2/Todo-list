document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    /* ================== Local Storage ================== */
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    /* ================== Confetti ================== */
    const Confetti = () => {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            })
        );
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    /* ================== Empty State ================== */
    const toggleEmptyState = () => {
        emptyImage.style.display =
        taskList.children.length === 0 ? 'block' : 'none';
    };

    /* ================== Create Task Element ================== */
    const createTaskElement = (taskObj) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        checkbox.checked = taskObj.completed;

        checkbox.addEventListener('change', () => {
        taskObj.completed = checkbox.checked;
        saveTasks();
        updateProgress();
        });

        const span = document.createElement('span');
        span.textContent = taskObj.text;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.addEventListener('click', () => {
        const newText = prompt("Edit your task:", span.textContent);
        if (newText && newText.trim() !== "") {
            taskObj.text = newText.trim();
            span.textContent = taskObj.text;
            saveTasks();
        }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => task !== taskObj);
        li.remove();
        saveTasks();
        toggleEmptyState();
        updateProgress();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    };

    /* ================== Add Task ================== */
    const addTask = (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const taskObj = {
        text: taskText,
        completed: false
        };

        tasks.push(taskObj);
        saveTasks();

        createTaskElement(taskObj);

        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
    };

    /* ================== Progress ================== */
    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks =
        taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks
        ? `${(completedTasks / totalTasks) * 100}%`
        : '0%';

        progressNumbers.textContent =
        `${completedTasks} / ${totalTasks}`;

        if (
        checkCompletion &&
        totalTasks > 0 &&
        completedTasks === totalTasks
        ) {
        Confetti();
        }
    };

    /* ================== Events ================== */
    taskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(e);
    });

    /* ================== Load Tasks ================== */
    tasks.forEach(task => createTaskElement(task));
    toggleEmptyState();
    updateProgress(false);

    });
