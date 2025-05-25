// DOM elements - cache for better performance
const taskInput = document.querySelector('#newtask input');
const addButton = document.querySelector('#push');
const tasksContainer = document.querySelector('#tasks');

// Event delegation for task actions
tasksContainer.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle delete button clicks (including the icon inside the button)
    if (target.classList.contains('delete') || target.closest('.delete')) {
        const taskElement = target.closest('.task');
        if (taskElement) {
            taskElement.remove();
            saveTasksToLocalStorage();
        }
    } 
    // Handle task completion toggles (only when clicking on the task text)
    else if (target.id === 'taskname' || target.closest('#taskname')) {
        const taskElement = target.closest('.task');
        if (taskElement) {
            taskElement.classList.toggle('completed');
            saveTasksToLocalStorage();
        }
    }
});

// Add task function
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText.length === 0) {
        alert("Please Enter a Task");
        return;
    }
    
    // Create new task element
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    
    // Add task content
    taskElement.innerHTML = `
        <span id="taskname">
            ${escapeHTML(taskText)}
        </span>
        <button class="delete">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    // Add to DOM
    tasksContainer.appendChild(taskElement);
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Save to local storage
    saveTasksToLocalStorage();
}

// Prevent XSS attacks by escaping HTML
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Local storage functions
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(taskElement => {
        tasks.push({
            text: taskElement.querySelector('#taskname').textContent.trim(),
            completed: taskElement.classList.contains('completed')
        });
    });
    
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            
            taskElement.innerHTML = `
                <span id="taskname">
                    ${escapeHTML(task.text)}
                </span>
                <button class="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            
            tasksContainer.appendChild(taskElement);
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);