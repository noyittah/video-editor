export interface Scene {
    name: string;
    url: string;
    duration: number;
    isPlay: boolean;
    currentTime?: number;
    startTime?: number;
}
export type SceneType = Scene | null;
