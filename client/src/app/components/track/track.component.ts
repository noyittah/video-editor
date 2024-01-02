import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { TOTAL_DURATION } from '../../constants';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SceneType } from '../../models/scene.interface';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})

export class TrackComponent implements OnInit, OnDestroy {
  scenes: SceneType[] = [];
  secondsOfScenes: number = 0;
  rulerMarkers: number[] = [];
  draggedScene: SceneType = null;
  totalScenesDuration: number = 0;
  markersGap: number = 1;
  isPlaying: boolean = false;
  cursorPosition: number = 0;
  startFromCursor: boolean = false;
  totalDuration = TOTAL_DURATION;

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

  calculateWidth(scene: SceneType): string {
    let percent;
    if (scene !== null) {
      percent = (scene?.duration / TOTAL_DURATION) * 100;
    }
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

  removeSceneFromTrack(scene: SceneType): void {
    if (scene !== null) {
      const index = this.scenes.indexOf(scene);
      if (index !== -1) {
        this.scenes.splice(index, 1);
        this.totalScenesDuration -= scene?.duration;
        // const order = this.scenes.map((_, i) => i);
      }
    }
  }

  async onClickPlayBtn(){
    const videoElement = document.querySelector('.video') as HTMLMediaElement;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startFromCursor = true;
      this.playScenesInOrder(this.scenes.map((_, i) => i));
      videoElement.currentTime = this.cursorPosition;
      videoElement.play();
    } else {
      this.isPlaying = false;
      videoElement.pause();
    }
  }

  private playScenesInOrder(order: number[], startFromCursor: boolean = false): void {
    const videoElement = document.querySelector('.video') as HTMLMediaElement;
    let currentIndex = startFromCursor ? order.findIndex(i => i * this.markersGap > this.cursorPosition) : 0;
  
    const playNextScene = () => {
      if (currentIndex < order.length) {
        const scene = this.scenes[order[currentIndex]];
        videoElement.src = scene?.url || '';

        if (startFromCursor ) {
          videoElement.currentTime = Math.max(this.cursorPosition - (scene?.startTime ?? 0), 0);
        } else {
          videoElement.currentTime = 0;
        }

        videoElement.play();
        currentIndex++;
        
        videoElement.addEventListener('ended', () => {
          playNextScene();
        });
      }
      else {
        this.isPlaying = false;
      }
    };
    playNextScene();
  }

  onClickTrack(event: MouseEvent): void {
    this.startFromCursor = true;
    const trackElement = document.querySelector('.track-container') as HTMLElement;
    const playButton = document.querySelector('.play-btn') as HTMLElement;
    const videoElement = document.querySelector('.video') as HTMLMediaElement;
  
    if (playButton.contains(event.target as Node)) {
      return;
    }
  
    const clickX = event.clientX - trackElement.getBoundingClientRect().left;
    const percent = (clickX / trackElement.clientWidth) * 100;
    this.cursorPosition = (percent * TOTAL_DURATION) / 100;
    this.cursorPosition = Math.max(0, Math.min(this.cursorPosition, TOTAL_DURATION));
    videoElement.currentTime = this.cursorPosition;

    if (this.isPlaying) {
      videoElement.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      videoElement.pause();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

