import { Routes } from '@angular/router';

import { ListarTarefaComponent } from './listar';
import { CadastrarTarefaComponent } from './cadastrar';
import { EditarTarefaComponent } from './editar';

export const TarefaRoutes: Routes = [
  {
      path: 'listar',
      component: ListarTarefaComponent
  },
  {
      path: 'cadastrar',
      component: CadastrarTarefaComponent
  },
  {
      path: 'editar/:id',
      component: EditarTarefaComponent
  }
]
