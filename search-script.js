// 검색 페이지 JavaScript

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSearchResults();
    setupSearchBar();
    setupLanguageSelector();
    setupFilterReset();
});

// 검색바 기능 설정
function setupSearchBar() {
    const searchInput = document.getElementById('searchInput');
    
    // Enter 키로 검색
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 실시간 검색 (입력 중)
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 0) {
            performTextSearch(query);
        } else {
            loadSearchResults();
        }
    });
}

// 텍스트 검색 수행
function performTextSearch(query) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    // 승인된 체험단만 필터링
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    const filteredExperiences = approvedExperiences.filter(experience => {
        const searchText = `${experience.title} ${experience.description} ${experience.category} ${experience.managerName}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    });
    
    displaySearchResults(filteredExperiences);
}

// 검색 버튼 클릭 시 검색 수행
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query.length > 0) {
        performTextSearch(query);
    } else {
        loadSearchResults();
    }
}

// 언어 선택기 설정
function setupLanguageSelector() {
    const languageBtn = document.querySelector('.language-btn');
    
    languageBtn.addEventListener('click', function() {
        // 언어 선택 드롭다운 토글 (향후 구현)
        alert('언어 선택 기능은 향후 구현될 예정입니다.');
    });
}

// 지역별 필터링
function filterByRegion(region) {
    // 모든 지역 버튼 비활성화
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 지역 버튼 활성화
    document.querySelector(`[data-region="${region}"]`).classList.add('active');
    
    // 서울이 선택되면 구/군 버튼 표시
    if (region === 'seoul') {
        document.getElementById('seoulDistricts').style.display = 'block';
    } else {
        document.getElementById('seoulDistricts').style.display = 'none';
        // 구/군 버튼들 비활성화
        document.querySelectorAll('.district-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    applyFilters();
}

// 구/군별 필터링
function filterByDistrict(district) {
    // 모든 구/군 버튼 비활성화
    document.querySelectorAll('.district-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 구/군 버튼 활성화
    document.querySelector(`[data-district="${district}"]`).classList.add('active');
    
    applyFilters();
}

// 필터 적용
function applyFilters() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    // 승인된 체험단만 필터링
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    const selectedRegion = document.querySelector('.region-btn.active')?.dataset.region;
    const selectedDistrict = document.querySelector('.district-btn.active')?.dataset.district;
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedChannel = document.getElementById('channelFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    
    console.log('필터 적용:', {
        selectedRegion,
        selectedDistrict,
        selectedCategory,
        selectedChannel,
        sortBy,
        totalExperiences: experiences.length
    });
    
    let filteredExperiences = approvedExperiences.filter(experience => {
        // 지역 필터
        if (selectedRegion && selectedRegion !== 'all') {
            if (experience.region !== selectedRegion) {
                return false;
            }
            
            // 서울인 경우 구/군 필터 적용
            if (selectedRegion === 'seoul' && selectedDistrict && experience.district !== selectedDistrict) {
                return false;
            }
        }
        
        // 카테고리 필터
        if (selectedCategory) {
            const categoryName = getCategoryName(selectedCategory);
            if (experience.category !== categoryName) {
                console.log('카테고리 필터로 제외:', experience.title, '카테고리:', experience.category, '선택된 카테고리:', selectedCategory, '변환된 카테고리명:', categoryName);
                return false;
            }
        }
        
        // 채널 필터
        if (selectedChannel) {
            const channelName = getChannelName(selectedChannel);
            if (experience.channel !== channelName) {
                console.log('채널 필터로 제외:', experience.title, '채널:', experience.channel, '선택된 채널:', selectedChannel, '변환된 채널명:', channelName);
                return false;
            }
        }
        
        return true;
    });
    
    console.log('필터링 결과:', filteredExperiences.length, '개');
    
    // 정렬
    filteredExperiences.sort((a, b) => {
        switch (sortBy) {
            case 'deadline':
                return new Date(a.endDate) - new Date(b.endDate);
            case 'participants':
                return parseInt(b.participantCount) - parseInt(a.participantCount);
            case 'latest':
            default:
                return new Date(b.registrationDate) - new Date(a.registrationDate);
        }
    });
    
    displaySearchResults(filteredExperiences);
}

// 검색 결과 표시
function displaySearchResults(experiences) {
    const resultsContainer = document.getElementById('searchResults');
    const resultCount = document.getElementById('resultCount');
    
    resultCount.textContent = `${experiences.length}개`;
    
    if (experiences.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-search"></i>
                <p>검색 결과가 없습니다.</p>
                <p>다른 필터 조건을 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = experiences.map(experience => {
        const daysLeft = calculateDaysLeft(experience.endDate);
        const locationText = getLocationText(experience.region, experience.district);
        
        return `
            <div class="experience-card" onclick="viewExperienceDetails('${experience.id}')">
                <img src="${experience.thumbnail}" alt="${experience.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300x220/9B59B6/FFFFFF?text=이미지'">
                <div class="card-content">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${experience.title}</h3>
                            <div class="card-company">${experience.companyName || '상호명 미입력'}</div>
                            <div class="card-location">${locationText}</div>
                        </div>
                        <div class="card-badges">
                            ${experience.isPopular ? '<div class="card-premium">프리미엄</div>' : ''}
                        </div>
                    </div>
                    
                    <div class="card-info">
                        <span class="card-deadline">${daysLeft}일 남음</span>
                        <span class="card-participants">신청 ${Math.floor(Math.random() * 100)}/${experience.participantCount}</span>
                    </div>
                    
                    <div class="card-description">${experience.description}</div>
                    
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
    }).join('');
}

