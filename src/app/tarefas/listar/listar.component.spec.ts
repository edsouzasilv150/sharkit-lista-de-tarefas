import { TarefaService } from './../shared/tarefa.service';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListarTarefaComponent } from './listar.component';
import { of, throwError } from 'rxjs';
import { Tarefa } from '../shared';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let fixture: ComponentFixture<ListarTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarTarefaComponent ],
      imports: [
        RouterModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar component', () => {
    expect(component).toBeTruthy();
  });
});

// teste unitário do método listarTodos
describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let fixture: ComponentFixture<ListarTarefaComponent>;
  let tarefaService: jasmine.SpyObj<TarefaService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['listarTodos']);

    TestBed.configureTestingModule({
      declarations: [ListarTarefaComponent],
      providers: [
        { provide: TarefaService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(ListarTarefaComponent);
    component = fixture.componentInstance;
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
  });

  it('deve listar todas as tarefas e atribuí-las a tarefas', fakeAsync(() => {
    const mockTarefas: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];

    tarefaService.listarTodos.and.returnValue(of(mockTarefas));

    component.listarTodos();
    tick();

    expect(tarefaService.listarTodos).toHaveBeenCalled();
    expect(component.tarefas).toEqual(mockTarefas);
  }));

  it('deve registrar um erro se a listagem de tarefas falhar', fakeAsync(() => {
    const mockError = new Error('Erro ao listar tarefas');
    tarefaService.listarTodos.and.returnValue(throwError(() => mockError));
    const consoleErrorSpy = spyOn(console, 'error');

    component.listarTodos();
    tick();

    expect(tarefaService.listarTodos).toHaveBeenCalled();
    expect(component.tarefas).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao listar tarefas', mockError);
  }));
});

// teste unitário para o método remover
describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['listarTodos', 'remover']);

    TestBed.configureTestingModule({
      declarations: [ListarTarefaComponent],
      providers: [
        ListarTarefaComponent,
        { provide: TarefaService, useValue: spy }
      ]
    });

    component = TestBed.inject(ListarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
  });

  it('deve impedir o comportamento padrão do evento e confirmar a remoção', () => {
    const mockEvent = jasmine.createSpyObj('$event', ['preventDefault']);
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };
    const mockTarefas = [{ id: 1, nome: 'Tarefa 1' }, { id: 2, nome: 'Tarefa 2' }, { id: 3, nome: 'Tarefa 3' }];

    tarefaService.remover.and.returnValue
    (of(mockTarefas.filter(tarefa => tarefa.id !== mockTarefa.id)));
    spyOn(component, 'listarTodos');

    component.remover(mockEvent, mockTarefa);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith('Deseja remover a tarefa? Tarefa 1?');
    expect(tarefaService.remover).toHaveBeenCalledWith(mockTarefa.id);
    expect(component.listarTodos).toHaveBeenCalled();
  });

  it('deve tratar o erro ao remover uma tarefa', () => {
    const mockEvent = jasmine.createSpyObj('$event', ['preventDefault']);
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };
    const consoleErrorSpy = spyOn(console, 'error');
    const mockError = new Error('Erro ao remover tarefa');

    tarefaService.remover.and.returnValue(throwError(() => mockError));

    component.remover(mockEvent, mockTarefa);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith('Deseja remover a tarefa? Tarefa 1?');
    expect(tarefaService.remover).toHaveBeenCalledWith(mockTarefa.id);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao remover tarefa', mockError);
  });

  it('deve registrar a mensagem completa quando a remoção for concluída', () => {
    const mockEvent = jasmine.createSpyObj('$event', ['preventDefault']);
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };
    const consoleLogSpy = spyOn(console, 'log');

    tarefaService.remover.and.returnValue(of());

    component.remover(mockEvent, mockTarefa);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith('Deseja remover a tarefa? Tarefa 1?');
    expect(tarefaService.remover).toHaveBeenCalledWith(mockTarefa.id);
    expect(consoleLogSpy).toHaveBeenCalledWith('Remoção completa');
  });

  it('não deve chamar o removedor se a confirmação for falsa', () => {
    const mockEvent = jasmine.createSpyObj('$event', ['preventDefault']);
    spyOn(window, 'confirm').and.returnValue(false);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };

    component.remover(mockEvent, mockTarefa);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith('Deseja remover a tarefa? Tarefa 1?');
    expect(tarefaService.remover).not.toHaveBeenCalled();
  });
});

// teste unitário para o método alterarStatus
describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let fixture: ComponentFixture<ListarTarefaComponent>;
  let tarefaService: jasmine.SpyObj<TarefaService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['atualizar', 'listarTodos']);

    TestBed.configureTestingModule({
      declarations: [ListarTarefaComponent],
      providers: [
        { provide: TarefaService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(ListarTarefaComponent);
    component = fixture.componentInstance;
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
  });

  it('deve registrar um erro se a atualização falhar', fakeAsync(() => {
    const mockTarefa: Tarefa = { id: 1, concluida: false };
    const mockError = new Error('Erro ao atualizar');
    const erro = new Error('Erro ao atualizar');

    tarefaService.atualizar.and.returnValue(throwError(() => erro))
    const consoleErrorSpy = spyOn(console, 'error');

    component.alterarStatus(mockTarefa);
    tick();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao alterar status da tarefa', mockError);
  }));

  it('não deve alterar o status se o ID da tarefa for undefined', fakeAsync(() => {
    const mockTarefa: Tarefa = { id: undefined, concluida: false };
    spyOn(console, 'error');

    component.alterarStatus(mockTarefa);

    expect(mockTarefa.concluida).toBeFalse();
    expect(tarefaService.atualizar).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('ID da tarefa é undefined');
  }));
});
