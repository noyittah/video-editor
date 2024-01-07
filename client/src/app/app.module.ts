import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
import { TrackComponent } from './components/track/track.component';
import { EditorComponent } from './components/editor/editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    TrackComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}