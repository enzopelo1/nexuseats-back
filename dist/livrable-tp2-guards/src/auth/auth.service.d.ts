import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
}
export interface AuthResponse {
    access_token: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    validateUserById(userId: number): Promise<{
        id: any;
        email: any;
        role: any;
    }>;
}
