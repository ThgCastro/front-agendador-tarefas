import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { UserService } from '../../services/user';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormField, MatInputModule, ReactiveFormsModule, MatListModule, MatIconModule, MatTooltipModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {
  private authService = inject(Auth);
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  readonly dialog = inject(MatDialog);

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }]
  });

  addEndereco() {
    const formConfig: DialogFields[] = [
      {
        nome: 'cep', label: 'CEP',
        button: {
          icon: 'search',
          callback: (cep: string) => this.findEnderecoByCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { nome: 'logradouro', label: 'Logradouro' },
      { nome: 'numero', label: 'Nº' },
      { nome: 'complemento', label: 'Complemento' },
      { nome: 'cidade', label: 'Cidade' },
      { nome: 'estado', label: 'Estado' },
    ]

    const token = this.authService.getToken()
    if (!token) return

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço', formConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => console.log('Endereço cadastrado', result),
          error: () => console.log('Erro ao cadastrar endereço', result)
        })
      }
    });
  }

  editEndereco(endereco: { id: number, rua: string, numero: string, complemento: string, cidade: string, estado: string, cep: string }) {
    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogFields[] = [
      {
        nome: 'cep', label: 'CEP', value: endereco.cep,
        button: {
          icon: 'search',
          callback: (cep: string) => this.findEnderecoByCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { nome: 'logradouro', label: 'Logradouro', value: endereco.rua },
      { nome: 'numero', label: 'Nº', value: endereco.numero },
      { nome: 'complemento', label: 'Complemento', value: endereco.complemento },
      { nome: 'cidade', label: 'Cidade', value: endereco.cidade },
      { nome: 'estado', label: 'Estado', value: endereco.estado },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço', formConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => console.log('Endereço cadastrado', result),
          error: () => console.log('Erro ao cadastrar endereço', result)
        })
      }
    });
  }

  addTelefone() {
    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogFields[] = [
      { nome: 'ddd', label: 'DDD', validators: [Validators.required] },
      { nome: 'numero', label: 'Número', validators: [Validators.required] }
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Telefone', formConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveTelefone(result, token).subscribe({
          next: () => console.log('Telefone cadastrado', result),
          error: () => console.log('Erro ao cadastrar telefone', result)
        })
      }
    });
  }

  editTelefone(telefone: { id: number, ddd: string; numero: string }) {
    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogFields[] = [
      { nome: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { nome: 'numero', label: 'Número', value: telefone.numero, validators: [Validators.required] }
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Telefone', formConfig }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateTelefone(telefone.id, result, token).subscribe({
          next: () => console.log('Telefone editado com sucesso', result),
          error: () => console.log('Erro ao editar telefone', result)
        })
      }
    });
  }

  findEnderecoByCep(cep: string, dialogRef: MatDialogRef<ModalDialog, any>) {
    this.userService.getCep(cep).subscribe({
      next: (response) => {
          dialogRef.componentInstance.form.patchValue({
            rua: response.logradouro,
            estado: response.uf,
            cidade: response.localidade
          });
      },
      error: () => console.warn('CEP não encontrado')
    })
  }

}
