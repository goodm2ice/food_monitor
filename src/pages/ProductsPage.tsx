import { memo, useMemo } from 'react'
import { Text } from 'react-native-paper'

import ProductModel from '../models/Product'
import { DB_NAME } from '../settings'

export const ProductsPage = memo(() => {
    const products = useMemo(() => new ProductModel(DB_NAME), [])

    return (
        <Text>Products Page</Text>
    )
})

export default ProductsPage
