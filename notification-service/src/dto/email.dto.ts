import { IsString } from "class-validator";

export class EmailInput {
    @IsString()
    to: string; // to whome send the email

    @IsString()
    name: string; // customer name

    @IsString()
    order_number: string // order number
}