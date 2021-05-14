import {IUser} from "./user.interface";

export interface IVariable {
    id?: string|number;
    genre?: string;
    user?: IUser;
}
