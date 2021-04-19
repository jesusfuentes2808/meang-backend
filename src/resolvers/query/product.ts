import { COLLECTIONS, EXPIRTIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';

const resolversProductQuery: IResolvers = {
    Query: {
       products(){
           return true;
       }
    }
};

export default resolversProductQuery;