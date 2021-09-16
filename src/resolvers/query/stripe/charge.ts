import {IResolvers} from "graphql-tools";
import StripeChargeService from "../../../services/stripe/charge.service";
import resolversStripeCardQuery from "./card";

const resolversStripeChargeQuery: IResolvers = {
    Query: {
        chargesByCustomer(_, {customer, limit,  startingAfter, endingBefore}, {db}){

            return new StripeChargeService().listByCustomer(
                customer,
                limit, startingAfter, endingBefore
            );
        }
    }
}

export default resolversStripeChargeQuery;