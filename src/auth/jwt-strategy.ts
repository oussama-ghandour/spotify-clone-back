import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authConstants } from "./auth.constants";
import { PayloadType } from "./types";


@Injectable()
export class JwtStrategyy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // secretOrKey: authConstants.SECRET,
            secretOrKey: process.env.SECRET,//with swagger
        });
    }

    async validate(payload: PayloadType) {
        return { 
            userId: payload.userId, 
            email: payload.email,
            artistId: payload.artistId
        };
    }
}

