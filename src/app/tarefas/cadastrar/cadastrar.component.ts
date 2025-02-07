import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TarefaService, Tarefa } from '../shared';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarTarefaComponent implements OnInit {
  nome = new FormControl('', [Validators.required, Validators.minLength(5)]);

  @ViewChild('formTarefa') formTarefa!: NgForm;
  tarefa!: Tarefa;

  constructor(
    private tarefaService: TarefaService,
    private router: Router) {
      this.tarefa = new Tarefa();
    }

  ngOnInit(): void {}

  cadastrar(): void {
    if (this.formTarefa.form.valid) {
      this.tarefaService.cadastrar(this.tarefa).subscribe({
        next: () => this.router.navigate(['/listar']),
        error: error => console.error('Erro ao cadastrar tarefa', error)
      });
    }
  }
}
