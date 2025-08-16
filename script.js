class TodoApp {
  constructor() {
    this.tasks = this.loadTasks();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Add task events
    addBtn.addEventListener('click', () => this.addTask());
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    // Filter events
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });
  }

  addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (!taskText) return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.render();
    taskInput.value = '';
    taskInput.focus();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(t => !t.completed);
      case 'completed':
        return this.tasks.filter(t => t.completed);
      default:
        return this.tasks;
    }
  }

  render() {
    const container = document.getElementById('tasksContainer');
    const stats = document.getElementById('stats');
    const filteredTasks = this.getFilteredTasks();

    // Update stats
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    stats.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''} total • ${activeTasks} active • ${completedTasks} completed`;

    // Render tasks
    if (filteredTasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>${this.getEmptyStateTitle()}</h3>
          <p>${this.getEmptyStateMessage()}</p>
        </div>
      `;
    } else {
      container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
          <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
               onclick="todoApp.toggleTask(${task.id})">
          </div>
          <div class="task-text">${this.escapeHtml(task.text)}</div>
          <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
            ×
          </button>
        </div>
      `).join('');
    }
  }

  getEmptyStateTitle() {
    switch (this.currentFilter) {
      case 'active':
        return 'All done!';
      case 'completed':
        return 'No completed tasks';
      default:
        return 'No tasks yet';
    }
  }

  getEmptyStateMessage() {
    switch (this.currentFilter) {
      case 'active':
        return 'You\'ve completed all your tasks. Great job!';
      case 'completed':
        return 'Complete some tasks to see them here.';
      default:
        return 'Add a task above to get started!';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadTasks() {
    try {
      const tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }
}

// Initialize the app
const todoApp = new TodoApp();
