export interface IBlog {
    id: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    category: string | null;
    createdBy: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
