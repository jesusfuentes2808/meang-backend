import {IResolvers} from "graphql-tools";
import ShopProductService from "../../services/shop-product.service";

const resolversShopProductMutation: IResolvers = {
    Mutation: {
        async updateStock(_, {update}, { db }){
            console.log(update);
            return new ShopProductService(_, {}, {db})
                .updateStock(update);
        },
    }
};

export default resolversShopProductMutation;