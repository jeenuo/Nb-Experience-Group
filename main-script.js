// 메인 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 등록된 체험단 로드 및 표시
    loadRegisteredExperiences();
    
    // 배너 광고 로드 및 초기화
    loadBanners();
    
    // 임시 사용자 데이터 생성
    createTempUsers();
    
    // 자동 로그인 확인
    checkAutoLogin();
    startBannerRotation();
    
    // 핫플 맛집 로드
    loadHotplaces();
    
    // 이달의 리뷰 로드
    loadReviews();
    
    // URL 파라미터 확인 (등록 완료 후 리다이렉트)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showRegistrationSuccessMessage();
    }
});

// 등록된 체험단 로드
function loadRegisteredExperiences() {
    let experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    
    if (experiences.length === 0) {
        return; // 등록된 체험단이 없으면 기본 카드 유지
    }
    
    // 기존 데이터에 isPopular, isRecommended 속성이 없는 경우 기본값 설정
    let needsUpdate = false;
    experiences = experiences.map(exp => {
        if (exp.isPopular === undefined) {
            exp.isPopular = false;
            needsUpdate = true;
        }
        if (exp.isRecommended === undefined) {
            exp.isRecommended = false;
            needsUpdate = true;
        }
        return exp;
    });
    
    // 업데이트가 필요한 경우 localStorage에 저장
    if (needsUpdate) {
        localStorage.setItem('experiences', JSON.stringify(experiences));
    }
    
    // 진행중 포함: 승인 또는 진행중 체험단만, 종료 제외
    const approvedExperiences = experiences.filter(exp => exp.status !== 'expired' && (exp.status === 'approved' || exp.status === 'ongoing'));
    const recommendedExperiences = approvedExperiences
        .filter(exp => exp.isRecommended === true)
        .sort((a, b) => (a.status === 'ongoing') - (b.status === 'ongoing')); // 진행중은 하단으로
    
    // 각 섹션에 새로운 체험단 카드 추가 (최대 6개)
    addExperiencesToSection('추천 체험단', recommendedExperiences.slice(0, 4));
    
    // 인기 체험단 (신청수가 많고 인기 있는 체험단들 - 추천 체험단 포함)
    const trendingExperiences = approvedExperiences
        .map(exp => {
            // 조회수와 신청수 데이터가 없으면 생성
            if (!exp.viewCount) exp.viewCount = Math.floor(Math.random() * 500) + 50;
            if (!exp.applicationCount) exp.applicationCount = Math.floor(Math.random() * 80) + 10;
            return exp;
        })
        .sort((a, b) => {
            // 추천 체험단은 우선순위를 높게 설정
            const aIsPopular = a.isPopular ? 1 : 0;
            const bIsPopular = b.isPopular ? 1 : 0;
            
            // 추천 체험단이면 더 높은 점수 부여
            const aScore = (a.viewCount || 0) * 0.3 + (a.applicationCount || 0) * 0.7 + (aIsPopular * 1000);
            const bScore = (b.viewCount || 0) * 0.3 + (b.applicationCount || 0) * 0.7 + (bIsPopular * 1000);
            return bScore - aScore;
        });
    // 진행중은 목록 하단으로 정렬
    const trendingOrdered = trendingExperiences.sort((a, b) => (a.status === 'ongoing') - (b.status === 'ongoing'));
    displayExperiencesWithMore('trending', trendingOrdered, 6);
    
    // 신규 체험단 (최근 등록된 체험단)
    const newExperiences = approvedExperiences
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .sort((a, b) => (a.status === 'ongoing') - (b.status === 'ongoing'));
    displayExperiencesWithMore('new', newExperiences, 6);
    
    // 마감 임박 체험단 (마감일이 가까운 체험단)
    const endingExperiences = approvedExperiences
        .filter(exp => {
            const endDate = new Date(exp.endDate);
            const today = new Date();
            const diffTime = endDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 7; // 7일 이내 마감
        })
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    displayExperiencesWithMore('ending', endingExperiences, 6);
    
    // 종료된 체험단 (status가 'expired'인 체험단들)
    const expiredExperiences = experiences
        .filter(exp => exp.status === 'expired')
        .sort((a, b) => new Date(b.expiredAt || b.endDate) - new Date(a.expiredAt || a.endDate));
    displayExperiencesWithMore('expired', expiredExperiences, 6);
}

// 체험단을 제한된 개수로 표시하고 더보기 버튼 관리
function displayExperiencesWithMore(sectionType, experiences, maxDisplay) {
    const sectionId = sectionType + 'Experiences';
    const footerId = sectionType + 'Footer';
    const container = document.getElementById(sectionId);
    const footer = document.getElementById(footerId);
    
    if (!container) return;
    
    // 처음 6개만 표시
    const displayExperiences = experiences.slice(0, maxDisplay);
    container.innerHTML = displayExperiences.map(experience => createExperienceCard(experience)).join('');
    
    // 7개 이상이면 더보기 버튼 표시
    if (experiences.length > maxDisplay) {
        footer.style.display = 'block';
        // 전체 데이터를 저장 (더보기 시 사용)
        window[sectionType + 'AllExperiences'] = experiences;
    } else {
        footer.style.display = 'none';
    }
}

// 더보기 버튼 클릭 시 모든 체험단 표시
function showMoreExperiences(sectionType) {
    const sectionId = sectionType + 'Experiences';
    const footerId = sectionType + 'Footer';
    const container = document.getElementById(sectionId);
    const footer = document.getElementById(footerId);
    
    if (!container || !window[sectionType + 'AllExperiences']) return;
    
    // 모든 체험단 표시
    const allExperiences = window[sectionType + 'AllExperiences'];
    container.innerHTML = allExperiences.map(experience => createExperienceCard(experience)).join('');
    
    // 더보기 버튼 숨기기
    footer.style.display = 'none';
}

// 추천 체험단만 로드하는 별도 함수
function loadRecommendedExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const recommendedExperiences = experiences.filter(exp => exp.isRecommended === true);
    
    // 추천 체험단 섹션만 업데이트
    addExperiencesToSection('추천 체험단', recommendedExperiences.slice(0, 4));
}

// 핫플 맛집 로드
function loadHotplaces() {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    
    if (hotplaces.length === 0) {
        return; // 등록된 맛집이 없으면 기본 카드 유지
    }
    
    // 핫플 맛집 섹션에 카드 추가
    addHotplacesToSection('사진쏙 핫플 맛집', hotplaces.slice(0, 6));
}

// 핫플 맛집 섹션에 카드 추가
function addHotplacesToSection(sectionTitle, hotplaces) {
    const sections = document.querySelectorAll('.section-title');
    let targetSection = null;
    
    sections.forEach(section => {
        if (section.textContent.includes(sectionTitle)) {
            targetSection = section.closest('.product-section');
        }
    });
    
    if (!targetSection) return;
    
    const productGrid = targetSection.querySelector('.product-grid');
    if (!productGrid) return;
    
    // 기존 카드 제거 (새로운 카드로 교체)
    productGrid.innerHTML = '';
    
    // 새로운 핫플 맛집 카드 생성
    hotplaces.forEach(hotplace => {
        const hotplaceCard = createHotplaceCard(hotplace);
        productGrid.appendChild(hotplaceCard);
    });
}

