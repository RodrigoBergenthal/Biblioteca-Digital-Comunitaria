// script.js

// Dados simulados de livros com cores de capa
const books = [
    {
        id: 1,
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        coverColor: "#FFD700", // Dourado
        category: "Clássicos",
        description: "Obra-prima do realismo brasileiro, narrada por um defunto que recorda sua vida com ironia e humor.",
        rating: 4.9
    },
    {
        id: 2,
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        coverColor: "#87CEEB", // Azul céu
        category: "Realismo",
        description: "Representação do naturalismo brasileiro, retratando a vida no cortiço carioca.",
        rating: 4.7
    },
    {
        id: 3,
        title: "Iracema",
        author: "José de Alencar",
        coverColor: "#2F4F4F", // Cinza escuro
        category: "Romance Indianista",
        description: "Ícone do indianismo no Brasil, que narra o amor entre Iracema e Martim.",
        rating: 4.4
    },
    {
        id: 4,
        title: "O Guarani",
        author: "José de Alencar",
        coverColor: "#FFB6C1", // Rosa claro
        category: "Romance Indianista",
        description: "Primeiro romance brasileiro de alcance universal que retrata o índio como herói.",
        rating: 4.3
    },
    {
        id: 5,
        title: "Senhora",
        author: "José de Alencar",
        coverColor: "#8B4513", // Marrom
        category: "Romance Urbano",
        description: "Obra que critica o casamento por interesse e valoriza o amor verdadeiro.",
        rating: 4.2
    },
    {
        id: 6,
        title: "O Alienista",
        author: "Machado de Assis",
        coverColor: "#9370DB", // Roxo
        category: "Conto",
        description: "Conto sobre o Dr. Simão Bacamarte que estuda a loucura e termina questionando a própria sanidade.",
        rating: 4.6
    },
    {
        id: 7,
        title: "Quincas Borba",
        author: "Machado de Assis",
        coverColor: "#D2691E", // Chocolate
        category: "Filosófico",
        description: "Obra filosófica que acompanha Rubião e seu professor Quincas Borba em sua jornada.",
        rating: 4.5
    },
    {
        id: 8,
        title: "Lucíola",
        author: "José de Alencar",
        coverColor: "#32CD32", // Verde lima
        category: "Romance Romântico",
        description: "Romance que aborda temas de amor e redenção social na sociedade do século XIX.",
        rating: 4.1
    },
    {
        id: 9,
        title: "A Moreninha",
        author: "Joaquim Manuel de Macedo",
        coverColor: "#A0522D", // Siena
        category: "Romance Romântico",
        description: "Primeiro grande sucesso literário brasileiro que narra um triângulo amoroso.",
        rating: 4.0
    },
    {
        id: 10,
        title: "O Gaúcho",
        author: "José de Alencar",
        coverColor: "#4682B4", // Azul aço
        category: "Romance Regionalista",
        description: "Obra que retrata a cultura e paisagens do sul do Brasil com personagens marcantes.",
        rating: 4.3
    }
];

