import { Db } from 'mongodb';
 
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
    filter: object = {}
) => {
    return await database.collection(collection).
                    find(filter).toArray();
};


export const deleteOneElement = async(
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).deleteOne(filter);
};

