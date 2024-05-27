import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Tarefa } from './tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor() { }

  listarTodos(): Observable<Tarefa[]> {
    return of(localStorage['tarefas']).pipe(
      map(tarefas => tarefas ? JSON.parse(tarefas) : []),
      catchError(() => of([]))
    );
  }

  cadastrar(tarefa: Tarefa): Observable<Tarefa[]> {
    return this.listarTodos().pipe(
      map(tarefas => {
        tarefa.id = new Date().getTime();
        tarefas.push(tarefa);
        localStorage['tarefas'] = JSON.stringify(tarefas);
        return tarefas;
      })
    );
  }

  buscarPorId(id: number): Observable<Tarefa | undefined> {
    return this.listarTodos().pipe(
      map(tarefas => tarefas.find(tarefa => tarefa.id === id)),
      catchError(() => of(undefined))
    );
  }

  atualizar(tarefa: Tarefa): Observable<Tarefa[]> {
    return this.listarTodos().pipe(
      map(tarefas => {
        tarefas.forEach((obj, index, objs) => {
          if(tarefa.id === obj.id) {
            objs[index] = tarefa;
          }
        });
        localStorage['tarefas'] = JSON.stringify(tarefas);
        return tarefas;
      })
    );
  }

  remover(id: number): Observable<Tarefa[]> {
    return this.listarTodos().pipe(
      map(tarefas => {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        localStorage['tarefas'] = JSON.stringify(tarefas);
        return tarefas;
      })
    );
  }

  alterarStatus(id: number): Observable<Tarefa[]> {
    return this.listarTodos().pipe(
      map(tarefas => {
        tarefas.forEach((obj, index, objs) => {
          if(id === obj.id) {
            objs[index].concluida = !obj.concluida;
          }
        });
        localStorage['tarefas'] = JSON.stringify(tarefas);
        return tarefas;
      })
    );
  }
}
