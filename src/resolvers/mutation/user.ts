import { asignDocumentId, findOneElement, insertOneElement } from './../../lib/lib-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const resolversUserMutation: IResolvers = {
    Mutation: {
        //async register(_, { user }, { db }){
            
        async register(_, { user }, { db }){
            // Comprobar que el usuario no existe
            const userCheck = await findOneElement(db, COLLECTIONS.USERS, {email: user.email});
            
            if(userCheck){
                return {
                    status: false,
                    message: `El email ${user.email} esta registrado y no puedes registrarte con este email`,
                    user: null
                };
            }

            user.id = await asignDocumentId(db, COLLECTIONS.USERS, {registerDate: -1});

            user.registerDate = new Date().toISOString();

            user.password = bcrypt.hashSync(user.password, 10);
            
            return await insertOneElement(db, COLLECTIONS.USERS, user).then(
                                async () => {
                                    return {
                                        status: true,
                                        message: `El email ${user.email} esta registrado correctamente`,
                                        user: user
                                    };
                                }
                            ).catch((err: Error) => {
                                console.log(err.message);
                                return {
                                    status: false,
                                    message: `Error inesperado`,
                                    user: null
                                };
                            });

        }
    }
};

export default resolversUserMutation;