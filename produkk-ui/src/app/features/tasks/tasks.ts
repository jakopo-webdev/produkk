import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TasksService } from '../../core/services/tasks.service';
import { AuthService } from '../../core/services/auth.service';
import { Task } from '../../core/models';
import { NavbarComponent } from '../../layout/navbar/navbar';

type FilterType = 'all' | 'to-do' | 'active' | 'completed';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  filter = signal<FilterType>('all');
  showModal = signal(false);
  editingTask = signal<Task | null>(null);
  savingTask = signal(false);
  deletingId = signal<number | null>(null);
  togglingId = signal<number | null>(null);
  // id of task with open status menu (null = closed)
  statusMenuId = signal<number | null>(null);
  // id of task currently being changed via status update
  statusChangingId = signal<number | null>(null);
  modalError = signal<string | null>(null);

  filteredTasks = computed(() => {
    const f = this.filter();
    const all = this.tasks();
    if (f === 'to-do') return all.filter((t) => t.status === 'to-do');
    if (f === 'active') return all.filter((t) => t.status === 'active');
    if (f === 'completed') return all.filter((t) => t.status === 'completed');
    return all;
  });

  totalCount = computed(() => this.tasks().length);
  todoCount = computed(() => this.tasks().filter((t) => t.status === 'to-do').length);
  activeCount = computed(() => this.tasks().filter((t) => t.status === 'active').length);
  completedCount = computed(() => this.tasks().filter((t) => t.status === 'completed').length);

  readonly filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'to-do', label: 'To-do' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  taskForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
  });

  ngOnInit() {
    if (this.auth.isLoggedIn() && !this.auth.currentUser()) {
      this.auth.getProfile().subscribe();
    }
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.tasksService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAddModal() {
    this.editingTask.set(null);
    this.taskForm.reset();
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.taskForm.setValue({ title: task.title, description: task.description ?? '' });
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTask.set(null);
    this.taskForm.reset();
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.savingTask.set(true);
    this.modalError.set(null);
    const { title, description } = this.taskForm.getRawValue();
    const editing = this.editingTask();
    const body = { title, description };
    const request$ = editing
      ? this.tasksService.update(editing.id, body)
      : this.tasksService.create(body);

    request$.subscribe({
      next: () => {
        this.loadTasks();
        this.closeModal();
        this.savingTask.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.savingTask.set(false);
        this.modalError.set(
          (err.error as { message?: string })?.message ?? 'Failed to save task. Please try again.',
        );
      },
    });
  }

  toggleComplete(task: Task) {
    this.togglingId.set(task.id);
    const newStatus = task.status === 'completed' ? 'to-do' : 'completed';
    this.tasksService.update(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.tasks.update((list) =>
          list.map((x) => (x.id === task.id ? { ...x, status: newStatus } : x)),
        );
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  openStatusMenu(taskId: number) {
    // toggle the menu for the given task
    this.statusMenuId.set(this.statusMenuId() === taskId ? null : taskId);
  }

  updateStatus(task: Task, newStatus: Task['status']) {
    if (task.status === newStatus) {
      this.statusMenuId.set(null);
      return;
    }
    this.statusChangingId.set(task.id);
    this.tasksService.update(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.tasks.update((list) => list.map((x) => (x.id === task.id ? { ...x, status: newStatus } : x)));
        this.statusChangingId.set(null);
        this.statusMenuId.set(null);
      },
      error: () => {
        this.statusChangingId.set(null);
        this.statusMenuId.set(null);
      },
    });
  }

  deleteTask(id: number) {
    this.deletingId.set(id);
    this.tasksService.delete(id).subscribe({
      next: () => {
        this.tasks.update((list) => list.filter((x) => x.id !== id));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  setFilter(f: FilterType) {
    this.filter.set(f);
  }

  filterTabClass(key: FilterType): string {
    return this.filter() === key
      ? 'bg-gray-700 text-white'
      : 'text-gray-400 hover:text-gray-200';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get titleCtrl() { return this.taskForm.controls.title; }

  // Called from template when clicking edit icon
  editTask(task: Task) {
    this.openEditModal(task);
  }

  // Confirm then delete
  confirmDelete(task: Task) {
    const confirmed = confirm(`Delete task "${task.title}"? This cannot be undone.`);
    if (!confirmed) return;
    this.deleteTask(task.id);
  }
}
