import { IResolvers } from 'graphql-tools';
import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../../lib/stripe-api";
import {IStripeCustomer} from "../../../interfaces/stripe/customer.interface";
import {findOneElement} from "../../../lib/lib-operations";
import {COLLECTIONS} from "../../../config/constants";
import {IUser} from "../../../interfaces/user.interface";
import UsersService from "../../../services/users.service";
import {Trace} from "apollo-reporting-protobuf/dist/protobuf";
import Error = Trace.Error;
import StripeCustomerService from "../../../services/stripe/customer.service";

const resolversStripeCustomerMutation: IResolvers = {
    Mutation: {
        async createCustomer(_, {name, email}, { db }){
            return new StripeCustomerService().add(_, name, email, db);
        },
        async updateCustomer(_, {id, customer}, { db }){
            return new StripeCustomerService().update(id, customer);
        },
        async deleteCustomer(_, {id}, { db }){
            return new StripeCustomerService().delete(id, db);
        }
    }
};

export default resolversStripeCustomerMutation;
