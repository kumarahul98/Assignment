#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { LearnCdkStack } from '../lib/learn-cdk-stack';

const app = new cdk.App();
new LearnCdkStack(app, 'LearnCdkStack');
