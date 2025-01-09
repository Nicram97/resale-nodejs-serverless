import { CreatePaymentSessionInput } from "app/models/dto/CreatePaymentSessionInput";
import Stripe from "stripe";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

export const APPLICATION_FEE = (totalAmount: number) => {
    const appFee = 1.5 // application fee in %
    return (totalAmount / 100) * appFee;
};

export const STRIPE_FEE = (totalAmount: number) => {
    const perTransaction = 1.5 // 1.5 % per transaction
    const fixCost = 0.29 // 29 cents
    const stripeCost = (totalAmount / 100) * perTransaction

    return stripeCost + fixCost;
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia'
});

export const CreatePaymentSession = async ({ email, phone, amount, customerId }: CreatePaymentSessionInput) => {
    let currentCustomerId: string;

    if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);
        currentCustomerId = customer.id;
    } else {
        const customer = await stripe.customers.create({
            email,
        });
        currentCustomerId = customer.id;
    }

    const { client_secret, id } = await stripe.paymentIntents.create({
        customer: currentCustomerId,
        payment_method_types: ['card'],
        amount: parseInt(`${amount * 100}`), // need to assign as cents
        currency: 'usd',
    });

    return {
        client_secret,
        public_key: STRIPE_PUBLIC_KEY,
        paymentId: id,
        customerId: currentCustomerId,
    };
};

export const RetrievePayment = async (paymentId: string) => {
    return stripe.paymentIntents.retrieve(paymentId);
};
