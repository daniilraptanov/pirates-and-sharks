import { observable, action, makeObservable } from 'mobx';
import { InventoryService } from "../types/services/InventoryService";
import { InventoryDTO } from '../types/dto/InventoryDTO';
import { ResourceType } from '../enums/resource-type';

class InventoryServiceImpl implements InventoryService {
    @observable inventories: InventoryDTO[] = [];

    constructor() {
        makeObservable(this);
    }

    @action
    async getUserInventory(): Promise<InventoryDTO[]> {
        // TODO
        this.inventories = [
            { 
                id: "1", 
                resourceId: "1", 
                userSessionId: "1", 
                amount: 3, 
                resource: { 
                    id: "1", 
                    name: "Rope", 
                    type: ResourceType.ROPE 
                } 
            },
            { 
                id: "1", 
                resourceId: "2", 
                userSessionId: "1", 
                amount: 2, 
                resource: { 
                    id: "2", 
                    name: "Axe", 
                    type: ResourceType.AXE 
                } 
            },
            { 
                id: "1", 
                resourceId: "3", 
                userSessionId: "1", 
                amount: 3, 
                resource: { 
                    id: "3", 
                    name: "Rum", 
                    type: ResourceType.RUM 
                } 
            },
        ];
        return this.inventories;
    }
}

export default function inventoryServiceFactory(): InventoryService {
    return new InventoryServiceImpl();
}
