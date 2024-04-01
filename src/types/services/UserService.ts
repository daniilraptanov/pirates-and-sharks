export interface UserService {
    readonly isAuth: boolean;
    registration(login: string, password: string): Promise<boolean>;
    login(login: string, password: string): Promise<boolean>;
}
