import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "../repositories/review.repository";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import type { IReview } from "../interfaces/review.interface";
import type { CreateReviewDto } from "../schemas/create-review.schema";
import type { UpdateReviewDto } from "../schemas/update-review.schema";

@Injectable()
export class ReviewService {

    constructor(private readonly repo: ReviewRepository) {}

    findAll(): Promise<IReview[]> {
        return this.repo.findAll();
    }

    findByCustomerId(customerId: string): Promise<IReview[]> {
        return this.repo.findByCustomerId(customerId);
    }

    async findOne(id: string): Promise<IReview> {
        const review = await this.repo.findOneById(id);
        if (!review) throw new NotFoundException('Review ' + id);
        return review;
    }

    create(dto: CreateReviewDto): Promise<IReview> {
        return this.repo.create(dto);
    }

    async update(id: string, dto: UpdateReviewDto): Promise<IReview> {
        await this.findOne(id);
        return this.repo.update(id, dto);
    }

    async delete(id: string): Promise<void> {
        await this.findOne(id);
        return this.repo.delete(id);
    }
}
