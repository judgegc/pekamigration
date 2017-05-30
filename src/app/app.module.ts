import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import {PekaApiService} from './peka-api/peka-api.service';
import { DataProviderService } from './data-provider.service';

import { ViewportComponent } from './viewport/viewport.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { DescriptionComponent } from './description/description.component';
import { SettingsComponent } from './settings/settings.component'; 
import { AllChatsListenerService } from './all-chats-listener.service';

@NgModule({
  declarations: [
    AppComponent,
    ViewportComponent,
    SearchBoxComponent,
    DescriptionComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [PekaApiService, DataProviderService, AllChatsListenerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
