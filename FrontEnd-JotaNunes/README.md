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

## 📜 Scripts Disponíveis

No diretório do projeto, você pode executar:

-   `npm run dev`
    Roda a aplicação em modo de desenvolvimento. Abra [http://localhost:5173](http://localhost:5173) para a ver no navegador.

-   `npm run build`
    Compila a aplicação para produção na pasta `dist/`.

-   `npm run lint`
    Executa o ESLint para analisar o código em busca de erros de padrão e qualidade.

---

## 🏛️ Estrutura do Projeto

Este projeto segue uma arquitetura simplificada para facilitar a manutenção e o desenvolvimento:

-   `src/pages/`: Contém as páginas principais da aplicação (rotas). Cada página é responsável por montar o layout e buscar os dados necessários.
-   `src/components/`: Contém todos os componentes React reutilizáveis, desde os mais simples (`Button`, `Input`) até os mais complexos (`LoginForm`).
-   `src/services/`: Contém toda a lógica de comunicação com a API (backend).
-   `src/hooks/`: Contém hooks customizados genéricos que podem ser reutilizados em várias partes da aplicação.

---

## ✅ Qualidade de Código

Utilizamos **ESLint** e **Prettier** para garantir um padrão de código consistente.

-   **ESLint** ajuda a encontrar potenciais bugs e a manter as boas práticas de React.
-   **Prettier** garante que todo o código tenha a mesma formatação.

É altamente recomendado instalar as extensões `ESLint` e `Prettier` no seu VS Code e ativar a formatação ao salvar.