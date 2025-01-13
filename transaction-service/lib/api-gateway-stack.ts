import { aws_apigateway } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
    createOrder: IFunction,
    getOrder: IFunction,
    getOrders: IFunction,
    getTransaction: IFunction,
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
        this.addResource('transaction', props);
    }

    addResource(serviceName: string, { getOrder, getOrders, getTransaction }: ApiGatewayStackProps) {
        const apgw = new aws_apigateway.RestApi(this, `${serviceName}-Api`, {
            defaultCorsPreflightOptions: {
                allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
            },
        });

        // order endpoint
        const orderResource = this.createEndpoints(getOrders, apgw, {
            name: 'orders',
            methods: [
                'GET',
            ],
        });
        this.addChildEndpoint('{id}', 'GET', getOrder, orderResource);

        this.createEndpoints(getTransaction, apgw, {
            name: 'transaction',
            methods: [
                'GET',
            ],
        });
    }

    createEndpoints(
        handler: IFunction,
        resource: RestApi,
        { name, methods, child }: ResourceType
    ) {
        const lambdaFunction = new LambdaIntegration(handler);
        const rootResource = resource.root.addResource(name);
        methods.map((item) => {
            rootResource.addMethod(item, lambdaFunction);
        });
        return rootResource;
    }

    addChildEndpoint(
        path: string,
        methodType: string,
        handler: IFunction,
        resource: aws_apigateway.Resource,
    ) {
        const lambdaFunction = new LambdaIntegration(handler);
        const childResource = resource.addResource(path);
        childResource.addMethod(methodType, lambdaFunction);
    }
}