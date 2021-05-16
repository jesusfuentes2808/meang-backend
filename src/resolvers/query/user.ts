import { findOneElement, findElements } from './../../lib/lib-operations';
import { COLLECTIONS, EXPIRTIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import UsersService from "../../services/users.service";

const resolversUserQuery: IResolvers = {
    Query: {
        async users(root, {page, itemsPage}, context) {
            return new UsersService(root, {pagination: {page, itemsPage}}, context).items();
        },

        async login(_, { email, password }, context) {
            return new UsersService(_, {user: { email, password }}, context).login()
        },

        async me(_, __, { token }) {
            return new UsersService(_, __, {token}).auth();
        }
    }
};

export default resolversUserQuery;
