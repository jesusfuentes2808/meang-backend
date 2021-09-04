import {
    deleteOneElement,
    findElements,
    findOneElement,
    insertOneElement,
    updateOneElement
} from '../lib/lib-operations';
import {COLLECTIONS} from "../config/constants";
import {IContextData} from "../interfaces/context-data.interface";
import {IVariable} from "../interfaces/variable.interface";
import {Db} from 'mongodb';
import {pagination} from "../lib/pagination";
import {IPaginationOptions} from "../interfaces/pagination-options.interface";

class ResolversOperationsService{
    private root:object;
    private variables:IVariable;
    private context:IContextData;

    constructor(root: object, variables: IVariable, context: IContextData) {
        this.root = root;
        this.context = context;
        this.variables = variables;
    }

    protected getDB(): Db{
        return this.context.db!;
    }

    protected getContext(): IContextData{
        return this.context;
    }

    protected getVariables(){
        return this.variables;
    }

    // Listar información
    protected async list(
        collection: string,
        listElement: string,
        page: number = 1,
        itemsPage: number = 20,
        filter: object = { active: { $ne: false} }
    ){
        try {
            const paginationData: IPaginationOptions = await pagination(
                this.getDB(),
                collection,
                page,
                itemsPage,
                filter
                );

            return{
                info: {
                    page: paginationData.page,
                    pages: paginationData.pages,
                    itemsPage: paginationData.itemsPage,
                    total: paginationData.total,
                },
                status: true,
                message: `Lista de ${listElement} correctamente cargada`,
                items: await findElements(this.getDB(), collection, filter, paginationData)
            };

        }catch (error){
            return{
                status: false,
                message: `Lista de ${listElement} no cargada`,
                items: await findElements(this.getDB(), COLLECTIONS.GENRES)
            };
        }
    }

    // Obtener detalles de item
    protected async get(collection: string){

        try {
                const collectionLabel = collection.toLowerCase();
                return await findOneElement(this.getDB(), collection, {id: this.variables.id}
                ).then(
                    (result) => {

                        if(result){
                            return {
                                status: true,
                                message: `${collectionLabel} ${this.variables.id} seleccionado`,
                                item: result,
                            };
                        }

                        return {
                            status: false,
                            message: `${collectionLabel} ${this.variables.id} no ha obtenido detalles`,
                            item: null,
                        };
                    }
                );
        }catch (error){
            return{
                status: false,
                message: `Lista de inesperado al -no cargada`,
                item: await findElements(this.getDB(), COLLECTIONS.GENRES)
            };
        }
    }

    // Añadir Item

    protected async add(collection: string, document: object, item: string){
        try {

            return await insertOneElement(this.getDB(), collection, document).then( res => {
                if(res.result.ok === 1){
                    return{
                        status: true,
                        message: `Añadido correctamente el ${item}`,
                        item: document
                    };
                }
            });

            return{
                status: false,
                message: `No ha insertado el ${item}`,
                item: null
            };
        }catch (error){
            return{
                status: false,
                message: `Error inesperado al insertar el ${item}, intentalo de nuevo por favor`,
                item: null
            };
        }
    }


    // Modificar Item
    protected async update(collection: string, filter: object, objectUpdate: object, item: string){
        try {
            return await updateOneElement(
                        this.getDB(),
                        collection,
                        filter,
                        objectUpdate
            ).then(
                res => {
                    if (res.result.nModified === 1 && res.result.ok) {
                        return{
                            status: true,
                            message: `Elemento del ${item} actualizado correctamente`,
                            item: Object.assign({}, filter, objectUpdate),
                        };
                    }

                    return{
                        status: false,
                        message: `Elemento del ${item}, no se ha actualizado. COmprueba que estas filtrando correctamente o no has actualizadop los datos`,
                        item: null
                    };
                }
            );

        } catch (e) {
            return{
                status: false,
                message: `Error inesperado al actualizar el ${item}, intentalo de nuevo por favor`,
                item: null
            };
        }
    }

    // eliminar

    protected async del(collection: string, filter: object, item: string){
        try {
            //return  await this.getDB().collection(collection).deleteOne(filter).then(
            return  await deleteOneElement(this.getDB(), collection, filter).then(
                res => {
                    if (res.deletedCount === 1) {
                        return{
                            status: true,
                            message: `Elemento del ${item} borrado correctamente`
                        };
                    }

                    return{
                        status: false,
                        message: `Elemento del ${item} no se borró correctamente`
                    };

                }
            );
        } catch (e) {
            return{
                status: false,
                message: `Error inesperado al actualizar el ${item}, intentalo de nuevo por favor`,
                item: null
            };
        }
    }
}

export default ResolversOperationsService;
