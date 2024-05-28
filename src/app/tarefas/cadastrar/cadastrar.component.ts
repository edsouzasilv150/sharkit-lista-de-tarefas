import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TarefaService, Tarefa } from '../shared';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarTarefaComponent implements OnInit {

  @ViewChild('formTarefa') formTarefa!: NgForm;
  tarefa: Tarefa = new Tarefa();

  constructor(
    private tarefaService: TarefaService,
    private router: Router) {}

  ngOnInit(): void {}

  cadastrar(): void {
    if (this.formTarefa.form.valid) {
      this.tarefaService.cadastrar(this.tarefa).subscribe({
        next: () => this.router.navigate(['/tarefas']),
        error: error => console.error('Erro ao cadastrar tarefa', error)
      });
    }
  }
}
