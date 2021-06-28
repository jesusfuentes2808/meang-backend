import GMR from 'graphql-merge-resolvers';
import resolversShopProductType from "./shop-products";
import resolversPlatformType from "./platform";
import resolversProductType from "./product";

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType
]);

export default typeResolvers;
