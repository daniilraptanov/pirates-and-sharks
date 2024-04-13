import { MapDTO } from "../dto/MapDTO";

export interface MapService {
    readonly maps: MapDTO[];
    getMaps(): Promise<MapDTO[]>;
    findMapById(id: string): MapDTO | null;
}
