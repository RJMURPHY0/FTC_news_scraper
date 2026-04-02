document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('articles-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let articles = [];
    let savedArticleIds = JSON.parse(localStorage.getItem('savedArticles') || '[]');

    const updateCounters = () => {
        document.getElementById('count-articles').textContent = articles.length;
        document.getElementById('count-saved').textContent = savedArticleIds.length;
    };

    // Fake an API call since we are using local files
    // In production this would fetch from /api/articles or supabase
    const fetchArticles = async () => {
        try {
            // For now, try to load from the python generated json file
            // Alternatively, load mock data if file not found via HTTP Server
            const response = await fetch('/.tmp/articles.json');
            if (response.ok) {
                const data = await response.json();
                articles = data.articles || [];
                renderArticles(articles);
                updateCounters();
            } else {
                showMockData();
            }
        } catch (error) {
            console.error("Could not fetch articles.json. Using mock data.", error);
            showMockData();
        }
    };

    const showMockData = () => {
        // Fallback mock data matching schema
        articles = [
            {
                id: "mock1",
                source: "Reddit (r/artificial)",
                title: "OpenAI announces superapp capabilities",
                url: "#",
                summary: "OpeNAI has just released a brand new update that integrates over 50 different microservices into a single conversational interface...",
                published_date: new Date().toISOString(),
                image_url: ""
            },
            {
                id: "mock2",
                source: "Ben's Bytes",
                title: "Top 10 new Agents launched today",
                url: "#",
                summary: "We tracked 10,000 products. These 10 agent architectures are changing how businesses approach logistics...",
                published_date: new Date(Date.now() - 3600000).toISOString(),
                image_url: ""
            }
        ];
        renderArticles(articles);
        updateCounters();
    };

    const toggleSave = (id) => {
        if (savedArticleIds.includes(id)) {
            savedArticleIds = savedArticleIds.filter(savedId => savedId !== id);
        } else {
            savedArticleIds.push(id);
        }
        localStorage.setItem('savedArticles', JSON.stringify(savedArticleIds));
        updateCounters();
        
        // Update UI
        const btn = document.querySelector(`.save-btn[data-id="${id}"]`);
        if(btn) {
            btn.classList.toggle('saved');
            btn.innerHTML = savedArticleIds.includes(id) ? '♥' : '♡';
        }
    };

    window.handleSaveClick = (id) => toggleSave(id);

    const getPlaceholder = (source = '') => {
        const s = source.toLowerCase();
        if (s.includes('reddit')) return '/placeholder_reddit.png';
        if (s.includes("ben") || s.includes('rundown') || s.includes('newsletter')) return '/placeholder_newsletter.png';
        return '/placeholder_default.png';
    };

    const renderArticles = (dataToRender) => {
        grid.innerHTML = ''; // Clear skeletons
        
        if (dataToRender.length === 0) {
            grid.innerHTML = '<p style="color:var(--brand-light-grey)">No articles found.</p>';
            return;
        }

        dataToRender.forEach(article => {
            const isSaved = savedArticleIds.includes(article.id);
            const dateStr = new Date(article.published_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const card = document.createElement('div');
            card.className = 'article-card';
            
            card.innerHTML = `
                <img src="${article.image_url || getPlaceholder(article.source)}" alt="Cover" class="article-img" onerror="this.src='${getPlaceholder(article.source)}'">
                <div class="article-content">
                    <div class="article-meta">
                        <span>${article.source}</span>
                        <span>${dateStr}</span>
                    </div>
                    <h3 class="article-title"><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p class="article-summary">${article.summary}</p>
                    <div class="card-footer">
                        <a href="${article.url}" target="_blank" style="color:var(--brand-orange);text-decoration:none;font-weight:600;font-size:0.9rem">Read Source →</a>
                        <button class="save-btn ${isSaved ? 'saved' : ''}" data-id="${article.id}" onclick="handleSaveClick('${article.id}')">
                            ${isSaved ? '♥' : '♡'}
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            if (filter === 'saved') {
                renderArticles(articles.filter(a => savedArticleIds.includes(a.id)));
            } else {
                renderArticles(articles);
            }
        });
    });

    // Init
    updateCounters(); // Show saved count immediately on load
    setTimeout(fetchArticles, 800); // Small delay to show off beautiful skeletons
});
