// admin.js

// ডেটা লোড
let games = JSON.parse(localStorage.getItem('zvy_games')) || defaultGames;
const gameSelect = document.getElementById('adminGameSelect');
const packListDiv = document.getElementById('adminPackList');

// গেম ড্রপডাউন রেন্ডার
function renderAdminGameSelect() {
    gameSelect.innerHTML = '';
    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;
        option.textContent = game.name;
        gameSelect.appendChild(option);
    });
    renderPackList();
}

// সিলেক্টেড গেমের প্যাক লিস্ট দেখানো
gameSelect.addEventListener('change', renderPackList);

function renderPackList() {
    const selectedGameId = gameSelect.value;
    const game = games.find(g => g.id === selectedGameId);
    packListDiv.innerHTML = '';

    if (!game || game.packs.length === 0) {
        packListDiv.innerHTML = '<p style="color:#777; font-size:14px;">কোনো প্যাক নেই।</p>';
        return;
    }

    game.packs.forEach((pack, index) => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div>
                <strong>${pack.name}</strong> - ${pack.price} BDT
            </div>
            <button class="delete-btn" onclick="deletePack('${game.id}', ${index})">Delete</button>
        `;
        packListDiv.appendChild(item);
    });
}

// নতুন প্যাক যোগ
function addPack() {
    const gameId = gameSelect.value;
    const name = document.getElementById('packName').value;
    const price = document.getElementById('packPrice').value;

    if (!name || !price) {
        alert("সব ঘর পূরণ করুন!");
        return;
    }

    const game = games.find(g => g.id === gameId);
    if (game) {
        game.packs.push({
            id: 'p' + Date.now(),
            name: name,
            price: parseInt(price)
        });

        // LocalStorage এ সেভ
        localStorage.setItem('zvy_games', JSON.stringify(games));
        
        // ফর্ম রিসেট ও লিস্ট আপডেট
        document.getElementById('packName').value = '';
        document.getElementById('packPrice').value = '';
        renderPackList();
        alert("সফলভাবে যোগ হয়েছে!");
    }
}

// প্যাক ডিলিট
function deletePack(gameId, packIndex) {
    if (confirm("আপনি কি এই প্যাকটি ডিলিট করতে চান?")) {
        const game = games.find(g => g.id === gameId);
        game.packs.splice(packIndex, 1);
        localStorage.setItem('zvy_games', JSON.stringify(games));
        renderPackList();
    }
}

// ইনিশিয়ালাইজ
renderAdminGameSelect();