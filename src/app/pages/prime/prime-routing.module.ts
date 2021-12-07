import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimeComponent } from './prime.component';

const routes: Routes = [
  {
    path: '',
    component: PrimeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimeRoutingModule { }
