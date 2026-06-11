import { IUser } from "../../users/interfaces/user.interface";

export interface IReview {
    id: string;
    userId: string;
    rating: number;
    comment: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: IUser;
}
