# Componente Especificações

Componente responsável pelo fluxo de cadastro de especificações de empreendimentos.

## Estrutura

```
Especificacoes/
├── components/           # Sub-componentes
│   ├── FormStep.jsx     # Renderiza formulários (etapas 0 e 1)
│   ├── TableStep.jsx    # Renderiza tabelas (etapas 2, 3, etc)
│   └── ResumoStep.jsx   # Renderiza resumo final
├── config/              # Configurações
│   └── stepConfig.js    # Configuração orientada a dados das etapas
├── hooks/               # Hooks customizados
│   └── useStepHandlers.js # Gerencia lógica de navegação e submissão
├── utils/               # Funções utilitárias
│   └── stepHelpers.js   # Funções reutilizáveis para processamento
├── EspecificacoesComponent.jsx # Componente principal
├── Especificacoes.module.css   # Estilos
└── index.js             # Exportação do componente

```

## Uso

```jsx
import EspecificacoesComponent from '@/components/Especificacoes';

function MinhaPage() {
  return <EspecificacoesComponent />;
}
```

## Fluxo de Etapas

1. **Etapa 0**: Título do processo (Form)
2. **Etapa 1**: Dados do empreendimento (Form)
3. **Etapa 2**: Unidades privativas (Table)
4. **Etapa 3**: Área comum (Table)
5. **Etapas 4-N**: Ambientes detalhados (Table dinâmica)
6. **Penúltima**: Materiais e marcas (Table)
7. **Última**: Resumo (Resumo)

## Características

- ✅ Arquitetura orientada a dados
- ✅ Componentes reutilizáveis
- ✅ Lógica centralizada em hooks
- ✅ Sem duplicação de código
- ✅ Fácil manutenção e extensibilidade
