import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ServiceStack } from './service-stack';
import { ApiGatewayStack } from './api-gateway-stack';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // spawn services which represent lambdas
    const { productService, categoryService, dealsService } = new ServiceStack(this, 'ProductService', {
      
    });
    // spawn api gateway and pass lambda services inside of api gateway to "show them to the world through API"
    new ApiGatewayStack(this, 'ProductApiGateway', {
      productService,
      categoryService,
      dealsService,
    });
  }
}