// 핫플 맛집 카드 생성
function createHotplaceCard(hotplace) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            ${hotplace.image ? 
                `<img src="${hotplace.image}" alt="${hotplace.name}">` : 
                `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
            }
            <div class="product-category">- ${hotplace.category}</div>
        </div>
        <div class="product-content">
            <h3 class="product-name">${hotplace.name}</h3>
            <p class="product-description">${hotplace.description || '맛집 설명이 없습니다.'}</p>
            <div class="product-meta">
                ${hotplace.location ? `
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${hotplace.location}</span>
                    </div>
                ` : ''}
                ${hotplace.price ? `
                    <div class="product-price">${hotplace.price}</div>
                ` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">${getStarRating(hotplace.rating)}</div>
                <span class="rating-text">(${hotplace.rating}점)</span>
            </div>
            ${hotplace.keywords && hotplace.keywords.length > 0 ? `
                <div class="product-keywords">
                    ${hotplace.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                </div>
            ` : ''}
            <div class="product-actions">
                <div class="product-actions-left">
                    <button class="product-action-btn" title="즐겨찾기">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="product-action-btn" title="공유">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="product-action-btn" title="좋아요">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="product-action-btn" title="리포스트">
                        <i class="fas fa-retweet"></i>
                    </button>
                </div>
                ${hotplace.url ? 
                    `<button class="product-view-btn" onclick="openOriginalUrl('${hotplace.url}')">원문 보기</button>` : 
                    `<div class="product-status">무료 체험</div>`
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

// 원문 보기 함수
function openOriginalUrl(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('원문 URL이 없습니다.');
    }
}

// 이달의 리뷰 로드
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    if (reviews.length === 0) {
        return; // 등록된 리뷰가 없으면 기본 카드 유지
    }
    
    // 이달의 리뷰 섹션에 카드 추가
    addReviewsToSection('이달의 리뷰', reviews.slice(0, 6));
}

// 이달의 리뷰 섹션에 카드 추가
function addReviewsToSection(sectionTitle, reviews) {
    const sections = document.querySelectorAll('.section-title');
    let targetSection = null;
    
    sections.forEach(section => {
        if (section.textContent.includes(sectionTitle)) {
            targetSection = section.closest('.product-section');
        }
    });
    
    if (!targetSection) return;
    
    const productGrid = targetSection.querySelector('.product-grid');
    if (!productGrid) return;
    
    // 기존 카드 제거 (새로운 카드로 교체)
    productGrid.innerHTML = '';
    
    // 새로운 리뷰 카드 생성
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        productGrid.appendChild(reviewCard);
    });
}

// 리뷰 카드 생성
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            ${review.image ? 
                `<img src="${review.image}" alt="${review.title}">` : 
                `<div class="placeholder"><i class="fas fa-${getChannelIcon(review.channel)}"></i></div>`
            }
            <div class="product-category">- ${getChannelName(review.channel)}</div>
        </div>
        <div class="product-content">
            <h3 class="product-name">${review.title}</h3>
            <p class="product-description">${review.content || '리뷰 내용이 없습니다.'}</p>
            <div class="product-meta">
                <div class="product-author">
                    <i class="fas fa-user"></i>
                    <span>${review.author}</span>
                </div>
                <div class="product-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(review.date)}</span>
                </div>
            </div>
            <div class="product-rating">
                <div class="stars">${getStarRating(review.rating)}</div>
                <span class="rating-text">(${review.rating}점)</span>
            </div>
            <div class="product-actions">
                <div class="product-actions-left">
                    <button class="product-action-btn" title="즐겨찾기">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="product-action-btn" title="공유">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="product-action-btn" title="좋아요">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="product-action-btn" title="리포스트">
                        <i class="fas fa-retweet"></i>
                    </button>
                </div>
                ${review.url ? 
                    `<button class="product-view-btn" onclick="viewOriginal('${review.url}')">원문 보기</button>` : 
                    `<div class="product-status">리뷰</div>`
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
        tiktok: 'video',
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

// 원문 보기 함수
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

// 특정 섹션에 체험단 카드 추가
function addExperiencesToSection(sectionTitle, experiences) {
    const sections = document.querySelectorAll('.section-title');
    let targetSection = null;
    
    sections.forEach(section => {
        if (section.textContent.includes(sectionTitle)) {
            targetSection = section.closest('.product-section');
        }
    });
    
    if (!targetSection) return;
    
    const productGrid = targetSection.querySelector('.product-grid');
    if (!productGrid) return;
    
    // 기존 카드 제거 (새로운 카드로 교체)
    productGrid.innerHTML = '';
    
    // 새로운 체험단 카드 생성
    const cardsHTML = experiences.map(experience => createExperienceCard(experience)).join('');
    productGrid.innerHTML = cardsHTML;
}

// 체험단 카드 생성
function createExperienceCard(experience) {
    // 남은 일수 계산
    const daysLeft = calculateDaysLeft(experience.endDate);
    
    // 지역 텍스트 생성 (주소 정보 포함)
    const locationText = getLocationText(experience.region, experience.address);
    
    // 체험단 상태 확인
    const isExpired = experience.status === 'expired';
    const isOngoing = experience.status === 'ongoing';
    
    // 진행중인 체험단의 경우 남은 체험 일수 계산
    let statusText = '';
    if (isExpired) {
        statusText = '모집 종료';
    } else if (isOngoing) {
        const experienceEndDate = new Date(experience.experienceEndDate || experience.endDate);
        const today = new Date();
        const diffTime = experienceEndDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        statusText = diffDays > 0 ? `체험 ${diffDays}일 남음` : '체험중';
    } else {
        statusText = daysLeft === 1 ? '오늘 마감' : `${daysLeft}일 남음`;
    }
    
    return `
        <div class="experience-card ${isExpired ? 'expired-card' : ''} ${isOngoing ? 'ongoing-card' : ''}" data-experience-id="${experience.id}" onclick="viewExperienceDetails('${experience.id}')">
            <img src="${experience.thumbnail}" alt="${experience.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300x220/9B59B6/FFFFFF?text=이미지'">
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${experience.title || '체험단 제목'}</h3>
                        <div class="card-company">${experience.companyName || '상호명 미입력'}</div>
                        <div class="card-location">${locationText}</div>
                    </div>
                    <div class="card-badges">
                        ${isExpired ? '<div class="card-expired">종료됨</div>' : ''}
                        ${isOngoing ? '<div class="card-ongoing">진행중</div>' : ''}
                        ${experience.isPopular ? '<div class="card-premium">프리미엄</div>' : ''}
                    </div>
                </div>
                
                <div class="card-info">
                    <span class="card-deadline">${statusText}</span>
                    <span class="card-participants">신청 ${experience.applicationCount || Math.floor(Math.random() * 100)}/${experience.participantCount || '10'}</span>
                </div>

                <div class="card-description">${experience.description || '체험단에 대한 자세한 설명을 입력해주세요'}</div>
                
                <div class="card-channels">
                    ${experience.channel ? `<span class="channel-tag">${experience.channel}</span>` : ''}
                </div>
                
                <div class="card-type">${getExperienceTypeName(experience.type) || '방문형'} | ${experience.category || '기타'}</div>
                
                <div class="card-price">
                    ${experience.providedServices || experience.serviceDetails || '체험단 상세 정보'}
                    ${experience.isPremium ? `<span class="p-point-info">P 포인트: ${experience.premiumPoint || 0}원</span>` : ''}
                </div>
                
                ${experience.url ? `
                <div class="card-url">
                    <a href="${experience.url}" target="_blank" class="url-link" onclick="event.stopPropagation();">
                        <i class="fas fa-external-link-alt"></i>
                        바로가기
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 이미지 로딩 오류 처리
function handleImageError(img, title) {
    console.log('이미지 로딩 실패:', img.src);
    img.src = `https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=${encodeURIComponent(title)}`;
    img.style.objectFit = 'contain';
    img.style.backgroundColor = '#f8f9fa';
}

// 이미지 로딩 성공 처리
function handleImageLoad(img) {
    console.log('이미지 로딩 성공:', img.src);
    img.style.objectFit = 'cover';
    img.style.backgroundColor = 'transparent';
}

// 남은 일수 계산
function calculateDaysLeft(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

// 지역 텍스트 생성
function getLocationText(region, address) {
    if (!region) return '';
    
    // region이 이미 한글이면 그대로 사용, 아니면 매핑
    const regionNames = {
        'seoul': '서울',
        'gyeonggi': '경기',
        'incheon': '인천',
        'busan': '부산',
        'daegu': '대구',
        'gwangju': '광주',
        'daejeon': '대전',
        'ulsan': '울산',
        'sejong': '세종',
        'gangwon': '강원',
        'chungbuk': '충북',
        'chungnam': '충남',
        'jeonbuk': '전북',
        'jeonnam': '전남',
        'gyeongbuk': '경북',
        'gyeongnam': '경남',
        'jeju': '제주'
    };
    
    const regionName = regionNames[region] || region;
    
    if (address) {
        return `[${regionName}] ${address}`;
    }
    
    return `[${regionName}]`;
}

// 방문 가능 요일 텍스트 생성
function getAvailableDaysText(availableDays) {
    if (!availableDays || !Array.isArray(availableDays)) return '미입력';
    
    const dayNames = {
        'monday': '월',
        'tuesday': '화',
        'wednesday': '수',
        'thursday': '목',
        'friday': '금',
        'saturday': '토',
        'sunday': '일'
    };
    
    return availableDays.map(day => dayNames[day] || day).join(', ');
}

// 체험 유형 이름 가져오기
function getExperienceTypeName(typeValue) {
    const types = {
        'visit': '방문형',
        'delivery': '배송형',
        'pickup': '포장형',
        'online': '온라인'
    };
    return types[typeValue] || '방문형';
}

function getChannelRequirements(channel) {
    const channelRequirements = {
        '블로그': `
            <div class="channel-requirement">
                <h6>블로그</h6>
                <ul>
                    <li>영상: 5초 이상 영상 1개 필수</li>
                    <li>키워드: 지정 키워드별 3회 이상 삽입</li>
                    <li>글자 수: 최소 1,000자 이상 작성</li>
                    <li>사진: 최소 15장 이상 업로드 및 지도 등록 필수</li>
                </ul>
            </div>
        `,
        '클립': `
            <div class="channel-requirement">
                <h6>클립</h6>
                <ul>
                    <li>해시태그 10개 이상</li>
                    <li>지도 첨부 필수</li>
                    <li>15초 이상 영상 (사진 X)</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                </ul>
            </div>
        `,
        '인스타그램': `
            <div class="channel-requirement">
                <h6>인스타그램</h6>
                <ul>
                    <li>해시태그 10개 이상</li>
                    <li>사진 5장 이상</li>
                    <li>5초 이상 영상</li>
                    <li>글자수 100자 이상</li>
                    <li>계정태그 필수</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                </ul>
            </div>
        `,
        '유튜브': `
            <div class="channel-requirement">
                <h6>유튜브</h6>
                <ul>
                    <li>키워드, 태그 10개 이상</li>
                    <li>5분 이상 영상</li>
                    <li>계정태그 필수</li>
                    <li>유료광고 표시</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                    <li>목소리 필수</li>
                </ul>
            </div>
        `,
        '틱톡': `
            <div class="channel-requirement">
                <h6>틱톡</h6>
                <ul>
                    <li>30초 이상 영상</li>
                    <li>지도 첨부 필수</li>
                    <li>유료광고 문구표기 (#협찬, #내바 마케팅)</li>
                    <li>목소리 필수</li>
                </ul>
            </div>
        `,
        '릴스': `
            <div class="channel-requirement">
                <h6>릴스</h6>
                <ul>
                    <li>30초 이상 영상</li>
                    <li>지도 첨부 필수</li>
                    <li>유료광고 문구표기 (#협찬, #내바 마케팅)</li>
                    <li>목소리 필수</li>
                </ul>
            </div>
        `,
        '샤오홍슈': `
            <div class="channel-requirement">
                <h6>샤오홍슈</h6>
                <ul>
                    <li>해시태그 10개 이상</li>
                    <li>사진 5장 이상</li>
                    <li>5초 이상 영상</li>
                    <li>글자수 100자 이상</li>
                    <li>계정태그 필수</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                </ul>
            </div>
        `,
        'X(트위터)': `
            <div class="channel-requirement">
                <h6>X(트위터)</h6>
                <ul>
                    <li>해시태그 10개 이상</li>
                    <li>사진 5장 이상</li>
                    <li>5초 이상 영상</li>
                    <li>글자수 100자 이상</li>
                    <li>계정태그 필수</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                </ul>
            </div>
        `,
        '블로그+클립': `
            <div class="channel-requirement">
                <h6>블로그+클립</h6>
                <ul>
                    <li><strong>블로그 요구사항:</strong></li>
                    <li>영상: 5초 이상 영상 1개 필수</li>
                    <li>키워드: 지정 키워드별 3회 이상 삽입</li>
                    <li>글자 수: 최소 1,000자 이상 작성</li>
                    <li>사진: 최소 15장 이상 업로드 및 지도 등록 필수</li>
                    <li><strong>클립 요구사항:</strong></li>
                    <li>해시태그 10개 이상</li>
                    <li>지도 첨부 필수</li>
                    <li>15초 이상 영상 (사진 X)</li>
                    <li>공정위 문구표기 (#협찬, #내바 마케팅)</li>
                </ul>
            </div>
        `
    };
    
    return channelRequirements[channel] || channelRequirements['블로그'];
}

// 체험단 상세 보기 (검색 페이지와 동일한 모달)
function viewExperienceDetails(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 카드 형태 모달 생성
    const daysLeft = calculateDaysLeft(experience.endDate);
    const locationText = getLocationText(experience.region, experience.address);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content card-modal" style="max-width: 800px; padding: 0;">
            <div class="modal-header" style="padding: 20px 20px 0 20px; border-bottom: none;">
                <span class="close" style="position: absolute; top: 20px; right: 20px; font-size: 24px; cursor: pointer; z-index: 1001;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 0;">
                <div class="experience-card-large">
                    <img src="${experience.thumbnail}" alt="${experience.title}" class="card-image-large" onerror="this.src='https://via.placeholder.com/800x400/9B59B6/FFFFFF?text=이미지'">
                    <div class="card-content-large">
                        <div class="card-header">
                            <div>
                                <h3 class="card-title">${experience.title || '체험단 제목'}</h3>
                                <div class="card-company">${experience.companyName || '상호명 미입력'}</div>
                                <div class="card-location">${locationText}</div>
                            </div>
                            <div class="card-premium">프리미엄</div>
                        </div>
                        
                        <div class="card-info">
                            <span class="card-deadline">${daysLeft === 1 ? '오늘 마감' : daysLeft + '일 남음'}</span>
                            <span class="card-participants">신청 ${Math.floor(Math.random() * 100)}/${experience.participantCount || '10'}</span>
                        </div>

                        <div class="card-description">${experience.description || '체험단에 대한 자세한 설명을 입력해주세요'}</div>
                        
                        <div class="card-channels">
                            ${experience.channel ? `<span class="channel-tag">${experience.channel}</span>` : ''}
                        </div>
                        
                        <div class="card-type">${getExperienceTypeName(experience.type) || '방문형'} | ${experience.category || '기타'}</div>
                        
                        <div class="card-price">${experience.providedServices || experience.serviceDetails || '체험단 상세 정보'}</div>
                        
                        ${experience.url ? `
                        <div class="card-url">
                            <a href="${experience.url}" target="_blank" class="url-link">
                                <i class="fas fa-external-link-alt"></i>
                                바로가기
                            </a>
                        </div>
                        ` : ''}
                        
                        <div class="card-details">
                            <div class="detail-section">
                                <h4>모집 기간</h4>
                                <p>${experience.startDate || '-'} ~ ${experience.endDate || '-'}</p>
                            </div>
                            
                            <div class="detail-section">
                                <h4>체험 일정</h4>
                                <p>${experience.experienceStartDate || '-'} ~ ${experience.experienceEndDate || '-'}</p>
                            </div>
                            
                            ${experience.address ? `
                            <div class="detail-section">
                                <h4>상세 주소</h4>
                                <p>${experience.address}</p>
                            </div>
                            ` : ''}
                            
                            <div class="detail-section">
                                <h4>홍보 키워드</h4>
                                <div class="keywords-container">
                                    ${experience.keywords?.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('') || '-'}
                                </div>
                            </div>
                            
                            ${experience.type !== 'journalist' ? `
                            <div class="detail-section">
                                <h4>방문 가능 일자 및 시간</h4>
                                <p><strong>체험 기간:</strong> ${experience.experienceStartDate || '-'} ~ ${experience.experienceEndDate || '-'}</p>
                                ${experience.availableDays && experience.availableDays.length > 0 ? `
                                    <p><strong>방문 가능 요일:</strong> ${getAvailableDaysText(experience.availableDays)}</p>
                                ` : ''}
                                ${experience.startTime && experience.endTime ? `
                                    <p><strong>방문 가능 시간:</strong> ${experience.startTime === '24시간' ? '24시간 영업' : `${experience.startTime} ~ ${experience.endTime}`}</p>
                                ` : ''}
                                ${experience.reservationNotes ? `
                                    <p><strong>예약 시 주의사항:</strong> ${experience.reservationNotes}</p>
                                ` : ''}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding: 20px; border-top: 1px solid #e0e0e0;">
                <button class="btn-secondary">닫기</button>
                <button class="btn-primary" onclick="openApplicationModal('${experience.id}')">지원하기</button>
            </div>
        </div>
    `;
    
    // 모달 닫기 함수
    const closeModal = () => {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove();
        }, 200);
    };
    
    // 배경 클릭 시 모달 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);
    
    // 닫기 버튼 이벤트 수정
    setTimeout(() => {
        const closeBtn = modal.querySelector('.close');
        const closeModalBtn = modal.querySelector('.btn-secondary');
        
        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }
        if (closeModalBtn) {
            closeModalBtn.onclick = closeModal;
        }
    }, 100);
    
    document.body.appendChild(modal);
}

// 관리자 로그인 함수
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    // 간단한 비밀번호 체크 (실제로는 서버에서 처리해야 함)
    if (password === '0000') {
        // 로그인 상태 저장
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // 새 창에서 관리자 센터 열기
        window.open('admin.html', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        // 로그인 폼 숨기기
        const adminLoginForm = document.getElementById('adminLoginForm');
        adminLoginForm.style.display = 'none';
        
        // 성공 메시지 표시
        const adminPanel = document.getElementById('adminPanel');
        adminPanel.style.display = 'block';
        adminPanel.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #28a745; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                    로그인 성공!
                </h3>
                <p>관리자 센터가 새 창에서 열렸습니다.</p>
                <button class="btn-primary" onclick="window.open('admin.html', '_blank')" style="margin-top: 1rem;">
                    <i class="fas fa-external-link-alt"></i>
                    관리자 센터 열기
                </button>
            </div>
        `;
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

// 관리자 로그아웃 함수
function adminLogout() {
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPassword = document.getElementById('adminPassword');
    
    adminPanel.style.display = 'none';
    adminLoginForm.style.display = 'block';
    adminPassword.value = '';
}

// 관리자 탭 전환
function switchAdminTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // 선택된 탭 활성화
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'TabContent').style.display = 'block';
    
    // 탭별 데이터 로드
    if (tabName === 'experiences') {
        loadAdminExperiences();
    } else if (tabName === 'edit') {
        loadEditExperienceOptions();
    } else if (tabName === 'banners') {
        loadAdminBanners();
    } else if (tabName === 'reviews') {
        loadAdminReviews();
    } else if (tabName === 'hotplace') {
        loadAdminHotplace();
    }
}

// 관리자 체험단 목록 로드
function loadAdminExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experiencesList = document.getElementById('adminExperienceList');
    const totalExperiences = document.getElementById('totalExperiences');
    
    // 통계 업데이트
    if (totalExperiences) {
        totalExperiences.textContent = experiences.length;
    }
    
    if (experiences.length === 0) {
        experiencesList.innerHTML = '<p>등록된 체험단이 없습니다.</p>';
        return;
    }
    
    experiencesList.innerHTML = experiences.map(experience => `
        <div class="admin-experience-item">
            <div class="experience-info">
                <h4>${experience.title}</h4>
                <p>카테고리: ${experience.category || '기타'}</p>
                <p>모집 기간: ${experience.startDate} ~ ${experience.endDate}</p>
                <p>회사명: ${experience.companyName || '미입력'}</p>
            </div>
            <div class="experience-actions">
                <button class="btn-edit" onclick="editExperience('${experience.id}')">편집</button>
                <button class="btn-delete" onclick="deleteExperience('${experience.id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 체험단 편집
function editExperience(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 체험단 수정 탭으로 전환
    switchAdminTab('edit');
    
    // 수정 폼에 데이터 채우기
    setTimeout(() => {
        document.getElementById('editExperienceSelect').value = experienceId;
        loadExperienceForEdit(experienceId);
    }, 100);
}

// 체험단 수정을 위한 데이터 로드
function loadExperienceForEdit(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) return;
    
    // 폼 필드에 데이터 채우기
    const fields = {
        'editTitle': experience.title,
        'editCompanyName': experience.companyName,
        'editCategory': experience.category,
        'editStartDate': experience.startDate,
        'editEndDate': experience.endDate,
        'editParticipantCount': experience.participantCount,
        'editDescription': experience.description,
        'editServiceDetails': experience.serviceDetails,
        'editKeywords': experience.keywords ? experience.keywords.join(', ') : '',
        'editUrl': experience.url,
        'editLocation': experience.location
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId] || '';
        }
    });
}

// 체험단 수정 저장
function saveExperienceEdit() {
    const experienceId = document.getElementById('editExperienceSelect').value;
    if (!experienceId) {
        alert('수정할 체험단을 선택해주세요.');
        return;
    }
    
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);
    
    if (experienceIndex === -1) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 수정된 데이터 수집
    const updatedExperience = {
        ...experiences[experienceIndex],
        title: document.getElementById('editTitle').value,
        companyName: document.getElementById('editCompanyName').value,
        category: document.getElementById('editCategory').value,
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value,
        participantCount: document.getElementById('editParticipantCount').value,
        description: document.getElementById('editDescription').value,
        serviceDetails: document.getElementById('editServiceDetails').value,
        keywords: document.getElementById('editKeywords').value.split(',').map(k => k.trim()).filter(k => k),
        url: document.getElementById('editUrl').value,
        location: document.getElementById('editLocation').value,
        updatedAt: new Date().toISOString()
    };
    
    // 데이터 업데이트
    experiences[experienceIndex] = updatedExperience;
    localStorage.setItem('experiences', JSON.stringify(experiences));
    
    // 목록 새로고침
    loadAdminExperiences();
    loadRegisteredExperiences();
    
    alert('체험단이 수정되었습니다.');
    switchAdminTab('experiences');
}

// 체험단 삭제
function deleteExperience(experienceId) {
    if (confirm('정말로 이 체험단을 삭제하시겠습니까?')) {
        const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
        localStorage.setItem('experiences', JSON.stringify(updatedExperiences));
        loadAdminExperiences();
        loadRegisteredExperiences(); // 메인 페이지도 업데이트
        alert('체험단이 삭제되었습니다.');
    }
}

// 카테고리 아이콘 가져오기
function getCategoryIcon(category) {
    const icons = {
        '맛집': 'fas fa-utensils',
        '식품': 'fas fa-apple-alt',
        '뷰티': 'fas fa-palette',
        '여행': 'fas fa-plane',
        '디지털': 'fas fa-laptop',
        '반려동물': 'fas fa-paw',
        '기타': 'fas fa-ellipsis-h'
    };
    return icons[category] || 'fas fa-ellipsis-h';
}

// 등록 성공 메시지 표시
function showRegistrationSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>체험단이 성공적으로 등록되었습니다!</span>
        </div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .success-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-content i {
            font-size: 18px;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 체험단 카드 클릭 이벤트 (상세 정보 표시)
document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card[data-experience-id]');
    if (productCard) {
        const experienceId = productCard.getAttribute('data-experience-id');
        showExperienceDetails(experienceId);
    }
});

// 체험단 상세 정보 표시
function showExperienceDetails(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) return;
    
    // 상세 정보 모달 생성
    const modal = document.createElement('div');
    modal.className = 'experience-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${experience.title}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="experience-image">
                    <img src="${experience.thumbnail}" alt="${experience.title}">
                </div>
                <div class="experience-details">
                    <div class="detail-row">
                        <strong>카테고리:</strong> ${experience.category}
                    </div>
                    <div class="detail-row">
                        <strong>체험 유형:</strong> ${experience.type}
                    </div>
                    <div class="detail-row">
                        <strong>채널:</strong> ${experience.channel}
                    </div>
                    <div class="detail-row">
                        <strong>모집 인원:</strong> ${experience.participantCount}명
                    </div>
                    <div class="detail-row">
                        <strong>모집 기간:</strong> ${experience.startDate} ~ ${experience.endDate}
                    </div>
                    ${experience.location ? `<div class="detail-row"><strong>위치:</strong> ${experience.location}</div>` : ''}
                    <div class="detail-row">
                        <strong>설명:</strong> ${experience.description}
                    </div>
                    ${experience.serviceDetails ? `<div class="detail-row"><strong>제공 내역:</strong> ${experience.serviceDetails}</div>` : ''}
                    ${experience.keywords.length > 0 ? `<div class="detail-row"><strong>키워드:</strong> ${experience.keywords.join(', ')}</div>` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-btn">닫기</button>
                <button class="btn-primary" onclick="openApplicationModal('${experience.id}')">지원하기</button>
            </div>
        </div>
    `;
    
    // 모달 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .experience-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .modal-header h2 {
            margin: 0;
            color: #333;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        .modal-body {
            padding: 20px;
        }
        .experience-image {
            text-align: center;
            margin-bottom: 20px;
        }
        .experience-image img {
            max-width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
        }
        .experience-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .detail-row {
            display: flex;
            gap: 10px;
        }
        .detail-row strong {
            min-width: 100px;
            color: #333;
        }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 닫기 버튼 이벤트
    modal.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 배너 광고 관련 함수들
let currentBannerIndex = 0;
let bannerInterval;


// 배너 로드
function loadBanners() {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const bannerSlides = document.getElementById('bannerSlides');
    const bannerDots = document.getElementById('bannerDots');
    const bannerControls = document.getElementById('bannerControls');
    
    if (banners.length === 0) {
        // 기본 배너 표시
        bannerSlides.innerHTML = `
            <div class="banner-slide active">
                <div class="banner-content pink">
                    <div class="banner-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="banner-text">
                        <h2>사진쏙 체험단</h2>
                        <p>최고의 체험단을 만나보세요!</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // 활성 배너만 필터링
    const activeBanners = banners.filter(banner => banner.active).sort((a, b) => a.order - b.order);
    
    if (activeBanners.length === 0) {
        bannerSlides.innerHTML = '<div class="banner-slide active"><div class="banner-content pink"><div class="banner-icon"><i class="fas fa-star"></i></div><div class="banner-text"><h2>사진쏙 체험단</h2><p>최고의 체험단을 만나보세요!</p></div></div></div>';
        return;
    }
    
    // 단독 배너와 일반 배너 분리
    const singleBanners = activeBanners.filter(banner => banner.displayMode === 'single');
    const doubleBanners = activeBanners.filter(banner => banner.displayMode !== 'single');
    
    // 배너 슬라이더 클래스 설정
    if (singleBanners.length > 0) {
        bannerSlides.className = 'banner-slides single-banner';
    } else {
        bannerSlides.className = 'banner-slides double-banner';
    }
    
    // 배너 슬라이드 생성
    if (singleBanners.length > 0) {
        // 단독 배너가 있으면 단독 배너만 표시
        bannerSlides.innerHTML = singleBanners.map((banner, index) => `
            <div class="banner-slide single-banner ${banner.color} ${index === 0 ? 'active' : ''}" ${banner.link ? `onclick="window.open('${banner.link}', '_blank')"` : ''}>
                <div class="banner-single">
                    <div class="banner-content">
                        <div class="banner-icon">
                            <i class="fas fa-${getBannerIcon(banner.icon)}"></i>
                        </div>
                        <div class="banner-text">
                            <h2>${banner.title}</h2>
                            <p>${banner.subtitle}</p>
                        </div>
                        ${banner.image ? `<div class="banner-image"><img src="${banner.image}" alt="${banner.title}"></div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        // 일반 배너는 2개씩 표시
        bannerSlides.innerHTML = doubleBanners.map((banner, index) => `
            <div class="banner-slide double-banner ${banner.color}" ${banner.link ? `onclick="window.open('${banner.link}', '_blank')"` : ''}>
                <div class="banner-single">
                    <div class="banner-content">
                        <div class="banner-icon">
                            <i class="fas fa-${getBannerIcon(banner.icon)}"></i>
                        </div>
                        <div class="banner-text">
                            <h2>${banner.title}</h2>
                            <p>${banner.subtitle}</p>
                        </div>
                        ${banner.image ? `<div class="banner-image"><img src="${banner.image}" alt="${banner.title}"></div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 도트 생성 (단독 배너가 있을 때만)
    if (singleBanners.length > 0 && singleBanners.length > 1) {
        bannerDots.innerHTML = singleBanners.map((_, index) => 
            `<span class="banner-dot ${index === 0 ? 'active' : ''}" onclick="goToBanner(${index})"></span>`
        ).join('');
        bannerControls.style.display = 'flex';
    } else {
        bannerDots.innerHTML = '';
        bannerControls.style.display = 'none';
    }
}

// 배너 아이콘 매핑
function getBannerIcon(iconName) {
    const iconMap = {
        'star': 'star',
        'gift': 'gift',
        'heart': 'heart',
        'thumbs-up': 'thumbs-up',
        'trophy': 'trophy',
        'diamond': 'gem',
        'crown': 'crown',
        'fire': 'fire',
        'lightning': 'bolt',
        'rocket': 'rocket',
        'gem': 'gem',
        'medal': 'medal',
        'target': 'bullseye',
        'shield': 'shield-alt',
        'magic': 'magic',
        'sun': 'sun',
        'moon': 'moon',
        'sparkles': 'sparkles',
        'bolt': 'bolt'
    };
    return iconMap[iconName] || 'star';
}

// 배너 자동 회전 시작
function startBannerRotation() {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const activeBanners = banners.filter(banner => banner.active);
    
    if (activeBanners.length <= 1) return;
    
    bannerInterval = setInterval(() => {
        changeBanner(1);
    }, 5000); // 5초마다 변경
}

// 배너 변경
function changeBanner(direction) {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const activeBanners = banners.filter(banner => banner.active);
    
    if (activeBanners.length <= 1) return;
    
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    // 현재 활성 슬라이드 비활성화
    slides[currentBannerIndex].classList.remove('active');
    dots[currentBannerIndex].classList.remove('active');
    
    // 다음 인덱스 계산
    currentBannerIndex += direction;
    if (currentBannerIndex >= activeBanners.length) {
        currentBannerIndex = 0;
    } else if (currentBannerIndex < 0) {
        currentBannerIndex = activeBanners.length - 1;
    }
    
    // 새로운 슬라이드 활성화
    slides[currentBannerIndex].classList.add('active');
    dots[currentBannerIndex].classList.add('active');
}

// 특정 배너로 이동
function goToBanner(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    // 현재 활성 슬라이드 비활성화
    slides[currentBannerIndex].classList.remove('active');
    dots[currentBannerIndex].classList.remove('active');
    
    // 선택된 슬라이드 활성화
    currentBannerIndex = index;
    slides[currentBannerIndex].classList.add('active');
    dots[currentBannerIndex].classList.add('active');
}

// 배너 추가 모달 열기
function openAddBannerModal() {
    document.getElementById('addBannerModal').style.display = 'flex';
}

// 배너 추가 모달 닫기
function closeAddBannerModal() {
    document.getElementById('addBannerModal').style.display = 'none';
    document.getElementById('addBannerForm').reset();
}

// 배너 저장
function saveBanner() {
    const form = document.getElementById('addBannerForm');
    const formData = new FormData(form);
    
    const banner = {
        id: Date.now().toString(),
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        color: formData.get('color'),
        icon: formData.get('icon'),
        image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : null,
        link: formData.get('link'),
        order: parseInt(formData.get('order')),
        active: formData.get('active') === 'on',
        createdAt: new Date().toISOString()
    };
    
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    banners.push(banner);
    localStorage.setItem('banners', JSON.stringify(banners));
    
    closeAddBannerModal();
    loadBanners();
    loadAdminBanners();
    alert('배너가 저장되었습니다.');
}

// 관리자 배너 목록 로드
function loadAdminBanners() {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const bannersList = document.getElementById('bannersList');
    const totalBanners = document.getElementById('totalBanners');
    const activeBanners = document.getElementById('activeBanners');
    
    totalBanners.textContent = banners.length;
    activeBanners.textContent = banners.filter(banner => banner.active).length;
    
    if (banners.length === 0) {
        bannersList.innerHTML = '<p>등록된 배너가 없습니다.</p>';
        return;
    }
    
    bannersList.innerHTML = banners.map(banner => `
        <div class="admin-banner-item">
            <div class="banner-preview">
                <div class="banner-card ${banner.color}">
                    <div class="banner-content">
                        <div class="banner-icon">
                            <i class="fas fa-${getBannerIcon(banner.icon)}"></i>
                        </div>
                        <div class="banner-text">
                            <h4>${banner.title}</h4>
                            <p>${banner.subtitle}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner-info">
                <h4>${banner.title}</h4>
                <p>순서: ${banner.order} | ${banner.active ? '활성' : '비활성'}</p>
                <p>생성일: ${new Date(banner.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="banner-actions">
                <button class="btn-edit" onclick="editBanner('${banner.id}')">편집</button>
                <button class="btn-delete" onclick="deleteBanner('${banner.id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 배너 편집
function editBanner(bannerId) {
    alert('편집 기능은 준비 중입니다.');
}

// 배너 삭제
function deleteBanner(bannerId) {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
        const banners = JSON.parse(localStorage.getItem('banners') || '[]');
        const updatedBanners = banners.filter(banner => banner.id !== bannerId);
        localStorage.setItem('banners', JSON.stringify(updatedBanners));
        loadAdminBanners();
        loadBanners();
        alert('배너가 삭제되었습니다.');
    }
}

// 관리자 리뷰 목록 로드
function loadAdminReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviewsList) {
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>등록된 리뷰가 없습니다.</p>';
            return;
        }
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="admin-review-item">
                <div class="review-info">
                    <h4>${review.title}</h4>
                    <p>작성자: ${review.author}</p>
                    <p>평점: ${review.rating}/5</p>
                    <p>작성일: ${new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div class="review-actions">
                    <button class="btn-edit" onclick="editReview('${review.id}')">편집</button>
                    <button class="btn-delete" onclick="deleteReview('${review.id}')">삭제</button>
                </div>
            </div>
        `).join('');
    }
}

// 관리자 핫플 맛집 목록 로드
function loadAdminHotplace() {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplaceList = document.getElementById('hotplaceList');
    
    if (hotplaceList) {
        if (hotplaces.length === 0) {
            hotplaceList.innerHTML = '<p>등록된 맛집이 없습니다.</p>';
            return;
        }
        
        hotplaceList.innerHTML = hotplaces.map(hotplace => `
            <div class="admin-hotplace-item">
                <div class="hotplace-info">
                    <h4>${hotplace.name}</h4>
                    <p>위치: ${hotplace.location}</p>
                    <p>카테고리: ${hotplace.category}</p>
                    <p>평점: ${hotplace.rating}/5</p>
                </div>
                <div class="hotplace-actions">
                    <button class="btn-edit" onclick="editHotplace('${hotplace.id}')">편집</button>
                    <button class="btn-delete" onclick="deleteHotplace('${hotplace.id}')">삭제</button>
                </div>
            </div>
        `).join('');
    }
}

// 리뷰 편집
function editReview(reviewId) {
    alert('리뷰 편집 기능은 준비 중입니다.');
}

// 리뷰 삭제
function deleteReview(reviewId) {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
        loadAdminReviews();
        alert('리뷰가 삭제되었습니다.');
    }
}

// 핫플 맛집 편집
function editHotplace(hotplaceId) {
    alert('맛집 편집 기능은 준비 중입니다.');
}

// 핫플 맛집 삭제
function deleteHotplace(hotplaceId) {
    if (confirm('정말로 이 맛집을 삭제하시겠습니까?')) {
        const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
        const updatedHotplaces = hotplaces.filter(hotplace => hotplace.id !== hotplaceId);
        localStorage.setItem('hotplaces', JSON.stringify(updatedHotplaces));
        loadAdminHotplace();
        alert('맛집이 삭제되었습니다.');
    }
}

// 체험단 수정 옵션 로드
function loadEditExperienceOptions() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const selectElement = document.getElementById('editExperienceSelect');
    
    if (selectElement) {
        selectElement.innerHTML = '<option value="">체험단을 선택하세요</option>' +
            experiences.map(exp => `<option value="${exp.id}">${exp.title}</option>`).join('');
    }
}

// 체험단 신청 모달 열기
function openApplicationModal(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 기존 모달이 있다면 제거
    const existingModal = document.querySelector('.application-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 신청 모달 생성
    const modal = document.createElement('div');
    modal.className = 'application-modal';
    modal.innerHTML = `
        <div class="modal-content application-modal-content">
            <div class="modal-header">
                <h2>체험단 신청</h2>
                <button class="close-btn" onclick="closeApplicationModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="experience-info">
                    <h3>${experience.title}</h3>
                    <p class="company-name">${experience.companyName}</p>
                </div>
                
                <div class="terms-section">
                    <h4>체험단 신청 약관</h4>
                    <div class="terms-content">
                        <div class="terms-category">
                            <h5>콘텐츠 제작 의무</h5>
                            <div class="channel-requirements">
                                ${getChannelRequirements(experience.channel)}
                            </div>
                        </div>
                        
                        <div class="terms-category">
                            <h5>서비스 이용 조건</h5>
                            <ul>
                                <li>타 쿠폰 및 할인 적용 불가</li>
                                <li>테이크아웃 불가, 초과 비용 발생 시 본인 부담</li>
                            </ul>
                        </div>
                        
                        <div class="terms-category">
                            <h5>리뷰 등록 및 관리</h5>
                            <ul>
                                <li>리뷰 미등록 시 취소 횟수가 부과되며, 제공된 서비스 비용이 청구될 수 있음</li>
                                <li>예약 후 무단 미방문 또는 당일 취소 시 노쇼(No-show) 페널티 적용</li>
                                <li>작성된 콘텐츠는 최소 6개월간 유지해야 하며, 업체 홍보용으로 2차 활용될 수 있음</li>
                            </ul>
                        </div>
                        
                        <div class="terms-category">
                            <h5>AI 창작물 사용 금지</h5>
                            <ul>
                                <li>AI 도구를 사용한 콘텐츠 생성 및 편집은 엄격히 금지됩니다</li>
                                <li>ChatGPT, Midjourney, DALL-E 등 AI 도구로 생성된 텍스트, 이미지, 영상 사용 불가</li>
                                <li>AI 도구 사용 시 즉시 계정 정지 및 서비스 이용 제한 조치가 취해집니다</li>
                                <li>모든 콘텐츠는 반드시 본인이 직접 제작한 원본이어야 합니다</li>
                            </ul>
                        </div>
                        
                        <div class="terms-category">
                            <h5>책임 한계</h5>
                            <ul>
                                <li>본 서비스는 광고주와 인플루언서를 연결하는 플랫폼으로, 체험 과정에서 발생한 문제나 금전적 손실에 대해서는 책임지지 않음</li>
                            </ul>
                        </div>
                        
                        <div class="terms-category">
                            <h5>표기 의무</h5>
                            <ul>
                                <li>"본 체험은 내바 마케팅을 통해 제공받았습니다." 라는 문구를 반드시 포함해야 함</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="agreement-section">
                    <label class="agreement-checkbox">
                        <input type="checkbox" id="termsAgreement" required>
                        <span class="checkmark"></span>
                        <span class="agreement-text">위 약관에 동의합니다 (필수)</span>
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeApplicationModal()">취소</button>
                <button class="btn-primary" id="submitApplication" onclick="submitApplication('${experienceId}')" disabled>신청하기</button>
            </div>
        </div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .application-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }
        
        .application-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            margin: 20px;
        }
        
        .application-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 15px 15px 0 0;
        }
        
        .application-modal .modal-header h2 {
            margin: 0;
            color: #333;
            font-size: 1.5rem;
        }
        
        .application-modal .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .application-modal .modal-body {
            padding: 20px;
        }
        
        .experience-info {
            text-align: center;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .experience-info h3 {
            margin: 0 0 5px 0;
            color: #333;
            font-size: 1.2rem;
        }
        
        .company-name {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .terms-section {
            margin-bottom: 20px;
        }
        
        .terms-section h4 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.1rem;
            border-bottom: 2px solid #007bff;
            padding-bottom: 5px;
        }
        
        .terms-content {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
        }
        
        .terms-category {
            margin-bottom: 15px;
        }
        
        .terms-category:last-child {
            margin-bottom: 0;
        }
        
        .terms-category h5 {
            margin: 0 0 8px 0;
            color: #495057;
            font-size: 1rem;
            font-weight: 600;
        }
        
        .terms-category ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .terms-category li {
            margin-bottom: 5px;
            color: #6c757d;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .agreement-section {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .agreement-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 1rem;
            color: #333;
        }
        
        .agreement-checkbox input[type="checkbox"] {
            display: none;
        }
        
        .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
            position: relative;
            background: white;
            transition: all 0.3s ease;
        }
        
        .agreement-checkbox input[type="checkbox"]:checked + .checkmark {
            background: #007bff;
            border-color: #007bff;
        }
        
        .agreement-checkbox input[type="checkbox"]:checked + .checkmark::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }
        
        .agreement-text {
            font-weight: 500;
        }
        
        .application-modal .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 0 0 15px 15px;
        }
        
        .btn-primary:disabled {
            background: #6c757d;
            border-color: #6c757d;
            cursor: not-allowed;
        }
        
        .channel-requirements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        
        .channel-requirement {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #007bff;
        }
        
        .channel-requirement h6 {
            margin: 0 0 10px 0;
            color: #007bff;
            font-size: 1rem;
            font-weight: 600;
            text-align: center;
            background: #e3f2fd;
            padding: 8px;
            border-radius: 4px;
        }
        
        .channel-requirement ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .channel-requirement li {
            margin-bottom: 6px;
            color: #495057;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .terms-category h5 {
            color: #dc3545;
            font-weight: 600;
        }
        
        .terms-category h5:contains("AI 창작물") {
            color: #dc3545;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 약관 동의 체크박스 이벤트
    const termsCheckbox = document.getElementById('termsAgreement');
    const submitButton = document.getElementById('submitApplication');
    
    termsCheckbox.addEventListener('change', function() {
        submitButton.disabled = !this.checked;
    });
}

// 체험단 신청 모달 닫기
function closeApplicationModal() {
    const modal = document.querySelector('.application-modal');
    if (modal) {
        modal.remove();
    }
}

// 체험단 신청 제출
function submitApplication(experienceId) {
    const termsAgreed = document.getElementById('termsAgreement').checked;
    
    if (!termsAgreed) {
        alert('약관에 동의해야 신청할 수 있습니다.');
        return;
    }
    
    // 신청 처리 (실제로는 서버로 전송)
    alert('체험단 신청이 완료되었습니다!');
    closeApplicationModal();
    
    // 신청 데이터 저장 (로컬 스토리지)
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
        id: Date.now().toString(),
        experienceId: experienceId,
        appliedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
}

// 검색 페이지로 이동
function goToSearch() {
    window.location.href = 'search.html';
}


// 로그인 모달 관련 함수들
function openLoginModal() {
    // 이미 로그인된 상태인지 확인
    const userIcon = document.querySelector('.fa-user');
    if (userIcon && userIcon.title && userIcon.title.includes('로그인됨')) {
        // 로그인된 상태면 로그아웃 확인
        if (confirm('로그아웃하시겠습니까?')) {
            logout();
        }
        return;
    }
    
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 배경 스크롤 복원
    }
}

// 로그인 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // 모달 외부 클릭 시 닫기
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
});

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const autoLogin = document.getElementById('autoLogin').checked;
    
    if (!email || !password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
    }
    
    // 관리자 계정 확인 (이메일 형식 검증 없이)
    if (email === 'AD1234' && password === '0000') {
        // 관리자 로그인 성공
        console.log('관리자 로그인 성공');
        
        // 관리자 로그인 상태를 세션 스토리지에 저장
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUser', 'AD1234');
        
        // file:// 프로토콜에서 절대 경로로 이동
        const currentPath = window.location.href;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const adminPageUrl = basePath + 'admin.html';
        
        console.log('현재 경로:', currentPath);
        console.log('관리자 페이지 URL:', adminPageUrl);
        
        closeLoginModal();
        
        // 즉시 페이지 이동 시도
        try {
            window.location.href = adminPageUrl;
        } catch (e) {
            console.error('페이지 이동 실패:', e);
            // 새 창으로 열기
            window.open(adminPageUrl, '_blank');
        }
    } else {
        // 일반 사용자 로그인 처리
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let loginUser = null;
        
        // 이메일 전체 또는 @ 앞부분으로 로그인 시도
        for (let user of users) {
            const emailPrefix = user.email.split('@')[0];
            
            // 전체 이메일 또는 @ 앞부분으로 매칭
            if (user.email === email || emailPrefix === email) {
                if (user.password === password) {
                    loginUser = user;
                    break;
                }
            }
        }
        
        if (loginUser) {
            // 로그인 성공
            console.log('사용자 로그인 성공:', loginUser);
            
            // 로그인 상태를 세션 스토리지에 저장
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('currentUser', JSON.stringify(loginUser));
            
            // 자동 로그인 설정
            if (autoLogin) {
                localStorage.setItem('autoLogin', 'true');
                localStorage.setItem('autoLoginUser', JSON.stringify(loginUser));
            }
            
            closeLoginModal();
            
            // 사용자 상태 업데이트
            updateUserStatus(loginUser.email, false);
            
            // 성공 메시지
            alert(`${loginUser.name}님, ${t('login.welcome_back')}`);
            
            // 페이지 새로고침
            location.reload();
        } else {
            // 잘못된 계정 정보
            console.log('잘못된 로그인 시도:', { email, password, autoLogin });
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
            return;
        }
    }
}

