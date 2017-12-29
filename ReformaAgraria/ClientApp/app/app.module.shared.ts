import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProgressHttpModule } from 'angular-progress-http';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ColorPickerModule } from 'angular4-color-picker';
import { NgPipesModule } from 'ngx-pipes';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { DashboardComponent } from './components/dashboard';
import { HomeComponent } from './components/home'; 
import { BreadcrumbComponent } from './components/breadcrumb';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village'; 
import { TeamComponent } from './components/team';
import { VillageBorderComponent } from './components/village-border';
import { MapNavigationComponent } from './components/mapNavigation';
import { AgrariaIssuesHeaderComponent } from './components/agraria-issues-header';
import { AgrariaIssuesListComponent } from './components/agraria-issues-list';
import { AgrariaIssuesListObjectSubjectComponent } from './components/agraria-issues-list-object-subject';
import { AlertComponent } from './components/alert';
import { LoginComponent } from './components/login';
import { ForgotPasswordComponent } from './components/forgotPassword';
import { ResetPasswordComponent } from './components/resetPassword';
import { UserManagementComponent } from './components/userManagement';
import { RegionComponent } from './components/region';
import { MapComponent } from './components/map';

//import { LoaderComponent } from './components/loader';

import { RegionCrudComponent } from './components/crud/region'; 

import { CookieService } from 'ngx-cookie-service';
import { DataService } from './services/data';
import { SharedService } from './services/shared';
import { AlertService } from './services/alert';
import { AccountService } from './services/account';
import { AuthGuard } from './services/authGuard';
import { RegionService } from './services/gen/region';
import { AgrariaIssuesListService } from './services/agrariaIssuesList';
import { MapNavigationService } from './services/mapNavigation';
import { BaseLayerService } from './services/gen/baseLayer';
import { MapService } from './services/map';
import { ToraMapService } from './services/gen/toraMap';

import { RegionBreadcrumbPipe } from './pipes/regionBreadcrumb';
import { EnumPipe } from './pipes/enum'; 

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        DashboardComponent,
        HomeComponent,
        BreadcrumbComponent,
        EventComponent, 
        VillageComponent,
        TeamComponent,
        VillageBorderComponent,
        AgrariaIssuesHeaderComponent,
        AgrariaIssuesListComponent,
        AlertComponent,
        LoginComponent,
        MapNavigationComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserManagementComponent,
        RegionCrudComponent,
        RegionComponent,
        RegionBreadcrumbPipe,
        EnumPipe,
        AgrariaIssuesListObjectSubjectComponent,
        MapComponent        
        
    ],
    imports: [
        LeafletModule,
        HttpModule,
        BrowserModule,
        FormsModule,
        ProgressHttpModule,
        CommonModule,
        OrderModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(), 
        ColorPickerModule,
        NgPipesModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '', component: DashboardComponent, canActivate: [AuthGuard], children: [
                    { path: 'home', component: HomeComponent  },
                    { path: 'home/:id', component: HomeComponent },
                    { path: 'region', component: RegionComponent },
                    { path: 'region/:id', component: RegionComponent },
                    { path: 'event', component: EventComponent },
                    { path: 'map', component: MapComponent },
                    //{ path: 'crud', children: [
                    //        //{ path: 'region', component: RegionCrudComponent }
                    //    ]
                    //}
                ]
            },
            {
                path: 'account', children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'forgotpassword', component: ForgotPasswordComponent },
                    { path: 'resetpassword', component: ResetPasswordComponent },
                    { path: 'usermanagement', component: UserManagementComponent }
                ]
            },
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
        RegionService,
        AgrariaIssuesListService,
        MapNavigationService,
        BaseLayerService,
        MapService,
        ToraMapService
    ]
})
export class AppModuleShared {
}
