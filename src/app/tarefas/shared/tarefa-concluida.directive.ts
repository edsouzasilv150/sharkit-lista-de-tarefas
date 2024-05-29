import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tarefaConcluida]'
})
export class TarefaConcluidaDirective implements OnInit, OnChanges {
  @Input() tarefaConcluida!: boolean | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.tarefaConcluida) {
      this.el.nativeElement.style.textDecoration = "line-through";
    }
  }

  ngOnChanges(): void {
    if (this.tarefaConcluida) {
      this.renderer.addClass(this.el.nativeElement, 'concluida');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'concluida');
    }
  }
}
