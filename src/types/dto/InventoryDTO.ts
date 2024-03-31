import { ResourceDTO } from "./ResourceDTO";

export interface InventoryDTO {
    id: string;
    resourceId: string;
    userSessionId: string;
    amount: number;

    resource: ResourceDTO;
}
