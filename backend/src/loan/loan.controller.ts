import { Controller, Post, Get, Query, Param, Body, HttpCode } from '@nestjs/common';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  // Endpoint para criar um novo empréstimo
  @Post()
  @HttpCode(201) // Retorna status 201 Criado
  async createLoan(
    @Body('clientName') clientName: string,
    @Body('clientId') clientId: string,
    @Body('amount') amount: number,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
    @Body('city') city: string,
    @Body('state') state: string,
    @Body('country') country: string
  ): Promise<{ message: string }> {
    await this.loanService.createLoan(clientName, clientId, amount, latitude, longitude, city, state, country);
    return { message: 'Empréstimo criado com sucesso' };
  }

  // Endpoint para listar empréstimos paginados, filtrando por clientId
  @Get()
  async getLoans(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('clientId') clientId: string,
  ): Promise<any> {
    const loans = await this.loanService.getLoans(page, limit, clientId);
    const pagination = await this.loanService.getLoanPagination(limit, clientId);
    return { loans, ...pagination };
  }

  // Endpoint detalhamento de um empréstimo específico
  @Get(':id')
  async getLoanDetails(@Param('id') id: number): Promise<Loan> {
    return this.loanService.getLoanDetails(id);
  }
}
