import { Routes } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';

export const routes: Routes = [
  {
    path: 'calender2',
    component: CalenderComponent,
    title: 'Home page',
  },
  {path: 'calender', loadComponent: () => import('./calender/calender.component').then(mod => mod.CalenderComponent)},
];
