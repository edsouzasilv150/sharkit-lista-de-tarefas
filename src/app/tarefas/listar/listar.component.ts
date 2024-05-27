import { Component, OnInit } from '@angular/core';

import { Tarefa } from '../shared/tarefa.model';
import { TarefaService } from '../shared';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarTarefaComponent implements OnInit {
  tarefas: Tarefa[] | undefined;

  constructor(private tarefaService: TarefaService) {}

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.tarefaService.listarTodos().subscribe({
      next: tarefas => this.tarefas = tarefas,
      error: error => console.error('Erro ao listar tarefas', error),
      complete: () => console.log('Lista completa')
    });
  }

  remover($event: any, tarefa: Tarefa): void {
    $event.preventDefault();
    if (confirm(`Deseja remover a tarefa? ${tarefa.nome}?`)) {
      if (tarefa.id !== undefined) {  // Verifique se tarefa.id não é undefined
        this.tarefaService.remover(tarefa.id).subscribe({
          next: () => this.listarTodos(),
          error: error => console.error('Erro ao remover tarefa', error),
          complete: () => console.log('Remoção completa')
        });
      } else {
        console.error('ID da tarefa é undefined');
      }
    }
  }

  alterarStatus(tarefa: Tarefa): void {
    if (confirm('Deseja alterar o status da tarefa "' + tarefa.nome + '"?')) {
      if (tarefa.id !== undefined) {  // Verifique se tarefa.id não é undefined
        this.tarefaService.remover(tarefa.id).subscribe({
          next: () => this.listarTodos(),
          error: error => console.error('Erro ao alterar status da tarefa', error),
          complete: () => console.log('Remoção completa')
        });
      } else {
        console.error('ID da tarefa é undefined');
      }
    }
  }
}
