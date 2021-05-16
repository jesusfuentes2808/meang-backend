import {Db} from "mongodb";
import {countElements} from "./lib-operations";

export async function pagination(
    db: Db,
    collection: string,
    page: number = 1,
    itemsPage: number = 2) {
    if(itemsPage < 1 || itemsPage > 20){
        itemsPage = 20;
    }

    if(page < 1){
        page = 1;
    }

    const total = await countElements(db, collection);
    const pages = Math.ceil(+total / itemsPage);

    return{
        page,
        skip: (page -1) * itemsPage,
        itemsPage: +itemsPage,
        total,
        pages
    }
}
