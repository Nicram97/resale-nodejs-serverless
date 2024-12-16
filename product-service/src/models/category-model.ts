import mongoose from "mongoose";

type CategoryModel = {
    name: string;
    nameTranslation: string;
    parentId: string;
    subCategories: CategoryDoc[];
    products: string[];
    displayOrder: number;
    imageUrl: string;
}

export type CategoryDoc = mongoose.Document & CategoryModel;

const categorySchema = new mongoose.Schema(
    {
        name: String,
        nameStranslation: { en: { type: String }, de: { type: String }},
        parentId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'categories'
        },
        subCategories: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'categories'
            }
        ],
        products: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'products'
            }
        ],
        displayOrder: { type: String, default: 1 },
        imageUrl: String
    },
    {
        toJSON: {
            transform(doc, ret, options) {
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

export const categories = mongoose.model<CategoryDoc>('categories', categorySchema);
