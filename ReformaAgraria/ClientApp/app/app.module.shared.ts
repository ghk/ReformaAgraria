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
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { DashboardComponent } from './components/dashboard';
import { HomeComponent } from './components/home';
import { EventComponent } from './components/event';
import { VillageComponent } from './components/village';
import { TeamComponent } from './components/team';
import { VillageBorderComponent } from './components/village-border';
import { MapNavigationComponent } from './components/mapNavigation';
import { ToraHeaderComponent } from './components/toraHeader';
import { ToraSummaryComponent } from './components/toraSummary';
import { ToraListComponent } from './components/toraList';
import { ToraDetailComponent } from './components/toraDetail';
import { AlertComponent } from './components/alert';
import { LoginComponent } from './components/login';
import { ForgotPasswordComponent } from './components/forgotPassword';
import { ResetPasswordComponent } from './components/resetPassword';
import { UserManagementComponent } from './components/userManagement';
import { MapComponent } from './components/map';

import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './services/shared';
import { AlertService } from './services/alert';
import { AccountService } from './services/account';
import { AuthGuard } from './services/authGuard';
import { RegionService } from './services/gen/region';
import { ToraService } from './services/tora';
import { ToraObjectService } from './services/gen/toraObject';
import { ToraSubjectService } from './services/gen/toraSubject';
import { MapNavigationService } from './services/mapNavigation';
import { BaseLayerService } from './services/gen/baseLayer';
import { MapService } from './services/map';
import { ToraMapService } from './services/gen/toraMap';
import { ToraObjectService } from './services/gen/toraObject';


import { RegionBreadcrumbPipe } from './pipes/regionBreadcrumb';
import { EnumPipe } from './pipes/enum';
import { TranslatePipe } from './pipes/translate';

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        DashboardComponent,
        HomeComponent,
        EventComponent,
        VillageComponent,
        TeamComponent,
        VillageBorderComponent,
        ToraHeaderComponent,
        ToraSummaryComponent,
        ToraListComponent,
        ToraDetailComponent,
        MapComponent,
        AlertComponent,
        LoginComponent,
        MapNavigationComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserManagementComponent,
        RegionBreadcrumbPipe,
        EnumPipe,
        TranslatePipe
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
        TabsModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home/72_1', pathMatch: 'full' },
            {
                path: '', component: DashboardComponent, canActivate: [AuthGuard], children: [
                    { path: 'home/:id', component: HomeComponent },
                    { path: 'toradetail/:id', component: ToraDetailComponent },
                    { path: 'event', component: EventComponent },
                    { path: 'map', component: MapComponent },
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
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        SharedService,
        CookieService,
        AccountService,
        AlertService,
        AuthGuard,
        RegionService,
        ToraService,
        ToraObjectService,
        ToraSubjectService,
        MapNavigationService,
        BaseLayerService,
        MapService,
        ToraMapService,
        ToraObjectService
    ]
})
export class AppModuleShared {
}
