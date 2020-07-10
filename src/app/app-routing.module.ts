import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import {EditComponent} from './edit/edit.component';


const routes: Routes = [
  {path: '', redirectTo: '/input', pathMatch: 'full'},
  {path: 'input', component: InputComponent},
  {path: 'edit', component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
