# Resale-nodejs-serverless

Mimic ebay like backend behaviour.

Techstack:

- nodejs
- serverless
- PostgreSQL
- Amazon S3

## Project Design

1. Product requirements
2. System Design
3. Technology & Infrastructure
4. CICD

### 1. Product requirements

Build a web application to manage buy/sale of new and used/old products in certain price range.
Client in position of buyer should be able to search/view products of choice and buy it online.
As for a client being the seller he should be able to post products with description,
advertise them and manage their prace/existance.

App should provide way of communication between seller and buyer, the communication should be fully direct
without need of a 3rd party "person" all should be allowed through app. Also possibility to buy products with given price
Payments system should collect the money for the product and a fee of some % of the final product price. Mentioned % will be
passed to app owner and rest will transferred to the seller.

Buyer can rate purchase experience, seller and delivery. Manage communication of the process
through sms or/and email.

#### Use cases
* Seller can sale products online
* Buyer can purchase products online
* Transaction will take place between C2C (Client To Client)
* A fee of % will be charged per final transaction
* Notification/communication channel needed to colaborate between seller and buyer
