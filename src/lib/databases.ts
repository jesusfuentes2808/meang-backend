import chalk from 'chalk';
import MongoClient from 'mongodb';

class Database {
    async init() {
        const MONGO_DB = process.env.DATABASE 
                        || 
                        'mongodb://127.0.0.1:27017/mega-online-shop';
        const client = await MongoClient.connect(MONGO_DB, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        const db = client.db();

        if(client.isConnected()) {
            console.log('=========================DATABASE=========================');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
            console.log(`DATABASE: ${chalk.greenBright(db.databaseName)}`);
            console.log('=========================DATABASE=========================');
        }

        return db;
    }
}

export default Database;