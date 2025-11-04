// script.js

// Dados simulados de livros com cores de capa
const books = [
    { 
        id: 1, 
        title: "Dom Casmurro", 
        author: "Machado de Assis", 
        coverColor: "#FFD700", // Dourado
        category: "Clássicos",
        description: "Obra-prima de Machado de Assis que narra a história de Bentinho e Capitu.",
        rating: 4.5
    },
    { 
        id: 2, 
        title: "O Pequeno Príncipe", 
        author: "Antoine de Saint-Exupéry", 
        coverColor: "#87CEEB", // Azul céu
        category: "Infantil",
        description: "Conto filosófico sobre um pequeno príncipe que parte em uma jornada.",
        rating: 4.8
    },
    { 
        id: 3, 
        title: "1984", 
        author: "George Orwell", 
        coverColor: "#2F4F4F", // Cinza escuro
        category: "Ficção Científica",
        description: "Romance distópico que retrata uma sociedade totalitária.",
        rating: 4.7
    },
    { 
        id: 4, 
        title: "Orgulho e Preconceito", 
        author: "Jane Austen", 
        coverColor: "#FFB6C1", // Rosa claro
        category: "Romance",
        description: "História de amor entre Elizabeth Bennet e o Sr. Darcy.",
        rating: 4.3
    },
    { 
        id: 5, 
        title: "O Senhor dos Anéis", 
        author: "J.R.R. Tolkien", 
        coverColor: "#8B4513", // Marrom
        category: "Fantasia",
        description: "Epic de fantasia que se passa na Terra Média.",
        rating: 4.9
    },
    { 
        id: 6, 
        title: "Harry Potter e a Pedra Filosofal", 
        author: "J.K. Rowling", 
        coverColor: "#9370DB", // Roxo
        category: "Fantasia",
        description: "Primeiro livro da série sobre o jovem bruxo Harry Potter.",
        rating: 4.6
    },
    { 
        id: 7, 
        title: "O Hobbit", 
        author: "J.R.R. Tolkien", 
        coverColor: "#D2691E", // Chocolate
        category: "Fantasia",
        description: "Aventura de Bilbo Bolseiro na Terra Média.",
        rating: 4.4
    },
    { 
        id: 8, 
        title: "Cem Anos de Solidão", 
        author: "Gabriel García Márquez", 
        coverColor: "#32CD32", // Verde lima
        category: "Realismo Mágico",
        description: "Obra-prima do realismo mágico sobre a família Buendía.",
        rating: 4.7
    },
    { 
        id: 9, 
        title: "A Revolução dos Bichos", 
        author: "George Orwell", 
        coverColor: "#A0522D", // Siena
        category: "Fábula Política",
        description: "Fábula satírica que critica o totalitarismo.",
        rating: 4.5
    },
    { 
        id: 10, 
        title: "O Código da Vinci", 
        author: "Dan Brown", 
        coverColor: "#4682B4", // Azul aço
        category: "Suspense",
        description: "Thriller que mistura arte, religião e mistério.",
        rating: 4.2
    }
];

// Função para gerar uma capa de livro em base64 com título e autor
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

// Gerar as capas em base64 dinamicamente
books.forEach(book => {
    book.coverImage = generateCoverImage(book.title, book.author, book.coverColor);
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
                    <img src="${book.coverImage}" alt="${book.title}">
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
                    <img src="${book.coverImage}" alt="${book.title}">
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

// Função para filtrar livros com base na busca
function filterBooks(query) {
    if (!query) {
        // Se a busca estiver vazia, mostra todos os livros
        return books;
    }
    const lowerCaseQuery = query.toLowerCase();
    return books.filter(book =>
        book.title.toLowerCase().includes(lowerCaseQuery) ||
        book.author.toLowerCase().includes(lowerCaseQuery) ||
        book.category.toLowerCase().includes(lowerCaseQuery) ||
        book.description.toLowerCase().includes(lowerCaseQuery)
    );
}

// Função para filtrar por categoria
function filterByCategory(category) {
    if (!category || category === 'all') {
        return books;
    }
    return books.filter(book => book.category.toLowerCase() === category.toLowerCase());
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
document.getElementById('mainSearchBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('mainSearchInput');
    const query = searchInput.value.trim();
    const filteredBooks = filterBooks(query);
    renderBooks(filteredBooks, 'mainBookGrid');
});

// Permite buscar pressionando Enter na tela principal
document.getElementById('mainSearchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('mainSearchBtn').click();
    }
});

// Evento para o botão de busca na tela inicial
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const filteredBooks = filterBooks(query);
    renderBooks(filteredBooks, 'bookGrid');
});

// Permite buscar pressionando Enter na tela inicial
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
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

// Event listeners para os botões da tela inicial
document.getElementById('loginBtn').addEventListener('click', showLoginScreen);
document.getElementById('registerBtn').addEventListener('click', showRegisterScreen);

// Event listeners para links de autenticação
document.getElementById('createAccountLink').addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterScreen();
});

document.getElementById('backToLoginLink').addEventListener('click', function(e) {
    e.preventDefault();
    showLoginScreen();
});

document.getElementById('forgotPasswordLink').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha não implementada na demonstração.');
});

// Event listener para o formulário de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
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
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
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
document.getElementById('confirmationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputCode = document.getElementById('confirmationCode').value;
    
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
document.getElementById('logoutBtn').addEventListener('click', logout);

// Event listener para voltar à tela inicial
document.getElementById('backToHome').addEventListener('click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela de cadastro
document.getElementById('registerBackToHome').addEventListener('click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela de confirmação
document.getElementById('confirmationBackToHome').addEventListener('click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para voltar à tela inicial na tela principal
document.getElementById('mainBackToHome').addEventListener('click', function(e) {
    e.preventDefault();
    showHomeScreen();
});

// Event listener para login de demonstração
document.getElementById('demoLoginBtn').addEventListener('click', function(e) {
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

// Inicializa o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
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