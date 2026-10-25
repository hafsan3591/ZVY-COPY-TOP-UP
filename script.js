// script.js

// ডিফল্ট ডেটা (যদি অ্যাডমিন প্যানেল থেকে কিছু সেট না করা থাকে)
const defaultGames = [
    {
        id: "freefire",
        name: "Free Fire",
        image: "https://play-lh.googleusercontent.com/4_i7a3toKFBQvppI92jR5S9M1t5a4e1fFz4c9g8h7j6k5l4m3n2b1v",
        packs: [
            { id: "p1", name: "25 Diamonds", price: 20 },
            { id: "p2", name: "50 Diamonds", price: 38 },
            { id: "p3", name: "115 Diamonds", price: 75 },
            { id: "p4", name: "240 Diamonds", price: 150 },
            { id: "p5", name: "610 Diamonds", price: 380 },
            { id: "p6", name: "Weekly Membership", price: 160 }
        ]
    },
    {
        id: "pubg",
        name: "PUBG Mobile",
        image: "https://play-lh.googleusercontent.com/0e2j0a4Q4Xq3q4Xq3q4Xq3q4Xq3q4Xq3q4Xq3q4Xq3q4",
        packs: [
            { id: "pubg1", name: "60 UC", price: 85 },
            { id: "pubg2", name: "325 UC", price: 420 }
        ]
    }
];

// LocalStorage থেকে ডেটা লোড করা
function getGames() {
    const saved = localStorage.getItem('zvy_games');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('zvy_games', JSON.stringify(defaultGames));
    return defaultGames;
}

let games = getGames();
let selectedGame = null;
let selectedPack = null;
let selectedPayment = "bKash";

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const rechargeGrid = document.getElementById('rechargeGrid');
const paymentGrid = document.getElementById('paymentGrid');
const sumGame = document.getElementById('sumGame');
const sumPack = document.getElementById('sumPack');
const sumTotal = document.getElementById('sumTotal');
const payBtn = document.getElementById('payBtn');
const playerIdInput = document.getElementById('playerId');

// গেম রেন্ডার
function renderGames() {
    gameGrid.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/150'">
            <h4>${game.name}</h4>
        `;
        card.onclick = () => selectGame(game, card);
        gameGrid.appendChild(card);
    });
}

// গেম সিলেক্ট
function selectGame(game, cardElement) {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    cardElement.classList.add('active');
    selectedGame = game;
    selectedPack = null;
    sumGame.textContent = game.name;
    renderRecharges(game.packs);
    updateSummary();
}

// প্যাক রেন্ডার
function renderRecharges(packs) {
    rechargeGrid.innerHTML = '';
    packs.forEach(pack => {
        const card = document.createElement('div');
        card.className = 'recharge-card';
        card.innerHTML = `
            <div class="amount">${pack.name}</div>
            <div class="price">${pack.price} BDT</div>
        `;
        card.onclick = () => selectPack(pack, card);
        rechargeGrid.appendChild(card);
    });
}

// প্যাক সিলেক্ট
function selectPack(pack, cardElement) {
    document.querySelectorAll('.recharge-card').forEach(c => c.classList.remove('active'));
    cardElement.classList.add('active');
    selectedPack = pack;
    updateSummary();
}

// পেমেন্ট মেথড সিলেক্ট
paymentGrid.addEventListener('click', (e) => {
    const methodCard = e.target.closest('.pay-method');
    if (!methodCard) return;
    
    document.querySelectorAll('.pay-method').forEach(c => c.classList.remove('active'));
    methodCard.classList.add('active');
    selectedPayment = methodCard.dataset.method;
});

// সামারি আপডেট
function updateSummary() {
    if (selectedGame && selectedPack) {
        sumPack.textContent = selectedPack.name;
        sumTotal.textContent = selectedPack.price + " BDT";
    } else {
        sumPack.textContent = "-";
        sumTotal.textContent = "0 BDT";
    }
    checkForm();
}

// ফর্ম ভ্যালিডেশন
playerIdInput.addEventListener('input', checkForm);

function checkForm() {
    if (selectedGame && selectedPack && playerIdInput.value.trim() !== "") {
        payBtn.disabled = false;
        payBtn.textContent = `পেমেন্ট করুন (${selectedPack.price} BDT)`;
        payBtn.style.background = "#1c8bc0"; // Active color
    } else {
        payBtn.disabled = true;
        payBtn.textContent = "লগইন / এখনই কিনুন";
        payBtn.style.background = "#ccc";
    }
}

// পে বাটনে ক্লিক
payBtn.onclick = () => {
    // এখানে আপনি চাইলে পেমেন্ট গেটওয়েতে রিডাইরেক্ট করতে পারেন।
    // আপাতত আমরা একটি সাকসেস মডাল দেখাচ্ছি।
    document.getElementById('successModal').style.display = 'grid';
};

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    // রিসেট ফর্ম
    playerIdInput.value = "";
    selectedGame = null;
    selectedPack = null;
    document.querySelectorAll('.game-card, .recharge-card').forEach(c => c.classList.remove('active'));
    updateSummary();
}

// ইনিশিয়ালাইজ
renderGames();