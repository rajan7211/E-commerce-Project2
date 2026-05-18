import { UserRole } from "../utils/enums";

export interface JwtPayload {
    userId : number ;
    email : string;
    role : UserRole;
    is_verified : boolean;
}

export interface JwtTokens {
    accessToken : string;


}



