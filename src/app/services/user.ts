import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

interface UserRegisterPayload {
    nome: string,
    email: string,
    senha: string,
    endereco?: [{
        rua: string,
        numero: string,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    }]
    telefone?: [{
        numero: string,
        ddd: string
    }]
}

export interface UserResponse {
    nome: string,
    email: string,
    endereco: {
        id: number,
        rua: string,
        numero: string,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    }[] | null
    telefone: {
        id: number,
        numero: string,
        ddd: string
    }[] | null
}

export interface userLoginPayload {
    email: string,
    senha: string,
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apirUrl = 'http://localhost:8083';

    private jwtHelper = new JwtHelperService;

    private _user = signal<UserResponse | null>(null);
    readonly user = this._user.asReadonly();

    constructor(private http: HttpClient, private authService: Auth) {
        const savedUser = authService.getUser();
        if (savedUser) {
            this.setUser(savedUser)
        }
    }

    register(body: UserRegisterPayload): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.apirUrl}/usuario`, body)
    }

    login(body: userLoginPayload): Observable<string> {
        return this.http.post<string>(`${this.apirUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
    }

    getUserByEmail(token: string): Observable<UserResponse> {
        const email = this.getEmailBytoken(token);

        if (!email) throw new Error('Token inválido');

        const headers = new HttpHeaders({ Authorization: `${token}` })

        return this.http.get<UserResponse>(`${this.apirUrl}/usuario?email=${email}`, { headers })
    }

    getEmailBytoken(token: string): string | null {
        try {
            const decoded = this.jwtHelper.decodeToken(token)
            return decoded?.sub || null
        } catch (error) {
            return null
        }
    }

    saveEndereco(body: { rua: string, numero: string, complemento: string, cidade: string, estado: string, cep: string }, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `${token}` })

        return this.http.post<UserResponse>(`${this.apirUrl}/usuario/endereco`, body, { headers }).pipe(
            switchMap(() => this.getUserByEmail(token)),
            tap(user => {
                this.setUser(user)
                this.authService.saveUser(user)
            })
        )
    }

    updateEndereco(id: number, body: { rua: string, numero: string, complemento: string, cidade: string, estado: string, cep: string }, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `${token}` })

        return this.http.put<UserResponse>(`${this.apirUrl}/usuario/endereco?id=${id}`, body, { headers }).pipe(
            switchMap(() => this.getUserByEmail(token)),
            tap(user => {
                this.setUser(user)
                this.authService.saveUser(user)
            })
        )
    }

    saveTelefone(body: { numero: string, ddd: string }, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `${token}` })

        return this.http.post<UserResponse>(`${this.apirUrl}/usuario?telefone`, body, { headers }).pipe(
            switchMap(() => this.getUserByEmail(token)),
            tap(user => {
                this.setUser(user)
                this.authService.saveUser(user)
            })
        )
    }

    updateTelefone(id: number, body: { numero: string, ddd: string }, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `${token}` })

        return this.http.put<UserResponse>(`${this.apirUrl}/usuario?telefone?id=${id}`, body, { headers }).pipe(
            switchMap(() => this.getUserByEmail(token)),
            tap(user => {
                this.setUser(user)
                this.authService.saveUser(user)
            })
        )
    }

    getCep(cep: string): Observable<any> {
        return this.http.get<any>(`${this.apirUrl}/usuario/endereco/${cep}`)
    }

    getUser(): UserResponse | null {
        return this._user()
    }

    setUser(data: UserResponse | null): void {
        this._user.set(data);
    }
}
