import { IResolvers } from 'graphql-tools';
import PlatformService from "../../services/platform.service";

const resolversPlatformType: IResolvers = {
    Platform: {
        //type-objects shop-product
        active: (parent) => parent.active !== false ? true : false,

    }
};

export default resolversPlatformType;
