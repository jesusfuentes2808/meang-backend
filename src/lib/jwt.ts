import { IJwt } from './../interfaces/jwt.interface';
import { SECRET_KEY, MESSAGES, EXPIRTIME } from './../config/constants';
import jwt from 'jsonwebtoken';
import { constants } from 'node:buffer';

class JWT {
    private secretKey = SECRET_KEY as string;

    sign(data: IJwt, expiresIn: number = EXPIRTIME.H24){
        return jwt.sign(
                {user: data.user},
                this.secretKey,
                {expiresIn: expiresIn}
            );
    }

    verify(token: string){
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return MESSAGES.TOKEN_VERIFICATION_FAILED;
            console.log(error.message);
        }
    }
}

export default JWT;