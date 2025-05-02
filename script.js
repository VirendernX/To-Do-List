const addButton = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearAllButton = document.getElementById('clear-all-btn');

// Load tasks from localStorage when the page loads
window.addEventListener('load', loadTasks);

// Add task function
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = document.createElement('li');
    newTask.innerHTML = `
      <input type="checkbox">
      <span class="task-text">${taskText}</span>
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="delete-btn">🗑️</button>
    `;
    taskList.appendChild(newTask);

    // Clear input field
    taskInput.value = "";

    // Add event listeners to buttons
    addTaskEventListeners(newTask);
    saveTasks(); // Save tasks to localStorage
  }
}

// Add event listeners for edit and delete buttons
function addTaskEventListeners(taskItem) {
  const deleteButton = taskItem.querySelector('.delete-btn');
  const editButton = taskItem.querySelector('.edit-btn');

  // Delete task
  deleteButton.addEventListener('click', function() {
    taskList.removeChild(taskItem);
    saveTasks();
  });

  // Edit task
  editButton.addEventListener('click', function() {
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.innerText;

    taskText.innerHTML = `<input type="text" value="${currentText}" class="edit-input">`;

    // Change edit button to save
    editButton.innerHTML = 'Save';
    editButton.setAttribute('class', 'save-btn'); 

    // Save edited task
    editButton.addEventListener('click', function saveTask() {
      const newTaskText = taskItem.querySelector('.edit-input').value;
      taskText.innerText = newTaskText;

      editButton.innerHTML = `<i class="fas fa-edit"></i>`;
      editButton.setAttribute('class', 'edit-btn');
      
      saveTasks();
    });
  });
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task-list li').forEach(taskItem => {
    const taskText = taskItem.querySelector('.task-text').innerText;
    const isChecked = taskItem.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text: taskText, checked: isChecked });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    savedTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
        <input type="checkbox" ${task.checked ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="edit-btn"><i class="fas fa-edit"></i></button>
        <button class="delete-btn">🗑️</button>
      `;
      taskList.appendChild(taskItem);

      // Add event listeners for edit and delete buttons
      addTaskEventListeners(taskItem);
    });
  }
}

// Clear all tasks
clearAllButton.addEventListener('click', function() {
  taskList.innerHTML = '';
  saveTasks();
});

// Add task when the button is clicked or enter is pressed
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});
