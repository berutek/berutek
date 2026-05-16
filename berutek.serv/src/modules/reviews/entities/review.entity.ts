import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "../../customers/entities/customer.entity";

@Entity('reviews')
export class ReviewEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;

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

    @OneToOne(() => CustomerEntity)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;
}