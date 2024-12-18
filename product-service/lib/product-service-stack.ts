import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ServiceStack } from './service-stack';
import { ApiGatewayStack } from './api-gateway-stack';
import { S3BucketStack } from './s3bucket-stack';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new S3BucketStack(this, 'product-images');

    // spawn services which represent lambdas
    const { 
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService,
    } = new ServiceStack(this, 'ProductService', {
      bucket: bucket.bucketName
    });

    // assign permissions for bucket
    bucket.grantReadWrite(imageService);

    // spawn api gateway and pass lambda services inside of api gateway to "show them to the world through API"
    new ApiGatewayStack(this, 'ProductApiGateway', {
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService
    });
  }
}