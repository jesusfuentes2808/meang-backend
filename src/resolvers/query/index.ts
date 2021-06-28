import GMR from 'graphql-merge-resolvers';
import resolversUserQuery from './user';
import resolversGenreQuery from './genre';
import resolversShopProductQuery from "./shop-product";

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopProductQuery,
    resolversGenreQuery
]);

export default queryResolvers;
