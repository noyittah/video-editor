export interface Scene {
    name: string;
    url: string;
    duration: number;
    isPlay: boolean;
    currentTime?: number;
    newStartTime?: number;
    newEndTime?: number; 
}
export type SceneType = Scene | null;
