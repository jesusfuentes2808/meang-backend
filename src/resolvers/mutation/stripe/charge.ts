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
import StripeChargeService from "../../../services/stripe/charge.service";

const resolversStripeChargeMutation: IResolvers = {
    Mutation: {
        async chargeOrder(_, {payment, stockChange}, { db, pubsub }){
            return new StripeChargeService().order(payment, stockChange, pubsub, db);
        }
    }
};

export default resolversStripeChargeMutation;
