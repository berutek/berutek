export interface IService {
    id: string;
    name: string;
    description: string;
    tags: string[];
    icon: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