// 검색 결과 로드
function loadSearchResults() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    // 승인된 체험단만 필터링
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    displaySearchResults(approvedExperiences);
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
function getLocationText(region, district) {
    if (!region) return '';
    
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
    
    const districtNames = {
        // 서울
        'gangnam': '강남구', 'gangdong': '강동구', 'gangbuk': '강북구', 'gangseo': '강서구',
        'gwanak': '관악구', 'gwangjin': '광진구', 'guro': '구로구', 'geumcheon': '금천구',
        'nowon': '노원구', 'dobong': '도봉구', 'dongdaemun': '동대문구', 'dongjak': '동작구',
        'mapo': '마포구', 'seodaemun': '서대문구', 'seocho': '서초구', 'seongdong': '성동구',
        'seongbuk': '성북구', 'songpa': '송파구', 'yangcheon': '양천구', 'yeongdeungpo': '영등포구',
        'yongsan': '용산구', 'eunpyeong': '은평구', 'jongno': '종로구', 'jung': '중구', 'jungnang': '중랑구',
        
        // 경기
        'suwon': '수원시', 'seongnam': '성남시', 'goyang': '고양시', 'yongin': '용인시',
        'bucheon': '부천시', 'ansan': '안산시', 'anyang': '안양시', 'namyangju': '남양주시',
        'hwasung': '화성시', 'pyeongtaek': '평택시', 'siheung': '시흥시', 'gimpo': '김포시',
        'gunpo': '군포시', 'osan': '오산시', 'hanam': '하남시', 'yangju': '양주시',
        'icheon': '이천시', 'gwangju_gyeonggi': '광주시', 'paju': '파주시', 'yeoju': '여주시',
        'yangpyeong': '양평군', 'gapyeong': '가평군', 'yeoncheon': '연천군',
        
        // 인천
        'michuhol': '미추홀구', 'yeonsu': '연수구', 'namdong': '남동구', 'bupyeong': '부평구',
        'gyeyang': '계양구', 'ganghwa': '강화군', 'ongjin': '옹진군',
        
        // 부산
        'yeongdo': '영도구', 'busanjin': '부산진구', 'dongrae': '동래구', 'haeundae': '해운대구',
        'saha': '사하구', 'geumjeong': '금정구', 'yeonje': '연제구', 'suyeong': '수영구',
        'sasang': '사상구', 'gijang': '기장군',
        
        // 대구
        'suseong': '수성구', 'dalseo': '달서구', 'dalseong': '달성군', 'gunwi': '군위군',
        
        // 광주
        'gwangsan': '광산구',
        
        // 대전
        'yuseong': '유성구', 'daedeok': '대덕구',
        
        // 울산
        'ulju': '울주군',
        
        // 세종
        'sejong': '세종특별자치시',
        
        // 강원
        'chuncheon': '춘천시', 'wonju': '원주시', 'gangneung': '강릉시', 'donghae': '동해시',
        'taebaek': '태백시', 'sokcho': '속초시', 'samcheok': '삼척시', 'hongcheon': '홍천군',
        'hoengseong': '횡성군', 'yeongwol': '영월군', 'pyeongchang': '평창군', 'jeongseon': '정선군',
        'cheorwon': '철원군', 'hwacheon': '화천군', 'yanggu': '양구군', 'inje': '인제군',
        'goseong': '고성군', 'yangyang': '양양군',
        
        // 충북
        'cheongju': '청주시', 'chungju': '충주시', 'jecheon': '제천시', 'boeun': '보은군',
        'okcheon': '옥천군', 'yeongdong': '영동군', 'jincheon': '진천군', 'goesan': '괴산군',
        'eumseong': '음성군', 'danyang': '단양군', 'jeungpyeong': '증평군',
        
        // 충남
        'cheonan': '천안시', 'gongju': '공주시', 'boryeong': '보령시', 'asan': '아산시',
        'seosan': '서산시', 'nonsan': '논산시', 'gyeryong': '계룡시', 'dangjin': '당진시',
        'geumsan': '금산군', 'buyeo': '부여군', 'seocheon': '서천군', 'cheongyang': '청양군',
        'hongseong': '홍성군', 'yesan': '예산군', 'taean': '태안군',
        
        // 전북
        'jeonju': '전주시', 'gunsan': '군산시', 'iksan': '익산시', 'jeongeup': '정읍시',
        'namwon': '남원시', 'gimje': '김제시', 'wansan': '완주군', 'jinan': '진안군',
        'muju': '무주군', 'jangsu': '장수군', 'imsil': '임실군', 'sunchang': '순창군',
        'gochang': '고창군', 'buan': '부안군',
        
        // 전남
        'mokpo': '목포시', 'yeosu': '여수시', 'suncheon': '순천시', 'naju': '나주시',
        'gwangyang': '광양시', 'damyang': '담양군', 'gokseong': '곡성군', 'gurye': '구례군',
        'goheung': '고흥군', 'boseong': '보성군', 'hwasun': '화순군', 'jangheung': '장흥군',
        'gangjin': '강진군', 'haenam': '해남군', 'yeongam': '영암군', 'muan': '무안군',
        'hampyeong': '함평군', 'yeonggwang': '영광군', 'jangseong': '장성군', 'wando': '완도군',
        'jindo': '진도군', 'shinan': '신안군',
        
        // 경북
        'pohang': '포항시', 'gyeongju': '경주시', 'gimcheon': '김천시', 'andong': '안동시',
        'gumi': '구미시', 'yeongju': '영주시', 'yeongcheon': '영천시', 'sangju': '상주시',
        'mungyeong': '문경시', 'gyeongsan': '경산시', 'uiseong': '의성군', 'cheongsong': '청송군',
        'yeongyang': '영양군', 'yeongdeok': '영덕군', 'cheongdo': '청도군', 'goryeong': '고령군',
        'seongju': '성주군', 'chilgok': '칠곡군', 'yecheon': '예천군', 'bonghwa': '봉화군',
        'uljin': '울진군', 'ulleung': '울릉군',
        
        // 경남
        'changwon': '창원시', 'jinju': '진주시', 'tongyeong': '통영시', 'sacheon': '사천시',
        'gimhae': '김해시', 'miryang': '밀양시', 'geoje': '거제시', 'yangsan': '양산시',
        'uiryeong': '의령군', 'haman': '함안군', 'changnyeong': '창녕군', 'goseong': '고성군',
        'namhae': '남해군', 'hadong': '하동군', 'sancheong': '산청군', 'hamyang': '함양군',
        'geochang': '거창군', 'hapcheon': '합천군',
        
        // 제주
        'seogwipo': '서귀포시'
    };
    
    const regionName = regionNames[region] || region;
    const districtName = districtNames[district] || district;
    
    return `[${regionName}]`;
}

