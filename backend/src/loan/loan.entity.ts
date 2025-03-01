  import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

  @Entity()
  export class Loan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientName: string;
    
    @Column()
    clientId: string;

    @Column('decimal')
    amount: number;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    creditScore: number;

    @Column({ type: 'enum', enum: ['Approved', 'Rejected'], default: 'Rejected' })
    status: 'Approved' | 'Rejected';

    @CreateDateColumn()
    createdAt: Date;
  }