// Função assíncrona para buscar capas de livros na Google Books API
async function fetchBookCover(title, author) {
    try {
        // Codifica o título e autor para usar na URL
        const encodedTitle = encodeURIComponent(title);
        const encodedAuthor = encodeURIComponent(author);

        // Usa título e autor para busca mais precisa
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodedTitle}+inauthor:${encodedAuthor}&maxResults=1`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Retorna a imagem da capa maior disponível
            const book = data.items[0];
            return book.volumeInfo.imageLinks?.thumbnail ||
                   book.volumeInfo.imageLinks?.smallThumbnail ||
                   book.volumeInfo.imageLinks?.extraLarge ||
                   book.volumeInfo.imageLinks?.large ||
                   book.volumeInfo.imageLinks?.medium ||
                   book.volumeInfo.imageLinks?.small ||
                   generateCoverImage(book.volumeInfo.title || title, book.volumeInfo.authors?.[0] || author, getRandomColor());
        }
    } catch (error) {
        console.error(`Erro ao buscar capa para "${title}":`, error);
    }

    // Se não encontrar na API, retorna capa gerada dinamicamente
    return generateCoverImage(title, author, getRandomColor());
}

// Função para gerar uma cor aleatória (usada como fallback)
function getRandomColor() {
    const colors = ["#FFD700", "#87CEEB", "#2F4F4F", "#FFB6C1", "#8B4513", "#9370DB", "#D2691E", "#32CD32", "#A0522D", "#4682B4"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Função para gerar uma capa de livro em base64 com título e autor (fallback)
function generateCoverImage(title, author, color) {
    // Criar um canvas temporário para gerar a imagem
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Preencher o fundo com a cor especificada
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adicionar borda
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Adicionar título
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';

    // Quebrar título em múltiplas linhas se necessário
    const maxWidth = canvas.width - 20;
    const lineHeight = 14;
    let y = canvas.height / 2 - 20;

    // Função para quebrar texto em múltiplas linhas
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, currentY);
        return currentY;
    }

    // Desenhar título
    y = wrapText(ctx, title, canvas.width / 2, y, maxWidth, lineHeight);

    // Desenhar autor
    ctx.font = 'italic 10px Arial';
    wrapText(ctx, author, canvas.width / 2, y + 20, maxWidth, lineHeight);

    // Converter para base64
    return canvas.toDataURL('image/png');
}

// Função para carregar livros com capas reais da API
async function loadBooks() {
    for (let i = 0; i < books.length; i++) {
        // Enquanto a API busca a capa real, usa a capa gerada como temporário
        books[i].coverImage = generateCoverImage(books[i].title, books[i].author, books[i].coverColor);

        // Depois de gerar a capa temporária, busca a capa real
        try {
            const realCover = await fetchBookCover(books[i].title, books[i].author);
            // Atualiza a capa do livro com a imagem real (ou fallback)
            books[i].coverImage = realCover;

            // Se a tela já estiver carregada, atualiza os elementos visíveis
            updateBookCoverInDOM(books[i].id, realCover);
        } catch (error) {
            console.error(`Falha ao atualizar capa para o livro ${books[i].title}:`, error);
        }
    }
}

// Função auxiliar para atualizar a capa de um livro específico no DOM
function updateBookCoverInDOM(bookId, newCoverUrl) {
    // Atualiza capas em todas as seções da página
    const coverElements = document.querySelectorAll(`.book-cover img`);
    coverElements.forEach(img => {
        // Atualiza apenas imagens que correspondem ao livro específico
        if(img.dataset.bookId == bookId) {
            img.src = newCoverUrl;
        }
    });

    // Atualiza visualizações específicas se elas estiverem visíveis
    updateVisibleBookSections();
}

// Função para atualizar todas as seções visíveis de livros
function updateVisibleBookSections() {
    // Atualiza o grid principal se estiver visível
    if (document.querySelector('#homeScreen:not([style*="none"])')) {
        renderBooks(books, 'bookGrid');
    }
    // Atualiza a seção principal após login se estiver visível
    if (document.querySelector('#mainScreen:not([style*="none"])')) {
        renderBooks(books, 'mainBookGrid');
    }
    // Atualiza a seção de livros mais lidos
    renderBooks(getMostReadBooks(), 'mostReadGrid');
    renderBooks(getMostReadBooks(), 'mainMostReadGrid');
}

// Função para obter os livros mais lidos do mês (simulado)
function getMostReadBooks() {
    // Retorna os 5 primeiros livros como os mais lidos (simulação)
    return books.slice(0, 5);
}

// Função para inicializar as capas dos livros
async function initializeBookCovers() {
    for (let i = 0; i < books.length; i++) {
        // Gera capa temporária enquanto busca a real
        books[i].coverImage = generateCoverImage(books[i].title, books[i].author, books[i].coverColor);

        // Busca a capa real em segundo plano
        try {
            const realCover = await fetchBookCover(books[i].title, books[i].author);
            books[i].coverImage = realCover;

            // Atualiza a capa no DOM se o elemento já estiver visível
            updateBookCoverInDOM(books[i].id, realCover);
        } catch (error) {
            console.error(`Falha ao atualizar capa para o livro ${books[i].title}:`, error);
        }
    }

    // Após carregar todas as capas, renderiza os livros na tela inicial
    if (typeof renderBooks === 'function') {
        // Se estamos na tela inicial, atualiza o grid de livros
        if (document.getElementById('bookGrid')) {
            renderBooks(books, 'bookGrid');
        }
        // Atualiza também na tela principal se estiver visível
        if (document.getElementById('mainBookGrid')) {
            renderBooks(books, 'mainBookGrid');
        }
        // Atualiza a seção de livros mais lidos
        renderBooks(getMostReadBooks(), 'mostReadGrid');
        renderBooks(getMostReadBooks(), 'mainMostReadGrid');
    }
}

// Carregar capas dos livros quando o script iniciar
initializeBookCovers();

// Inicializar o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    // Garante que o usuário de demonstração exista
    const demoUserEmail = 'demo@biblioteca.com';
    if (!users.some(u => u.email === demoUserEmail)) {
        const demoUser = {
            id: 'demo_user',
            name: 'Usuário de Demonstração',
            email: demoUserEmail,
            password: 'demo123',
            verified: true,
            registrationDate: new Date().toISOString()
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Verifica se há um usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        // Verifica se o usuário ainda está na lista de usuários
        if (!users.some(u => u.id === currentUser.id)) {
            // Usuário não encontrado, limpa o estado
            currentUser = null;
            localStorage.removeItem('currentUser');
        } else {
            // Usuário encontrado, mostra tela principal
            showMainScreen();
            return;
        }
    }

    // Se não houver usuário logado, mostra tela inicial
    showHomeScreen();
});

// Dados de usuários (simulados)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

// Função para gerar estrelas de avaliação
function renderRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }

    if (halfStar) {
        stars += '★'; // Pode ser uma meia estrela, mas usando uma cheia por simplicidade
    }

    // Preenche o restante com estrelas vazias
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }

    return stars;
}

// Função para renderizar os livros no catálogo (vários estilos)
function renderBooks(bookList, containerId = 'bookGrid', showDetails = false) {
    const bookGrid = document.getElementById(containerId);
    if (!bookGrid) return; // Verifica se o elemento existe

    bookGrid.innerHTML = ''; // Limpa o grid

    if (bookList.length === 0) {
        bookGrid.innerHTML = '<p>Nenhum livro encontrado. Tente outra busca.</p>';
        return;
    }

    bookList.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        if (showDetails) {
            // Card com detalhes do livro
            bookCard.innerHTML = `
                <div class="book-cover">
                    <img src="${book.coverImage}" alt="${book.title}" data-book-id="${book.id}">
                </div>
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p class="author">${book.author}</p>
                    <p class="category"><strong>Categoria:</strong> ${book.category}</p>
                    <p class="rating">${renderRating(book.rating)}</p>
                    <p class="description">${book.description}</p>
                    <div class="book-actions">
                        <button class="btn-read" onclick="openBook(${book.id})">Ler</button>
                        <button class="btn-download" onclick="downloadBook(${book.id})">Baixar</button>
                        <button class="btn-favorite" onclick="toggleFavorite(${book.id})">
                            ${isFavorite(book.id) ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Card padrão
            bookCard.innerHTML = `
                <div class="book-cover">
                    <img src="${book.coverImage}" alt="${book.title}" data-book-id="${book.id}">
                </div>
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p class="author">${book.author}</p>
                    <p class="rating">${renderRating(book.rating)}</p>
                </div>
                <div class="book-overlay">
                    <button class="btn-details" onclick="showBookDetails(${book.id})">Detalhes</button>
                </div>
            `;
        }

        bookGrid.appendChild(bookCard);
    });
}