function loginWithNaver() {
    console.log('네이버 로그인 시도');
    // 네이버 로그인 API 연동
    alert(t('login.naver_login') + ' ' + t('message.preparing'));
}

function loginWithInstagram() {
    console.log('인스타그램 로그인 시도');
    // 인스타그램 로그인 API 연동
    alert(t('login.instagram_login') + ' ' + t('message.preparing'));
}

function openSignupModal() {
    console.log('회원가입 모달 열기');
    const signupModal = document.getElementById('signupModal');
    const userTypeSelection = document.getElementById('userTypeSelection');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    // 초기 상태로 리셋
    userTypeSelection.style.display = 'block';
    signupFormContainer.style.display = 'none';
    
    // 선택된 카드 초기화
    const cards = document.querySelectorAll('.user-type-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    // 폼 초기화
    document.getElementById('signupForm').reset();
    
    signupModal.style.display = 'flex';
}

function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'none';
}

function selectUserType(type) {
    console.log('사용자 유형 선택:', type);
    
    // 모든 카드에서 selected 클래스 제거
    const cards = document.querySelectorAll('.user-type-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    // 선택된 카드에 selected 클래스 추가
    event.currentTarget.classList.add('selected');
    
    // 선택된 유형을 저장
    window.selectedUserType = type;
    
    // 폼으로 이동
    setTimeout(() => {
        showSignupForm(type);
    }, 300);
}

function showSignupForm(userType) {
    const userTypeSelection = document.getElementById('userTypeSelection');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const businessInfoGroup = document.getElementById('businessInfoGroup');
    const businessInfoGroup2 = document.getElementById('businessInfoGroup2');
    const businessInfoGroup3 = document.getElementById('businessInfoGroup3');
    
    // 사용자 유형 선택 숨기기
    userTypeSelection.style.display = 'none';
    
    // 폼 표시
    signupFormContainer.style.display = 'block';
    
    // 자영업자인 경우 사업자 정보 필드 표시
    if (userType === 'business') {
        businessInfoGroup.style.display = 'block';
        businessInfoGroup2.style.display = 'block';
        businessInfoGroup3.style.display = 'block';
        document.getElementById('signupBusinessName').required = true;
        document.getElementById('signupBusinessNumber').required = true;
        document.getElementById('signupBusinessLicense').required = true;
        
        // 파일 업로드 이벤트 리스너 추가
        initializeFileUpload();
    } else {
        businessInfoGroup.style.display = 'none';
        businessInfoGroup2.style.display = 'none';
        businessInfoGroup3.style.display = 'none';
        document.getElementById('signupBusinessName').required = false;
        document.getElementById('signupBusinessNumber').required = false;
        document.getElementById('signupBusinessLicense').required = false;
    }
}

function goBackToUserType() {
    const userTypeSelection = document.getElementById('userTypeSelection');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    userTypeSelection.style.display = 'block';
    signupFormContainer.style.display = 'none';
}

// 회원가입 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
});

