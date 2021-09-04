import { IResolvers } from 'graphql-tools';
import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../../lib/stripe-api";
import {IStripeCustomer} from "../../../interfaces/stripe/customer.interface";
import StripeCustomerService from "../../../services/stripe/customer.service";
import queryResolvers from "../index";


const resolversStripeCustomerQuery: IResolvers = {
    Query: {
        async customers(_, {limit, startingAfter, endingBefore}, {db}){
            return new StripeCustomerService().list(limit, startingAfter, endingBefore);
        },

        async customer(_, { id }, {db}){
            return new StripeCustomerService().get(id);
        }
    }
};

export default resolversStripeCustomerQuery;
