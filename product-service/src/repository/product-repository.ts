import { ProductInput } from "../dto/product-input";
import { ProductDoc, products } from "../models";

export class ProductRepository {
    constructor() {}

    async createProduct({ name, description, price, category_id, image_url }: ProductInput): Promise<ProductDoc> {
        const result = await products.create({
            name,
            description,
            price,
            category_id,
            image_url,
            availability: true,
        });
        return result;
    }

    async getAllProducts(offset = 0, pages?: number) {
        return products.find().skip(offset).limit(pages ? pages : 500);
    }

    async getProductById(id: string): Promise<ProductDoc | null> {
        return products.findById(id);
    }

    async updateProduct({ id, name, description, price, category_id, image_url, availability}: ProductInput) {
        const existingProduct = await products.findById(id) as ProductDoc;
        existingProduct.name = name;
        existingProduct.description = description;
        existingProduct.price = price;
        existingProduct.category_id = category_id;
        existingProduct.image_url = image_url;
        existingProduct.availability = availability;

        return existingProduct.save();
    }

    async deleteProduct(id: string) {
        const { category_id } = (await products.findById(id)) as ProductDoc;
        const deleteResult = await products.deleteOne({
            _id: id,
        });

        return { category_id, deleteResult };
    }
}