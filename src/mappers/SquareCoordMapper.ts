import { MapSquare } from "../game/objects/MapSquare";
import { AvailableSquareDTO } from "../types/dto/AvailableSquareDTO";

export class SquareCoordMapper {
    static toMinimal(x: number, y: number) {
        return {
            x: x / MapSquare.SIZE,
            y: y / MapSquare.SIZE,
        }
    }

    static toStandard(x: number, y: number) {
        return {
            x: x * MapSquare.SIZE,
            y: y * MapSquare.SIZE,
        }
    }
}

export function availableSquaresMap(data: AvailableSquareDTO | AvailableSquareDTO[]) {
    const coordsMap = (square: AvailableSquareDTO) => {
        const coords = SquareCoordMapper.toStandard(square.square.x, square.square.y);
        square.square.x = coords.x;
        square.square.y = coords.y;
        return square;
    }
    
    if (data instanceof Array) {
        return data.map((square) => coordsMap(square));
    } else {
        return coordsMap(data);
    }
}
