// 핫플 맛집 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadHotplaces();
    setupFilters();
});

// 원문 보기 함수
function openOriginalUrl(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('원문 URL이 없습니다.');
    }
}

// 맛집 목록 로드
function loadHotplaces() {
    let hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    
    // 기존 데이터에 active 속성이 없는 경우 기본값 설정
    let hasUpdates = false;
    hotplaces = hotplaces.map(hotplace => {
        if (hotplace.active === undefined) {
            hotplace.active = true;
            hasUpdates = true;
        }
        return hotplace;
    });
    
    // 업데이트된 데이터가 있으면 다시 저장
    if (hasUpdates) {
        localStorage.setItem('hotplaces', JSON.stringify(hotplaces));
    }
    
    // active가 true인 맛집만 표시
    const activeHotplaces = hotplaces.filter(hotplace => hotplace.active === true);
    
    const hotplaceGrid = document.getElementById('hotplaceGrid');
    
    if (activeHotplaces.length === 0) {
        hotplaceGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>등록된 맛집이 없습니다</h3>
                <p>관리자가 맛집을 등록하면 여기에 표시됩니다.</p>
            </div>
        `;
        return;
    }
    
    hotplaceGrid.innerHTML = '';
    activeHotplaces.forEach((hotplace, index) => {
        const hotplaceCard = createHotplaceCard(hotplace, index);
        hotplaceGrid.appendChild(hotplaceCard);
    });
}

// 맛집 카드 생성
function createHotplaceCard(hotplace, index) {
    const card = document.createElement('div');
    card.className = 'hotplace-card';
    card.innerHTML = `
        <div class="hotplace-image">
            ${hotplace.image ? 
                `<img src="${hotplace.image}" alt="${hotplace.name}">` : 
                `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
            }
            <div class="hotplace-category">- ${hotplace.category}</div>
        </div>
        <div class="hotplace-content">
            <h3 class="hotplace-name">${hotplace.name}</h3>
            <p class="hotplace-description">${hotplace.description || '맛집 설명이 없습니다.'}</p>
            <div class="hotplace-meta">
                ${hotplace.location ? `
                    <div class="hotplace-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${hotplace.location}</span>
                    </div>
                ` : ''}
                ${hotplace.price ? `
                    <div class="hotplace-price">${hotplace.price}</div>
                ` : ''}
            </div>
            <div class="hotplace-rating">
                <div class="stars">${getStarRating(hotplace.rating)}</div>
                <span class="rating-text">(${hotplace.rating}점)</span>
            </div>
            ${hotplace.keywords && hotplace.keywords.length > 0 ? `
                <div class="hotplace-keywords">
                    ${hotplace.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                </div>
            ` : ''}
            <div class="hotplace-actions">
                <div class="hotplace-actions-left">
                    <button class="hotplace-action-btn" onclick="toggleFavorite(${index})" title="즐겨찾기">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="hotplace-action-btn" onclick="viewDetails(${index})" title="상세보기">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="hotplace-action-btn" onclick="toggleLike(${index})" title="좋아요">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="hotplace-action-btn" onclick="shareHotplace(${index})" title="공유">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                ${hotplace.url ? 
                    `<button class="hotplace-view-btn" onclick="openOriginalUrl('${hotplace.url}')">원문 보기</button>` : 
                    `<div class="hotplace-status">무료 체험</div>`
                }
            </div>
        </div>
    `;
    return card;
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

// 필터 설정
function setupFilters() {
    // 필터 탭 이벤트
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭에서 active 클래스 제거
            filterTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            // 필터 적용
            applyFilters();
        });
    });
    
    // 정렬 및 평점 필터 이벤트
    const sortSelect = document.getElementById('sortSelect');
    const ratingFilter = document.getElementById('ratingFilter');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    if (ratingFilter) {
        ratingFilter.addEventListener('change', applyFilters);
    }
}

