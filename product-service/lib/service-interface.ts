import { IFunction } from "aws-cdk-lib/aws-lambda";

export interface ServiceInterface {
    // products
    readonly createProduct: IFunction;
    readonly editProduct: IFunction;
    readonly getProducts: IFunction; //customer 
    readonly getSellerProducts: IFunction;
    readonly getProduct: IFunction; // customer / seller
    readonly deleteProduct: IFunction;

    // categories
    readonly createCategory: IFunction;
    readonly editCategory: IFunction;
    readonly getCategories: IFunction;
    readonly getCategory: IFunction;
    readonly deleteCategory: IFunction;

    // deals
    readonly createDeals: IFunction;

    // other
    readonly imageUploader: IFunction;
    readonly messageQueueHandler: IFunction;
}