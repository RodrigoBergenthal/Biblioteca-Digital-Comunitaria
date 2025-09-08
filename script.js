// script.js

// Dados simulados de livros
const books = [
    { id: 1, title: "Dom Casmurro", author: "Machado de Assis", coverColor: "#FFD700" },
    { id: 2, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", coverColor: "#87CEEB" },
    { id: 3, title: "1984", author: "George Orwell", coverColor: "#2F4F4F" },
    { id: 4, title: "Orgulho e Preconceito", author: "Jane Austen", coverColor: "#FFB6C1" },
    { id: 5, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", coverColor: "#8B4513" },
    { id: 6, title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", coverColor: "#9370DB" },
    { id: 7, title: "O Hobbit", author: "J.R.R. Tolkien", coverColor: "#D2691E" },
    { id: 8, title: "Cem Anos de Solidão", author: "Gabriel García Márquez", coverColor: "#32CD32" }
];

// Função para renderizar os livros no catálogo
function renderBooks(bookList) {
    const bookGrid = document.getElementById('bookGrid');
    bookGrid.innerHTML = ''; // Limpa o grid

    if (bookList.length === 0) {
        bookGrid.innerHTML = '<p>Nenhum livro encontrado. Tente outra busca.</p>';
        return;
    }

    bookList.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover" style="background-color: ${book.coverColor};">
                CAPA
            </div>
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
        `;
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
        book.author.toLowerCase().includes(lowerCaseQuery)
    );
}

// Evento para o botão de busca
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const filteredBooks = filterBooks(query);
    renderBooks(filteredBooks);
});

// Permite buscar pressionando Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// Renderiza os livros em destaque inicialmente (todos os livros, por enquanto)
renderBooks(books);