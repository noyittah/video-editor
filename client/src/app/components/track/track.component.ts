import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { TOTAL_DURATION } from '../../constants';
import { VideoEditorService } from '../../services/video-editor.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  scenes: any[] = [];
  rulerMarkers: number[] = [];
  draggedScene: any;
  totalScenesDuration: number = 0;
  shouldPlayMergedVideo: boolean = false;
  markersGap: number = 1;

  constructor(
    private sceneService: SceneService,
    private videoEditorService: VideoEditorService,
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
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex);
  }

  async onClickPlayBtn(): Promise<void> {
    const inputFiles = this.scenes.map((scene) => scene.url).filter((url) => !!url);

    if (inputFiles.length === 0) {
      console.error('No valid video files found.');
      return;
    }
  }
}

