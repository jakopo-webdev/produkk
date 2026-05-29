import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Task[]>('/tasks');
  }

  create(body: { title: string; description?: string; status?: Task['status'] }) {
    return this.http.post<Task>('/tasks', body);
  }

  update(id: number, body: Partial<Pick<Task, 'title' | 'description' | 'status'>>) {
    return this.http.put<Task>(`/tasks/${id}`, body);
  }

  delete(id: number) {
    return this.http.delete(`/tasks/${id}`);
  }
}
