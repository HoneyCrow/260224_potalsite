// サンプルデータ
const siteData = [
    {
        id: 1,
        title: "レシピアプリ",
        category: "Web App",
        description: "冷蔵庫の中の食材を入力すると、作れる料理のレシピを提案してくれるアプリ。",
        image: "📋",
        date: "2026-02-17",
        url: "http://local.bunri.nagoya-bunri.ac.jp/~3124097/recipe-app/"
    },
    
];

// 現在のフィルター状態
let currentFilter = {
    search: "",
    category: "",
    sort: "newest"
};

// ダークモード初期化
function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton();
    }
}

// ダークモード切り替え
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeButton();
}

// ダークモードボタンのアイコン更新
function updateDarkModeButton() {
    const btn = document.getElementById('darkModeToggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    btn.textContent = isDarkMode ? '☀️' : '🌙';
    btn.title = isDarkMode ? 'ライトモード' : 'ダークモード';
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    renderCards(siteData);
    renderTimeline(siteData);
    attachEventListeners();
});

// イベントリスナーを設定
function attachEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const darkModeBtn = document.getElementById('darkModeToggle');

    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleFilter);
    sortSelect.addEventListener('change', handleSort);
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

// 検索処理
function handleSearch(e) {
    currentFilter.search = e.target.value.toLowerCase();
    applyFilters();
}

// カテゴリーフィルター処理
function handleFilter(e) {
    currentFilter.category = e.target.value;
    applyFilters();
}

// ソート処理
function handleSort(e) {
    currentFilter.sort = e.target.value;
    applyFilters();
}

// フィルターを適用
function applyFilters() {
    let filtered = siteData.filter(site => {
        const matchSearch = site.title.toLowerCase().includes(currentFilter.search) ||
                          site.description.toLowerCase().includes(currentFilter.search);
        const matchCategory = !currentFilter.category || site.category === currentFilter.category;
        return matchSearch && matchCategory;
    });

    // ソート
    filtered = sortData(filtered, currentFilter.sort);

    // レンダリング
    renderCards(filtered);
    renderTimeline(siteData);

    // 検索結果なしの表示
    const noResults = document.getElementById('noResults');
    if (filtered.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// データをソート
function sortData(data, sortType) {
    const sorted = [...data];
    
    switch(sortType) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
        default:
            return sorted;
    }
}

// カードをレンダリング
function renderCards(data) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    data.forEach((site, index) => {
        const card = createCard(site);
        container.appendChild(card);
        
        // アニメーションのディレイを設定
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// カードを作成
function createCard(site) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${site.id}`;

    const formattedDate = formatDate(site.date);

    card.innerHTML = `
        <div class="card-image">${site.image}</div>
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-title">${site.title}</h3>
                <span class="card-date-badge">${formattedDate}</span>
            </div>
            <span class="card-category">${site.category}</span>
            <p class="card-description">${site.description}</p>
            <div class="card-footer">
                <a href="${site.url}" target="_blank" class="card-link">
                    サイトへ移動 →
                </a>
            </div>
        </div>
    `;

    return card;
}

// タイムラインをレンダリング
function renderTimeline(data) {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    // 日付でソート（新着順）
    const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(site => {
        const item = createTimelineItem(site);
        container.appendChild(item);
    });
}

// タイムラインアイテムを作成
function createTimelineItem(site) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.id = `timeline-${site.id}`;

    const formattedDate = formatDate(site.date);

    item.innerHTML = `
        <span class="timeline-date">${formattedDate}</span>
        <div class="timeline-title">${site.image} ${site.title}</div>
    `;

    // クリックでカードにジャンプ
    item.addEventListener('click', () => {
        const card = document.getElementById(`card-${site.id}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightCard(card);
        }
    });

    return item;
}

// カードをハイライト
function highlightCard(card) {
    // 以前のハイライトを削除
    document.querySelectorAll('.card').forEach(c => {
        c.style.boxShadow = '';
    });

    // 新しいハイライトを追加
    card.style.boxShadow = '0 0 0 3px #f59e0b, 0 10px 25px rgba(0, 0, 0, 0.15)';

    // 2秒後にハイライトを削除
    setTimeout(() => {
        card.style.boxShadow = '';
    }, 2000);
}

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