function handleSignup() {
    const formData = new FormData(document.getElementById('signupForm'));
    const userType = window.selectedUserType;
    
    // 필수 필드 검증
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const region = formData.get('region');
    const agreeTerms = formData.get('agreeTerms');
    
    // 기본 검증
    if (!email || !password || !passwordConfirm || !name || !phone || !region) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    // 비밀번호 확인
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 비밀번호 강도 검증 (최소 8자, 영문+숫자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
        return;
    }
    
    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(phone)) {
        alert('올바른 전화번호 형식을 입력해주세요.');
        return;
    }
    
    // 약관 동의 확인
    if (!agreeTerms) {
        alert('이용약관 및 개인정보처리방침에 동의해주세요.');
        return;
    }
    
    // 자영업자 추가 검증
    if (userType === 'business') {
        const businessName = formData.get('businessName');
        const businessNumber = formData.get('businessNumber');
        const businessLicense = window.selectedBusinessLicense;
        
        if (!businessName || !businessNumber) {
            alert('자영업자 정보를 모두 입력해주세요.');
            return;
        }
        
        // 사업자등록증 파일 검증
        if (!businessLicense) {
            alert('사업자등록증을 첨부해주세요.');
            return;
        }
        
        // 사업자등록번호 형식 검증 (10자리 숫자)
        const businessNumberRegex = /^\d{10}$/;
        if (!businessNumberRegex.test(businessNumber.replace(/-/g, ''))) {
            alert('올바른 사업자등록번호 형식을 입력해주세요. (10자리 숫자)');
            return;
        }
    }
    
    // 회원가입 처리
    const userData = {
        id: generateUserId(),
        email: email,
        password: password, // 실제로는 해시화해야 함
        name: name,
        phone: phone,
        region: region,
        userType: userType,
        businessName: userType === 'business' ? formData.get('businessName') : null,
        businessNumber: userType === 'business' ? formData.get('businessNumber') : null,
        businessLicense: userType === 'business' ? {
            fileName: window.selectedBusinessLicense.name,
            fileSize: window.selectedBusinessLicense.size,
            fileType: window.selectedBusinessLicense.type,
            uploadDate: new Date().toISOString()
        } : null,
        agreeMarketing: formData.get('agreeMarketing') === 'on',
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // 로컬 스토리지에 사용자 데이터 저장
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    console.log('회원가입 성공:', userData);
    
    // 성공 메시지
    alert(`${userType === 'influencer' ? '인플루언서' : '자영업자'} 회원가입이 완료되었습니다!`);
    
    // 모달 닫기
    closeSignupModal();
    
    // 로그인 모달 열기
    setTimeout(() => {
        openLoginModal();
    }, 500);
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 자동 로그인 확인
function checkAutoLogin() {
    const autoLogin = localStorage.getItem('autoLogin');
    const autoLoginUser = localStorage.getItem('autoLoginUser');
    
    if (autoLogin === 'true' && autoLoginUser) {
        try {
            const user = JSON.parse(autoLoginUser);
            
            // 세션 스토리지에 로그인 상태 저장
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // 사용자 상태 업데이트
            updateUserStatus(user.email, false);
            
            console.log('자동 로그인 성공:', user.name);
        } catch (e) {
            console.error('자동 로그인 실패:', e);
            // 자동 로그인 데이터 삭제
            localStorage.removeItem('autoLogin');
            localStorage.removeItem('autoLoginUser');
        }
    }
}

// 임시 사용자 데이터 생성
function createTempUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 임시 사용자가 이미 있는지 확인
    const hasTempUsers = existingUsers.some(user => user.email.includes('temp'));
    
    if (!hasTempUsers) {
        const tempUsers = [
            {
                id: 'temp_influencer_1',
                email: 'influencer1@temp.com',
                password: '123456',
                name: '김인플루언서',
                phone: '010-1234-5678',
                region: '서울',
                userType: 'influencer',
                businessName: null,
                businessNumber: null,
                businessLicense: null,
                agreeMarketing: true,
                createdAt: new Date().toISOString(),
                status: 'active',
                profile: {
                    instagram: '@kim_influencer',
                    followers: 15000,
                    categories: ['뷰티', '패션'],
                    bio: '뷰티와 패션을 사랑하는 인플루언서입니다.'
                }
            },
            {
                id: 'temp_business_1',
                email: 'business1@temp.com',
                password: '123456',
                name: '박사업자',
                phone: '010-9876-5432',
                region: '경기',
                userType: 'business',
                businessName: '테스트카페',
                businessNumber: '1234567890',
                businessLicense: {
                    fileName: 'business_license.pdf',
                    fileSize: 1024000,
                    fileType: 'application/pdf',
                    uploadDate: new Date().toISOString()
                },
                agreeMarketing: true,
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'temp_business_2',
                email: 'cafe_owner@temp.com',
                password: 'cafe123',
                name: '이카페사장',
                phone: '010-5555-1234',
                region: '서울',
                userType: 'business',
                businessName: '달콤한카페',
                businessNumber: '9876543210',
                businessLicense: {
                    fileName: 'cafe_license.jpg',
                    fileSize: 2048000,
                    fileType: 'image/jpeg',
                    uploadDate: new Date().toISOString()
                },
                agreeMarketing: true,
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'temp_business_3',
                email: 'restaurant@temp.com',
                password: 'food123',
                name: '최맛집사장',
                phone: '010-7777-8888',
                region: '부산',
                userType: 'business',
                businessName: '바다맛집',
                businessNumber: '5555666677',
                businessLicense: {
                    fileName: 'restaurant_license.pdf',
                    fileSize: 1536000,
                    fileType: 'application/pdf',
                    uploadDate: new Date().toISOString()
                },
                agreeMarketing: false,
                createdAt: new Date().toISOString(),
                status: 'active'
            }
        ];
        
        // 기존 사용자에 임시 사용자 추가
        const allUsers = [...existingUsers, ...tempUsers];
        localStorage.setItem('users', JSON.stringify(allUsers));
        
        console.log('임시 사용자 데이터 생성 완료');
        console.log('인플루언서 계정: influencer1@temp.com / 123456');
        console.log('자영업자 계정 1: business1@temp.com / 123456');
        console.log('자영업자 계정 2: cafe_owner@temp.com / cafe123');
        console.log('자영업자 계정 3: restaurant@temp.com / food123');
    }
}

