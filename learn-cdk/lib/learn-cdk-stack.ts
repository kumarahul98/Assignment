
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hitcounter';

import { TableViewer } from 'cdk-dynamo-table-viewer';


export class LearnCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const fun = new lambda.Function(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    const hitcounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: fun
    });

    const api = new apigw.LambdaRestApi(this, 'hello-api', {
      handler: hitcounter.handler

    });

    new TableViewer(this, 'viewHits', {
      title: "Total Hits",
      table: hitcounter.table
    });

  }
}
