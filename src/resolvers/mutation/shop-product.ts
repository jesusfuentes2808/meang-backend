import {IResolvers} from "graphql-tools";
import ShopProductService from "../../services/shop-product.service";

const resolversShopProductMutation: IResolvers = {
    Mutation: {
        async updateStock(_, {update}, { db, pubsub }){
            return new ShopProductService(_, {}, {db})
                .updateStock(update, pubsub);
        },
    }
};

export default resolversShopProductMutation;