import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('sessions')
@Index(['expiredAt'])
export class Session {
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;

  @Column('bigint')
  expiredAt: number;
}