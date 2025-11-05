import { UserDTO } from './user-dto';

export interface AuthResponseDTO {
    jwtToken: string;
    epxiresIn: number;
}
