import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import type { CreateReviewDto } from "../schemas/create-review.schema";
import type { UpdateReviewDto } from "../schemas/update-review.schema";

@Injectable()
export class ReviewRepository {

    constructor(
        @InjectRepository(ReviewEntity)
        private readonly repo: Repository<ReviewEntity>,
    ) {}

    findAll(): Promise<ReviewEntity[]> {
        return this.repo.find({ where: { isDeleted: false }, relations: ['customer'] });
    }

    findByCustomerId(customerId: string): Promise<ReviewEntity[]> {
        return this.repo.find({ where: { customerId, isDeleted: false } });
    }

    findOneById(id: string): Promise<ReviewEntity | null> {
        return this.repo.findOne({ where: { id, isDeleted: false }, relations: ['customer'] });
    }

    create(dto: CreateReviewDto): Promise<ReviewEntity> {
        const review = this.repo.create(dto);
        return this.repo.save(review);
    }

    async update(id: string, dto: UpdateReviewDto): Promise<ReviewEntity> {
        await this.repo.update(id, dto);
        return await this.findOneById(id) ?? Promise.reject(new NotFoundException('Review ' + id));
    }

    async delete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}