// 파일 업로드 초기화
function initializeFileUpload() {
    const fileInput = document.getElementById('signupBusinessLicense');
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileUploadContent = document.getElementById('fileUploadContent');
    const filePreview = document.getElementById('filePreview');
    const filePreviewImage = document.getElementById('filePreviewImage');
    const fileName = document.getElementById('fileName');
    
    if (!fileInput || !fileUploadArea) return;
    
    // 파일 선택 이벤트
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
    
    // 드래그 앤 드롭 이벤트
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// 파일 선택 처리
function handleFileSelect(file) {
    if (!file) return;
    
    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
    }
    
    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('JPG, PNG, PDF 파일만 업로드 가능합니다.');
        return;
    }
    
    // 파일 미리보기 표시
    const fileUploadContent = document.getElementById('fileUploadContent');
    const filePreview = document.getElementById('filePreview');
    const filePreviewImage = document.getElementById('filePreviewImage');
    const fileName = document.getElementById('fileName');
    
    fileUploadContent.style.display = 'none';
    filePreview.style.display = 'flex';
    
    // 이미지 파일인 경우 미리보기 표시
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreviewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        // PDF 파일인 경우 아이콘 표시
        filePreviewImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMTUgMTVIMzVWMzVIMTVWMTVaIiBzdHJva2U9IiM2Njc5RUEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMjAgMjBIMzBWMjVIMjBWMjBaIiBzdHJva2U9IiM2Njc5RUEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMjAgMzBIMzBWMzVIMjBWMzBaIiBzdHJva2U9IiM2Njc5RUEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
    }
    
    fileName.textContent = file.name;
    
    // 파일을 전역 변수에 저장
    window.selectedBusinessLicense = file;
}

