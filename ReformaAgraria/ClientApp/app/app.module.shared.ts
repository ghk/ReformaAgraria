import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ProgressHttpModule } from 'angular-progress-http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ColorPickerModule } from 'angular4-color-picker';
import { NgPipesModule } from 'ngx-pipes';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CalendarModule } from 'angular-calendar';

import { AppComponent } from './components/app';
import { HeaderComponent } from './components/header';
import { SidenavComponent } from './components/sidenav';
import { DashboardComponent } from './components/dashboard';
import { HomeComponent } from './components/home';
import { EventCalendarComponent } from './components/eventCalendar';
import { VillageComponent } from './components/village';
import { TeamComponent } from './components/team';
import { VillageBorderComponent } from './components/village-border';
import { ToraMapComponent } from './components/toraMap';
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
import { LibraryComponent } from './components/library';

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
import { SearchService } from './services/search';
import { LibraryService } from './services/library';
import { EventService } from './services/gen/event';

import { RegionBreadcrumbPipe } from './pipes/regionBreadcrumb';
import { EnumPipe } from './pipes/enum';
import { TranslatePipe } from './pipes/translate';

import { defineLocale } from 'ngx-bootstrap';
import { id } from './helpers/id';
defineLocale('id', id);

import 'bootstrap';
import './styles/app.scss';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        DashboardComponent,
        HomeComponent,
        EventCalendarComponent,
        VillageComponent,
        TeamComponent,
        VillageBorderComponent,
        ToraHeaderComponent,
        ToraSummaryComponent,
        ToraListComponent,
        ToraDetailComponent,
        ToraMapComponent,
        MapComponent,
        AlertComponent,
        LoginComponent,        
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserManagementComponent,
        RegionBreadcrumbPipe,
        EnumPipe,
        TranslatePipe,
        LibraryComponent
    ],
    imports: [
        LeafletModule,
        HttpModule,
        BrowserModule,
        FormsModule,
        ProgressHttpModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ColorPickerModule,
        NgPipesModule,
        TypeaheadModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        CalendarModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home/72_1', pathMatch: 'full' },
            {
                path: '', component: DashboardComponent, canActivate: [AuthGuard], children: [
                    { path: 'home/:id', component: HomeComponent },
                    { path: 'toradetail/:id', component: ToraDetailComponent },
                    { path: 'calendar/:id', component: EventCalendarComponent },
                    { path: 'map', component: MapComponent },
                    { path: 'library', component: LibraryComponent }
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
        SearchService,
        LibraryService,
        EventService,
        { provide: LOCALE_ID, useValue: 'id-ID' }
    ]
})
export class AppModuleShared {
}
