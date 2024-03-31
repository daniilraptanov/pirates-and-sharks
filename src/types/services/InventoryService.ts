import { InventoryDTO } from "../dto/InventoryDTO";

export interface InventoryService {
    getUserInventory(): Promise<InventoryDTO[]>;
}
