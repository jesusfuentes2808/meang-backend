import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../lib/stripe-api";
import {IStripeCard} from "../../interfaces/stripe/card.interface";
import {IStripeCustomer} from "../../interfaces/stripe/customer.interface";

class StripeCardService extends StripeApi{
    async createToken(card: IStripeCard){
        return await this.execute(
            STRIPE_OBJECTS.TOKENS,
            STRIPE_ACTIONS.CREATE,
            {
                card:{
                    number: card.number,
                    exp_month: card.expMonth,
                    exp_year: card.expYear,
                    cvc: card.cvc,
                }
            }
        ).then((result: {id: string}) => {
            return{
                status: true,
                message: `Token ${result.id} creado correctamente`,
                token: result.id,
            };
        }).catch((error: Error) => {
            console.log(error.message);
        });
    }

    async create(customer:string, tokenCard:string){

        /*
        const card = await stripe.customers.createSource(
            'cus_K9gDzzNO0HqZvE',
            {source: 'tok_mastercard'}
        );*/
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.CREATE_SOURCE,
            customer,
            {source: tokenCard}
        ).then((result: IStripeCard) => {
            return{
                status: true,
                message: `Tarjeta ${result.id} creada correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error));
    }

    async get(customer:string, card:string){
        /*const card = await stripe.customers.retrieveSource(
            'cus_K9gDzzNO0HqZvE',
            'card_1JVMqdEIAT5QN8i1Rk3dUmoG'
        );*/

        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.GET_SOURCE,
            customer,
            card
        ).then((result: IStripeCard) => {
            return{
                status: true,
                message: `Detalle de la tarjeta ${result.id} creada correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error));
    }

    async update(customer:string, card:string, details: object){
        /*const card = await stripe.customers.updateSource(
            'cus_K9hZBCtBmnxQRA',
            'card_1JVOA3EIAT5QN8i1I3HDF21E',
            {name: 'Jenny Rosen'}
        );*/
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.UPDATE_SOURCE,
            customer,
            card,
            details
        ).then((result: IStripeCard) => {
            return{
                status: true,
                message: `Actualizado detalle de la tarjeta ${result.id} correctamente`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error));
    }

    async delete(customer:string, card:string){
        /*const deleted = await stripe.customers.deleteSource(
                'cus_K9hZBCtBmnxQRA',
                    'card_1JVOA3EIAT5QN8i1I3HDF21E'
            );*/
        return this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.DELETE_SOURCE,
            customer,
            card
        ).then((result: { id: string, deleted: boolean }) => {
            return{
                status: result.deleted,
                message: result.deleted ?
                    `Eliminado detalle de la tarjeta ${result.id} correctamente`:
                    `El item ${result.id} no se ha borrado`,
                id: result.id,
                card: result
            };
        }).catch((error: Error) => this.getError(error));
    }

    async list(customer: string, limit: number = 5, startingAfter: string = '', endingBefore: string = ''){
        /*const cards = await stripe.customers.listSources(
            'cus_KA0vTi99TByJ2V',
            {object: 'card', limit: 3}
        );*/
        const pagination = this.getPagination(startingAfter, endingBefore);

        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.LIST_SOURCE,
            customer,
            {
                object: 'card',
                limit,
                ...pagination
            }
        ).then((result: { has_more: boolean, data: Array<IStripeCard> })=>{
            return{
                status: true,
                message: `Lista de tarjetas cargado correctamente`,
                hasMore: result.has_more,
                cards: result.data
            };
        }).catch((error: Error) => this.getError(error));
    }

    async removeOtherCards(customer: string, noDeleteCard: string){
        let list = await this.list(customer);
        let listCards = list.cards;

        listCards?.map(async (item: IStripeCard) => {
            if(item.id !== noDeleteCard && noDeleteCard !== ''){
                await this.delete(customer, item?.id || '');
            }
        });
    }
}

export default StripeCardService;