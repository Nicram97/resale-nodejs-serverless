import { aws_apigateway } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
    // put diferrent lambda services here
    productService: IFunction;
    categoryService: IFunction;
    dealsService: IFunction;
}

// interface representing endpoints resource it accepts root name + methods and can accept child paths as additional resources
interface ResourceType {
    name: string;
    methods: string[];
    child?: ResourceType;
}

export class ApiGatewayStack extends Construct {
    constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id);
        this.addResource('product', props);
    }

    addResource(serviceName: string, { categoryService, productService, dealsService } : ApiGatewayStackProps) {
        // for multiple resources we use aws_apigateway.RestApi();
        const apgw = new aws_apigateway.RestApi(this, `${serviceName}-ApiGrt`);
        
        // /product/{id}
        this.createEndpoints(productService, apgw, {
            name: 'product',
            methods: ['GET', 'POST'],
            child: {
                name: '{id}',
                methods: ['GET', 'PUT', 'DELETE'],
            }
        });

        // /category/{id}
        this.createEndpoints(categoryService, apgw, {
            name: 'category',
            methods: ['GET', 'POST'],
            child: {
                name: '{id}',
                methods: ['GET', 'PUT', 'DELETE'],
            }
        });

        // /deals/{id}
        this.createEndpoints(dealsService, apgw, {
            name: 'deals',
            methods: ['GET', 'POST'],
            child: {
                name: '{id}',
                methods: ['GET', 'PUT', 'DELETE'],
            }
        });
    }

    createEndpoints( handler: IFunction, resource: RestApi, { name, methods, child }: ResourceType) {
        // create root level lambda handler
        const lambdaFunction = new LambdaIntegration(handler);
        // create root path and resource
        const rootResource = resource.root.addResource(name);
        // add methods to path
        methods.map((item) => {
            rootResource.addMethod(item, lambdaFunction);
        });

        // handle child paths
        if (child) {
            const childResource = rootResource.addResource(child.name);
            child.methods.map((item) => {
                childResource.addMethod(item, lambdaFunction);
            });
        }
    }
}