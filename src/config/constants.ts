import enviroment from './enviroments';

if(process.env.NODE_ENV !== 'production'){
    const env = enviroment;
}

export const SECRET_KEY = process.env.SECRET_KEY || 'JesusFuentesGRAPHQL';

export enum COLLECTIONS{
    USERS='users',
    GENRES='genres'
}

export enum MESSAGES{
    TOKEN_VERIFICATION_FAILED = 'token no valido'
}

/* 
H = horas
M = Mintos
D = Días
*/

export enum EXPIRTIME{
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D3 = H24 * 3,
}

export enum  ACTIVE_VALUES_FILTER {
    ALL = 'ALL',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
