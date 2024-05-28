import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaService } from './shared';
import { ListarTarefaComponent } from './listar/listar.component';
import { CadastrarTarefaComponent } from './cadastrar/cadastrar.component';
import { EditarTarefaComponent } from './editar/editar.component';



@NgModule({
  declarations: [
    ListarTarefaComponent,
    CadastrarTarefaComponent,
    EditarTarefaComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    TarefaService
  ]
})
export class TarefasModule { }
