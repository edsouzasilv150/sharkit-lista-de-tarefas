import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TarefaService, Tarefa } from '../shared';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarTarefaComponent implements OnInit {

  @ViewChild('formTarefa') formTarefa!: NgForm;
  tarefa!: Tarefa;

  constructor(
    private tarefaService: TarefaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.tarefaService.buscarPorId(id).subscribe({
      next: tarefa => {
        if (tarefa) {
          this.tarefa = tarefa;
        } else {
          console.error('Tarefa não encontrada');
        }
      },
      error: error => console.error('Erro ao buscar tarefa', error)
    });
  }

  atualizar(): void {
    if (this.formTarefa.form.valid) {
      this.tarefaService.atualizar(this.tarefa).subscribe({
        next: () => this.router.navigate(['/tarefas']),
        error: error => console.error('Erro ao atualizar tarefa', error)
      });
    }
  }
}
