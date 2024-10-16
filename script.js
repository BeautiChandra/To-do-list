// Selectors
const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", modifyTask);

// Functions

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task.text, task.completed));
}

// Add new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a valid task!");
    return;
  }

  createTaskElement(taskText, false);
  saveTaskToLocalStorage(taskText, false);
  taskInput.value = "";
}

// Create a new task element in the DOM
function createTaskElement(taskText, isCompleted) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  if (isCompleted) taskItem.classList.add("completed");

  taskItem.innerHTML = `
        <div class="task">
            <input type="checkbox" ${isCompleted ? "checked" : ""}>
            <span>${taskText}</span>
        </div>
        <div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

  taskList.appendChild(taskItem);
}

// Modify task: Edit or Delete
function modifyTask(e) {
  if (e.target.classList.contains("delete-btn")) {
    deleteTask(e.target.parentElement.parentElement);
  } else if (e.target.classList.contains("edit-btn")) {
    editTask(e.target.parentElement.parentElement);
  } else if (e.target.type === "checkbox") {
    toggleTaskCompletion(e.target.parentElement.parentElement);
  }
}

// Save task to localStorage
function saveTaskToLocalStorage(taskText, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task from DOM and localStorage
function deleteTask(taskItem) {
  const taskText = taskItem.querySelector("span").innerText;
  taskItem.remove();
  removeTaskFromLocalStorage(taskText);
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Edit a task
function editTask(taskItem) {
  const taskText = taskItem.querySelector("span").innerText;
  const newTaskText = prompt("Edit your task", taskText);

  if (newTaskText && newTaskText.trim() !== "") {
    taskItem.querySelector("span").innerText = newTaskText;
    updateTaskInLocalStorage(taskText, newTaskText);
  }
}

// Update task in localStorage
function updateTaskInLocalStorage(oldTaskText, newTaskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.text === oldTaskText);
  tasks[taskIndex].text = newTaskText;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle task completion
function toggleTaskCompletion(taskItem) {
  taskItem.classList.toggle("completed");
  const taskText = taskItem.querySelector("span").innerText;
  updateTaskCompletionInLocalStorage(
    taskText,
    taskItem.classList.contains("completed")
  );
}

// Update task completion status in localStorage
function updateTaskCompletionInLocalStorage(taskText, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.text === taskText);
  tasks[taskIndex].completed = isCompleted;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
