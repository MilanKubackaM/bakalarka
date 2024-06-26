import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './views/base/base.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './views/about/about.component';
import { GraphsComponent } from './views/graphs/graphs.component';
import { OverviewMapComponent } from './views/overviewMap/overviewMap.component';
import { LoginComponent } from './views/login/login.component';
import { DataComponent } from './views/data/data.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../enviroments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APIInterceptorService } from './shared/services/APIInterceptor/apiinterceptor.service';
import { AddDeviceComponent } from './views/settings/addDevice/addDevice.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MapComponent } from "./views/settings/map/map.component";
import { ToastrModule } from 'ngx-toastr';
import { MyDevicesComponent } from "./views/settings/my-devices/my-devices.component";
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { ComparisonGraphComponent } from "./views/data/comparison-graph/comparison-graph.component";
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
        NavbarComponent,
        AboutComponent,
        GraphsComponent,
        OverviewMapComponent,
        LoginComponent,
        DataComponent,
        AddDeviceComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: APIInterceptorService,
            multi: true,
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en-GB'
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        HttpClientModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        FormsModule,
        MapComponent,
        ToastrModule.forRoot(),
        MyDevicesComponent,
        ModalModule.forRoot(),
        TranslateModule.forRoot(),
        ComparisonGraphComponent
    ]
})
export class AppModule { }
