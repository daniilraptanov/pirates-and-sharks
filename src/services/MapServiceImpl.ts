import { action, makeObservable, observable } from "mobx";
import { MapDTO } from "../types/dto/MapDTO";
import { MapService } from "../types/services/MapService";
import { sendApiRequest } from "../tools/send-api-request";

class MapServiceImpl implements MapService {
    @observable maps: MapDTO[] = [];

    constructor() {
        makeObservable(this);
    }
    
    @action
    async getMaps(): Promise<MapDTO[]> {
        this.maps = (await sendApiRequest("/maps", "get")) || [];
        return this.maps;
    }
}

export default function mapServiceFactory(): MapService {
    return new MapServiceImpl();
}
