import type { ICustomer } from "../../customers/interfaces/customer.interface";

export interface IReview {
    id: string;
    customerId: string;
    rating: number;
    comment: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    customer?: ICustomer;
}