// Atualizar a função para carregar capas com abordagem assíncrona adequada
async function initializeBookCovers() {
    // Primeiro, gera capas temporárias para exibição imediata
    books.forEach(book => {
        book.coverImage = generateCoverImage(book.title, book.author, book.coverColor);
    });

    // Atualiza imediatamente os grids visíveis com capas temporárias
    if (document.getElementById('bookGrid')) {
        renderBooks(books, 'bookGrid');
    }
    if (document.getElementById('mainBookGrid')) {
        renderBooks(books, 'mainBookGrid');
    }
    if (document.getElementById('mostReadGrid')) {
        renderBooks(getMostReadBooks(), 'mostReadGrid');
    }
    if (document.getElementById('mainMostReadGrid')) {
        renderBooks(getMostReadBooks(), 'mainMostReadGrid');
    }

    // Em paralelo, busca as capas reais da API
    const coverPromises = books.map(async (book) => {
        try {
            const realCover = await fetchBookCover(book.title, book.author);
            book.coverImage = realCover; // Atualiza com a capa real
            return book.id; // Retorna o ID do livro para atualização individual
        } catch (error) {
            console.error(`Falha ao buscar capa real para o livro ${book.title}:`, error);
            return null;
        }
    });

    // Espera que todas as capas reais sejam obtidas
    const updatedBookIds = (await Promise.all(coverPromises)).filter(id => id !== null);

    // Atualiza os grids novamente com as capas reais
    if (document.getElementById('bookGrid')) {
        renderBooks(books, 'bookGrid');
    }
    if (document.getElementById('mainBookGrid')) {
        renderBooks(books, 'mainBookGrid');
    }
    if (document.getElementById('mostReadGrid')) {
        renderBooks(getMostReadBooks(), 'mostReadGrid');
    }
    if (document.getElementById('mainMostReadGrid')) {
        renderBooks(getMostReadBooks(), 'mainMostReadGrid');
    }
}

// Variáveis para manter o estado dos filtros atuais
let currentSearchQuery = '';
let currentCategoryFilter = 'all';

// Função para filtrar livros com base na busca e categoria
function filterBooks(query, category = null) {
    if (category === null) {
        category = currentCategoryFilter; // Usa o filtro de categoria atual se não for especificado
    } else {
        currentCategoryFilter = category; // Atualiza o filtro de categoria atual
    }

    if (query !== undefined) {
        currentSearchQuery = query; // Atualiza a busca atual
    }

    // Filtra por categoria primeiro, se necessário
    let filteredBooks = books;
    if (category && category !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category.toLowerCase() === category.toLowerCase());
    }

    // Depois filtra pela busca, se houver
    if (currentSearchQuery) {
        const lowerCaseQuery = currentSearchQuery.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(lowerCaseQuery) ||
            book.author.toLowerCase().includes(lowerCaseQuery) ||
            book.category.toLowerCase().includes(lowerCaseQuery) ||
            book.description.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return filteredBooks;
}

