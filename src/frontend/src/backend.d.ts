import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Video {
    id: bigint;
    title: string;
    createdAt: bigint;
    isOriginal: boolean;
    description?: string;
    genre: Genre;
    youtubeVideoId: string;
    youtubeUrl: string;
}
export interface UserProfile {
    name: string;
}
export enum Genre {
    documentary = "documentary",
    comedy = "comedy",
    drama = "drama"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVideo(title: string, description: string | null, youtubeUrl: string, genre: Genre, isOriginal: boolean): Promise<bigint>;
    deleteVideo(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOriginalShows(): Promise<Array<Video>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(id: bigint): Promise<Video | null>;
    getVideosByGenre(genre: Genre): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    listVideos(): Promise<Array<Video>>;
    loginAsAdmin(code: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateVideo(id: bigint, title: string, description: string | null, youtubeUrl: string, genre: Genre, isOriginal: boolean): Promise<void>;
}
