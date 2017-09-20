# Alexa_AskManny

Pre-requisites:

AWS API Key and Secret
  * Navigate to IAM service, create a user with API Access Keys
  * Grant full access to DynamoDB and SNS to user


Create DynamoDB table:
  * Tablename: 'AskYourName'
  * PrimaryKey: UserId
  * Read/Write Throughtput: 5/5

Modify lambda IAM Role:
  - Add Policies:
    * AmazonDynamoDBFullAccess
    * AmazonSNSFullAccess 

Install:

  * Clone repo
  * In root directory of project:
    - yarn install

Test:
  Pre-req:  Export your AWS key environmental variables from IAM.
  * export AWS_ACCESS_KEY_ID=<insert key>
  * export AWS_SECRET_ACCESS_KEY=<insert secret>
  * In root directory of project
    - yarn test

Troubleshooting:
  * If you get a timeout during the mocha test, make sure you are not on visigoth and are not using a proxy (unset http_proxy, https_proxy)
  
