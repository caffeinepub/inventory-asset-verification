import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GPSCoordinates {
    latitude: number;
    longitude: number;
}
export interface Asset {
    assetId: string;
    gpsCoordinates: GPSCoordinates;
    name: string;
    locationId: string;
    timestamp: bigint;
    category: string;
    remarks: string;
    photos: Array<string>;
    condition: string;
}
export enum DeleteResult {
    success = "success",
    assetNotFound = "assetNotFound"
}
export interface backendInterface {
    deleteAsset(assetId: string): Promise<DeleteResult>;
    exportAssetVerifications(): Promise<Array<Asset>>;
    findAssetsByName(name: string): Promise<Array<Asset>>;
    getAllAssets(): Promise<Array<Asset>>;
    getAssetCountsByCategory(): Promise<Array<[string, bigint]>>;
    getAssetsByLocation(locationId: string): Promise<Array<Asset>>;
    getLocationCountsByCondition(): Promise<Array<[string, Array<[string, bigint]>]>>;
    submitAssetCheck(assetId: string, name: string, category: string, locationId: string, condition: string, remarks: string, latitude: number, longitude: number, photos: Array<string>): Promise<void>;
    updateAssetStatus(assetId: string, condition: string, remarks: string, latitude: number, longitude: number, photos: Array<string>): Promise<void>;
}