// 방문 가능 요일 텍스트 변환 함수
function getAvailableDaysText(availableDays) {
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

// 체험단 상세 보기 (메인 페이지의 함수와 동일)
function viewExperienceDetails(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 카드 형태 모달 생성
    const daysLeft = calculateDaysLeft(experience.endDate);
    const locationText = getLocationText(experience.region, experience.district);
    
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
                            <span class="card-deadline">${daysLeft}일 남음</span>
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

// 체험단 신청 모달 열기 (메인 페이지와 동일)
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
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .application-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
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
            background: #f8f9fa;
            border-radius: 15px 15px 0 0;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #333;
            font-size: 1.5rem;
        }
        
        .close-btn {
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
        
        .close-btn:hover {
            color: #333;
        }
        
        .modal-body {
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
            font-size: 1.3rem;
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
            color: #dc3545;
            margin-bottom: 15px;
            font-size: 1.2rem;
            border-bottom: 2px solid #dc3545;
            padding-bottom: 5px;
        }
        
        .terms-category {
            margin-bottom: 20px;
        }
        
        .terms-category h5 {
            color: #495057;
            margin-bottom: 10px;
            font-size: 1rem;
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
        
        .agreement-section {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .agreement-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 1rem;
            color: #333;
        }
        
        .agreement-checkbox input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 0 0 15px 15px;
        }
        
        .btn-primary, .btn-secondary {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .btn-primary {
            background: #007bff;
            color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: #0056b3;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #545b62;
        }
        
        .btn-primary:disabled {
            background: #6c757d;
            border-color: #6c757d;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 약관 동의 체크박스 이벤트
    const termsCheckbox = document.getElementById('termsAgreement');
    const submitBtn = document.getElementById('submitApplication');
    
    termsCheckbox.addEventListener('change', function() {
        submitBtn.disabled = !this.checked;
    });
    
    // 모달 닫기 이벤트
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeApplicationModal);
    
    // 배경 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeApplicationModal();
        }
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
    
    // 여기에 실제 신청 로직 구현
    alert('체험단 신청이 완료되었습니다!');
    closeApplicationModal();
}

// 채널별 요구사항 가져오기
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

// 필터 초기화 설정
function setupFilterReset() {
    // 필터 초기화 버튼이 있다면 이벤트 리스너 추가
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
        resetButton.addEventListener('click', resetAllFilters);
    }
}

