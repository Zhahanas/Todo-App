// Database simulation pake localStorage
class TodoDB {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('id-ID')
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
    }
    
    toggleArchive() {
        const archive = document.getElementById("archiveSection");
        archive.classList.toggle("hidden");
        this.loadArchive();
    }


    getTasks() {
        return this.tasks;
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, progress };
    }
}

// UI Controller
class TodoUI {
    constructor() {
        this.db = new TodoDB();
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.statsElement = document.getElementById('stats');

        this.init();
    }

    init() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        this.loadTasks();
        this.updateStats();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text) {
            this.db.addTask(text);
            this.taskInput.value = '';
            this.loadTasks();
            this.updateStats();
        }
    }

loadTasks() {
    let tasks = this.db.getTasks();

    // --- FITUR BARU: Urutkan otomatis ---
    // Yang belum completed (false) naik ke atas
    tasks.sort((a, b) => a.completed - b.completed);
    // -------------------------------------

    if (tasks.length === 0) {
        this.emptyState.style.display = 'block';
        this.taskList.style.display = 'none';
        return;
    }

    this.emptyState.style.display = 'none';
    this.taskList.style.display = 'block';

    this.taskList.innerHTML = tasks.map(task => `
        <div class="task-item flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <div class="flex items-center flex-1">
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="todoUI.toggleTask(${task.id})"
                    class="mr-3 h-5 w-5 text-blue-500"
                >
                <span class="${task.completed ? 'task-completed text-gray-500' : 'text-gray-800'} flex-1">
                    ${task.text}
                </span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">${task.createdAt}</span>
                <button 
                    onclick="todoUI.deleteTask(${task.id})"
                    class="text-red-500 hover:text-red-700 ml-2"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

    toggleTask(id) {
        this.db.toggleTask(id);
        this.loadTasks();
        this.updateStats();
    }

    deleteTask(id) {
        if (confirm('Yakin mau hapus task ini, bro?')) {
            this.db.deleteTask(id);
            this.loadTasks();
            this.updateStats();
        }
    }

    updateStats() {
        const stats = this.db.getStats();
        this.statsElement.textContent = 
            `Total: ${stats.total} | Selesai: ${stats.completed} | Progress: ${stats.progress}%`;
    }
}

// Initialize app
const todoUI = new TodoUI();



