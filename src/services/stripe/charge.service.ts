import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../lib/stripe-api";
import {IPayment} from "../../interfaces/stripe/payment.interface";
import invariant from "ts-invariant";
import error = invariant.error;
import {Trace} from "apollo-reporting-protobuf/dist/protobuf";
import StripeCustomerService from "./customer.service";
import StripeCardService from "./card.service";

class StripeChargeService extends StripeApi{

    private async getClient(customer: string){
        return new StripeCustomerService().get(customer);
    }

    async order(payment: IPayment){
        const userData = await this.getClient(payment.customer);

        if(userData && userData.status){
            console.log('Cliente encontrado');
            if(payment.token !== undefined){
                //Asociar cliente a la tarjeta
                const cardCreate = await new StripeCardService().create(
                    payment.customer,
                    payment.token
                );

                //Actualizar como fuente predeterminada
                await new StripeCustomerService().update(
                    payment.customer,
                    {
                        default_source: cardCreate.card?.id
                    }
                );

                // Actualizar borrando las demas tarjetas de cliente

                await new StripeCardService().removeOtherCards(
                    payment.customer, cardCreate.card?.id || ''
                );

            } else if(payment.token === undefined &&
                userData.customer?.default_source === null){
                    return {
                        status: false,
                        message: 'Cliente no tiene ningun metodo de pago asignado',
                    };
                }
        } else {
            return {
                status: false,
                message: 'Cliente no encontrado',
            };
        }

        delete payment.token;
        payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100) / 100;
        payment.amount *= 100;
        /*
        * const charge = await stripe.charges.create({
          amount: 2000,
          currency: 'usd',
          source: 'tok_visa',
          description: 'My First Test Charge (created for API docs)',
        });*/

        return await this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTIONS.CREATE,
            payment
        ).then((result: object) => {
            return{
                status: true,
                message: 'Pago realizado',
                charge: result
            };
        }).catch((error: Error) => this.getError(error));
    }
}

export default StripeChargeService;