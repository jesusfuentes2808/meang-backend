//ACA SE DEBE AGREGAR HASMORE
import StripeChargeService from "../services/stripe/charge.service";

export interface ICharge {
    charges: [StripeChargeService];
    hasMore: boolean;
}
