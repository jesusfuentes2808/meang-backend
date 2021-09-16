export const STRIPE_OBJECTS = {
    CHARGES: 'charges',
    CUSTOMERS: 'customers',
    TOKENS: 'tokens',
};

export const STRIPE_ACTIONS = {
    CREATE: 'create',
    LIST: 'list',
    GET: 'retrieve',
    UPDATE: 'update',
    DELETE: 'del',
    CREATE_SOURCE: 'createSource',
    GET_SOURCE: 'retrieveSource',
    UPDATE_SOURCE: 'updateSource',
    DELETE_SOURCE: 'deleteSource',
    LIST_SOURCE: 'listSources',
};

class StripeApi{
    private stripe = require('stripe')(process.env.STRIPE_API_KEY,{
        apiVersion: process.env.STRIPE_API_VERSION
    });

    async execute(object: string, action: string, ...args: [
        (string | object), (string | object)?, (string | object)?
    ] ){
        return await this.stripe[object][action](...args);
    }

    protected async getError(error: Error){
        return{
            status: false,
            message: `Error: ${error.message} - No se ha cargado correctamente`,
            hasMore: false,
            customer: undefined,
            card:undefined,
            cards: undefined,
        };
    }

    protected getPagination(startingAfter: string, endingBefore: string){
        let pagination = {};

        if(startingAfter !== '' && endingBefore === ''){
            pagination = {
                starting_after: startingAfter
            };
        } else if(startingAfter === '' && endingBefore !== '') {
            pagination = {
                ending_before: endingBefore
            };
        }
        return pagination;
    }
}

export default StripeApi;