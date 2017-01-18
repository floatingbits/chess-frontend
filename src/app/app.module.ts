import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { BoardComponent } from './chess/board.component';
import { MatchComponent } from './chess/match.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { DragulaModule } from 'ng2-dragula';
import { AppConfig } from "./app.config";

var appConfig = new AppConfig();
appConfig.apiEndpoint = "%%apiUrl%%";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MatchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
      DragulaModule,

  ],
  providers: [
      { provide: AppConfig, useValue: appConfig }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
