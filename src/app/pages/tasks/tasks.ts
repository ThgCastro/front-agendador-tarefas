import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksPayLoad, Taskss } from '../../services/taskss';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ConfirmModalDialog } from '../../shared/components/confirm-modal-dialog/confirm-modal-dialog';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatFormFieldModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})

export class Tasks {

  private tasksService = inject(Taskss);
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);

  tasks = this.tasksService.tasks;
  hasTasks = () => (this.tasks() ?? []).length > 0;

  normalizeDataEvento(dataEvento: string) {
    const [data, tempo] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-').map(Number);
    const [hora, minuto] = tempo.split(':').map(Number);

    const formattedData = new Date(ano, mes - 1, dia, hora, minuto);
    const formattedTempo = new Date(ano, mes - 1, dia, hora, minuto);

    return { formattedData, formattedTempo }
  }

  normalizeDataEventoExhibition(dataEvento: string) {
    const [data, tempo] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-');
    const [hora, minuto] = tempo.split(':');

    const dataString = `${dia}/${mes}/${ano}`;
    const tempoString = `${hora}:${minuto}`;

    return { dataString, tempoString }
  }

  addTarefa() {
    const formConfig: DialogFields[] = [
      { nome: 'nomeTarefa', label: 'Nome da tarefa' },
      { nome: 'data', label: 'Data da tarefa', type: 'date' },
      { nome: 'tempo', label: 'Horário da tarefa', type: 'time' },
      { nome: 'descricao', label: 'Descreva a tarefa' }
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0")

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinute());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`

        const payLoad = {
          ...resto,
          dataEvento
        }

        this.tasksService.createTask(payLoad).subscribe({
          next: () => console.log('Tarefa cadastrada', payLoad),
          error: () => console.log('Erro ao cadastrar tarefa', payLoad)
        })
      }
    });
  }

  editTarefa(tarefa: TasksPayLoad) {

    const eventData = this.normalizeDataEvento(tarefa.dataEvento)

    const formConfig: DialogFields[] = [
      { nome: 'nomeTarefa', label: 'Nome da tarefa', value: tarefa.nomeTarefa },
      { nome: 'data', label: 'Data da tarefa', type: 'date', value: eventData.formattedData },
      { nome: 'tempo', label: 'Horário da tarefa', type: 'time', value: eventData.formattedTempo },
      { nome: 'descricao', label: 'Descreva a tarefa', value: tarefa.descricao }
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0")

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinute());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`

        const payLoad = {
          ...resto,
          dataEvento
        }

        this.tasksService.editTask(tarefa.id, payLoad).subscribe({
          next: () => console.log('Tarefa editada com sucesso', payLoad),
          error: () => console.log('Erro ao editar tarefa', payLoad)
        })
      }
    });
  }

  deleteTarefa(tarefa: string) {
    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      data: {
        title: 'Confirmar exclusão',
        message: 'Você realmente que excluir esta tarefa?',
        confirmButton: 'Deletar',
        cancelButton: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.deleteTask(tarefa).subscribe({
          next: () => console.log('Tarefa excluida com sucesso'),
          error: () => console.log('Erro ao excluir tarefa')
        })
      }
    });
  }
}
