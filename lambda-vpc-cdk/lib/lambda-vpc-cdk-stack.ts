import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';


export class LambdaVpcCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myvpc = new ec2.Vpc(this, 'cloud-assignment', {
      cidr: "10.0.0.0/16", //optional
      // natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 26,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,

        },
      ],
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
          subnets: [
            { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }]
        },
      },
    });

    const mysg = new ec2.SecurityGroup(this, 'assignment2-lambda-endpoint', {
      allowAllOutbound: true,
      vpc: myvpc
    });
    const pvtSubnet = myvpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    });

    const getObject = new lambda.Function(this, 'get-object', {
      vpc: myvpc,
      vpcSubnets: pvtSubnet,
      securityGroups: [mysg],
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: "redirect-url",
        FILE_NAME: "1626288171"
      }
    });

  }
}
