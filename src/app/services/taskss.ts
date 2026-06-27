import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { Observable, tap } from 'rxjs';

interface TasksResponse {
    id: string,
    nomeTarefa: string,
    descricao: string,
    dataCriacao: string,
    dataEvento: string,
    emailUsuario: string,
    dataAlteracao: string,
    statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}
export interface TasksPayLoad {
    id?: string,
    nomeTarefa: string,
    descricao: string,
    dataEvento: string
}

@Injectable({
    providedIn: 'root'
})
export class Taskss {

    private apirUrl = 'http://localhost:8083';
    private _tasks = signal<TasksResponse[] | null>(null);
    readonly tasks = this._tasks.asReadonly();

    constructor(private http: HttpClient, private authService: Auth) {
        this.loadTasks()
    }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `${token}` })
    }

    loadTasks(): void {
        this.http.get<TasksResponse[]>(`${this.apirUrl}/tarefas`, { headers: this.getHeaders() })
            .subscribe({
                next: tasks => this._tasks.set(tasks),
                error: () => this._tasks.set([])
            })
    }

    createTask(body: TasksPayLoad): Observable<TasksResponse> {
        return this.http.post<TasksResponse>(`${this.apirUrl}/tarefas`, body, { headers: this.getHeaders() })
        .pipe(
            tap(() => this.loadTasks())
        )
    }

    editTask(id: string | undefined, body: TasksPayLoad): Observable<TasksResponse> {
        return this.http.put<TasksResponse>(`${this.apirUrl}/tarefas?id=${id}`, body, { headers: this.getHeaders() })
        .pipe(
            tap(() => this.loadTasks())
        )
    }

    deleteTask(id: string): Observable<TasksResponse> {
        return this.http.delete<TasksResponse>(`${this.apirUrl}/tarefas?id=${id}`, { headers: this.getHeaders() })
        .pipe(
            tap(() => this.loadTasks())
        )
    }
}
