import { AvailableSquareDTO } from "../dto/AvailableSquareDTO";

export interface SquareService {
    saveSquare(x: number, y: number, isCurrentPosition: boolean): Promise<AvailableSquareDTO>;
    getAvailableSquares(): Promise<AvailableSquareDTO[]>;
    getUsersPositions(): Promise<AvailableSquareDTO[]>;
}
