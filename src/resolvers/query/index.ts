import GMR from 'graphql-merge-resolvers';
import resolversUserQuery from './user';
import resolversGenreQuery from './genre';
import resolversShopProductQuery from "./shop-product";
import queryStripeResolvers from "./stripe";

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopProductQuery,
    resolversGenreQuery,
    queryStripeResolvers
]);

export default queryResolvers;
