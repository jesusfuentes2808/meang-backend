import { IResolvers } from 'graphql-tools';
import PlatformService from "../../services/platform.service";

const resolversProductType: IResolvers = {
    Product: {
        //type-objects shop-product
        screenshoot: (parent) => parent.shortScreenshots,

    }
};

export default resolversProductType;
