// Main JavaScript file for poet details page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const poetName = urlParams.get('poet');
    
    if (!poetName) {
        window.location.href = 'poet-selection.html';
        return;
    }
    
    fetch(`data/${poetName}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Poet data not found');
            }
            return response.json();
        })
        .then(data => {
            displayPoetInfo(data);
            setupTabs(data);
        })
        .catch(error => {
            console.error('Error loading poet data:', error);
            document.getElementById('poet-content').innerHTML = `
                <div class="error-message">
                    <h2>عذراً، لم يتم العثور على بيانات الشاعر</h2>
                    <p>يرجى العودة إلى <a href="poet-selection.html">صفحة اختيار الشاعر</a></p>
                </div>
            `;
        });
});

function displayPoetInfo(poet) {
    document.title = `ديوان الزمان - ${poet.name}`;
    
    document.getElementById('poet-name').textContent = poet.name;
    
    const poetInfoHTML = `
        <div class="poet-header">
            <div class="poet-image">
                <img src="${poet.image}" alt="${poet.name}" />
            </div>
            <div class="poet-bio">
                <h2>${poet.name}</h2>
                <p>${poet.bio}</p>
            </div>
        </div>
    `;
    
    document.getElementById('poet-info').innerHTML = poetInfoHTML;
}

function setupTabs(poet) {
    const tabsContainer = document.getElementById('tabs');
    const contentContainer = document.getElementById('tab-content');
    
    const tabsHTML = `
        <button class="tab-button active" data-tab="quotes">اقتباسات</button>
        <button class="tab-button" data-tab="poems">قصائد</button>
    `;
    
    tabsContainer.innerHTML = tabsHTML;
    
    showQuotesTab(poet);
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            if (tabName === 'quotes') {
                showQuotesTab(poet);
            } else if (tabName === 'poems') {
                showPoemsTab(poet);
            }
        });
    });
}

function showQuotesTab(poet) {
    const contentContainer = document.getElementById('tab-content');
    
    let quotesHTML = '<div class="quotes-container">';
    
    quotesHTML += '<div class="category-tabs">';
    const categories = {
        'romantic': 'رومانسية',
        'patriotic': 'وطنية',
        'philosophical': 'فلسفية',
        'existential': 'وجودية',
        'social': 'اجتماعية'
    };
    
    Object.keys(categories).forEach((category, index) => {
        const activeClass = index === 0 ? 'active' : '';
        quotesHTML += `<button class="category-tab ${activeClass}" data-category="${category}">${categories[category]}</button>`;
    });
    quotesHTML += '</div>';
    
    quotesHTML += '<div class="quotes-content">';
    Object.keys(categories).forEach((category, index) => {
        const displayStyle = index === 0 ? 'block' : 'none';
        quotesHTML += `<div class="category-content" id="${category}-quotes" style="display: ${displayStyle}">`;
        
        if (poet.quotes && poet.quotes[category]) {
            poet.quotes[category].forEach((quote, qidx) => {
                const quoteText = quote.replace(/"/g, '&quot;');
                quotesHTML += `<div class="quote-card">
                    <div class="quote-text">${quote}</div>
                    <div class="quote-author">${poet.name}</div>
                    <div class="quote-actions" style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end;">
                        <button class="copy-btn" title="نسخ الاقتباس" data-quote="${quoteText}">📋</button>
                        <button class="share-btn" title="مشاركة الاقتباس" data-quote="${quoteText}" data-author="${poet.name}">🔗</button>
                    </div>
                </div>`;
            });
        } else {
            quotesHTML += `<p class="no-content">لا توجد اقتباسات في هذه الفئة</p>`;
        }
        
        quotesHTML += '</div>';
    });
    quotesHTML += '</div>';
    quotesHTML += '</div>';
    
    contentContainer.innerHTML = quotesHTML;
    
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            this.classList.add('active');
            
            document.querySelectorAll('.category-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-quotes`).style.display = 'block';
        });
    });
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-quote');
            navigator.clipboard.writeText(text);
            this.textContent = '✅';
            setTimeout(() => { this.textContent = '📋'; }, 1200);
        });
    });
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-quote');
            const author = this.getAttribute('data-author');
            const shareText = `"${text}"\n— ${author}`;
            if (navigator.share) {
                navigator.share({ text: shareText });
            } else {
                navigator.clipboard.writeText(shareText);
                this.textContent = '✅';
                setTimeout(() => { this.textContent = '🔗'; }, 1200);
                alert('تم نسخ الاقتباس للمشاركة!');
            }
        });
    });
}

