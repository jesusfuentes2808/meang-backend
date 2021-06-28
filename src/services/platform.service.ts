import ResolversOperationsService from "./resolvers-operations.service";
import {ACTIVE_VALUES_FILTER, COLLECTIONS} from "../config/constants";
import {IContextData} from "../interfaces/context-data.interface";


class  PlatformService extends ResolversOperationsService{
    collection = COLLECTIONS.PLATFORMS;

    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async details(){
        const result = await this.get(this.collection);

        return {
            status: result.status,
            message: result.message,
            platform: result.item
        };
    }
}

export default PlatformService;