// Função para filtrar por categoria (mantendo compatibilidade)
function filterByCategory(category) {
    if (!category || category === 'all') {
        // Se for 'all', apenas retorna os livros com base na busca atual
        return filterBooks(currentSearchQuery, 'all');
    }
    return filterBooks(currentSearchQuery, category);
}

// Helper para adicionar event listeners com segurança (verifica se o elemento existe)
function safeAddListener(idOrEl, event, handler) {
    if (!idOrEl) return;
    // aceita id string ou elemento
    let el = null;
    if (typeof idOrEl === 'string') {
        el = document.getElementById(idOrEl);
    } else if (idOrEl instanceof Element) {
        el = idOrEl;
    }

    if (el) {
        el.addEventListener(event, handler);
    }
}

// Função para mostrar detalhes do livro
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        renderBooks([book], 'mainBookGrid', true); // Mostra o livro com detalhes na tela principal
        // Adiciona o livro ao histórico de visualizações
        addToHistory(book);
    }
}

// Função para abrir livro (simulação)
function openBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        alert(`Iniciando a leitura de "${book.title}"...\n\n(Em uma implementação real, isso abriria o livro para leitura.)`);
        // Adiciona o livro ao histórico de leitura
        addToReadingHistory(book);
    }
}

// Função para download de livro (simulação)
function downloadBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        alert(`Preparando o download de "${book.title}"...\n\n(Em uma implementação real, isso iniciaria o download do livro.)`);
    }
}

