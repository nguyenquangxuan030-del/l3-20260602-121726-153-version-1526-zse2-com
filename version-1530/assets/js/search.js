(function () {
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchButton');
    const results = document.getElementById('searchResults');
    const count = document.getElementById('searchCount');
    const movies = window.MOVIE_SEARCH_INDEX || [];

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getQueryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function cardTemplate(movie) {
        const tags = (movie.tags || [])
            .slice(0, 3)
            .map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            })
            .join('');

        return [
            '<article class="movie-card">',
            '    <a class="poster-link" href="details/' + escapeHtml(movie.id) + '.html" aria-label="查看' + escapeHtml(movie.title) + '详情">',
            '        <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" data-fallback-image>',
            '        <div class="poster-fallback"><span>' + escapeHtml(movie.region) + '</span><strong>' + escapeHtml(movie.title) + '</strong></div>',
            '        <span class="score-badge">' + escapeHtml(movie.hotScore) + '</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '        <h3><a href="details/' + escapeHtml(movie.id) + '.html">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.oneLine || movie.summary || '') + '</p>',
            '        <div class="tag-row">' + tags + '</div>',
            '    </div>',
            '</article>'
        ].join('');
    }

    function render(query) {
        const keyword = (query || '').trim().toLowerCase();

        if (!keyword) {
            results.innerHTML = '';
            count.textContent = '请输入关键词开始搜索。';
            return;
        }

        const list = movies
            .filter(function (movie) {
                return movie.search.indexOf(keyword) !== -1;
            })
            .slice(0, 120);

        results.innerHTML = list.map(cardTemplate).join('');
        count.textContent = list.length ? '找到 ' + list.length + ' 条相关结果。' : '没有找到匹配结果。';

        document.querySelectorAll('[data-fallback-image]').forEach(function (image) {
            image.addEventListener('error', function () {
                image.classList.add('is-missing');
            });
        });
    }

    function updateSearch() {
        render(input.value);
    }

    if (input && button) {
        const initialQuery = getQueryFromUrl();

        if (initialQuery) {
            input.value = initialQuery;
            render(initialQuery);
        }

        input.addEventListener('input', updateSearch);
        button.addEventListener('click', updateSearch);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                updateSearch();
            }
        });
    }
}());
