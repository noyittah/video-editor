import { Component } from '@angular/core';
import { SCENES, TOTAL_DURATION } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SceneService } from '../../services/scene.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  draggedScene: any;

  constructor(
    private sceneService: SceneService) {
    this.selectedScene.next(this.scenes[0]);
  }

  scenes: any[] = SCENES;
  private selectedScene: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get selectedScene$(): BehaviorSubject<any> {
    return this.selectedScene;
  }

  onPlay(scene: any): void {
    const videoElement = document.querySelector('.video') as HTMLMediaElement;
  
    if (scene !== this.selectedScene.value || !scene.isPlay) {
      if (this.selectedScene.value) {
        this.selectedScene.value.isPlay = false;
      }
      scene.isPlay = true;
      this.selectedScene.next(scene);
      videoElement.src = scene.url;
      videoElement.currentTime = scene.currentTime || 0;
      videoElement.play();
  
      videoElement.addEventListener('ended', () => {
        scene.isPlay = false;
        this.selectedScene.next(scene);
      });
  
      videoElement.addEventListener('play', () => {
        this.selectedScene.value.isPlay = true;
      });
  
      videoElement.addEventListener('pause', () => {
        this.selectedScene.value.isPlay = false;
      });
    } else {
      scene.isPlay = !scene.isPlay;
      this.selectedScene.next(scene);
  
      if (scene.isPlay) {
        videoElement.play();
      } else {
        scene.currentTime = videoElement.currentTime;
        videoElement.pause();
      }
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.draggedScene) {
      this.scenes.push(this.draggedScene);
      this.sceneService.setDraggedScene(null);
    } else {
      moveItemInArray(this.scenes, event.previousIndex, event.currentIndex);
    }
  }

  dragStart(scene: any): void { 
    this.sceneService.setDraggedScene(scene);
  }
}
