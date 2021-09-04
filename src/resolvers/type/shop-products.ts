import { IResolvers } from 'graphql-tools';
import ProductService from "../../services/product.service";
import PlatformService from "../../services/platform.service";
import {findElements} from "../../lib/lib-operations";
import {COLLECTIONS} from "../../config/constants";


const resolversShopProductType: IResolvers = {
    ShopProduct: {
        //type-objects shop-product
        productId: (parent) => parent.product_id,
        platformId: (parent) => parent.platform_id,
        product: async (parent, __, {db}) => {
            const result =
                await new ProductService(
                    {},
                    {id: parent.product_id},
                    {db}).details();

            return result.product;
        },
        platform: async (parent, __, {db}) => {
            const result =
                await new PlatformService(
                    {},
                    {id: parent.platform_id},
                    {db}).details();

            return result.platform;
        },
        relationalProducts: async (parent, __, {db}) => {
            const result =
                await findElements(
                    db,
                    COLLECTIONS.SHOP_PRODUCT,
                    {
                        $and: [
                            {product_id: parent.product_id},
                            {id: {$ne: parent.id}}
                        ]
                    });

            return result;
        }
    }
};

export default resolversShopProductType;