// 모든 필터 초기화
function resetAllFilters() {
    // 지역 필터 초기화
    const regionButtons = document.querySelectorAll('.region-btn');
    regionButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-region="all"]').classList.add('active');
    
    // 구/군 필터 초기화
    const districtButtons = document.querySelectorAll('.district-btn');
    districtButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('seoulDistricts').style.display = 'none';
    
    // 기타 필터 초기화
    document.getElementById('categoryFilter').value = '';
    document.getElementById('channelFilter').value = '';
    document.getElementById('sortFilter').value = 'latest';
    
    // 검색어 초기화
    document.getElementById('searchInput').value = '';
    
    // 모든 체험단 다시 로드
    loadSearchResults();
}

// 채널 이름 가져오기 (admin-script.js와 동일한 함수)
function getChannelName(channelValue) {
    const channels = {
        'blog': '블로그',
        'blog_clip': '블로그+클립',
        'reels': '릴스',
        'shorts': '쇼츠',
        'instagram': '인스타그램',
        'clip': '클립',
        'youtube': '유튜브',
        'tiktok': '틱톡',
        'xiaohongshu': '샤오홍슈',
        'twitter': 'X(트위터)'
    };
    return channels[channelValue] || '블로그';
}

// 카테고리 이름 가져오기
function getCategoryName(categoryValue) {
    const categories = {
        'restaurant': '맛집',
        'food': '식품',
        'beauty': '뷰티',
        'travel': '여행',
        'digital': '디지털',
        'pets': '반려동물',
        'other': '기타'
    };
    return categories[categoryValue] || '기타';
}
