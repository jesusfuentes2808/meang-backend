import ResolversOperationsService from "./resolvers-operations.service";
import {ACTIVE_VALUES_FILTER, COLLECTIONS} from "../config/constants";
import {IContextData} from "../interfaces/context-data.interface";


class  ProductService extends ResolversOperationsService{
    collection = COLLECTIONS.PRODUCTS;

    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async details(){
        const result = await this.get(this.collection);

        return {
            status: result.status,
            message: result.message,
            product: result.item
        };
    }
}

export default ProductService;