import { Component, ViewEncapsulation } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule ,FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None
})
export class Register {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder){
    this.form = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get passwordControl(): FormControl{
    return this.form.get('password') as FormControl;
  }

  get fullNameErrors(): string | null {
    const fullNameControl = this.form.get('fullName');
    if(fullNameControl?.hasError('required')) return 'O nome completo é obrigatório';
    if(fullNameControl?.hasError('minlength')) return 'Cadastre um nome com mais de 3 letras';
    return null
  }

  get emailErros(): string | null {
    const emailControl = this.form.get('email');
    if(emailControl?.hasError('required')) return 'O e-mail é obrigatório';
    if(emailControl?.hasError('email')) return 'E-mail inválido';
    return null
  }

  submit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return
    }
    console.log("formulário preenchido!" ,this.form.value)
  }
}