// 파일 삭제
function removeFile() {
    const fileInput = document.getElementById('signupBusinessLicense');
    const fileUploadContent = document.getElementById('fileUploadContent');
    const filePreview = document.getElementById('filePreview');
    
    fileInput.value = '';
    fileUploadContent.style.display = 'block';
    filePreview.style.display = 'none';
    
    // 전역 변수에서 파일 제거
    window.selectedBusinessLicense = null;
}

function updateUserStatus(email, isAdmin = false) {
    // 헤더의 사용자 아이콘을 로그인된 상태로 변경
    const userIcon = document.querySelector('.fa-user');
    if (userIcon) {
        userIcon.style.color = isAdmin ? '#ff6b6b' : '#667eea';
        userIcon.title = isAdmin ? `관리자 로그인됨: ${email}` : `로그인됨: ${email}`;
        
        // 관리자인 경우 아이콘 변경
        if (isAdmin) {
            userIcon.className = 'fas fa-user-shield';
        }
        
        // 클릭 이벤트 추가 (프로필 페이지 또는 로그아웃)
        userIcon.onclick = function() {
            const userLoggedIn = sessionStorage.getItem('userLoggedIn');
            const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
            
            if (adminLoggedIn) {
                // 관리자는 관리자 페이지로
                window.location.href = 'admin.html';
            } else if (userLoggedIn) {
                // 일반 사용자는 프로필 페이지로
                window.location.href = 'profile.html';
            } else {
                // 로그인되지 않은 경우 로그인 모달
                openLoginModal();
            }
        };
    }
}

