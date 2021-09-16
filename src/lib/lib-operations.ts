import { Db } from 'mongodb';
import databases from "./databases";
import {IPaginationOptions} from "../interfaces/pagination-options.interface";
import {pagination} from "./pagination";
 
/**
  * 
  * @param database Base de datos con la que estamos trabajando
  * @param collection Colección donde queremos buscar el ultimo elemento
  * @param sort Como quertemos ordenarlo { <propiedad>: -1 }
  * @returns 
  */
export const asignDocumentId = async(
    database: Db,
    collection: string,
    sort: object = {registerDate: -1}
) => {
    const lastElemet = await database.collection(collection).
                            find().
                            limit(1).
                            sort(sort).
                            toArray();
    if(lastElemet.length === 0){
        return '1';
    } else {
        return String(+lastElemet[0].id + 1);
    }
};

export const findOneElement = async(
    database: Db,
    collection: string,
    filter: object
) => {
    return await database
                .collection(collection)
                .findOne(filter);
};

export const insertOneElement = async(
    database: Db,
    collection: string,
    document: object
) => {
    return await database.collection(collection).
                    insertOne(document);
};

export const insertManyElements = async(
    database: Db,
    collection: string,
    document: Array<object>
) => {
    return await database.collection(collection).
                    insertMany(document);
};

export const updateOneElement = async(
    database: Db,
    collection: string,
    filter: object,
    objectUpdate: object
) => {
    return await database.collection(collection).
                                            updateOne(
                                                filter,
                                                {$set: objectUpdate}
                                            );
};

export const findElements = async(
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions = {
        page: 1,
        pages: 1,
        itemsPage: -1,
        skip: 0,
        total:-1
    }
) => {
    if(paginationOptions.total === -1){
        return await database.collection(collection).
                                find(filter).toArray();
    } else {
        return await database.collection(collection).
                                find(filter).
                                limit(paginationOptions.itemsPage).
                                skip(paginationOptions.skip).
                                toArray();
    }

};


export const deleteOneElement = async(
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).deleteOne(filter);
};

export const  countElements = async (
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).countDocuments(filter);
};

export const randomItems = async(
    database: Db,
    collection: string,
    filter: object = {},
    items: number = 10
): Promise<Array<object>> => {
    return new Promise(async (resolve) => {
        const pipeline = [
            { $match: filter },
            { $sample: {size: items} }
        ];

        const operation = await database.collection(collection)
                                        .aggregate(pipeline)
                                        .toArray();
        resolve(operation);
    });
};

export const manageStockUpdate = async(
    database: Db,
    collection: string,
    filter: object,
    updateObject: object
) => {
    return await database.collection(collection).
    updateOne(
        filter,
        {$inc: updateObject}
    );
};

