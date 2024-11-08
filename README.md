# Jolifox - back-end

<img 
  src="https://github.com/user-attachments/assets/edcfcdc9-f53d-4dfe-872c-bb24d492f397" 
  alt="Swagger API"
/>

## Cobertura dos testes de integração

<img 
  src="https://github.com/user-attachments/assets/0746b815-763e-44bb-868f-10445eb84625" 
  alt="Integration testing coverage"
/>

Você pode rodar a cobertura acima na sua máquina com o comando a seguir (depois de já ter o projeto instalado e configurado na sua máquina):

```bash
pnpm test:integration:coverage
```

**OBS**: Como o Notion suporta apenas 3 solicitações por segundo ([https://developers.notion.com/reference/request-limits](https://developers.notion.com/reference/request-limits)), tive que aplicar alguns atrasos entre as operações realizadas nos testes para que eles pudessem funcionar, por isso o tempo de conclusão de cada teste está acima do normal.

## Rode na sua máquina

### Clone o projeto

Primeiro clone o projeto utilizando alguma forma abaixo:

Com o [git](https://git-scm.com/downloads):

```bash
git clone https://github.com/Leo-Henrique/jolifox-back-end.git
```

Com a [CLI do GitHub](https://cli.github.com/):

```bash
gh repo clone Leo-Henrique/jolifox-back-end
```

Se você não tem ou não quer instalar o git ou a CLI do GitHub para clonar o projeto, vá até o topo da página inicial deste repositório; clique no botão verde com o texto "Code"; clique em "Download ZIP".

### Rodar com o Docker

Desta forma, você precisa de uma principal dependência instalada:

- [Docker](https://www.docker.com/products/docker-desktop/) 24.0.6 (ou qualquer versão superior)

#### Iniciar serviços do Docker

Um serviço / container será iniciado contendo a API em Node.js que usa [node:20.18-alpine](https://hub.docker.com/layers/library/node/20.18-alpine/images/sha256-d504f23acdda979406cf3bdbff0dff7933e5c4ec183dda404ed24286c6125e60?context=explore) como imagem base.

Na pasta do projeto:

```bash
docker compose up -d --build
```

Você conseguirá acessar a documentação da API em: [http://localhost:3333/docs](http://localhost:3333/docs) (ou com a mesma porta definida na variável `API_PORT` no arquivo **.env**, para caso você tenha alterado).

#### Verificar estado dos serviços (opcional):

```bash
docker compose logs -f
```

#### Parar serviços (opcional):

```bash
docker compose down
```

### Rodar manualmente

Desta forma, você precisa de uma principal dependência instalada:

- [Node.js](https://nodejs.org/en/download/package-manager) 20.5.1 (ou qualquer versão superior)

O gerenciador de pacotes utilizado no desenvolvimento e mostrado nos comandos a seguir é o **pnpm**. É preferível que você o utilize, mas você pode seguir com **npm** ou **yarn** se preferir.

- [PNPM](https://pnpm.io/installation) 9.1.1 (ou qualquer versão superior)

#### Instalar dependências do projeto

Na pasta do projeto:

```bash
pnpm install
```

#### Rode o projeto

```bash
pnpm start:dev
```

Você conseguirá acessar a documentação da API em: [http://localhost:3333/docs](http://localhost:3333/docs) (ou com a mesma porta definida na variável `API_PORT` no arquivo **.env**, para caso você tenha alterado).

#### Rode os testes de integração (opcional)

```bash
pnpm test:integration
```

**OBS**: Como o Notion suporta apenas 3 solicitações por segundo ([https://developers.notion.com/reference/request-limits](https://developers.notion.com/reference/request-limits)), tive que aplicar alguns atrasos entre as operações realizadas nos testes para que eles pudessem funcionar, por isso o tempo de conclusão de cada teste está acima do normal.