// 로그아웃 함수
function logout() {
    // 세션 스토리지에서 로그인 정보 제거
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    
    // 자동 로그인 정보 제거
    localStorage.removeItem('autoLogin');
    localStorage.removeItem('autoLoginUser');
    
    // 사용자 아이콘 원래 상태로 복원
    const userIcon = document.querySelector('.fa-user');
    if (userIcon) {
        userIcon.style.color = '';
        userIcon.title = '로그인';
        userIcon.className = 'fas fa-user';
        userIcon.onclick = function() {
            openLoginModal();
        };
    }
    
    console.log('로그아웃 완료');
    alert('로그아웃 되었습니다.');
    
    // 페이지 새로고침
    location.reload();
}

function showAdminPanel() {
    // 관리자 패널을 표시하는 로직
    // 기존 admin.html의 관리자 패널을 현재 페이지에 표시
    window.location.href = 'admin.html';
}

function logout() {
    // 로그아웃 처리
    const userIcon = document.querySelector('.fa-user');
    if (userIcon) {
        userIcon.style.color = '';
        userIcon.className = 'fas fa-user';
        userIcon.title = '';
    }
    
    // 관리자 패널 숨기기
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
    
    alert('로그아웃되었습니다.');
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLoginModal();
    }
});

// 체험단 상태 확인 및 업데이트 (진행중, 종료)
function checkAndUpdateExpiredExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const currentDate = new Date();
    let hasUpdates = false;
    
    experiences.forEach(experience => {
        const endDate = new Date(experience.endDate);
        const experienceEndDate = new Date(experience.experienceEndDate || experience.endDate);
        
        // 체험 기간이 완전히 끝난 경우 (진행중 -> 종료)
        if (experienceEndDate < currentDate && experience.status === 'ongoing') {
            experience.status = 'expired';
            experience.expiredAt = new Date().toISOString();
            hasUpdates = true;
            console.log(`체험단 "${experience.title}"이 완전히 종료되었습니다.`);
        }
        // 모집은 끝났지만 체험 기간은 아직 진행 중인 경우 (승인 -> 진행중)
        else if (endDate < currentDate && experienceEndDate >= currentDate && experience.status === 'approved') {
            experience.status = 'ongoing';
            experience.ongoingAt = new Date().toISOString();
            hasUpdates = true;
            console.log(`체험단 "${experience.title}"이 진행중 상태로 변경되었습니다.`);
        }
        // 모집 마감일이 지났고 체험 기간도 끝난 경우 (진행중이 아닌 경우)
        else if (endDate < currentDate && experienceEndDate < currentDate && experience.status !== 'expired') {
            experience.status = 'expired';
            experience.expiredAt = new Date().toISOString();
            hasUpdates = true;
            console.log(`체험단 "${experience.title}"이 종료되었습니다.`);
        }
    });
    
    // 변경사항이 있으면 localStorage 업데이트
    if (hasUpdates) {
        localStorage.setItem('experiences', JSON.stringify(experiences));
        console.log('체험단 상태가 업데이트되었습니다.');
    }
    
    return experiences;
}

