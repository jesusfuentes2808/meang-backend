import { findOneElement, findElements } from './../../lib/lib-operations';
import { COLLECTIONS, EXPIRTIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';

const resolversUserQuery: IResolvers = {
    Query: {
        async users(root, __, { db }) {
            try{
                return {
                    status: true,
                    message: 'Lista de usuarios cargada correctamente',
                    users: await findElements(db, COLLECTIONS.USERS)
                };
            }catch(error){
                console.log(error.message);
                return {
                    status: false,
                    message: 'Error al cargar lista de usuarios. Comprueba que tienes correctamente todo',
                    users: null
                };
            }
            
        },

        async login(_, { email, password }, { db }) {
            try{
                const user = await findOneElement(db, COLLECTIONS.USERS, { email });
                
                if(user === null){
                    return {
                        status: false,
                        message: 'Ususario no existe',
                        user: null
                    };
                }

                const passwordCheck = bcrypt.compareSync(password, user.password);

                if(passwordCheck !== null){
                    delete user.password;
                    delete user.datebirth; 
                    delete user.registerDate;
                }

                return {
                    status: true,
                    message: (!passwordCheck) ? 'Password y usuarios no son correctos' 
                                            : 'usuario cargado correctamente',
                    token: (!passwordCheck) ? null 
                                            : new JWT().sign({ user }, EXPIRTIME.H24)
                };
            }catch(error){
                console.log(error.message);
                return {
                    status: false,
                    message: 'Error al cargar lista de usuarios. Comprueba que tienes correctamente todo',
                    token: null
                };
            }
        },

        async me(_, __, { token }) {
            try {
                let info = new JWT().verify(token);
            
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
    }
};

export default resolversUserQuery;