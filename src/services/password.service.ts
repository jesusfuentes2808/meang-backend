import ResolversOperationsService from "./resolvers-operations.service";
import {COLLECTIONS, EXPIRTIME} from "../config/constants";
import {IContextData} from "../interfaces/context-data.interface";
import {findOneElement, updateOneElement} from "../lib/lib-operations";
import JWT from "../lib/jwt";
import MailService from "./mail.service";
import bcrypt from "bcrypt";

class PasswordService extends ResolversOperationsService{
    collection = COLLECTIONS.GENRES;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async change(){
        const id = this.getVariables().user?.id || '';
        let password = this.getVariables().user?.password || '';

        if(id === undefined|| id === ''){
            return{
                status: false,
                message: 'El id necesita una información correcta'
            };
        }

        if(password === undefined|| password === ''){
            return{
                status: false,
                message: 'El password necesita una información correcta'
            };
        }

        password = bcrypt.hashSync(password, 10);

        const result = await this.update(
            COLLECTIONS.USERS,
            {id},
            {password},
            'users'
        );

        return {
            status: result.status,
            message: result.status ? 'contraseña cambiada correctamente' : result.message,
        }
        /*return await updateOneElement(
            this.getDB(),
            COLLECTIONS.USERS,
            {id},
            {password}
        ).then(res=>{
            console.log(res.result);
            if(res.result.nModified === 1 && res.result.ok){
                return{
                    status: true,
                    message: `Contraseña cambiada correctamente`
                };
            }

            return{
                status: false,
                message: `Contraseña NO ACTUALIZADA`
            };
        }).catch(error => {
            return{
                status: false,
                message: `Contraseña NO ACTUALIZADA ${error}`
            };
        });*/

    }

    async sendMail(){
        const email = this.getVariables().user?.email || '';

        if(email === undefined || email === ''){
            return {
                status: false,
                message: 'El email no definido correctamente'
            }
        }

        const user = await findOneElement(this.getDB(),COLLECTIONS.USERS, {email});
        console.log(user);

        if(user === undefined || user === null){
            return{
                status: false,
                message: `Usuario con el email ${email} no existe`
            };
        }
        const newUser = {
            id: user.id,
            email
        };

        const token = new JWT().sign({user: newUser}, EXPIRTIME.M15);
        console.log(token);
        const html =
            `Para cambiar de contraseña haz click sobre esto 
                <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click aquí</a>`;

        const mail = {
            to: email,
            html,
            subject: 'Petición para cambiar de contraseña'
        };

        return new MailService().send(mail);
    }
}

export default PasswordService;