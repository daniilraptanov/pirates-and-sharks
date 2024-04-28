import { Socket, io } from 'socket.io-client';
import { UserPositionMessageDTO } from "../types/dto/messages/UserPositionMessageDTO";
import { MessageService } from "../types/services/MessageService";
import { SERVER_URL } from '../tools/send-api-request';
import { Messages } from '../enums/messages';

export class MessageServiceImpl implements MessageService {
    private static socket: Socket;

    static initialize(
        updatePositionCallback: (data: UserPositionMessageDTO) => void,
    ) {
        this.socket = io(SERVER_URL);
        this.socket.on('connect', () => console.log('connected')); // TODO
        this.socket.on(Messages.USER_POSITION_MESSAGE, updatePositionCallback);
    }
}

export default function messageServiceFactory(): MessageService {
    return new MessageServiceImpl();
}
