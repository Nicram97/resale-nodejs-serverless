import { Length } from "class-validator";
import { AddressInput } from "./AddressInput";

export class ProfileInput {
    @Length(3, 32)
    firstName: string;

    @Length(3, 32)
    lastName: string;

    @Length(5, 6)
    userType: string;

    address: AddressInput;
}