// Funções para gerenciar favoritos
function getFavorites() {
    return JSON.parse(localStorage.getItem('bookFavorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
}

function isFavorite(bookId) {
    const favorites = getFavorites();
    return favorites.some(book => book.id === bookId);
}

function toggleFavorite(bookId) {
    let favorites = getFavorites();
    const book = books.find(b => b.id === bookId);

    if (book) {
        const index = favorites.findIndex(b => b.id === bookId);
        if (index > -1) {
            // Remover dos favoritos
            favorites.splice(index, 1);
            saveFavorites(favorites);
            // Atualizar botão de favorito
            const favButtons = document.querySelectorAll(`.btn-favorite[onclick*="${bookId}"]`);
            favButtons.forEach(btn => btn.textContent = '☆');
        } else {
            // Adicionar aos favoritos
            favorites.push(book);
            saveFavorites(favorites);
            // Atualizar botão de favorito
            const favButtons = document.querySelectorAll(`.btn-favorite[onclick*="${bookId}"]`);
            favButtons.forEach(btn => btn.textContent = '★');
        }
        // Atualizar contadores em todas as telas
        updateCounters();
        // Atualizar a seção de favoritos na página principal
        updateFavoritesSection();
    }
}

// Funções para gerenciar histórico de visualizações
function getHistory() {
    return JSON.parse(localStorage.getItem('bookHistory')) || [];
}

function saveHistory(history) {
    localStorage.setItem('bookHistory', JSON.stringify(history));
}

function addToHistory(book) {
    let history = getHistory();
    // Verifica se o livro já está no histórico
    const existingIndex = history.findIndex(b => b.id === book.id);
    if (existingIndex > -1) {
        // Remove o livro existente para reordenar
        history.splice(existingIndex, 1);
    }
    // Adiciona o livro no início do histórico
    history.unshift({ ...book, timestamp: new Date().toISOString() });
    // Limita o histórico a 10 itens
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    saveHistory(history);
}

// Funções para gerenciar histórico de leitura
function getReadingHistory() {
    return JSON.parse(localStorage.getItem('readingHistory')) || [];
}

function saveReadingHistory(history) {
    localStorage.setItem('readingHistory', JSON.stringify(history));
}

function addToReadingHistory(book) {
    let readingHistory = getReadingHistory();
    // Verifica se o livro já está no histórico
    const existingIndex = readingHistory.findIndex(b => b.id === book.id);
    if (existingIndex > -1) {
        // Remove o livro existente para reordenar
        readingHistory.splice(existingIndex, 1);
    }
    // Adiciona o livro no início do histórico
    readingHistory.unshift({ ...book, timestamp: new Date().toISOString() });
    // Limita o histórico a 10 itens
    if (readingHistory.length > 10) {
        readingHistory = readingHistory.slice(0, 10);
    }
    saveReadingHistory(readingHistory);
}

// Função para gerar uma imagem de perfil baseada no nome do usuário
function generateProfilePicture(username) {
    // Cria um canvas temporário para gerar a imagem de perfil
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    // Define uma cor de fundo baseada nas iniciais do nome
    const initials = username.substring(0, 1).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const colorIndex = username.length % colors.length;

    // Preenche o círculo com a cor escolhida
    ctx.fillStyle = colors[colorIndex];
    ctx.beginPath();
    ctx.arc(20, 20, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Adiciona as iniciais no centro
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 20, 20);

    // Converte para base64
    return canvas.toDataURL('image/png');
}

// Função para renderizar seção de favoritos
function showFavorites() {
    const favorites = getFavorites();
    renderBooks(favorites, 'mainBookGrid');
    updateFavoritesSection();
}

// Função para atualizar a seção de favoritos na página principal
function updateFavoritesSection() {
    const favorites = getFavorites();
    const favoritesGrid = document.getElementById('favoritesGrid');

    if (favoritesGrid) {
        favoritesGrid.innerHTML = '';

        if (favorites.length > 0) {
            // Renderiza os favoritos em um grid menor
            favorites.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <div class="book-cover">
                        <img src="${book.coverImage}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h4>${book.title}</h4>
                        <p class="author">${book.author}</p>
                        <p class="rating">${renderRating(book.rating)}</p>
                    </div>
                `;
                favoritesGrid.appendChild(bookCard);
            });
        } else {
            favoritesGrid.innerHTML = '<p>Nenhum livro favoritado ainda.</p>';
        }
    }
}

// Função para renderizar seção de histórico
function showHistory() {
    const history = getHistory();
    renderBooks(history, 'mainBookGrid');
}

// Função para aplicar filtro de categoria
function applyCategoryFilter() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredBooks = filterByCategory(selectedCategory);
    renderBooks(filteredBooks, 'mainBookGrid');
}

// Evento para o botão de busca principal
safeAddListener('mainSearchBtn', 'click', function() {
    const searchInput = document.getElementById('mainSearchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    const filteredBooks = filterBooks(query);
    renderBooks(filteredBooks, 'mainBookGrid');
});

// Permite buscar pressionando Enter na tela principal
safeAddListener('mainSearchInput', 'keypress', function(e) {
    if (e.key === 'Enter') {
        const btn = document.getElementById('mainSearchBtn');
        if (btn) btn.click();
    }
});

// Evento para o botão de busca na tela inicial
safeAddListener('searchBtn', 'click', function() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    const filteredBooks = filterBooks(query);
    renderBooks(filteredBooks, 'bookGrid');
});

// Permite buscar pressionando Enter na tela inicial
safeAddListener('searchInput', 'keypress', function(e) {
    if (e.key === 'Enter') {
        const btn = document.getElementById('searchBtn');
        if (btn) btn.click();
    }
});

// Função para mostrar tela de login
function showLoginScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
}

// Função para mostrar tela de cadastro
function showRegisterScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'block';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
}

// Função para mostrar tela de recuperação de senha
function showForgotPasswordScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('forgotPasswordScreen').style.display = 'block';
}

// Função para mostrar tela de confirmação de código
function showCodeConfirmationScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('forgotPasswordScreen').style.display = 'none';
    document.getElementById('codeConfirmationScreen').style.display = 'block';
}

// Função para mostrar tela de redefinição de senha
function showResetPasswordScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('forgotPasswordScreen').style.display = 'none';
    document.getElementById('codeConfirmationScreen').style.display = 'none';
    document.getElementById('resetPasswordScreen').style.display = 'block';
}

// Função para mostrar tela de confirmação
function showConfirmationScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'block';
    document.getElementById('mainScreen').style.display = 'none';
}

// Função para mostrar tela principal
function showMainScreen() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';

    // Atualiza o nome do usuário
    if (currentUser) {
        document.getElementById('userNameDisplay').textContent = currentUser.name;

        // Atualiza a foto de perfil do usuário
        if (currentUser.profilePic) {
            document.getElementById('userProfilePic').src = currentUser.profilePic;
        } else {
            // Gera uma imagem de perfil padrão baseada no nome do usuário
            document.getElementById('userProfilePic').src = generateProfilePicture(currentUser.name);
        }
    }

    // Renderiza os livros na tela principal
    renderBooks(books, 'mainBookGrid');

    // Atualiza contadores e histórico
    updateCounters();
    displayReadingHistory();
    updateFavoritesSection();

    // Preenche as opções do seletor de categoria (na tela principal)
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect && categorySelect.options.length <= 1) { // Se ainda não foi preenchido
        const categories = [...new Set(books.map(book => book.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Função para mostrar tela inicial
function showHomeScreen() {
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('confirmationScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'none';

    // Renderiza os livros na tela inicial
    renderBooks(books, 'bookGrid');
}

// Função para fazer logout
function logout() {
    currentUser = null;
    showHomeScreen();
}

// Função para gerar código de confirmação (simulação)
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
}

// Função para simular envio de e-mail
function sendConfirmationEmail(email, code) {
    // Em uma implementação real, isso enviaria um e-mail real
    console.log(`Código de confirmação ${code} enviado para ${email}`);
    alert(`Código de confirmação enviado para ${email}. O código é: ${code} (apenas para demonstração)`);
}

// Variável para armazenar o e-mail do usuário durante o processo de recuperação de senha
let recoveryEmail = '';

// Event listeners para os botões da tela inicial
safeAddListener('loginBtn', 'click', showLoginScreen);
safeAddListener('registerBtn', 'click', showRegisterScreen);

// Event listeners para os botões de login e cadastro no cabeçalho
safeAddListener('headerLoginBtn', 'click', showLoginScreen);
safeAddListener('headerRegisterBtn', 'click', showRegisterScreen);

// Event listeners para links de autenticação
safeAddListener('createAccountLink', 'click', function(e) {
    e.preventDefault();
    showRegisterScreen();
});

safeAddListener('backToLoginLink', 'click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

safeAddListener('forgotPasswordLink', 'click', function(e) {
    e.preventDefault();
    showForgotPasswordScreen();
});

// Event listener para o link de recuperação de senha
safeAddListener('forgotPasswordBackToLogin', 'click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

// Event listener para o link de recuperação de senha alternativo (abaixo do botão enviar código)
safeAddListener('forgotPasswordBackToLoginAlt', 'click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

// Event listener para o formulário de recuperação de senha
safeAddListener('forgotPasswordForm', 'submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('forgotPasswordEmail').value;

    // Verifica se o e-mail existe
    const user = users.find(u => u.email === email);

    if (user) {
        // Gera código de recuperação
        const recoveryCode = generateConfirmationCode();
        user.recoveryCode = recoveryCode;
        user.recoveryExpiry = Date.now() + 10 * 60 * 1000; // Código válido por 10 minutos

        // Atualiza o armazenamento
        localStorage.setItem('users', JSON.stringify(users));

        // Salva o e-mail para uso posterior
        recoveryEmail = email;

        // Simula envio de código por e-mail
        console.log(`Código de recuperação ${recoveryCode} enviado para ${email}`);
        alert(`Código de recuperação enviado para ${email}. O código é: ${recoveryCode} (apenas para demonstração)`);

        // Mostra tela de confirmação de código
        showCodeConfirmationScreen();
    } else {
        alert('E-mail não encontrado. Por favor, verifique o e-mail digitado.');
    }
});

// Event listener para o link de voltar na tela de confirmação de código
safeAddListener('codeConfirmationBackToLogin', 'click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

// Event listener para o formulário de confirmação de código
safeAddListener('codeConfirmationForm', 'submit', function(e) {
    e.preventDefault();

    const codeInputEl = document.getElementById('codeInput');
    const codeInput = codeInputEl ? codeInputEl.value : '';

    // Encontra o usuário com este código de recuperação
    const userIndex = users.findIndex(u => u.recoveryCode === codeInput && u.recoveryExpiry > Date.now());

    if (userIndex !== -1) {
        // Código válido - mostra tela de redefinição de senha
        showResetPasswordScreen();
    } else {
        alert('Código de recuperação inválido ou expirado. Por favor, tente novamente.');
    }
});

// Event listener para o link de voltar na tela de redefinição de senha
safeAddListener('resetPasswordBackToLogin', 'click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

// Event listener para o formulário de redefinição de senha
safeAddListener('resetPasswordForm', 'submit', function(e) {
    e.preventDefault();

    const newPasswordEl = document.getElementById('newPassword');
    const confirmNewPasswordEl = document.getElementById('confirmNewPassword');
    const newPassword = newPasswordEl ? newPasswordEl.value : '';
    const confirmNewPassword = confirmNewPasswordEl ? confirmNewPasswordEl.value : '';

    if (newPassword !== confirmNewPassword) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    if (newPassword.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    // Encontra o usuário com o e-mail de recuperação
    const userIndex = users.findIndex(u => u.email === recoveryEmail);

    if (userIndex !== -1) {
        // Atualiza a senha do usuário
        users[userIndex].password = newPassword;

        // Limpa os dados de recuperação
        delete users[userIndex].recoveryCode;
        delete users[userIndex].recoveryExpiry;

        // Atualiza o armazenamento
        localStorage.setItem('users', JSON.stringify(users));

        // Reseta a variável de e-mail de recuperação
        recoveryEmail = '';

        alert('Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.');
        showLoginScreen();
    } else {
        alert('Erro ao redefinir a senha. Tente novamente.');
    }
});

// Event listener para o formulário de login
safeAddListener('loginForm', 'submit', function(e) {
    e.preventDefault();

    const emailEl = document.getElementById('loginEmail');
    const passwordEl = document.getElementById('loginPassword');
    const email = emailEl ? emailEl.value : '';
    const password = passwordEl ? passwordEl.value : '';

    // Verifica se o usuário existe
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Gera código de confirmação
        const confirmationCode = generateConfirmationCode();
        user.confirmationCode = confirmationCode;
        user.confirmationExpiry = Date.now() + 10 * 60 * 1000; // Código válido por 10 minutos

        // Atualiza o armazenamento
        localStorage.setItem('users', JSON.stringify(users));

        // Simula envio de e-mail
        sendConfirmationEmail(email, confirmationCode);

        // Mostra tela de confirmação
        showConfirmationScreen();
    } else {
        alert('E-mail ou senha inválidos. Se não tem conta, por favor cadastre-se.');
    }
});

// Event listener para o formulário de cadastro
safeAddListener('registerForm', 'submit', function(e) {
    e.preventDefault();

    const nameEl = document.getElementById('registerName');
    const emailEl = document.getElementById('registerEmail');
    const passwordEl = document.getElementById('registerPassword');
    const confirmPasswordEl = document.getElementById('confirmPassword');
    const name = nameEl ? nameEl.value : '';
    const email = emailEl ? emailEl.value : '';
    const password = passwordEl ? passwordEl.value : '';
    const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';

    // Validação de formulário
    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    // Verifica se o e-mail já está cadastrado
    if (users.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado. Por favor, use outro e-mail ou faça login.');
        return;
    }

    // Cria novo usuário
    const newUser = {
        id: Date.now(), // ID temporário baseado no timestamp
        name: name,
        email: email,
        password: password,
        verified: false,
        registrationDate: new Date().toISOString()
    };

    // Adiciona usuário à lista
    users.push(newUser);

    // Atualiza o armazenamento
    localStorage.setItem('users', JSON.stringify(users));

    // Simula envio de e-mail de verificação
    alert(`Cadastro realizado com sucesso! Um e-mail de verificação foi enviado para ${email}.`);

    // Retorna para a tela de login
    showLoginScreen();
});

// Event listener para o formulário de confirmação
safeAddListener('confirmationForm', 'submit', function(e) {
    e.preventDefault();

    const inputCodeEl = document.getElementById('confirmationCode');
    const inputCode = inputCodeEl ? inputCodeEl.value : '';

    // Encontra o usuário com este código de confirmação
    const userIndex = users.findIndex(u => u.confirmationCode === inputCode && u.confirmationExpiry > Date.now());

    if (userIndex !== -1) {
        // Código válido - login bem-sucedido
        currentUser = users[userIndex];
        delete currentUser.confirmationCode;
        delete currentUser.confirmationExpiry;

        // Atualiza o armazenamento
        localStorage.setItem('users', JSON.stringify(users));

        // Mostra tela principal
        showMainScreen();
    } else {
        alert('Código de confirmação inválido ou expirado. Por favor, tente novamente.');
    }
});

// Event listener para o botão de logout
safeAddListener('logoutBtn', 'click', logout);

// Event listener para voltar à tela inicial
safeAddListener('backToHome', 'click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela de cadastro
safeAddListener('registerBackToHome', 'click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela de confirmação
safeAddListener('confirmationBackToHome', 'click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela principal
safeAddListener('mainBackToHome', 'click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para login de demonstração
safeAddListener('demoLoginBtn', 'click', function(e) {
    e.preventDefault();

    // Criar usuário de demonstração se não existir
    const demoUserEmail = 'demo@biblioteca.com';
    const demoUserPassword = 'demo123';

    // Verifica se o usuário de demonstração já existe
    let demoUser = users.find(u => u.email === demoUserEmail);

    if (!demoUser) {
        // Cria usuário de demonstração
        demoUser = {
            id: 'demo_user',
            name: 'Usuário de Demonstração',
            email: demoUserEmail,
            password: demoUserPassword,
            verified: true,
            registrationDate: new Date().toISOString()
        };

        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Simula o login com confirmação automática
    const confirmationCode = generateConfirmationCode();
    demoUser.confirmationCode = confirmationCode;
    demoUser.confirmationExpiry = Date.now() + 10 * 60 * 1000; // Código válido por 10 minutos

    // Atualiza o armazenamento
    localStorage.setItem('users', JSON.stringify(users));

    // Define o usuário atual
    currentUser = demoUser;
    delete currentUser.confirmationCode;
    delete currentUser.confirmationExpiry;

    // Mostra tela principal
    showMainScreen();
});

// Função para mostrar histórico de leitura
function showReadingHistory() {
    const readingHistory = getReadingHistory();
    renderBooks(readingHistory, 'mainBookGrid');
}

// Função para atualizar contadores
function updateCounters() {
    // Atualiza contador de favoritos em todas as telas
    const favoriteCounts = document.querySelectorAll('.count');
    favoriteCounts.forEach(countEl => {
        countEl.textContent = getFavorites().length;
    });
}

// Função para exibir histórico de leitura
function displayReadingHistory() {
    const readingHistory = getReadingHistory();
    const historyList = document.getElementById('readingHistoryList');

    if (historyList && readingHistory.length > 0) {
        historyList.innerHTML = '';

        readingHistory.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'history-item';
            bookItem.innerHTML = `
                <div class="history-cover">
                    <img src="${book.coverImage}" alt="${book.title}">
                </div>
                <div class="history-info">
                    <h4>${book.title}</h4>
                    <p>${book.author}</p>
                </div>
            `;
            historyList.appendChild(bookItem);
        });
    } else if (historyList) {
        historyList.innerHTML = '<p>Nenhum livro lido recentemente.</p>';
    }
}

// Função para inicializar o carrossel de destaques
function initializeFeaturedCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicators = document.querySelectorAll('.indicator');

    console.log('Inicializando carrossel com', slides.length, 'slides');
    console.log('Botão anterior encontrado:', prevBtn !== null);
    console.log('Botão próximo encontrado:', nextBtn !== null);
    console.log('Indicadores encontrados:', indicators.length);

    if (slides.length === 0) return; // Retorna se não houver slides

    let currentIndex = 0;

    // Frases para o typewriter associadas a cada slide (mantê-las na mesma ordem dos slides)
    const featuredTaglines = [
        '"Conhecimento é o tesouro mais valioso que podemos compartilhar"',
        'Descubra clássicos que transformam perspectivas e dialogam com a comunidade',
        'Leituras que conectam gerações — explore e participe dos clubes'
    ];

    function showSlide(index) {
        console.log('Mostrando slide', index);
        // Esconde todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        // Remove a classe ativa de todos os indicadores
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Garante que o índice esteja dentro do intervalo
        if (index >= 0 && index < slides.length) {
            currentIndex = index;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = slides.length - 1;
        }

        // Mostra o slide atual
        if (slides[currentIndex]) {
            slides[currentIndex].classList.add('active');
            indicators[currentIndex].classList.add('active');
            console.log('Slide atual:', currentIndex, 'mostrado');

            // Atualiza a tagline com animação de máquina de escrever
            const taglineText = featuredTaglines[currentIndex] || document.querySelector('.tagline')?.textContent || '';
            startTypewriter(taglineText, 40); // 40 ms por caractere para melhor sincronia
        }
    }

    function nextSlide() {
        console.log('Próximo slide chamado');
        // Calcula o próximo índice circularmente
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        console.log('Slide anterior chamado');
        // Calcula o índice anterior circularmente
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Adiciona eventos aos botões
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão anterior clicado');
            prevSlide();

            // Reinicia o intervalo automatico
            restartAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão próximo clicado');
            nextSlide();

            // Reinicia o intervalo automatico
            restartAutoSlide();
        });
    }

    // Adiciona eventos aos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log('Indicador', index, 'clicado');
            showSlide(index);

            // Reinicia o intervalo automatico
            restartAutoSlide();
        });
    });

    // Inicia o carrossel com o primeiro slide
    showSlide(currentIndex);

    // Configura rotação automática do carrossel (a cada 7 segundos)
    let autoSlideInterval;
    if (slides.length > 1) {
        autoSlideInterval = setInterval(() => {
            console.log('Intervalo automático executado');
            nextSlide();
        }, 7000);
    }

    // Função para reiniciar o slider automático
    function restartAutoSlide() {
        if (slides.length > 1) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                console.log('Reiniciando intervalo automático');
                nextSlide();
            }, 7000);
        }
    }
}

// Inicializa o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Garante que os elementos do carrossel existam antes de inicializar
    const slides = document.querySelectorAll('.carousel-slide');
    console.log('Slides encontrados:', slides.length);
    if (slides.length > 0) {
        // Adiciona a classe 'active' ao primeiro slide para garantir que ele seja visível
        if (slides[0]) {
            slides[0].classList.add('active');
        }

        // Inicializa o carrossel de destaques
        initializeFeaturedCarousel();
        console.log('Função initializeFeaturedCarousel chamada');
    }

    // Garante que o usuário de demonstração exista
    const demoUserEmail = 'demo@biblioteca.com';
    if (!users.some(u => u.email === demoUserEmail)) {
        const demoUser = {
            id: 'demo_user',
            name: 'Usuário de Demonstração',
            email: demoUserEmail,
            password: 'demo123',
            verified: true,
            registrationDate: new Date().toISOString()
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Verifica se há um usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        // Verifica se o usuário ainda está na lista de usuários
        if (!users.some(u => u.id === currentUser.id)) {
            // Usuário não encontrado, limpa o estado
            currentUser = null;
            localStorage.removeItem('currentUser');
        } else {
            // Usuário encontrado, mostra tela principal
            showMainScreen();
            return;
        }
    }

    // Se não houver usuário logado, mostra tela inicial
    showHomeScreen();
});

// Typewriter animation for the tagline (máquina de escrever)
// Agora aceita um texto como parâmetro e cancela animações anteriores.
function startTypewriter(text, speed = 60) {
    const el = document.querySelector('.tagline');
    if (!el) return;

    // Cancela qualquer timeout anterior
    if (el._typeTimeout) {
        clearTimeout(el._typeTimeout);
        el._typeTimeout = null;
    }

    // Marca que está digitando
    el.dataset.typing = 'true';
    el.classList.add('typewriter');

    const fullText = (typeof text === 'string') ? text : el.textContent.trim();
    el.textContent = '';

    let i = 0;
    function tick() {
        if (i <= fullText.length) {
            el.textContent = fullText.slice(0, i);
            i++;
            el._typeTimeout = setTimeout(tick, speed);
        } else {
            // terminou — mantém o cursor piscando
            delete el.dataset.typing;
            el._typeTimeout = null;
        }
    }

    tick();
}