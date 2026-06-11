import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "../../customers/entities/customer.entity";
import { User } from "../../users/entities/user.entity";

@Entity('reviews')
export class ReviewEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}