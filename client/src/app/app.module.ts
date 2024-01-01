import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
import { TrackComponent } from './components/track/track.component';
import { EditorComponent } from './components/editor/editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    TrackComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}