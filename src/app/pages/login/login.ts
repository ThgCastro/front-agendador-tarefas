import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { userLoginPayload, UserService } from '../../services/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  form: FormGroup<{email: FormControl<string>, senha: FormControl<string>}>;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private authService: Auth) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control ('', {validators: [Validators.required, Validators.email], nonNullable: true}),
      senha: this.formBuilder.control ('', {validators: [Validators.required, Validators.minLength(6)], nonNullable: true})
    });
  }

  ngOnInit(): void{
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'])
    }
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  get emailErros(): string | null {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) return 'Digite seu e-mail para fazer login';
    if (emailControl?.hasError('email')) return 'E-mail inválido';
    return null
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value as userLoginPayload;

    this.isLoading = true;

    this.userService.login(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response)
          this.router.navigate(['/tasks'])
        },
        error: (e) => {
          console.error(`Erro ao fazer login`, e)
        }
      })
  } 
}
