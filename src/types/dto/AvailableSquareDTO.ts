import { SquareDTO } from "./SquareDTO";

export interface AvailableSquareDTO {
    id: string;
    squareId: string;
    userSessionId: string;
    isCurrentPosition: boolean;
    square: SquareDTO;
}
