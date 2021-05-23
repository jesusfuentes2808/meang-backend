import { asignDocumentId, findOneElement, insertOneElement } from './../../lib/lib-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import UsersService from "../../services/users.service";
import GenresService from "../../services/genres.service";

const resolversUserMutation: IResolvers = {
    Mutation: {
        //async register(_, { user }, { db }){
            
        async register(_, { user }, context){
            return new UsersService(_, {user}, context).register();
        },

        async updateUser(_, { user }, context){
            return new UsersService(_, {user}, context).modify();
        },

        async deleteUser(_, { id }, context){
            return new UsersService(_, {id}, context).delete();
        },

        blockUser(_, { id }, context){
            return  new UsersService(_,{ id }, context).block();
        }
    }
};

export default resolversUserMutation;
