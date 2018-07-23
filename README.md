## What this package does
This package allows for trivial versioning of HTTP endpoints for Lambda functions using the Serverless framework.  I'm not involved with Serverless development and any failings of this library reflect on me and not on Serverless.  Additionally, this library is currently very much a WIP.  There are no unit tests.  

## Assumptions
* API releases correspond with Github releases
* Single Github repository for all functions defined in the serverless.yml
* API is versioned like 'v1', 'v2', etc.  
* Each release bundles all necessary files including the serverless.yml associated with each version.
* That you aren't already using a `./releases` folder.  

## Use case
If you have a series of endpionts that you don't want to force people to migrate, this CLI tool can enable API versioning without manually updating your serverless.yml.  

## How it works
Previous versions are downloaded into a `./releases` folder. It then creates a combined serverless.yml file with versioning of the API endpoints.

## Workflow
Go do your normal Lambda stuff.  When you want to upgrade an API, use the CLI command `serverless-api-version new`.  This will create a combined serverless.yml and packaged assets by version in the `./releases` folder. You can set up your CI/CD tool to either automatically deploy on tagged commit or manually trigger a deploy.  

## Installation

`npm install -g serverless-api-version`

## Use
`serverless-api-version new` to create a new release with new API endpoint.  The CLI will handle creating a new tag, release, etc on the Github side.  
`serverless-api-version replace` to replace the previous API version.
