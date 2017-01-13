import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { BoardComponent } from './board/board.component';
import { MatchComponent } from './match/match.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { DragulaModule } from 'ng2-dragula';
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

  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
