// サンプルデータ
const siteData = [
    {
        id: 1,
        title: "タスク管理アプリ",
        category: "Web App",
        description: "リアルタイム同期機能付きのタスク管理アプリケーション。ドラッグ&ドロップで優先度を変更できます。",
        image: "📋",
        date: "2025-12-15",
        url: "https://example.com/task-manager"
    },
    {
        id: 2,
        title: "天気予報アプリ",
        category: "Web App",
        description: "GPSと天気APIを使用した天気予報アプリ。5日間の予報と詳細な気象情報を表示します。",
        image: "🌤️",
        date: "2025-11-20",
        url: "https://example.com/weather"
    },
    {
        id: 3,
        title: "ポートフォリオサイト",
        category: "デザイン",
        description: "モダンで応答性の高いポートフォリオサイト。プロジェクト一覧と連絡先フォーム付き。",
        image: "🎨",
        date: "2025-10-05",
        url: "https://example.com/portfolio"
    },
    {
        id: 4,
        title: "計算機",
        category: "ツール",
        description: "基本的な四則演算と関数計算に対応した高機能電卓。計算履歴も保存できます。",
        image: "🧮",
        date: "2025-09-18",
        url: "https://example.com/calculator"
    },
    {
        id: 5,
        title: "JavaScriptチュートリアル",
        category: "学習",
        description: "初心者向けJavaScriptの基礎を学べるインタラクティブなチュートリアルページ。",
        image: "📚",
        date: "2025-08-30",
        url: "https://example.com/js-tutorial"
    },
    {
        id: 6,
        title: "画像編集ツール",
        category: "ツール",
        description: "ブラウザ上で動作する簡単な画像編集ツール。フィルターと基本的な編集機能を搭載。",
        image: "🖼️",
        date: "2025-08-10",
        url: "https://example.com/image-editor"
    },
    {
        id: 7,
        title: "Reactコンポーネント集",
        category: "Web App",
        description: "再利用可能なReactコンポーネントの集合。デザインシステムとして活用できます。",
        image: "⚛️",
        date: "2025-07-25",
        url: "https://example.com/react-components"
    },
    {
        id: 8,
        title: "Webデザイン基礎",
        category: "学習",
        description: "HTML/CSS/JavaScriptの基礎から応用まで学べるカリキュラム。実践的なプロジェクト付き。",
        image: "🌐",
        date: "2025-06-12",
        url: "https://example.com/web-design-course"
    },
    {
        id: 9,
        title: "チャットアプリ",
        category: "Web App",
        description: "WebSocketを使用したリアルタイムチャットアプリケーション。複数ユーザー対応。",
        image: "💬",
        date: "2025-05-28",
        url: "https://example.com/chat-app"
    },
    {
        id: 10,
        title: "音楽プレイヤー",
        category: "ツール",
        description: "シンプルで使いやすい音楽プレイヤー。プレイリスト機能とカスタマイズ可能なスキン。",
        image: "🎵",
        date: "2025-04-15",
        url: "https://example.com/music-player"
    }
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
