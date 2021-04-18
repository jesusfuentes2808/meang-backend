import { IResolvers } from '@graphql-tools/utils';
import query  from './query';
import mutation  from './mutation';

const resolvers: IResolvers = {
    ...query,
    ...mutation
};

export default resolvers;