// 필터 적용
function applyFilters() {
    let hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    
    // 기존 데이터에 active 속성이 없는 경우 기본값 설정
    let hasUpdates = false;
    hotplaces = hotplaces.map(hotplace => {
        if (hotplace.active === undefined) {
            hotplace.active = true;
            hasUpdates = true;
        }
        return hotplace;
    });
    
    // 업데이트된 데이터가 있으면 다시 저장
    if (hasUpdates) {
        localStorage.setItem('hotplaces', JSON.stringify(hotplaces));
    }
    
    const activeHotplaces = hotplaces.filter(hotplace => hotplace.active === true);
    
    // 활성 탭에서 카테고리 가져오기
    const activeTab = document.querySelector('.filter-tab.active');
    const selectedCategory = activeTab ? activeTab.dataset.category : 'all';
    
    const ratingFilter = document.getElementById('ratingFilter').value;
    const sortSelect = document.getElementById('sortSelect').value;
    
    let filteredHotplaces = activeHotplaces;
    
    // 카테고리 필터
    if (selectedCategory && selectedCategory !== 'all') {
        filteredHotplaces = filteredHotplaces.filter(hotplace => 
            hotplace.category === selectedCategory
        );
    }
    
    // 평점 필터
    if (ratingFilter) {
        filteredHotplaces = filteredHotplaces.filter(hotplace => 
            parseInt(hotplace.rating) >= parseInt(ratingFilter)
        );
    }
    
    // 정렬
    switch (sortSelect) {
        case 'rating':
            filteredHotplaces.sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
            break;
        case 'name':
            filteredHotplaces.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            filteredHotplaces.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    // 필터링된 결과 표시
    displayFilteredHotplaces(filteredHotplaces);
}

// 필터링된 맛집 표시
function displayFilteredHotplaces(hotplaces) {
    const hotplaceGrid = document.getElementById('hotplaceGrid');
    
    if (hotplaces.length === 0) {
        hotplaceGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 필터 조건을 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    hotplaceGrid.innerHTML = '';
    hotplaces.forEach((hotplace, index) => {
        const hotplaceCard = createHotplaceCard(hotplace, index);
        hotplaceGrid.appendChild(hotplaceCard);
    });
}

// 즐겨찾기 토글
function toggleFavorite(index) {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplace = hotplaces[index];
    
    if (hotplace) {
        hotplace.favorite = !hotplace.favorite;
        localStorage.setItem('hotplaces', JSON.stringify(hotplaces));
        
        // UI 업데이트
        const btn = event.target.closest('.hotplace-action-btn');
        if (hotplace.favorite) {
            btn.classList.add('liked');
        } else {
            btn.classList.remove('liked');
        }
    }
}

// 상세보기
function viewDetails(index) {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplace = hotplaces[index];
    
    if (hotplace) {
        alert(`맛집 상세 정보\n\n이름: ${hotplace.name}\n카테고리: ${hotplace.category}\n설명: ${hotplace.description || '없음'}\n위치: ${hotplace.location || '없음'}\n가격: ${hotplace.price || '없음'}\n평점: ${hotplace.rating}점`);
    }
}

// 좋아요 토글
function toggleLike(index) {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplace = hotplaces[index];
    
    if (hotplace) {
        hotplace.liked = !hotplace.liked;
        localStorage.setItem('hotplaces', JSON.stringify(hotplaces));
        
        // UI 업데이트
        const btn = event.target.closest('.hotplace-action-btn');
        if (hotplace.liked) {
            btn.classList.add('liked');
        } else {
            btn.classList.remove('liked');
        }
    }
}

// 맛집 공유
function shareHotplace(index) {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplace = hotplaces[index];
    
    if (hotplace && navigator.share) {
        navigator.share({
            title: hotplace.name,
            text: hotplace.description || '맛집을 추천합니다!',
            url: window.location.href
        });
    } else {
        // 클립보드에 복사
        const shareText = `${hotplace.name} - ${hotplace.description || '맛집을 추천합니다!'}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('공유 정보가 클립보드에 복사되었습니다!');
        });
    }
}

// 검색 페이지로 이동
function goToSearch() {
    window.location.href = 'search.html';
}

