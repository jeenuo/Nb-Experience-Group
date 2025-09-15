// 리뷰 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupFilterTabs();
    setupSortSelect();
    setupLanguageSelector();
});

// 리뷰 데이터 로드
function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    const reviewsGrid = document.getElementById('reviewsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (reviews.length === 0) {
        reviewsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    reviewsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // 리뷰 카드 생성
    reviewsGrid.innerHTML = '';
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsGrid.appendChild(reviewCard);
    });
}

// 샘플 리뷰 데이터
function getSampleReviews() {
    return [
        {
            id: 1,
            title: "정말 만족스러운 체험단 활동이었어요!",
            content: "제품 품질이 정말 좋고, 사용해보니 정말 만족스러웠습니다. 체험단으로 참여할 수 있어서 정말 기뻤어요!",
            author: "김리뷰어",
            date: "2024-01-15",
            rating: 5,
            channel: "instagram",
            image: null,
            link: "https://instagram.com/sample"
        },
        {
            id: 2,
            title: "유튜브 리뷰 영상 올렸어요",
            content: "체험단 제품을 받아서 유튜브에 리뷰 영상을 올렸습니다. 구독자분들도 정말 좋아하시네요!",
            author: "박유튜버",
            date: "2024-01-12",
            rating: 4,
            channel: "youtube",
            image: null,
            link: "https://youtube.com/sample"
        },
        {
            id: 3,
            title: "틱톡에서 화제가 된 리뷰",
            content: "틱톡에 올린 리뷰가 정말 많은 조회수를 받았어요. 체험단 활동이 정말 재미있었습니다.",
            author: "이틱톡커",
            date: "2024-01-10",
            rating: 5,
            channel: "tiktok",
            image: null,
            link: "https://tiktok.com/sample"
        },
        {
            id: 4,
            title: "블로그 상세 리뷰 작성",
            content: "블로그에 상세한 리뷰를 작성했습니다. 제품의 장단점을 자세히 분석해봤어요.",
            author: "최블로거",
            date: "2024-01-08",
            rating: 4,
            channel: "blog",
            image: null,
            link: "https://blog.naver.com/sample"
        },
        {
            id: 5,
            title: "샤오홍슈에 올린 리뷰",
            content: "샤오홍슈에 올린 리뷰가 많은 좋아요를 받았어요. 체험단 활동이 정말 유익했습니다.",
            author: "한샤오홍슈",
            date: "2024-01-05",
            rating: 5,
            channel: "xiaohongshu",
            image: null,
            link: "https://xiaohongshu.com/sample"
        },
        {
            id: 6,
            title: "X(트위터) 리뷰 트윗",
            content: "X에 올린 리뷰 트윗이 많은 리트윗을 받았어요. 체험단 활동이 정말 재미있었습니다.",
            author: "정트위터",
            date: "2024-01-03",
            rating: 4,
            channel: "twitter",
            image: null,
            link: "https://twitter.com/sample"
        }
    ];
}

// 리뷰 카드 생성
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.dataset.channel = review.channel;
    card.dataset.date = review.date;
    card.dataset.rating = review.rating;
    
    card.innerHTML = `
        <div class="review-image">
            ${review.image ? 
                `<img src="${review.image}" alt="${review.title}">` : 
                `<div class="placeholder"><i class="fas fa-${getChannelIcon(review.channel)}"></i></div>`
            }
            <div class="review-category">- ${getChannelName(review.channel)}</div>
        </div>
        <div class="review-content">
            <h3 class="review-name">${review.title}</h3>
            <p class="review-description">${review.content || '리뷰 내용이 없습니다.'}</p>
            <div class="review-meta">
                <div class="review-author">
                    <i class="fas fa-user"></i>
                    <span>${review.author}</span>
                </div>
                <div class="review-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(review.date)}</span>
                </div>
            </div>
            <div class="review-rating">
                <div class="stars">${getStarRating(review.rating)}</div>
                <span class="rating-text">(${review.rating}점)</span>
            </div>
            <div class="review-actions">
                <div class="review-actions-left">
                    <button class="review-action-btn" title="즐겨찾기">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="review-action-btn" title="공유">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="review-action-btn" title="좋아요">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="review-action-btn" title="리포스트">
                        <i class="fas fa-retweet"></i>
                    </button>
                </div>
                ${review.url ? 
                    `<button class="review-view-btn" onclick="viewOriginal('${review.url}')">원문 보기</button>` : 
                    `<div class="review-status">리뷰</div>`
                }
            </div>
        </div>
    `;
    
    return card;
}

// 채널 아이콘 반환
function getChannelIcon(channel) {
    const icons = {
        instagram: 'instagram',
        youtube: 'youtube',
        tiktok: 'music',
        blog: 'blog',
        xiaohongshu: 'heart',
        twitter: 'twitter'
    };
    return icons[channel] || 'star';
}

// 채널 이름 반환
function getChannelName(channel) {
    const names = {
        instagram: '인스타그램',
        youtube: '유튜브',
        tiktok: '틱톡',
        blog: '블로그',
        xiaohongshu: '샤오홍슈',
        twitter: 'X(트위터)'
    };
    return names[channel] || channel;
}

// 별점 표시 생성
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '☆';
    }
    
    return stars;
}

// 원문 보기 함수 추가
function viewOriginal(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 필터 탭 설정
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const reviewCards = document.querySelectorAll('.review-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 필터링 적용
            const channel = tab.dataset.channel;
            filterReviews(channel);
        });
    });
}

// 리뷰 필터링
function filterReviews(channel) {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        if (channel === 'all' || card.dataset.channel === channel) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 정렬 설정
function setupSortSelect() {
    const sortSelect = document.getElementById('sortSelect');
    
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        sortReviews(sortBy);
    });
}

// 리뷰 정렬
function sortReviews(sortBy) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    const cards = Array.from(reviewsGrid.children);
    
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'oldest':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'rating':
                return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
            default:
                return 0;
        }
    });
    
    // 정렬된 카드들을 다시 그리드에 추가
    cards.forEach(card => reviewsGrid.appendChild(card));
}

// 언어 선택기 설정
function setupLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        // 언어 변경 로직 (필요시 구현)
        console.log('Selected language:', selectedLanguage);
    });
}

// 리뷰 데이터 새로고침 (관리자에서 리뷰 추가/수정/삭제 시 호출)
function refreshReviews() {
    loadReviews();
}

// 전역 함수로 등록 (다른 페이지에서 호출 가능)
window.refreshReviews = refreshReviews;

// 검색 페이지로 이동
function goToSearch() {
    window.location.href = 'search.html';
}

// 준비중 팝업 표시
function showComingSoon(serviceName) {
    alert(`${serviceName} 서비스는 현재 준비중입니다.\n빠른 시일 내에 서비스할 예정입니다.`);
}
