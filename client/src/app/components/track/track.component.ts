import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { TOTAL_DURATION } from '../../constants';
import { VideoEditorService } from '../../services/video-editor.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})

export class TrackComponent implements OnInit, OnDestroy {
  scenes: any[] = [];
  rulerMarkers: number[] = [];
  draggedScene: any;
  totalScenesDuration: number = 0;
  shouldPlayMergedVideo: boolean = false;
  markersGap: number = 1;
  isPlaying: boolean = false;

  private destroy$ = new Subject<void>();
  private playOrder$ = new BehaviorSubject<number[]>([]);

  constructor(
    private sceneService: SceneService,
  ) {}

  ngOnInit(): void {
    this.generateRulerMarkers();
    this.sceneService.draggedScene$.subscribe((scene) => {
      if (scene) {
        this.totalScenesDuration += scene?.duration;
        if (this.totalScenesDuration <= TOTAL_DURATION) {
          this.draggedScene = scene;
          this.scenes.push(this.draggedScene);
        }
      }
    });
    this.playOrder$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((order) => {
      this.playScenesInOrder(order);
    });
  }

  private generateRulerMarkers(): void {
    this.rulerMarkers = [];
    for (let i = 1; i <= TOTAL_DURATION; i += this.markersGap) {
      this.rulerMarkers.push(i);
    }
  }

  calculateWidth(scene: any): string {
    const percent = (scene?.duration / TOTAL_DURATION) * 100;
    return percent + '%';
  }

  onClickZoomIn(): void {
    if (this.markersGap < 3) {
      this.markersGap += 1;
      this.generateRulerMarkers();
    }
  }

  onClickZoomOut(): void {
    if (this.markersGap > 1) {
      this.markersGap -= 1;
      this.generateRulerMarkers();
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    const order = this.scenes.map((_, index) => index);
    this.playOrder$.next(order);
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex);
  }

  removeSceneFromTrack(scene: any): void {
    const index = this.scenes.indexOf(scene);
    if (index !== -1) {
      this.scenes.splice(index, 1);
      this.totalScenesDuration -= scene.duration;
      const order = this.scenes.map((_, i) => i);
    }
  }

  async onClickPlayBtn(){
    const videoElement = document.querySelector('.video') as HTMLMediaElement;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playScenesInOrder(this.scenes.map((_, i) => i));
      videoElement.play();
    } else {
      this.isPlaying = false;
      videoElement.pause();
    }

  }

  private playScenesInOrder(order: number[]): void {
    const videoElement = document.querySelector('.video') as HTMLMediaElement;
    let currentIndex = 0;
  
    const playNextScene = () => {
      if (currentIndex < order.length) {
        const scene = this.scenes[order[currentIndex]];
        videoElement.src = scene.url;
        videoElement.currentTime = 0;
        videoElement.play();
        currentIndex++;
  
        this.waitForVideoEnd(videoElement).then(() => {
          playNextScene();
        });
      }
      else {
        this.isPlaying = false;
      }
    };
    playNextScene();
  }
  
  private waitForVideoEnd(videoElement: HTMLMediaElement): Promise<void> {
    return new Promise<void>((resolve) => {
      const onEnded = () => {
        resolve();
        videoElement.removeEventListener('ended', onEnded);
      };
      videoElement.addEventListener('ended', onEnded);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

