#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UrlShortnerStack } from '../lib/url-shortner-stack';

const app = new cdk.App();
new UrlShortnerStack(app, 'UrlShortnerStack', {});
