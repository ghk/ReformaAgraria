import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProgressHttpModule } from 'angular-progress-http';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { DashboardComponent } from './components/dashboard';
import { BreadcrumbComponent } from './components/breadcrumb';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village'; 
import { TeamComponent } from './components/team';
import { VillageBorderComponent } from './components/village-border';
import { AlertComponent } from './components/alert';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';

import { DataService } from './services/data';
import { SharedService } from './services/shared';
import { AlertService } from './services/alert';
import { AccountService } from './services/account';
import { AuthGuard } from './services/authGuard';
import { CookieService } from 'ngx-cookie-service';

import { RegionService } from './services/gen/region';

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        DashboardComponent,
        BreadcrumbComponent,
        EventComponent, 
        VillageComponent,
        TeamComponent,
        VillageBorderComponent,
        AlertComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        ProgressHttpModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'event', component: EventComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '**', redirectTo: 'home'  }
        ])
    ],
    providers: [
        DataService,
        SharedService,
        CookieService,
        AccountService,
        AlertService,
        AuthGuard,
        RegionService
    ]
})
export class AppModuleShared {
}
