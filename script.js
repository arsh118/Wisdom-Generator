const quotes = [{
    text: "When the world crashes, developers reboot it.",
    author: "Arsh Ahmad",
    category: "tech"
},
{
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "coding"
},
{
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "coding"
},
{
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "coding"
},
{
    text: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch",
    category: "coding"
},
{
    text: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine",
    category: "coding"
},
{
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "coding"
},
{
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    category: "coding"
},
{
    text: "Good code is its own best documentation.",
    author: "Steve McConnell",
    category: "coding"
},
{
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    category: "wisdom"
},
{
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: "coding"
},
{
    text: "The most disastrous thing that you can ever learn is your first programming language.",
    author: "Alan Kay",
    category: "coding"
},
{
    text: "The computer was born to solve problems that did not exist before.",
    author: "Bill Gates",
    category: "tech"
},
{
    text: "Technology is best when it brings people together.",
    author: "Matt Mullenweg",
    category: "tech"
},
{
    text: "It's not that we use technology, we live technology.",
    author: "Godfrey Reggio",
    category: "tech"
},
{
    text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
    author: "Bill Gates",
    category: "tech"
},
{
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "life"
},
{
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "life"
},
{
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "life"
},
{
    text: "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt",
    category: "life"
},
{
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life"
}
];


const wisdomText = document.getElementById("wisdomText");
const wisdomAuthor = document.getElementById("wisdomAuthor");
const generateBtn = document.getElementById("generateWisdom");
const favoriteBtn = document.getElementById("favoriteBtn");
const categoriesContainer = document.getElementById("categories");
const favoritesList = document.getElementById("favoritesList");
const clearFavoritesBtn = document.getElementById("clearFavorites");
const notification = document.getElementById("notification");

let currentQuote = null;
let currentCategory = "all";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let isTyping = false;
let typingTimeout = null;

const categories = [{
    id: "all",
    name: "All Quotes"
},
{
    id: "coding",
    name: "Coding"
},
{
    id: "tech",
    name: "Technology"
},
{
    id: "life",
    name: "Life Wisdom"
}
];


function init() {
renderCategories();
displayRandomQuote();
renderFavorites();
}


function renderCategories() {
categoriesContainer.innerHTML = "";

categories.forEach(category => {
    const categoryEl = document.createElement("div");
    categoryEl.className = `category ${currentCategory === category.id ? "active" : ""}`;
    categoryEl.textContent = category.name;
    categoryEl.dataset.id = category.id;

    categoryEl.addEventListener("click", () => {
        currentCategory = category.id;
        document.querySelectorAll(".category").forEach(cat => {
            cat.classList.remove("active");
        });
        categoryEl.classList.add("active");
        displayRandomQuote();
    });

    categoriesContainer.appendChild(categoryEl);
});
}


function displayRandomQuote() {

if (isTyping) {
    clearTimeout(typingTimeout);
    isTyping = false;
}


const filteredQuotes = currentCategory === "all" ?
    quotes :
    quotes.filter(q => q.category === currentCategory);

if (filteredQuotes.length === 0) {
    wisdomText.textContent = "No quotes found in this category.";
    wisdomAuthor.textContent = "";
    return;
}

const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
currentQuote = filteredQuotes[randomIndex];

const isFavorite = favorites.some(fav =>
    fav.text === currentQuote.text && fav.author === currentQuote.author
);

favoriteBtn.innerHTML = isFavorite ?
    '<i class="fas fa-heart"></i>' :
    '<i class="far fa-heart"></i>';
favoriteBtn.classList.toggle("active", isFavorite);

wisdomText.textContent = "";
wisdomAuthor.textContent = "";

typeQuote(currentQuote);
}

function typeQuote(quote) {
let i = 0;
isTyping = true;

function type() {
    if (i < quote.text.length) {
        wisdomText.textContent = `"${quote.text.substring(0, i)}`;
        i++;
        typingTimeout = setTimeout(type, 30);
    } else {
        wisdomText.textContent = `"${quote.text}"`;
        wisdomAuthor.textContent = `- ${quote.author}`;
        isTyping = false;
    }
}

type();
}

function toggleFavorite() {
if (!currentQuote) return;

const index = favorites.findIndex(fav =>
    fav.text === currentQuote.text && fav.author === currentQuote.author
);

if (index === -1) {
    favorites.push({
        ...currentQuote,
        timestamp: new Date().getTime()
    });
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    favoriteBtn.classList.add("active");
    showNotification("Quote added to favorites!");
} else {
    favorites.splice(index, 1);
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    favoriteBtn.classList.remove("active");
    showNotification("Quote removed from favorites!");
}

localStorage.setItem("favorites", JSON.stringify(favorites));

renderFavorites();
}

function renderFavorites() {
if (favorites.length === 0) {
    favoritesList.innerHTML = `
        <div class="empty-favorites">
            <i class="fas fa-book-open"></i>
            <p>No favorites yet. Save quotes you love!</p>
        </div>
    `;
    return;
}

const sortedFavorites = [...favorites].sort((a, b) => b.timestamp - a.timestamp);

favoritesList.innerHTML = sortedFavorites.map((fav, index) => {
    const categoryName = categories.find(cat => cat.id === fav.category)?.name || fav.category;

    return `
        <div class="favorite-item">
            <div class="favorite-text">"${fav.text}"</div>
            <div class="favorite-author">- ${fav.author}</div>
            <span class="favorite-category">${categoryName}</span>
            <button class="remove-favorite" data-index="${index}">
                <i class="fas fa-times"></i> Remove
            </button>
        </div>
    `;
}).join("");

document.querySelectorAll(".remove-favorite").forEach(button => {
    button.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();

        if (currentQuote &&
            currentQuote.text === sortedFavorites[index].text &&
            currentQuote.author === sortedFavorites[index].author) {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.classList.remove("active");
        }
    });
});
}


function clearFavorites() {
if (favorites.length === 0) return;

if (confirm("Are you sure you want to remove all your favorite quotes?")) {
    favorites = [];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();

    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    favoriteBtn.classList.remove("active");
}
}


function showNotification(message) {
notification.textContent = message;
notification.classList.add("show");

setTimeout(() => {
    notification.classList.remove("show");
}, 2000);
}


generateBtn.addEventListener("click", displayRandomQuote);
favoriteBtn.addEventListener("click", toggleFavorite);
clearFavoritesBtn.addEventListener("click", clearFavorites);

init();