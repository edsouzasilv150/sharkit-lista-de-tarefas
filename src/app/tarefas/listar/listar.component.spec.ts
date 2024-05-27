import { TarefaService } from './../shared/tarefa.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTarefaComponent } from './listar.component';
import { of, throwError } from 'rxjs';

describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let fixture: ComponentFixture<ListarTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarTarefaComponent ]
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
  let tarefaService: jasmine.SpyObj<TarefaService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['listarTodos']);

    TestBed.configureTestingModule({
      providers: [
        ListarTarefaComponent,
        { provide: TarefaService, useValue: spy }
      ]
    });
    component = TestBed.inject(ListarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>
  });

  it('deve listar todas as tarefas com sucesso', () => {
    const mockTarefas = [
      { id: 1, nome: 'Tarefa 1'},
      {id: 2, nome: 'Tarefa 2'}
    ];
    tarefaService.listarTodos.and.returnValue(of(mockTarefas));

    component.listarTodos();

    expect(component.tarefas).toEqual(mockTarefas);
    expect(tarefaService.listarTodos).toHaveBeenCalled();
  });

  it('deve listar todas as tarefas com sucesso', (done) => {
    const mockTarefas = [{ id: 1, nome: 'Tarefa 1' }, { id: 2, nome: 'Tarefa 2' }];
    tarefaService.listarTodos.and.returnValue(of(mockTarefas));

    component.listarTodos();

    setTimeout(() => {
      expect(component.tarefas).toEqual(mockTarefas);
      expect(tarefaService.listarTodos).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve tratar o erro ao listar tarefas', (done) => {
    const consoleErrorSpy = spyOn(console, 'error');
    const mockError = new Error('Erro ao listar tarefas');
    tarefaService.listarTodos.and.returnValue(throwError(() => mockError));

    component.listarTodos();

    setTimeout(() => {
      expect(component.tarefas).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao listar tarefas', mockError);
      expect(tarefaService.listarTodos).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve registrar a mensagem completa quando a listagem de tarefas for concluída', (done) => {
    const consoleLogSpy = spyOn(console, 'log');
    tarefaService.listarTodos.and.returnValue(of([]));

    component.listarTodos();

    setTimeout(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Lista completa');
      expect(tarefaService.listarTodos).toHaveBeenCalled();
      done();
    }, 0);
  });
});

// teste unitário para o método remover
describe('ListarTarefaComponent', () => {
  let component: ListarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['listarTodos', 'remover']);

    TestBed.configureTestingModule({
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

  it('deve registrar erro se o id da tarefa estiver indefinido', () => {
    const mockEvent = jasmine.createSpyObj('$event', ['preventDefault']);
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { nome: 'Tarefa sem ID' };
    const consoleErrorSpy = spyOn(console, 'error');

    component.remover(mockEvent, mockTarefa);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith('Deseja remover a tarefa? Tarefa sem ID?');
    expect(tarefaService.remover).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('ID da tarefa é undefined');
  });
});

// teste unitário para o método alterarStatus
describe('TarefaComponent', () => {
  let component: ListarTarefaComponent;
  let tarefaService: jasmine.SpyObj<TarefaService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TarefaService', ['remover']);

    TestBed.configureTestingModule({
      providers: [
        ListarTarefaComponent,
        { provide: TarefaService, useValue: spy }
      ]
    });

    component = TestBed.inject(ListarTarefaComponent);
    tarefaService = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
  });

  it('deve confirmar a mudança de status e remover a tarefa', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };
    const mockTarefas = [{ id: 1, nome: 'Tarefa 1' }, { id: 2, nome: 'Tarefa 2' }, { id: 3, nome: 'Tarefa 3' }];

    tarefaService.remover.and.returnValue
    (of(mockTarefas.filter(tarefa => tarefa.id !== mockTarefa.id)));
    spyOn(component, 'listarTodos');

    component.alterarStatus(mockTarefa);

    expect(window.confirm).toHaveBeenCalledWith('Deseja alterar o status da tarefa "Tarefa 1"?');
    expect(tarefaService.remover).toHaveBeenCalledWith(mockTarefa.id);
    expect(component.listarTodos).toHaveBeenCalled();
  });

  it('should handle error when changing task status', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };
    const consoleErrorSpy = spyOn(console, 'error');
    const mockError = new Error('Erro ao alterar status da tarefa');

    tarefaService.remover.and.returnValue(throwError(() => mockError));

    component.alterarStatus(mockTarefa);

    expect(window.confirm).toHaveBeenCalledWith('Deseja alterar o status da tarefa "Tarefa 1"?');
    expect(tarefaService.remover).toHaveBeenCalledWith(mockTarefa.id);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao alterar status da tarefa', mockError);
  });

  it('deve registrar um erro se o ID da tarefa for indefinido', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockTarefa = { nome: 'Tarefa sem ID' };
    const consoleErrorSpy = spyOn(console, 'error');

    component.alterarStatus(mockTarefa);

    expect(window.confirm).toHaveBeenCalledWith('Deseja alterar o status da tarefa "Tarefa sem ID"?');
    expect(tarefaService.remover).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('ID da tarefa é undefined');
  });

  it('não deve alterar o status da tarefa se o usuário cancelar a confirmação', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const mockTarefa = { id: 1, nome: 'Tarefa 1' };

    component.alterarStatus(mockTarefa);

    expect(window.confirm).toHaveBeenCalledWith('Deseja alterar o status da tarefa "Tarefa 1"?');
    expect(tarefaService.remover).not.toHaveBeenCalled();
  });
});
