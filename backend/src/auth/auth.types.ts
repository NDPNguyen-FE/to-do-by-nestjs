export interface JwtPayload {
    sub: number;       // User ID
    username: string;
    iat?: number;      // Issued at
    exp?: number;      // Expiration
}



export interface RequestUser {
    id: number;
    username: string;
}
