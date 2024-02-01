import { ColumnMapping, Migrations, Repository, columnTypes, sql } from 'expo-sqlite-orm'

export const TABLE_NAME = 'products'

export enum ProductPackType { Pack = 'P', Weight = 'W' }

export interface Product {
    id: number
    /** Название продукта */
    title: string
    /** Белки на 100г (г) */
    proteins: number
    /** Жиры на 100г (г) */
    fats: number
    /** Углеводы на 100г (г) */
    carbohydrates: number
    /** Клетчатка на 100г (г) */
    cellulose: number
    /** Цена за упаковку/кг */
    price: number
    /** Вид поставки (упаковка/вес) */
    pack_type: ProductPackType
}

const columnMapping: ColumnMapping<Product> = {
    id: { type: columnTypes.INTEGER },
    title: { type: columnTypes.TEXT },
    proteins: { type: columnTypes.FLOAT },
    fats: { type: columnTypes.FLOAT },
    carbohydrates: { type: columnTypes.FLOAT },
    cellulose: { type: columnTypes.FLOAT },
    price: { type: columnTypes.FLOAT },
    pack_type: { type: columnTypes.TEXT },
}

const statements = {
    '': sql`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            proteins FLOAT DEFAULT 0,
            fats FLOAT DEFAULT 0,
            carbohydrates FLOAT DEFAULT 0,
            cellulose FLOAT DEFAULT 0,
            price FLOAT DEFAULT 0,
            pack_type TEXT CHECK( pack_type IN ('P', 'W') ) DEFAULT 'P',
        );
    `,
}

export default class ProductModel extends Repository<Product> {
    private migrations: Migrations

    constructor (databaseName: string) {
        super(databaseName, TABLE_NAME, columnMapping)
        this.migrations = new Migrations(databaseName, statements)
    }
}
