import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Bucket } from '@aws-cdk/aws-s3';
// import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

export class UrlShortnerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'urlShortner', {
      partitionKey: { name: 'short_url', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    const urlShortnerFunction = new lambda.Function(this, 'UrlShortner', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    const lambdaIntegration = new LambdaProxyIntegration({
      handler: urlShortnerFunction
    });

    const httpApi = new apigwv2.HttpApi(this, 'urlShortnerHttpApi');

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigwv2.HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    table.grantReadWriteData(urlShortnerFunction);

  }
}
