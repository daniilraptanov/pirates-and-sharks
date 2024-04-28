import { SquareCoordMapper, availableSquaresMap } from "../mappers/SquareCoordMapper";
import { sendApiRequest } from "../tools/send-api-request";
import { AvailableSquareDTO } from "../types/dto/AvailableSquareDTO";
import { SquareService } from "../types/services/SquareService";

class SquareServiceImpl implements SquareService {
    private static _instance: SquareServiceImpl;
    private availableSquares: AvailableSquareDTO[] = [];

    private findCachedAvailableSquare(x: number, y: number): AvailableSquareDTO | undefined {
        return this.availableSquares.find(square => square && square.square.x === x && square.square.y === y);
    }

    static getInstance() {
        if (!SquareServiceImpl._instance) {
            SquareServiceImpl._instance = new SquareServiceImpl();
        }
        return SquareServiceImpl._instance;
    }
    
    async saveSquare(x: number, y: number, isCurrentPosition: boolean): Promise<AvailableSquareDTO> {
        const cachedSquare = this.findCachedAvailableSquare(x, y);
        if (cachedSquare && !isCurrentPosition) {
            return cachedSquare;
        }
        const coords = SquareCoordMapper.toMinimal(x, y);
        const result = availableSquaresMap(
            await sendApiRequest("/sessions/squares", "post", { x: coords.x, y: coords.y, isCurrentPosition })
        ) as AvailableSquareDTO;
        this.availableSquares.push(result);
        return result;
    }

    async getAvailableSquares(): Promise<AvailableSquareDTO[]> {
        this.availableSquares.concat(availableSquaresMap(await sendApiRequest("/sessions/squares", "get")) as AvailableSquareDTO[]);
        return this.availableSquares;
    }

    async getUsersPositions(): Promise<AvailableSquareDTO[]> {
        return sendApiRequest("/sessions/squares/positions", "get");
    }
}


/**
 * Return singleton service!
 */
export default function squareServiceFactory(): SquareService {
    return SquareServiceImpl.getInstance();
}
