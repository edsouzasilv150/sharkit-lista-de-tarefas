import {  TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarTarefaComponent } from './editar.component';
import { Tarefa, TarefaService } from '../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

// teste unitário para o método atualizar
describe('EditarTarefaComponent', () => {
  let component: EditarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tarefaServiceSpy = jasmine.createSpyObj('TarefaService', ['atualizar']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      providers: [
        EditarTarefaComponent,
        { provide: TarefaService, useValue: tarefaServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } }, paramMap: of({ get: () => '1' }) } }
      ]
    });

    component = TestBed.inject(EditarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.formTarefa = { form: { valid: true } } as any; // Mock do NgForm
    component.tarefa = new Tarefa(1, 'Tarefa Atualizada', false); // Inicialize a tarefa
  });

  it('deve atualizar a tarefa e navegar na atualização bem-sucedida', fakeAsync(() => {
    const mockTarefas: Tarefa[] = [component.tarefa];
    tarefaService.atualizar.and.returnValue(of(mockTarefas));

    component.atualizar();
    tick();

    expect(tarefaService.atualizar).toHaveBeenCalledWith(component.tarefa);
    expect(router.navigate).toHaveBeenCalledWith(['/tarefas']);
  }));

  it('deve registrar erro se a atualização falhar', fakeAsync(() => {
    const mockError = new Error('Erro ao atualizar tarefa');
    tarefaService.atualizar.and.returnValue(throwError(() => mockError));
    const consoleErrorSpy = spyOn(console, 'error');

    component.atualizar();
    tick();

    expect(tarefaService.atualizar).toHaveBeenCalledWith(component.tarefa);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao atualizar tarefa', mockError);
  }));

  it('should not update task if form is invalid', () => {
    component.formTarefa = { form: { valid: false } } as NgForm;

    component.atualizar();

    expect(tarefaService.atualizar).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

// teste unitário para o método ngOnInit
describe('EditarTarefaComponent', () => {
  let component: EditarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tarefaServiceSpy = jasmine.createSpyObj('TarefaService', ['buscarPorId', 'atualizar']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        EditarTarefaComponent,
        { provide: TarefaService, useValue: tarefaServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } },
            paramMap: of({ get: () => '1' }) // Mock do paramMap para simular Observable
          }
        }
      ]
    });

    component = TestBed.inject(EditarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve buscar tarefa por id no init', fakeAsync(() => {
    const mockTarefa: Tarefa = { id: 1, nome: 'Test Tarefa', concluida: false };
    tarefaService.buscarPorId.and.returnValue(of(mockTarefa));

    component.ngOnInit();
    tick();

    expect(tarefaService.buscarPorId).toHaveBeenCalledWith(1);
    expect(component.tarefa).toEqual(mockTarefa);
  }));

  it('deve registrar erro se a tarefa não for encontrada', fakeAsync(() => {
    tarefaService.buscarPorId.and.returnValue(of(undefined));
    const consoleErrorSpy = spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(tarefaService.buscarPorId).toHaveBeenCalledWith(1);
    expect(component.tarefa).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Tarefa não encontrada');
  }));

  it('deve registrar erro na falha de busca', fakeAsync(() => {
    const mockError = new Error('Erro ao buscar tarefa');
    tarefaService.buscarPorId.and.returnValue(throwError(() => mockError));
    const consoleErrorSpy = spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(tarefaService.buscarPorId).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar tarefa', mockError);
  }));
});
