import StripeApi, {STRIPE_ACTIONS, STRIPE_OBJECTS} from "../../lib/stripe-api";
import {IStripeCustomer} from "../../interfaces/stripe/customer.interface";
import {IUser} from "../../interfaces/user.interface";
import {findOneElement} from "../../lib/lib-operations";
import {COLLECTIONS} from "../../config/constants";
import UsersService from "../users.service";
import {Db} from "mongodb";

class StripeCustomerService extends StripeApi{
    async list(limit:number, startingAfter: string, endingBefore: string){
        const pagination = this.getPagination(startingAfter, endingBefore);

        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.LIST,
            {
                limit, ...pagination
            }
        ).then((result: { has_more: boolean, data: Array<IStripeCustomer> })=>{
            return{
                status: true,
                message: `Lista de clientes cargado correctamente`,
                hasMore: result.has_more,
                customers: result.data
            };
        }).catch((error: Error) => this.getError(error));
    }
    async get(id: string){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.GET,
            id
        )
            .then(async (result: IStripeCustomer)=>{
                if (result.deleted){
                    return{
                        status: false,
                        message: `El cliente ${id}  ha sido eliminado`,
                        customer: undefined
                    };
                }
                return{
                    status: true,
                    message: `El cliente ${result.name} se ha cargado correctamente`,
                    customer: result
                };
            })
            .catch((error: Error) => this.getError(error));
    }

    async add(_: any ,name: string, email: string, db: Db){
        //const stripe = new StripeApi().stripe;

        const userCheckExist: { data: Array<IStripeCustomer> } = await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.LIST,
            {
                email
            }
        );

        if(userCheckExist.data.length > 0){
            return{
                status: false,
                message: `Error: El usuario con el email ${email} ya existe en el sistema`
            };
        } else {
            return await this.execute(
                STRIPE_OBJECTS.CUSTOMERS,
                STRIPE_ACTIONS.CREATE,
                {
                    name,
                    email,
                    description: `${name} (${email})`
                })
                .then(async (result: IStripeCustomer)=>{
                    //Actualizar BD Nuenva propiedad

                    const user: IUser = await findOneElement(db, COLLECTIONS.USERS, { email });

                    if (user) {
                        user.stripeCustomer = result.id;
                        const resultUserOperation = await new UsersService(_, {user}, {db}).modify();
                    }

                    return{
                        status: true,
                        message: `El cliente ${name} se ha cargado correctamente`,
                        customer: result
                    };
                })
                .catch((error: Error) => this.getError(error));
        }

    }

    async update(id: string, customer: IStripeCustomer){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.UPDATE,
            id,
            customer
        ).then((result: IStripeCustomer) => {
            return{
                status: true,
                message: `Usuario ${id} actualizado correctamente`,
                customer: result,
            };
        }).catch((error: Error) => this.getError(error));
    }

    async delete(id: string, db: Db){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.DELETE,
            id
        ).then(async (result: { id: string, deleted: boolean } ) => {
            if( result.deleted ){
                const resultOperation = await db.collection(COLLECTIONS.USERS)
                    .updateOne({stripeCustomer: result.id},
                        {$unset: {stripeCustomer: result.id}}
                    );
                return{
                    status: result.deleted && resultOperation ? true : false,
                    message: result.deleted && resultOperation ?
                        `Usuario ${id} eliminado correctamente`:
                        `Usuario ${id} No se ha eliminado correctamente en la bd`,
                    customer: result,
                };
            }
            return{
                status: false,
                message: `Usuario ${id} No se ha eliminado correctamente`,
                customer: result,
            };
        }).catch((error: Error) => this.getError(error));
    }


}

export default StripeCustomerService;