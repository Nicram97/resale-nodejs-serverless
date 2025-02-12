import * as cdk from 'aws-cdk-lib';
import { SubscriptionFilter, Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { ServiceStack } from './service-stack';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class NotificationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // email queue
    const emailQueue = new Queue(this, 'email_queue', {
      visibilityTimeout: cdk.Duration.seconds(180),
    });

    // sms queue
    const otpQueue = new Queue(this, 'otp_queue', {
      visibilityTimeout: cdk.Duration.seconds(180),
    });

    // topic -> customer_email, customer_otp
    const topic = new Topic(this, 'notification_topic');
    this.addSubscription(topic, emailQueue, ['customer_email']);
    this.addSubscription(topic, otpQueue, ['customer_otp']);

    const { emailHandler, otpHandler } = new ServiceStack(this, 'notification_service', {});

    // Allow email handler lambda to access AWS SES (Simple Email Service)
    emailHandler.addToRolePolicy(
      new PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
        effect: Effect.ALLOW,
      }),
    );

    // email handler
    emailHandler.addEventSource(new SqsEventSource(emailQueue));
    // otp handler
    otpHandler.addEventSource(new SqsEventSource(otpQueue));

    // add subscription
    new cdk.CfnOutput(this, 'NotificationTopic', {
      value: topic.topicArn,
      exportName: 'notifySvcArn',
    });
  }

  addSubscription(topic: Topic, queue: Queue, allowlist: string[]) {
    topic.addSubscription(
      new SqsSubscription(queue, {
        rawMessageDelivery: true,
        filterPolicy: {
          actionType: SubscriptionFilter.stringFilter({
            allowlist,
          }),
        },
      }),
    )
  }
}
