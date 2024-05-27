import { Tarefa } from "./tarefa.model";

describe('Tarefa', () => {
  it('deve criar uma instância com valores padrão', () => {
    const tarefa = new Tarefa();
    expect(tarefa).toBeTruthy();
    expect(tarefa.id).toBeUndefined();
    expect(tarefa.nome).toBeUndefined();
    expect(tarefa.concluida).toBeUndefined();
  });

  it('deve criar uma instância com determinados valores', () => {
    const tarefa = new Tarefa(1, 'Teste Tarefa', true);
    expect(tarefa).toBeTruthy();
    expect(tarefa.id).toBe(1);
    expect(tarefa.nome).toBe('Teste Tarefa');
    expect(tarefa.concluida).toBe(true);
  });

  it('deve permitir inicialização parcial', () => {
    const tarefa = new Tarefa(2, 'Outra Tarefa');
    expect(tarefa).toBeTruthy();
    expect(tarefa.id).toBe(2);
    expect(tarefa.nome).toBe('Outra Tarefa');
    expect(tarefa.concluida).toBeUndefined();

    const tarefaSemId = new Tarefa(undefined, 'Tarefa Sem ID', false);
    expect(tarefaSemId).toBeTruthy();
    expect(tarefaSemId.id).toBeUndefined();
    expect(tarefaSemId.nome).toBe('Tarefa Sem ID');
    expect(tarefaSemId.concluida).toBe(false);
  });
});
