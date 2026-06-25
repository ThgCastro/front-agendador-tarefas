import { Component, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormField, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  user = this.userService.getUser();

  form = this.formBuilder.group({
    nome: [{ value: this.user?.nome || '', disabled: true }],
    email: [{ value: this.user?.email || '', disabled: true }]
  });

}
