# FrontEnd JotaNunes

---

### Pré-requisitos

- Node.js (versão 20.x ou superior)
- npm (versão 10.x ou superior)

### Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Clone o repositório:**
    ```sh
    git clone https://github.com/IV-Squad-13/Front.git
    ```
2.  **Navegue para a pasta do projeto:**
    ```sh
    cd FrontEnd-JotaNunes
    ```
3.  **Instale as dependências:**
    ```sh
    npm install
    ```

---

## Scripts Disponíveis

No diretório do projeto, você pode executar:

-   `npm run dev`
    Roda a aplicação em modo de desenvolvimento. Abra [http://localhost:5173](http://localhost:5173) para a ver no navegador.

-   `npm run build`
    Compila a aplicação para produção na pasta `dist/`.

-   `npm run lint`
    Executa o ESLint para analisar o código em busca de erros de padrão e qualidade.

---

## Como Contribuir:

**Por favor, evite commit diretamente na `main`.**

### Passo a Passo Simples para Adicionar Código:

1.  **Crie uma nova branch:**
    Antes de começar a programar, crie uma nova branch a partir da `main`.
    ```sh
    # Certifique-se de que a sua 'main' está atualizada
    git checkout main
    git pull origin main

    # Crie uma nova branch
    git checkout -b nome-da-sua-branch
    ```
    *Exemplo de nome:* `feature/tela-de-login` ou `correcao/bug-do-botao`

2.  **Faça o seu trabalho:**
    Programe a sua funcionalidade ou correção. Faça commits normalmente na sua branch.
    ```sh
    git add .
    git commit -m "feat: adiciona formulário de login"
    ```

3.  **Envie a sua branch para o GitHub:**
    ```sh
    git push -u origin nome-da-sua-branch
    ```

4.  **Abra um Pull Request (PR):**
    Vá à página do repositório no GitHub e abra um Pull Request da sua branch para a `main`. Dessa forma, podemos analisar o código antes de juntar com a main.

---

## Estrutura do Projeto

Este projeto segue uma arquitetura simplificada para facilitar a manutenção e o desenvolvimento:

-   `src/pages/`: Contém as páginas principais da aplicação (rotas).
-   `src/components/`: Contém todos os componentes React reutilizáveis.
-   `src/services/`: Contém toda a lógica de comunicação com a API (backend).
-   `src/hooks/`: Contém hooks customizados genéricos e reutilizáveis.

---

## ✅ Qualidade de Código

Utilizamos **ESLint** e **Prettier** para garantir um padrão de código consistente.

-   **ESLint** ajuda a encontrar potenciais bugs e a manter as boas práticas.
-   **Prettier** garante que todo o código tenha a mesma formatação.

É altamente recomendado instalar as extensões `ESLint` e `Prettier` no seu VS Code e ativar a formatação ao salvar.
