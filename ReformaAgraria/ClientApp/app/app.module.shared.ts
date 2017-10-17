import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { HomeComponent } from './components/home';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village';

import { DataService } from './services/data';
import { SharedService } from './services/shared';

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        HomeComponent,
        EventComponent, 
        VillageComponent
    ],
    imports: [
        HttpModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'event', component: EventComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        DataService,
        SharedService
    ]
})
export class AppModuleShared {
}
