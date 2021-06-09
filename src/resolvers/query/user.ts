import { IResolvers } from 'graphql-tools';
import UsersService from "../../services/users.service";

const resolversUserQuery: IResolvers = {
    Query: {
        async users(root, {page, itemsPage, active}, context) {
            console.log(active);
            return new UsersService(root, {pagination: {page, itemsPage}}, context).items(active);
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
