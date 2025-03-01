  import { Injectable, OnModuleInit } from '@nestjs/common';
  import { EventPattern, Payload } from '@nestjs/microservices';
  import { LoanService } from './loan.service';
  import { Loan } from './loan.entity';
  import axios from 'axios';

  @Injectable()
  export class LoanConsumerService implements OnModuleInit {
    constructor(private readonly loanService: LoanService) {}

    onModuleInit() {
      console.log('🚀 LoanConsumerService iniciado e ouvindo RabbitMQ...');
    }

    @EventPattern('loan_queue')
    async handleLoanCreated(@Payload() payload: any) {
    const loanData = payload; 
  console.log('📩 Mensagem recebida:', loanData);

  try {
    
    // Gerando a pontuação de crédito
    const creditScore = await this.loanService.getCreditScore();
    const status = creditScore >= 600 ? 'Approved' : 'Rejected';

    // Criando e salvando o empréstimo no banco de dados
    const loan = this.loanService.loanRepository.create({
      clientName: loanData.clientName,
      clientId: loanData.clientId,
      amount: loanData.amount,
      latitude: loanData.latitude,
      longitude: loanData.longitude,
      city: loanData.city,
      state: loanData.state,
      country: loanData.country,
      creditScore,
      status,
    });

    await this.loanService.loanRepository.save(loan);
    console.log('✅ Empréstimo salvo no banco:', loan);
  } catch (error) {
    console.error('❌ Erro ao processar empréstimo:', error);
  }
}

   
  }
