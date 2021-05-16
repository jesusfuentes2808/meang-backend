import ResolversOperationsService from './resolvers-operations.service';
import {asignDocumentId, findElements, findOneElement} from '../lib/lib-operations';
import {COLLECTIONS} from '../config/constants';
import {IContextData} from '../interfaces/context-data.interface';
import slugify from 'slugify';

class GenresService extends ResolversOperationsService{
    collection = COLLECTIONS.GENRES;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async items(){
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'géneros', page, itemsPage);

        return {
            status: result.status,
            message: result.message,
            genres: result.items,
            info: result.info
        };
    }
    // Listar información

    async details(){
        const result = await this.get(this.collection);

        return {
            status: result.status,
            message: result.message,
            genre: result.item
        };
    }
    // Obtener detalles de item

    // Añadir Item

    async insert(){
        let genre = this.getVariables().genre;

        if(!this.checkData(genre || '')){
            return {
                status: false,
                message: 'El género especificado no es correcto',
                genre: null,
            };
        }

        if(await this.checkInDataBase( genre || '' )){
            return {
                status: false,
                message: 'El género exist5e en la base de datos',
                genre: null,
            };
        }

        const genreObject = {
            id: await asignDocumentId(this.getDB(), this.collection, { id: -1}),
            name: genre,
            slug: slugify(genre || '', {lower: true}),
        };

        const result: any = await this.add(this.collection,  genreObject, 'genero');

        return {
            status: result.status,
            message: result.message,
            genre: result.item
        };
    }

    async modify(){
        const id = this.getVariables().id;
        const genre = this.getVariables().genre;

        if(!this.checkData(String(id) || '')){
            return {
                status: false,
                message: 'El id del género existe en la base de datos',
                genre: null,
            };
        }

        if(!this.checkData(genre || '')){
            return {
                status: false,
                message: 'El género existe en la base de datos',
                genre: null,
            };
        }

        const objectUpdate = {
            name: genre,
            slug: slugify(genre || '', {lower: true})
        };

        const result = await this.update(this.collection, {id}, objectUpdate, 'genero');

        return {
            status: result.status,
            message: result.message,
            genre: result.item
        };
    }

    async  delete(){
        const id = this.getVariables().id;

        if(!this.checkData(String(id) || '')){
            return {
                status: false,
                message: 'El id del  género existe en la base de datos',
            };
        }

        const result = await this.del(this.collection, {id}, 'genero');

        return {
            status: result.status,
            message: result.message
        };
    }

    private checkData(value: string): boolean{
        return (value === '' || value === undefined) ? false : true;
    }

    private async checkInDataBase(value: string) {
        console.log(await findOneElement(this.getDB(), COLLECTIONS.GENRES,
            {name: value}
        ));
        return await findOneElement(this.getDB(), COLLECTIONS.GENRES,
            {name: value}
        );
    }
    // Modificar Item

    // eliminar
}

export default GenresService;
