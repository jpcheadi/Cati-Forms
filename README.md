# 📝 CATI Forms

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Java](https://img.shields.io/badge/Java-Spring_Boot-success)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-HTML_|_CSS_|_JS-orange)

O **CATI Forms** é uma plataforma web de criação, compartilhamento e armazenamento de formulários customizados. Este projeto foi desenvolvido como solução para o desafio técnico do **Banco de Talentos 2026 da CATI Jr**.

O objetivo do sistema é fornecer uma ferramenta estruturada para coletar dados e feedbacks de candidatos, permitindo a criação de formulários dinâmicos e a geração de links exclusivos para respostas públicas, servindo como base para o módulo interno de Controle de Pessoas.

## 🚀 Funcionalidades

O escopo do projeto atende aos seguintes requisitos funcionais:

- **Autenticação:** Cadastro e login de usuários administradores com armazenamento seguro de senhas (Hash).
- **Criação de Formulários:** Interface dinâmica para montagem de formulários contendo título, descrição e configuração opcional de coleta de e-mail.
- **Tipos de Perguntas Suportadas:**
  - Discursiva.
  - Múltipla escolha (sem limite de marcações).
  - Escolha única (com justificativa obrigatória).
- **Compartilhamento:** Geração de link único de acesso para cada formulário criado.
- **Respostas Públicas:** Renderização dinâmica do formulário para respondentes externos (sem necessidade de cadastro).
- **Exportação (Em breve):** Geração de relatórios de respostas nos formatos PDF e CSV.

## 🛠️ Arquitetura e Tecnologias

O projeto adota uma arquitetura **Cliente-Servidor** bem definida, com separação clara de responsabilidades através de uma API RESTful.

### Backend (API REST)
- **Linguagem/Framework:** Java com Spring Boot.
- **Padrão Arquitetural:** MVC/Camadas (Controller, Service, Repository, Model, DTO).
- **Persistência e ORM:** Spring Data JPA / Hibernate.
- **Segurança:** Proteção de rotas e injeção de variáveis de ambiente.

### Frontend (Client-side)
- **Linguagem:** HTML5, CSS3 e JavaScript.
- **Padrão de Renderização:** Componentização nativa via tags `<template>` e manipulação de DOM baseada em atributos de dados (`data-*`).
- **Gerenciamento de Estado:** Consumo de API assíncrona (`Fetch API`) e controle de sessão local (`localStorage`).

### Banco de Dados
- **SGBD:** PostgreSQL.
- **Modelagem:** Estrutura relacional normalizada com tabelas independentes para Usuários, Formulários, Perguntas, Opções e Submissões.

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
- [Java OpenJDK](https://adoptium.net/) (Versão 17 ou superior) configurado no `JAVA_HOME`.
- [PostgreSQL](https://www.postgresql.org/) rodando localmente na porta padrão (5432).
- VS Code com a extensão *Live Server*.

### 1. Configuração do Banco de Dados
Crie um banco de dados vazio no PostgreSQL chamado `catiforms`. O Spring Boot (`spring.jpa.hibernate.ddl-auto=update`) se encarregará de criar todas as tabelas e relacionamentos automaticamente na primeira execução.

### 2. Configuração do Backend
O projeto utiliza variáveis de ambiente para proteger dados sensíveis. Antes de iniciar a API, configure a senha do seu banco de dados local. No VS Code, crie ou edite o arquivo `.vscode/launch.json`:

```json
{
    "configurations": [
        {
            "type": "java",
            "name": "Spring Boot-CatiformsApplication",
            "request": "launch",
            "mainClass": "com.cati.catiforms.CatiformsApplication",
            "env": {
                "DB_PASSWORD": "senha"
            }
        }
    ]
}
```
## 👨‍💻 Autor
João Pedro | Estudante de Ciência da Computação e Desenvolvedor de Software.
