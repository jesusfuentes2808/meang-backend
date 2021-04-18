import { COLLECTIONS } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
    Mutation: {
        //async register(_, { user }, { db }){
            
        async register(_, { user }, { db }){
            // Comprobar que el usuario no existe
            const userCheck = await db.collection(COLLECTIONS.USERS)
                                    .findOne({email: user.email});
            
            if(userCheck){
                return {
                    status: false,
                    message: `El email ${user.email} esta registrado y no puedes registrarte con este email`,
                    user: null
                };
            }

            const lastUser = await db.collection(COLLECTIONS.USERS).
                            find().
                            limit(1).
                            sort({registerDate: -1}).
                            toArray();
            
            if(lastUser.length === 0){
                user.id = 1;
            } else {
                user.id = lastUser[0].id + 1;
            }

            user.registerDate = new Date().toISOString();

            user.password = bcrypt.hashSync(user.password, 10);
            
            return await db.collection(COLLECTIONS.USERS).
                            insertOne(user).then(
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

export default resolversMutation;