import {ACTIVE_VALUES_FILTER, COLLECTIONS, EXPIRTIME, MESSAGES} from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import ShopProductService from "../../services/shop-product.service";

const resolversShopProductQuery: IResolvers = {
    Query: {
        shopProducts(_, {page, itemsPage, active}, context){
           return new ShopProductService(_, {page, itemsPage, active}, context).items(active);
        },

        shopProductsPlatforms(_, {page, itemsPage, active, platform, random}, context){
            return new ShopProductService(_, {pagination: {page, itemsPage}, active}, context)
                .items(active, platform, random);
        },

        shopProductsOfferLast(_, {page, itemsPage, active, topPrice, lastUnits, random}, context){
            let otherFilters = {};
            if(lastUnits > 0 && topPrice > 10) {
                otherFilters = {
                    $and: [
                        {price: {$lte: topPrice}},
                        {stock: {$lte: lastUnits}}
                    ]
                };
            } else if(lastUnits <= 0 && topPrice > 10){
                otherFilters = {
                    price: {$lte: topPrice}
                };
            } else if(lastUnits > 0 && topPrice <= 10){
                otherFilters = {
                    stock: {$lte: lastUnits}
                };
            }

            return new ShopProductService(_, {pagination: {page, itemsPage}, active}, context)
                .items(active, ['-1'], random, otherFilters);
        },
    }
};

export default resolversShopProductQuery;
