import { Component } from '@angular/core';
import { SCENES } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SceneService } from '../../services/scene.service';
import { SceneType } from '../../models/scene.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  private selectedScene: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  draggedScene: SceneType = null;
  scenes: SceneType[] = SCENES;

  constructor(
    private sceneService: SceneService) {
    this.selectedScene.next(this.scenes[0]);
  }

  get selectedScene$(): BehaviorSubject<any> {
    return this.selectedScene;
  }

  onPlay(scene: SceneType): void {
    const videoElement = document.querySelector('.video') as HTMLMediaElement;
  
    if (scene !== null) {
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
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.draggedScene) {
      this.scenes.push(this.draggedScene);
      this.sceneService.setDraggedScene(null);
    }
  }

  dragStart(scene: SceneType): void {
    this.sceneService.setDraggedScene(scene);
  }
}
