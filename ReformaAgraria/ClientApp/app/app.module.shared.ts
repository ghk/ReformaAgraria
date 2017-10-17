import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { HomeComponent } from './components/home';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village'; 
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';
import { AuthGuard } from './components/auth.guard';


import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { DataService } from './services/data';
import { SharedService } from './services/shared';
import { AuthenticationService } from './services/authentication';
import { AlertService } from './services/alert';
import { UserService } from './services/user';

import 'bootstrap';
import './styles/app.less';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        HomeComponent,
        EventComponent, 
        VillageComponent,
        LoginComponent,
        RegisterComponent
        
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard]  },
            { path: 'home', component: HomeComponent },
            { path: 'event', component: EventComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '**', redirectTo: 'home', canActivate: [AuthGuard]  }
        ])
    ],
    providers: [
        DataService,
        SharedService,
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
        AuthenticationService,
        AlertService,
        UserService
    ]
})
export class AppModuleShared {
}
