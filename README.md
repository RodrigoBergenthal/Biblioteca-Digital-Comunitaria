# Biblioteca Digital Comunitária

**Demo publicado em:** https://biblioteca-digital-comunit-ria.vercel.app/  
(link em destaque — abre em nova aba)

## Descrição

Projeto front-end simples para uma Biblioteca Digital Comunitária. Permite explorar um catálogo de livros, ver destaques em um carrossel, favoritar, simular leitura/baixa e realizar fluxos básicos de autenticação (cadastro/login/recuperação de senha). Este repositório contém HTML, CSS e JavaScript puros — sem backend real (os fluxos são simulados/localStorage).

## Principais funcionalidades implementadas

- Carrossel de Destaques (`.featured-carousel`): rotação automática, controles prev/next e indicadores. A cada slide a frase de efeito no cabeçalho é exibida com animação de máquina de escrever (typewriter).
- Busca e filtros: busca por título/autor/assunto e filtro por categoria no catálogo.
- Grid de livros (telas inicial e principal): renderização dinâmica a partir do array `books` em `script.js`.
- Capas dinâmicas: geração de capas em canvas como fallback e tentativa de buscar capas na Google Books API.
- Favoritos: salvar/remover favoritos em `localStorage` e exibir na seção de favoritos.
- Histórico e Histórico de Leitura: adiciona livros lidos/visualizados e armazena em `localStorage`.
- Simulação de abertura/baixa: botões que simulam abrir/baixar um livro (apresentam `alert` de demonstração).
- Autenticação simulada: formulários de cadastro, login com código de confirmação (simulado) e fluxo de recuperação de senha com código temporário — tudo salvo em `localStorage`.
- Tela principal pós-login (`#mainScreen`) com perfil e bibliotecas pessoais.
- Tema Warm Earth: tema visual unificado (variáveis CSS) aplicado globalmente, incluindo `header`, `main-header`, `sections`, `book-card`, botões e rodapé.
- Link para PDF institucional no rodapé (arquivo: `biblioteca digital comunitária slides.pdf`). O link abre em nova aba e foi estilizado para ficar visível no rodapé.

## Arquivos relevantes

- `index.html` — estrutura da página, seções e conteúdo estático.
- `style.css` — estilos do site (tema Warm Earth adicionado e overrides no final do arquivo).
- `script.js` — lógica do aplicativo: carregamento de livros, carrossel, listeners, typewriter, favoritos, histórico, autenticação simulada.
- `biblioteca digital comunitária slides.pdf` — material PDF na raiz do projeto (link no rodapé).

## Como testar localmente

1. Abra `index.html` no navegador (duplo-clique ou usando Live Server no VS Code).  
2. Verifique o carrossel de destaques e a animação da `.tagline`.  
3. Teste busca, filtros, favoritar, leitura simulada e fluxo de login/cadastro.  
4. Confira o link do PDF no rodapé — deve abrir o arquivo local em nova aba.

Observação: o projeto usa `localStorage` para simular persistência; limpe o `localStorage` no DevTools se quiser resetar os dados.

## Conectar ao repositório remoto e enviar alterações (comandos)

Eu atualizei os arquivos localmente nesta cópia do projeto. Para conectar este diretório ao repositório remoto e enviar (push) as alterações, execute no terminal (PowerShell) na raiz do projeto:

```powershell
git remote add origin git@github.com:RodrigoBergenthal/Biblioteca-Digital-Comunitaria.git
git branch -M main
git add .
git commit -m "UI: aplicar tema Warm Earth; corrigir listeners do carrossel; adicionar typewriter; link PDF; atualizar README"
git push -u origin main
```

Notas importantes:
- Garanta que sua chave SSH esteja configurada e que você tenha permissões de push para o repositório `RodrigoBergenthal/Biblioteca-Digital-Comunitaria`.  
- Caso o repositório já tenha um remote `origin` configurado diferente, use `git remote set-url origin <url>` ou remova antes com `git remote remove origin`.

## Próximos passos sugeridos

- (Opcional) Consolidar e limpar `style.css` para remover regras duplicadas e organizar variáveis em um arquivo de tema separado.  
- Migrar as frases do carrossel para atributos `data-tagline` em cada `.carousel-slide` para tornar o conteúdo facilmente editável no HTML.  
- Subir o projeto para um hosting estático (Vercel/Netlify/GitHub Pages) se ainda não hospedado. O link de demonstração está no topo deste README.

---

Se quiser, eu posso criar um commit local com uma mensagem específica e gerar um patch ou instruções adicionais para automatizar o push (ex.: criar branch, pull request). Quer que eu gere um commit-ready patch aqui no workspace para você aplicar antes de dar push? 
