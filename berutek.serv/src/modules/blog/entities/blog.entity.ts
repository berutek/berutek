import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('blogs')
@Index(['title'], { unique: true })
export class BlogEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'simple-array', default: '' })
    tags: string[];

    @Column({ type: 'varchar', length: 20, nullable: true })
    category: string | null;

    @Column({ name: 'created_by', type: 'varchar', length: 255 })
    createdBy: string;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

}
