import { SQSEvent } from "aws-lambda";
import { EmailInput } from "../dto/email.dto";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { SendEmailUsingSES } from "../providers/email";

// if You can't see email in message box, check Spam folder
export const CustomerEmailHandler = async (event: SQSEvent) => {
    console.log('Email handler');
    const response: Record<string, unknown>[] = [];

    const promisses = event.Records.map(async (record) => {
        const input = plainToClass(EmailInput, JSON.parse(record.body));

        const errors = await AppValidationError(input);

        console.log('ERRORS: ', JSON.stringify(errors));

        if (!errors) {
            const { to, name, order_number } = input;
            const emailBody = `Dear Mr/s. ${name}, thank You for conducting business with us. here is You order number for future reference: ${order_number}`;

            const emailOutput = await SendEmailUsingSES(to, emailBody);
            console.log('Send email output ', emailOutput);
            // const orderTemplate = ORDER_CONFIRMATION(to, name, order_number);

            // await SendEmail(orderTemplate);
        } else {
            response.push({ error: JSON.stringify(errors) });
        }
    });

    await Promise.all(promisses);

    console.log('SQS response: ', response);

    return { response };
}