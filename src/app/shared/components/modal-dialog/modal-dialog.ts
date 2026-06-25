import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogFields {
  nome: string;
  label: string;
  value?: string;
  button?: {icon: string, callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void}
  validators?: any[]
}

interface DialogData {
  title: string,
  formConfig: DialogFields[]
}

@Component({
  selector: 'app-modal-dialog',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatDialogActions, MatDialogTitle, ReactiveFormsModule, MatIconModule],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
})
export class ModalDialog {
  readonly formBuilder = inject(FormBuilder)
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  fields: DialogFields[] = this.data.formConfig;

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {}
    this.fields.forEach(field => {
      controls[field.nome] = [field.value ?? '', field.validators || []]
    })
    return controls;
  }

  form: FormGroup = this.formBuilder.group(this.buildControls())

  onSave() {
    this.dialogRef.close(this.form.value)
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
