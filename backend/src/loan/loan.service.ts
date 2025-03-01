import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly _loanRepository: Repository<Loan>,
    @Inject('LOAN_SERVICE') private readonly client: ClientProxy, 
  ) {}

  get loanRepository(): Repository<Loan> {
    return this._loanRepository;
  }

  // Cria um novo empréstimo e envia para a fila RabbitMQ
  async createLoan(
    clientName: string,
    clientId: string,
    amount: number,
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    country: string
  ): Promise<void> {
     
    const loanData = {
      clientName,
      clientId,
      amount,
      latitude,
      longitude,
      city,
      state,
      country,
    };
  
    console.log(loanData);
    
    try {
      // Gera a pontuação de crédito e define o status
      const creditScore = await this.getCreditScore();
      const status = creditScore >= 600 ? 'Approved' : 'Rejected';

     
      const loan = this.loanRepository.create({
        ...loanData, 
        creditScore,
        status,
      });

      // Salva o empréstimo no banco de dados
      await this.loanRepository.save(loan);
      console.log('Empréstimo salvo no banco:', loan);
    } catch (error) {
      console.error('Erro ao salvar empréstimo no banco de dados:', error);
    }
    // Publica a mensagem na fila 'loan_queue' para o rabbitMQ
    this.client.emit('loan_queue',  loanData ); 
  }

  // Função para obter a pontuação de crédito
  async getCreditScore(): Promise<number> {
    try {
      const response = await axios.get('https://www.randomnumberapi.com/api/v1.0/random?min=100&max=800');
      return response.data[0]; 
    } catch (error) {
      console.error('Erro ao obter a pontuação de crédito:', error);
      return 0; 
    }
  }

  async getLoans(page: number, limit: number, clientId: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { clientId },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getLoanPagination(limit: number, clientId: string) {
    const totalItems = await this.loanRepository.count({ where: { clientId } });
    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async getLoanDetails(id: number): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
    });

    if (!loan) {
      throw new Error(`Empréstimo com ID ${id} não encontrado`);
    }

    return loan;
  }
}

