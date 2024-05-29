import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './tarefas/login';
import { TarefaRoutes } from './tarefas/tarefas-routing.module';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'tarefas',
    loadChildren: () => import('./tarefas/tarefas.module').then(m => m.TarefasModule)
  },
  ...TarefaRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
