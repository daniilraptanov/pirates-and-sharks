import { sendApiRequest } from "../tools/send-api-request";
import { AvailableSquareDTO } from "../types/dto/AvailableSquareDTO";
import { SquareService } from "../types/services/SquareService";

class SquareServiceImpl implements SquareService {
    private static _instance: SquareServiceImpl;
    private availableSquares: AvailableSquareDTO[] = [];

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
        const result = await sendApiRequest("/sessions/squares", "post", { x, y, isCurrentPosition });
        this.availableSquares.push(result);
        return result;
    }

    async getAvailableSquares(): Promise<AvailableSquareDTO[]> {
        this.availableSquares = await sendApiRequest("/sessions/squares", "get");
        return this.availableSquares;
    }

    private findCachedAvailableSquare(x: number, y: number): AvailableSquareDTO | undefined {
        return this.availableSquares.find(square => square && square.square.x === x && square.square.y === y);
    }
}


/**
 * Return singleton service!
 */
export default function squareServiceFactory(): SquareService {
    return SquareServiceImpl.getInstance();
}
