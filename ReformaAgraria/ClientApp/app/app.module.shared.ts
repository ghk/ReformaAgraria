import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { DashboardComponent } from './components/dashboard';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village'; 
import { AlertComponent } from './components/alert';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';

import { DataService } from './services/data';
import { SharedService } from './services/shared';
import { AlertService } from './services/alert';
import { AccountService } from './services/account';
import { AuthGuard } from './services/auth-guard';
import { CookieService } from 'ngx-cookie-service';

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        DashboardComponent,
        EventComponent, 
        VillageComponent,
        AlertComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
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
        AuthGuard
    ]
})
export class AppModuleShared {
}