function showPoemsTab(poet) {
    const contentContainer = document.getElementById('tab-content');
    
    let poemsHTML = '<div class="poems-container">';
    
    if (poet.poems && poet.poems.length > 0) {
        // Create poems list
        poemsHTML += '<div class="poems-list">';
        poet.poems.forEach((poem, index) => {
            const activeClass = index === 0 ? 'active' : '';
            poemsHTML += `<div class="poem-item ${activeClass}" data-poem-index="${index}">${poem.title}</div>`;
        });
        poemsHTML += '</div>';
        
        // Create poem content area
        poemsHTML += '<div class="poem-content">';
        poemsHTML += `<h3 class="poem-title">${poet.poems[0].title}</h3>`;
        poemsHTML += `<div class="poem-text">${poet.poems[0].text.replace(/\n/g, '<br>')}</div>`;
        poemsHTML += `<div class="poem-actions" style="margin-top:1.5rem;display:flex;gap:10px;justify-content:center;">
            <button class="copy-poem-btn" title="نسخ القصيدة" data-title="${poet.poems[0].title.replace(/"/g, '&quot;')}" data-text="${poet.poems[0].text.replace(/"/g, '&quot;')}">📋</button>
            <button class="share-poem-btn" title="مشاركة القصيدة" data-title="${poet.poems[0].title.replace(/"/g, '&quot;')}" data-text="${poet.poems[0].text.replace(/"/g, '&quot;')}">🔗</button>
        </div>`;
        poemsHTML += '</div>';
    } else {
        poemsHTML += '<p class="no-content">لا توجد قصائد متاحة</p>';
    }
    
    poemsHTML += '</div>'; 
    
    contentContainer.innerHTML = poemsHTML;
    
    document.querySelectorAll('.poem-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.poem-item').forEach(i => {
                i.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const poemIndex = parseInt(this.getAttribute('data-poem-index'));
            const poem = poet.poems[poemIndex];
            
            const poemContent = document.querySelector('.poem-content');
            poemContent.innerHTML = `
                <h3 class="poem-title">${poem.title}</h3>
                <div class="poem-text">${poem.text.replace(/\n/g, '<br>')}</div>
                <div class="poem-actions" style="margin-top:1.5rem;display:flex;gap:10px;justify-content:center;">
                    <button class="copy-poem-btn" title="نسخ القصيدة" data-title="${poem.title.replace(/"/g, '&quot;')}" data-text="${poem.text.replace(/"/g, '&quot;')}">📋</button>
                    <button class="share-poem-btn" title="مشاركة القصيدة" data-title="${poem.title.replace(/"/g, '&quot;')}" data-text="${poem.text.replace(/"/g, '&quot;')}">🔗</button>
                </div>
            `;
            addPoemActionListeners();
        });
    });
    addPoemActionListeners();
}

function addPoemActionListeners() {
    document.querySelectorAll('.copy-poem-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const text = this.getAttribute('data-text');
            const fullText = `"${title}"
${text}`;
            navigator.clipboard.writeText(fullText);
            this.textContent = '✅';
            setTimeout(() => { this.textContent = '📋'; }, 1200);
        });
    });
    document.querySelectorAll('.share-poem-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const text = this.getAttribute('data-text');
            const shareText = `"${title}"
${text}`;
            if (navigator.share) {
                navigator.share({ text: shareText });
            } else {
                navigator.clipboard.writeText(shareText);
                this.textContent = '✅';
                setTimeout(() => { this.textContent = '🔗'; }, 1200);
                alert('تم نسخ القصيدة للمشاركة!');
            }
        });
    });
}
