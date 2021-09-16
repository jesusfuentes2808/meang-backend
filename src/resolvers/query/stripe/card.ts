import { IResolvers } from 'graphql-tools';
import StripeCardService from "../../../services/stripe/card.service";


const resolversStripeCardQuery: IResolvers = {
    Query: {
        async card(_, {customer, card}, {db}){
            return new StripeCardService().get(customer, card);
        },

        async cards(_, {customer, limit, startingAfter, endingBefore}, {db}){
            console.log(new StripeCardService().list(customer, limit, startingAfter, endingBefore));
            return new StripeCardService().list(customer, limit, startingAfter, endingBefore);
        },

    }
};

export default resolversStripeCardQuery;
