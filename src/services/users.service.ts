import ResolversOperationsService from "./resolvers-operations.service";
import {COLLECTIONS, EXPIRTIME, MESSAGES} from "../config/constants";
import {IContextData} from "../interfaces/context-data.interface";
import {asignDocumentId, findOneElement, insertOneElement} from "../lib/lib-operations";
import bcrypt from "bcrypt";
import JWT from "../lib/jwt";

class UsersService extends ResolversOperationsService {
    collection = COLLECTIONS.USERS;

    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    //Lista de Usuarios
    async items(){
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'usuarios', page, itemsPage);
        return {
            status: result.status,
            message: result.message,
            users: result.items,
            info: result.info
        }
    }

    // Autenticarnos
    async login(){
        try{
            let variables = this.getVariables().user;

            const user = await findOneElement(this.getDB(), this.collection, { email: variables?.email });

            if(user === null){
                return {
                    status: false,
                    message: 'Ususario no existe',
                    user: null
                };
            }

            const passwordCheck = bcrypt.compareSync(variables?.password, user.password);

            if(passwordCheck !== null){
                delete user.password;
                delete user.datebirth;
                delete user.registerDate;
            }

            return {
                status: passwordCheck,
                message: (!passwordCheck) ? 'Password y usuarios no son correctos'
                    : 'usuario cargado correctamente',
                token: (!passwordCheck) ? null
                    : new JWT().sign({ user }, EXPIRTIME.H24),
                user:(!passwordCheck) ? null
                    : user,
            };
        }catch(error){
            console.log(error.message);
            return {
                status: false,
                message: 'Error al cargar lista de usuarios. Comprueba que tienes correctamente todo',
                token: null
            };
        }
    }

    async auth(){
        try {
            let info = new JWT().verify(this.getContext().token!);

            if(info === MESSAGES.TOKEN_VERIFICATION_FAILED){
                return{
                    status: false,
                    message: info,
                    user: null
                };
            }

            return{
                status: true,
                message: 'Usuario autenticado',
                user: Object.values(info)[0]
            };
        } catch (error) {

        }
    }

    // Iniciar sesión

    // Registrar usuario

    async register(){
        const user = this.getVariables().user;
        // Comprobar que el usuario no existe
        if(user === null){
            return {
                status: false,
                message: `Usuario no definido`,
                user: null
            };
        }

        if(user?.password === null ||
            user?.password === undefined ||
            user?.password === 'null'
        ){
            return {
                status: false,
                message: `Usuario sin password incluido`,
                user: null
            };
        }

        const userCheck = await findOneElement(this.getContext().db!, this.collection, {email: user?.email});

        if(userCheck !== null){
            return {
                status: false,
                message: `El email ${user?.email} esta registrado y no puedes registrarte con este email`,
                user: null
            };
        }

        user!.id = await asignDocumentId(this.getDB(), this.collection, {registerDate: -1});

        user!.registerDate = new Date().toISOString();

        user!.password = bcrypt.hashSync(user!.password, 10);

        const result = await this.add(this.collection, user || {}, 'usuario');

        return {
            status: result?.status,
            message: result?.message,
            user: result?.item,
        }
    }

    async modify(){
        const user = this.getVariables().user;

        if(user === null){
            return {
                status: false,
                message: `Usuario no definido`,
                user: null
            };
        }

        const filter={id: user?.id};

        const result = await this.update(this.collection, filter, user||{}, 'usuario');

        return {
            status: result.status,
            message: result.message,
            user: result.item,
        }

    }

    async delete(){
        const id = this.getVariables().id;

        if(id === undefined || id === ''){
            return {
                status: false,
                message: `Identificador no definido, procura definirlo para eliminar ususario`,
                user: null
            };
        }

        const result = await this.del(this.collection, {id}, 'usuario');

        return {
            status: result.status,
            message: result.message,
        };
    }

    async  block(){
        const id = this.getVariables().id;

        if(!this.checkData(String(id) || '')){
            return {
                status: false,
                message: 'El id del usuario no existe en la base de datos',
            };
        }

        const result = await this.update(this.collection, {id}, {active: false}, 'usuario');

        return {
            status: result.status,
            message: (result.message) ? 'Bloqueado correctamente' : 'No se ha bloqueado comprobarlo por favor',
        };
    }

    private checkData(value: string): boolean{
        return (value === '' || value === undefined) ? false : true;
    }
}

export default UsersService;
