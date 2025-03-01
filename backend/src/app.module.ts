import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Loan } from './loan/loan.entity';
import { LoanController } from './loan/loan.controller';
import { LoanService } from './loan/loan.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoanConsumerService } from './loan/loan-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Loan],
      synchronize: process.env.NODE_ENV !== 'production', 
    }),
    TypeOrmModule.forFeature([Loan]), // Registra a entidade Loan no repositório do TypeORM
    ClientsModule.register([
      {
        name: 'LOAN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'], // URL do RabbitMQ
          queue: 'loan_queue', 
          queueOptions: {
            durable: true, 
          },
        },
      },
    ]),
  ],
  controllers: [LoanController],
  providers: [LoanService, LoanConsumerService], 
})
export class AppModule {}
