jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

import { TestBed } from '@angular/core/testing';

import { TarefaService } from './tarefa.service';
import { Tarefa } from './tarefa.model';
import { throwError } from 'rxjs';


describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

// Teste do método listarTodos()
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
  });

  afterEach(() => {
    // limpar localStorage após cada teste.
    localStorage.clear();
  });

  it('deve retornar um array vazio quando não houver tarefas no localStorage', (done) => {
    localStorage.removeItem('tarefas');

    service.listarTodos().subscribe(tarefas => {
      expect(tarefas).toEqual([]);
      done();
    });
  });

  it('deve retornar uma série de tarefas quando houver tarefas no localStorage', (done) => {
    const tarefas: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage['tarefas'] = JSON.stringify(tarefas);

    service.listarTodos().subscribe(tarefasRetornadas => {
      expect(tarefasRetornadas).toEqual(tarefas);
      done();
    });
  });

  it('deve lidar com JSON inválido em localStorage normalmente', (done) => {
    localStorage['tarefas'] = 'invalid JSON';

    service.listarTodos().subscribe(tarefas => {
      expect(tarefas).toEqual([]);
      done();
    });
  });
});

// teste método cadastrar()
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve adicionar uma nova tarefa a uma lista vazia', (done) => {
    const novaTarefa: Tarefa = { id: 0, nome: 'Nova Tarefa', concluida: false };

    service.cadastrar(novaTarefa).subscribe(tarefas => {
      expect(tarefas.length).toBe(1);
      expect(tarefas[0].nome).toBe('Nova Tarefa');
      expect(tarefas[0].concluida).toBe(false);
      done();
    });
  });

  it('deve adicionar uma nova tarefa a uma lista existente', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    const novaTarefa: Tarefa = { id: 0, nome: 'Nova Tarefa', concluida: false };

    service.cadastrar(novaTarefa).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      expect(tarefas[1].nome).toBe('Nova Tarefa');
      expect(tarefas[1].concluida).toBe(false);
      done();
    });
  });

  it('deve atribuir um ID único à nova tarefa', (done) => {
    const novaTarefa: Tarefa = { id: 0, nome: 'Nova Tarefa', concluida: false };

    service.cadastrar(novaTarefa).subscribe(tarefas => {
      expect(tarefas.length).toBe(1);
      expect(tarefas[0].id).toBeGreaterThan(0);
      done();
    });
  });
});

// teste unitário método buscarPorId
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve retornar uma tarefa existente pelo ID', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.buscarPorId(1).subscribe(tarefa => {
      expect(tarefa).toEqual({ id: 1, nome: 'Tarefa 1', concluida: false });
      done();
    });
  });

  it('deve retornar undefined para um ID não existente', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.buscarPorId(3).subscribe(tarefa => {
      expect(tarefa).toBeUndefined();
      done();
    });
  });

  it('deve retornar undefined quando a lista de tarefas está vazia', (done) => {
    service.buscarPorId(1).subscribe(tarefa => {
      expect(tarefa).toBeUndefined();
      done();
    });
  });

  it('deve retornar undefined quando listarTodos lança um erro', (done) => {
    spyOn(service, 'listarTodos').and.returnValue(throwError('Erro simulado'));

    service.buscarPorId(1).subscribe(tarefa => {
      expect(tarefa).toBeUndefined();
      done();
    });
  });
});

// teste unitário  para o método atualizar
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve atualizar uma tarefa existente', (done) => {
    const tarefaExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefaExistentes));

    const tarefaAtualizada: Tarefa = { id: 1, nome: 'Tarefa 1 Atualizada', concluida: true };

    service.atualizar(tarefaAtualizada).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      const tarefa = tarefas.find(t => t.id === 1);
      expect(tarefa).toEqual(tarefaAtualizada);
      done();
    });
  });

  it('deve manter a lista inalterada se a tarefa a ser atualizada não existir', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    const tarefaNaoExistente: Tarefa = { id: 3, nome: 'Tarefa Inexistente', concluida: true };

    service.atualizar(tarefaNaoExistente).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      const tarefa = tarefas.find(t => t.id === 3);
      expect(tarefa).toBeUndefined();
      done();
    });
  });
});

// teste unitário para o método remover
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
    localStorage.clear()
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve remover uma tarefa existente pelo ID', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.remover(1).subscribe(tarefas => {
      expect(tarefas.length).toBe(1);
      expect(tarefas.find(t => t.id === 1)).toBeUndefined();
      expect(tarefas[0]).toEqual({ id: 2, nome: 'Tarefa 2', concluida: true });
      done();
    });
  });

  it('deve manter a lista inalterada se a tarefa a ser removida não existir', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.remover(3).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      expect(tarefas.find(t => t.id === 1)).toBeDefined();
      expect(tarefas.find(t => t.id === 2)).toBeDefined();
      done();
    });
  });

  it('deve lidar com a remoção de uma tarefa em uma lista vazia', (done) => {
    service.remover(1).subscribe(tarefas => {
      expect(tarefas.length).toBe(0);
      done();
    });
  });
});

// teste unitário para o método alterarStatus
describe('TarefaService', () => {
  let service: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve alternar o status de conclusão de uma tarefa existente', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.alterarStatus(1).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      const tarefa = tarefas.find(t => t.id === 1);
      expect(tarefa).toBeDefined();
      if(tarefa) {
        expect(tarefa.concluida).toBeTrue();
      }
      done();
    });
  });

  it('deve manter a lista inalterada se a tarefa a ser atualizada não existir', (done) => {
    const tarefasExistentes: Tarefa[] = [
      { id: 1, nome: 'Tarefa 1', concluida: false },
      { id: 2, nome: 'Tarefa 2', concluida: true }
    ];
    localStorage.setItem('tarefas', JSON.stringify(tarefasExistentes));

    service.alterarStatus(3).subscribe(tarefas => {
      expect(tarefas.length).toBe(2);
      expect(tarefas.find(t => t.id === 1)?.concluida).toBeFalse();
      expect(tarefas.find(t => t.id === 2)?. concluida).toBeTrue();
      done();
    });
  });

  it('deve lidar com a alteração de status em uma lista vazia', (done) => {
    service.alterarStatus(1).subscribe(tarefas => {
      expect(tarefas.length).toBe(0);
      done();
    });
  });
});
