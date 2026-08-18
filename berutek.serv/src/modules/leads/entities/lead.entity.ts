import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@Entity({ name: 'leads' })
export class Lead {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @Column({ name: 'company', type: 'varchar', length: 255, nullable: true })
    company?: string;

    @IsNotEmpty()
    @IsEmail()
    @Column({ name: 'email', type: 'varchar', length: 255 })
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
    description?: string;

    @IsNotEmpty()
    @IsIn(['low', 'medium', 'high', 'urgent'])
    @Column({ name: 'severity', type: 'varchar', length: 20 })
    severity: 'low' | 'medium' | 'high' | 'urgent';

    @IsOptional()
    @IsIn(['new', 'in_progress', 'closed won', 'closed lost'])
    @Column({ name: 'status', type: 'varchar', length: 20, default: 'new', nullable: false })
    status: 'new' | 'in_progress' | 'closed won' | 'closed lost';

    @IsOptional()
    @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @IsOptional()
    @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}