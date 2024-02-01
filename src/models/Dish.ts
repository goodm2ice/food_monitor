import { ColumnMapping, Migrations, Repository, columnTypes, sql } from 'expo-sqlite-orm'

import { TABLE_NAME as PRODUCTS_TABLE_NAME } from './Product'

export const TABLE_NAME = 'dishes'
export const RELATION_TABLE_NAME = 'dish_product_relation'

interface DishProductRelation {
    id: number
    /** ID блюда */
    dish_id: number
    /** ID продукта */
    product_id: number
    /** Вес продукта в кг */
    weight: number
}

const relationColumnMapping: ColumnMapping<DishProductRelation> = {
    id: { type: columnTypes.INTEGER },
    dish_id: { type: columnTypes.INTEGER },
    product_id: { type: columnTypes.INTEGER },
    weight: { type: columnTypes.FLOAT },
}

export interface Dish {
    id: number
    /** Название блюда */
    title: string
}

const columnMapping: ColumnMapping<Dish> = {
    id: { type: columnTypes.INTEGER },
    title: { type: columnTypes.TEXT },
}

const statements = {
    '': sql`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ${RELATION_TABLE_NAME} (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            dish_id INTEGER NOT NULL REFERENCES ${TABLE_NAME}(id),
            product_id INTEGER NOT NULL REFERENCES ${PRODUCTS_TABLE_NAME}(id),
            count FLOAT NOT NULL
        );
    `,
}

export default class DishModel extends Repository<Dish> {
    private migrations: Migrations
    private relation: Repository<DishProductRelation>

    constructor (databaseName: string) {
        super(databaseName, TABLE_NAME, columnMapping)
        this.relation = new Repository(databaseName, RELATION_TABLE_NAME, relationColumnMapping)
        this.migrations = new Migrations(databaseName, statements)
    }

    async getProducts(id: Dish['id']) {
        return this.relation.query({ where: { dish_id: id } })
    }
}
