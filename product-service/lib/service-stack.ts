import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ServiceInterface } from "./service-interface";

interface ServiceProps {
    bucket: string;
}

export class ServiceStack extends Construct {
    public readonly services: ServiceInterface;

    constructor(scope: Construct, id: string, props: ServiceProps) {
        super(scope, id);

        const nodejsFunctionProps: NodejsFunctionProps = {
            bundling: {
                externalModules: ['aws-sdk'],
            },
            environment: {
                BUCKET_NAME: props.bucket,
            },
            runtime: Runtime.NODEJS_18_X,
            timeout: Duration.seconds(10),
        };
        
        this.services = {
            createProduct: this.createHandler(nodejsFunctionProps, 'createProduct'),
            editProduct: this.createHandler(nodejsFunctionProps, 'editProduct'),
            getProducts: this.createHandler(nodejsFunctionProps, 'getProducts'),
            getSellerProducts: this.createHandler(nodejsFunctionProps, 'getSellerProducts'),
            getProduct: this.createHandler(nodejsFunctionProps, 'getProduct'),
            deleteProduct: this.createHandler(nodejsFunctionProps, 'deleteProduct'),

            createCategory: this.createHandler(nodejsFunctionProps, 'createCategory'),
            editCategory: this.createHandler(nodejsFunctionProps, 'editCategory'),
            getCategories: this.createHandler(nodejsFunctionProps, 'getCategories'),
            getCategory: this.createHandler(nodejsFunctionProps, 'getCategory'),
            deleteCategory: this.createHandler(nodejsFunctionProps, 'deleteCategory'),

            createDeals: this.createHandler(nodejsFunctionProps, 'createDeals'),

            imageUploader: this.createHandler(nodejsFunctionProps, 'imageUploader'),
            messageQueueHandler: this.createHandler(nodejsFunctionProps, 'messageQueueHandler'),
        }
    }

    createHandler(props: NodejsFunctionProps, handler: string): NodejsFunction {
        return new NodejsFunction(this, handler, {
            entry: join(__dirname, '/../src/handlers/index.ts'),
            handler: handler,
            ...props,
        });
    }
}