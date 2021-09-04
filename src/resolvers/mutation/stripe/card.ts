import { IResolvers } from 'graphql-tools';
import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../../lib/stripe-api";
import {IStripeCustomer} from "../../../interfaces/stripe/customer.interface";
import {findOneElement} from "../../../lib/lib-operations";
import {COLLECTIONS} from "../../../config/constants";
import {IUser} from "../../../interfaces/user.interface";
import UsersService from "../../../services/users.service";
import {Trace} from "apollo-reporting-protobuf/dist/protobuf";
import Error = Trace.Error;
import StripeCardService from "../../../services/stripe/card.service";
import {IStripeCard} from "../../../interfaces/stripe/card.interface";

const resolversStripeCardMutation: IResolvers = {
    Mutation: {
        async createCardToken(_, {card}, { db }){
            return new StripeCardService().createToken(card);
        },

        async createCard(_, {customer, tokenCard}, { db }){
            return new StripeCardService().create(customer, tokenCard);
        },

        async updateCard(_, {customer, card, details}, { db }){
            return new StripeCardService().update(customer, card, details);
        },

        async deleteCard(_, {customer, card}, { db }){
            return new StripeCardService().delete(customer, card);
        }
    }
};

export default resolversStripeCardMutation;
