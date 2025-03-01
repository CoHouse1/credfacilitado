# Nome do Projeto
CredFacilitado
## Breve descrição do projeto

Este projeto é uma aplicação que simula o fluxo de solicitação de empréstimos em um ambiente de microcrédito. O sistema permite a criação, listagem e detalhamento de empréstimos, com processamento assíncrono e integração com APIs externas para geolocalização e pontuação de crédito. A aprovação ou rejeição dos empréstimos é realizada com base na pontuação de crédito obtida, e as informações são armazenadas em um banco de dados.

## Tecnologias utilizadas

- **Next.js 14+** - Framework para o frontend.
- **NestJS** - Framework para o backend.
- **TypeORM** - ORM para interagir com o banco de dados PostgreSQL.
- **PostgreSQL** - Banco de dados relacional.
- **RabbitMQ** - Fila de mensagens para processamento assíncrono (não implementada, substituída por query direta no banco).
- **Stack Auth** - Para autenticação de usuários.

## Instruções para instalação e execução do projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- PostgreSQL
- RabbitMQ 

### Passos para execução

1. Clone o repositório:
   ```bash
   git clone <URL do repositório>
   cd <diretório do projeto>

2. Construa a imagem Docker:
 - Acesse a raiz do diretório
 - Execute o seguinte comando:
   ```bash
   docker-compose up --build.

3. Acesse a aplicação no navegador:
 - Frontend: http://localhost:3001
 - Backend: http://localhost:3000

# Abordagem adotada no desenvolvimento
Durante o desenvolvimento, utilizei uma arquitetura de microserviços com comunicação assíncrona via RabbitMQ, que, apesar de não ter sido finalizada devido a dificuldades na configuração, foi uma parte importante do projeto e que trouxe muito aprendizado. A aplicação foi dividida entre frontend (Next.js), onde fiz uma interface usando o stackAuth para autenticar usuarios e backend (NestJS), com comunicação entre eles por meio de chamadas HTTP. O banco de dados foi estruturado utilizando PostgreSQL com TypeORM.

# Desafios enfrentados
Configuração do RabbitMQ: Passei um tempo considerável tentando configurar a execução da fila de mensagens com RabbitMQ. Apesar de conseguir criar a fila com sucesso, não consegui fazer com que fossem processadas corretamente, resultou em um warning, dizendo que o rabbit não ia re-executar pois não havia encontrado o EventPattern, apesar dele ter sido declarado corretamente.
Falta de experiência com filas de mensagens: Como não havia trabalhado com RabbitMQ antes, não consegui resolver o problema a tempo e acabei optando por uma solução alternativa, utilizando queries diretas no banco de dados para garantir o funcionamento do fluxo como foi solicitado.

# Melhorias ou funcionalidades adicionais que você implementaria, se tivesse mais tempo
Implementação do RabbitMQ: A fila de mensagens seria integrada corretamente para garantir o processamento assíncrono e otimizar a escalabilidade do sistema.

Melhorias no Frontend: Melhorias na interface de usuário, como adição de feedback visual ao usuário durante o processo de solicitação de empréstimo, e a implementação de validações mais robustas.
Documentação de API: Documentar melhor a API com Swagger ou outra ferramenta, para facilitar o uso e integração com outros sistemas.

Melhorias no Backend: Faria mais consolidações de dados para fazer uma dashboard para o acompanhamento do usuário.

# Documentação da API

## Endpoints

### 1. Criar um empréstimo
- **Método**: `POST /loan`
- **Body**: 
  - `clientName`, `clientId`, `amount`, `latitude`, `longitude`, `city`, `state`, `country`
- **Resposta**: `201 Criado`, com a mensagem `Empréstimo criado com sucesso`

### 2. Listar empréstimos
- **Método**: `GET /loan`
- **Query Params**: 
  - `page`, `limit`, `clientId`
- **Resposta**: Retorna uma lista de empréstimos com paginação.

### 3. Detalhar um empréstimo
- **Método**: `GET /loan/:id`
- **Parâmetro**: `id` (ID do empréstimo)
- **Resposta**: Detalhes de um empréstimo específico.
