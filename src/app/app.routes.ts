import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LasagaClicker2Component } from './components/lasaga-clicker-2/lasaga-clicker-2.component';
import { SampleComponent } from './components/sample/sample.component';


export const routes: Routes = [
    { path: 'home', component: IndexComponent },
    { path: 'lasaga/v2', component: LasagaClicker2Component },
    { path: 'sample', component: SampleComponent },
    { path: '**', component: IndexComponent  }
];
