export interface UserService {
    registration(login: string, password: string): Promise<boolean>;
    login(login: string, password: string): Promise<boolean>;
}
