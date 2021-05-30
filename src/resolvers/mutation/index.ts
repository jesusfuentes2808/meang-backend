import GMR from 'graphql-merge-resolvers';
import resolversUserMutation from './user';
import resolversGenreMutation from "./genre";
import resolversMailMutation from "./email";

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversMailMutation
]);

export default mutationResolvers;
