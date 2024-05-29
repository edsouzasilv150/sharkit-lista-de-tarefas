import { ElementRef, Renderer2 } from '@angular/core';
import { TarefaConcluidaDirective } from './tarefa-concluida.directive';

describe('TarefaConcluidaDirective', () => {
  let directive: TarefaConcluidaDirective;
  let elementRefMock: ElementRef;
  let rendererMock: Renderer2;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: document.createElement('div')
    } as ElementRef;
    rendererMock = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);
    directive = new TarefaConcluidaDirective(elementRefMock, rendererMock);
  });

  it('deve definir a decoração do texto como line-through no ngOnInit se a tarefaConcluida for verdadeira', () => {
    directive.tarefaConcluida = true;
    directive.ngOnInit();
    expect(elementRefMock.nativeElement.style.textDecoration).toBe('line-through');
  });

  it('não deve definir a decoração do texto como line-through no ngOnInit se tarefaConcluida for falsa', () => {
    directive.tarefaConcluida = false;
    directive.ngOnInit();
    expect(elementRefMock.nativeElement.style.textDecoration).not.toBe('line-through');
  });

  it('devo adicionar a classe "concluida" em ngOnChanges se tarefaConcluida for verdadeira', () => {
    directive.tarefaConcluida = true;
    directive.ngOnChanges();
    expect(rendererMock.addClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'concluida');
  });

  it('deve remover a classe "concluida" no ngOnChanges se tarefaConcluida for falsa', () => {
    directive.tarefaConcluida = false;
    directive.ngOnChanges();
    expect(rendererMock.removeClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'concluida');
  });
});
