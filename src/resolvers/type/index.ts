import GMR from 'graphql-merge-resolvers';
import resolversShopProductType from "./shop-products";
import resolversPlatformType from "./platform";
import resolversProductType from "./product";
import typeStripeResolvers from "./stripe";

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType,

    typeStripeResolvers
]);

export default typeResolvers;