// 페이지 로드 시 체험단 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    checkAndUpdateExpiredExperiences();
    loadReviews();
});

// 준비중 팝업 표시
function showComingSoon(serviceName) {
    alert(`${serviceName} 서비스는 현재 준비중입니다.\n빠른 시일 내에 서비스할 예정입니다.`);
}


// 리뷰 로드
function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // 기존 데이터에 active 속성이 없는 경우 기본값 설정
    let hasUpdates = false;
    reviews = reviews.map(review => {
        if (review.active === undefined) {
            review.active = true;
            hasUpdates = true;
        }
        return review;
    });
    
    // 업데이트된 데이터가 있으면 다시 저장
    if (hasUpdates) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }
    
    // active가 true인 리뷰만 표시
    const activeReviews = reviews.filter(review => review.active === true);
    
    const reviewGrid = document.getElementById('reviewGrid');
    
    if (activeReviews.length === 0) {
        // 임시 리뷰 데이터 생성
        const tempReviews = [
            {
                id: 'rev1',
                channel: 'instagram',
                channelName: '인스타그램',
                title: '맛있는 카페 체험단 후기',
                author: '김리뷰어',
                content: '정말 맛있는 커피와 디저트를 체험했습니다. 분위기도 좋고 직원분들도 친절하셨어요!',
                rating: 5,
                date: '2024-02-15',
                keywords: ['강남 카페', '디저트 맛집', '인스타 감성'],
                link: 'https://instagram.com/review1',
                active: true
            },
            {
                id: 'rev2',
                channel: 'youtube',
                channelName: '유튜브',
                title: '뷰티 제품 체험단 리뷰',
                author: '박뷰티',
                content: '새로 출시된 립스틱을 체험해봤는데 색상도 예쁘고 지속력도 좋았어요. 추천합니다!',
                rating: 4,
                date: '2024-02-10',
                keywords: ['뷰티', '립스틱', '화장품'],
                link: 'https://youtube.com/review2',
                active: true
            },
            {
                id: 'rev3',
                channel: 'tiktok',
                channelName: '틱톡',
                title: '패션 체험단 쇼츠',
                author: '이패션',
                content: '신상 의류를 체험해봤는데 디자인도 예쁘고 착용감도 좋았어요! #패션 #체험단',
                rating: 5,
                date: '2024-02-08',
                keywords: ['패션', '의류', '스타일'],
                link: 'https://tiktok.com/review3',
                active: true
            }
        ];
        
        localStorage.setItem('reviews', JSON.stringify(tempReviews));
        displayReviews(tempReviews);
        return;
    }
    
    displayReviews(activeReviews);
}

// 리뷰 표시
function displayReviews(reviews) {
    const reviewGrid = document.getElementById('reviewGrid');
    
    if (reviews.length === 0) {
        reviewGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h3>등록된 리뷰가 없습니다</h3>
                <p>관리자가 리뷰를 등록하면 여기에 표시됩니다.</p>
            </div>
        `;
        return;
    }
    
    reviewGrid.innerHTML = '';
    reviews.forEach((review, index) => {
        const reviewCard = createReviewCard(review, index);
        reviewGrid.appendChild(reviewCard);
    });
}

// 리뷰 카드 생성
function createReviewCard(review, index) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div class="review-image">
            ${review.image ? 
                `<img src="${review.image}" alt="${review.title}">` : 
                `<div class="placeholder"><i class="fas fa-${getChannelIcon(review.channel)}"></i></div>`
            }
            <div class="review-category">- ${getChannelTag(review.channel)}</div>
        </div>
        <div class="review-content">
            <h3 class="review-name">${review.title}</h3>
            <p class="review-description">${review.content}</p>
            <div class="review-meta">
                <div class="review-author">
                    <i class="fas fa-user"></i>
                    <span>${review.author}</span>
                </div>
                <div class="review-date">
                    <i class="fas fa-calendar"></i>
                    <span>${review.date}</span>
                </div>
            </div>
            <div class="review-rating">
                <div class="review-stars">${getStarRating(review.rating)}</div>
                <span class="review-rating-text">(${review.rating}점)</span>
            </div>
            ${review.keywords && review.keywords.length > 0 ? `
                <div class="review-keywords">
                    ${review.keywords.map(keyword => `<span class="review-keyword-tag">${keyword}</span>`).join('')}
                </div>
            ` : ''}
        </div>
        <div class="review-actions">
            <div class="review-actions-left">
                <button class="review-action-btn" onclick="toggleReviewFavorite(${index})" title="즐겨찾기">
                    <i class="fas fa-star"></i>
                </button>
                <button class="review-action-btn" onclick="viewReviewDetails(${index})" title="상세보기">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="review-action-btn" onclick="toggleReviewLike(${index})" title="좋아요">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="review-action-btn" onclick="shareReview(${index})" title="공유">
                    <i class="fas fa-share"></i>
                </button>
            </div>
            ${review.link ? 
                `<button class="review-view-btn" onclick="openReviewLink('${review.link}')">원문 보기</button>` : 
                `<div class="review-status">무료 체험</div>`
            }
        </div>
    `;
    return card;
}

// 채널 아이콘 반환
function getChannelIcon(channel) {
    const icons = {
        'instagram': 'camera',
        'youtube': 'play',
        'tiktok': 'music',
        'xiaohongshu': 'heart',
        'twitter': 'twitter',
        'blog': 'blog'
    };
    return icons[channel] || 'star';
}

// 채널 태그 반환
function getChannelTag(channel) {
    const tags = {
        'instagram': '인스타그램',
        'youtube': '유튜브',
        'tiktok': '틱톡',
        'xiaohongshu': '샤오홍슈',
        'twitter': 'X(트위터)',
        'blog': '블로그'
    };
    return tags[channel] || '리뷰';
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

// 리뷰 관련 액션 함수들
function toggleReviewFavorite(index) {
    alert('즐겨찾기에 추가되었습니다.');
}

function viewReviewDetails(index) {
    alert('리뷰 상세보기 페이지로 이동합니다.');
}

function toggleReviewLike(index) {
    alert('좋아요가 추가되었습니다.');
}

function shareReview(index) {
    if (navigator.share) {
        navigator.share({
            title: '리뷰 공유',
            text: '이달의 리뷰를 확인해보세요!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('리뷰 링크가 클립보드에 복사되었습니다!');
        });
    }
}

function openReviewLink(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('리뷰 링크가 없습니다.');
    }
}
