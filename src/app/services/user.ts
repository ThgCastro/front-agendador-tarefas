import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface UserRegisterPayload {
    nome: string;
    email: string;
    senha: string;
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

interface UserRegisterResponse {
    nome: string;
    email: string;
    endereco: [{
        rua: string,
        numero: string,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    }] | null;
    telefone: [{
        numero: string,
        ddd: string
    }] | null;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apirUrl = 'http://localhost:8083';

    constructor(private http: HttpClient) { }

    register(body: UserRegisterPayload): Observable<UserRegisterResponse> {
        return this.http.post<UserRegisterResponse>(`${this.apirUrl}/usuario`, body)
    }
}
