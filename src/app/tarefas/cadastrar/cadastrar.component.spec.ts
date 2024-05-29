import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Tarefa, TarefaService } from '../shared';
import { CadastrarTarefaComponent } from './cadastrar.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {  FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('CadastrarTarefaComponent', () => {
  let component: CadastrarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tarefaServiceSpy = jasmine.createSpyObj('TarefaService', ['cadastrar']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      providers: [
        CadastrarTarefaComponent,
        { provide: TarefaService, useValue: tarefaServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    component = TestBed.inject(CadastrarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.formTarefa = { form: { valid: true } } as any;
    component.tarefa = new Tarefa();
  });

  it('deve cadastrar a tarefa e navegar no cadastro bem-sucedido', fakeAsync(() => {
    const mockTarefas: Tarefa[] = [component.tarefa];
    tarefaService.cadastrar.and.returnValue(of(mockTarefas));

    component.cadastrar();
    tick();

    expect(tarefaService.cadastrar).toHaveBeenCalledWith(component.tarefa);
    expect(router.navigate).toHaveBeenCalledWith(['/listar']);
  }));

  it('deve registrar erro se o cadastro falhar', fakeAsync(() => {
    const mockError = new Error('Erro ao cadastrar tarefa');
    tarefaService.cadastrar.and.returnValue(throwError(() => mockError));
    const consoleErrorSpy = spyOn(console, 'error');

    component.cadastrar();
    tick();

    expect(tarefaService.cadastrar).toHaveBeenCalledWith(component.tarefa);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao cadastrar tarefa', mockError);
  }));

  it('não deve cadastrar tarefa se o formulário for inválido', () => {
    component.formTarefa = { form: { valid: false } } as NgForm;

    component.cadastrar();

    expect(tarefaService.cadastrar).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
