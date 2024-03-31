import { InventoryDTO } from "../dto/InventoryDTO";

export interface InventoryService {
    readonly inventories: InventoryDTO[];
    getUserInventory(): Promise<InventoryDTO[]>;
}
