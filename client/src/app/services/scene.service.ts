import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SceneType } from '../models/scene.interface';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private draggedSceneSource = new BehaviorSubject<any>(null);
  draggedScene$ = this.draggedSceneSource.asObservable();

  setDraggedScene(scene: SceneType): void {
    this.draggedSceneSource.next(scene);
  }
}
