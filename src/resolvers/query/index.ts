import GMR from 'graphql-merge-resolvers';
import resolversProductQuery from './product';
import resolversUserQuery from './user';
import resolversGenreQuery from './genre';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductQuery,
    resolversGenreQuery
]);

export default queryResolvers;
