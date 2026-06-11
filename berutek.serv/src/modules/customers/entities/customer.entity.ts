import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReviewEntity } from "../../reviews/entities/review.entity";

@Entity('customers')
@Index(['email'], { unique: true })
export class CustomerEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
    companyName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

}