import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private draggedSceneSource = new BehaviorSubject<any>(null);
  draggedScene$ = this.draggedSceneSource.asObservable();

  setDraggedScene(scene: any): void {
    this.draggedSceneSource.next(scene);
  }
}
