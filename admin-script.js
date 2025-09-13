// 관리자 센터 JavaScript

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    checkLoginStatus();
    
    // 대시보드 데이터 로드
    loadDashboardData();
    
    // 체험단 수정 옵션 로드
    loadEditExperienceOptions();
    
    // 승인 대기 체험단 로드
    loadPendingExperiences();
});


// 기존 체험단들을 승인 대기 상태로 변경
function migrateExistingExperiencesToPending() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    let needsUpdate = false;
    
    const updatedExperiences = experiences.map(exp => {
        // status가 'approved'인 기존 체험단들을 'pending'으로 변경
        if (exp.status === 'approved' || exp.status === undefined) {
            exp.status = 'pending';
            exp.createdAt = exp.createdAt || new Date().toISOString();
            needsUpdate = true;
            console.log(`체험단 "${exp.title}"을 승인 대기 상태로 변경했습니다.`);
        }
        return exp;
    });
    
    if (needsUpdate) {
        localStorage.setItem('experiences', JSON.stringify(updatedExperiences));
        console.log('기존 체험단들이 승인 대기 상태로 변경되었습니다.');
        
        // 체험단 승인 탭으로 자동 이동
        setTimeout(() => {
            switchTab('approval');
        }, 500);
    }
}

// 모든 데이터 삭제
function clearAllData() {
    // 리뷰 데이터 삭제
    localStorage.removeItem('reviews');
    
    // 맛집 데이터 삭제
    localStorage.removeItem('hotplaces');
    
    // 배너 데이터 삭제
    localStorage.removeItem('banners');
    
    console.log('모든 데이터가 삭제되었습니다.');
}

// 리뷰 데이터만 삭제
function clearReviewData() {
    localStorage.removeItem('reviews');
    console.log('이달의 리뷰 데이터가 삭제되었습니다.');
}

// 로그인 상태 확인
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        // 로그인 페이지로 리다이렉트
        window.location.href = 'index.html';
    }
}

// 로그아웃
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'Content').classList.add('active');
    
    // 탭별 데이터 로드
    if (tabName === 'dashboard') {
        loadDashboardData();
    } else if (tabName === 'approval') {
        loadApprovalData();
    } else if (tabName === 'experiences') {
        loadAdminExperiences();
    } else if (tabName === 'add') {
        loadAddExperienceForm();
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

// 대시보드 데이터 로드
function loadDashboardData() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    
    // 승인 상태별 체험단 개수 계산
    const pendingExperiences = experiences.filter(exp => exp.status === 'pending');
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    const rejectedExperiences = experiences.filter(exp => exp.status === 'rejected');
    
    // 기본 통계 업데이트
    document.getElementById('totalExperiencesCount').textContent = approvedExperiences.length;
    document.getElementById('totalReviewsCount').textContent = reviews.length;
    document.getElementById('totalBannersCount').textContent = banners.length;
    document.getElementById('totalHotplaceCount').textContent = hotplaces.length;
    document.getElementById('totalApprovalCount').textContent = pendingExperiences.length;
    
    // 체험단 승인 카드 데이터 업데이트
    document.getElementById('dashboardPendingCount').textContent = pendingExperiences.length;
    document.getElementById('dashboardApprovedCount').textContent = approvedExperiences.length;
    document.getElementById('dashboardRejectedCount').textContent = rejectedExperiences.length;
}

// 체험단 관리
function loadAdminExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experiencesList = document.getElementById('experiencesList');
    const totalExperiences = document.getElementById('totalExperiences');
    const endedExperiences = document.getElementById('endedExperiences');
    const cancelledExperiences = document.getElementById('cancelledExperiences');
    
    // 승인된 체험단만 필터링
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    
    // 종료된 체험단 (모집 마감일이 지난 체험단)
    const today = new Date();
    const endedExp = approvedExperiences.filter(exp => {
        const endDate = new Date(exp.endDate);
        return endDate < today;
    });
    
    // 취소된 체험단 (거절된 체험단)
    const cancelledExp = experiences.filter(exp => exp.status === 'rejected');
    
    if (totalExperiences) {
        totalExperiences.textContent = approvedExperiences.length;
    }
    if (endedExperiences) {
        endedExperiences.textContent = endedExp.length;
    }
    if (cancelledExperiences) {
        cancelledExperiences.textContent = cancelledExp.length;
    }
    
    if (approvedExperiences.length === 0) {
        experiencesList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">승인된 체험단이 없습니다.</div>';
        return;
    }
    
    // 현재 필터 상태에 따라 체험단 표시
    displayExperiencesByCurrentFilter(approvedExperiences);
}

// 현재 필터 상태에 따라 체험단 표시
function displayExperiencesByCurrentFilter(experiences) {
    const experiencesList = document.getElementById('experiencesList');
    const currentFilter = window.currentExperienceFilter || 'active';
    
    let filteredExperiences = [];
    
    switch(currentFilter) {
        case 'active':
            // 활성 체험단 (모집 중인 체험단)
            const today = new Date();
            filteredExperiences = experiences.filter(exp => {
                const endDate = new Date(exp.endDate);
                return endDate >= today;
            });
            break;
        case 'ended':
            // 종료된 체험단
            const todayEnded = new Date();
            filteredExperiences = experiences.filter(exp => {
                const endDate = new Date(exp.endDate);
                return endDate < todayEnded;
            });
            break;
        case 'cancelled':
            // 취소된 체험단 (거절된 체험단)
            const allExperiences = JSON.parse(localStorage.getItem('experiences') || '[]');
            filteredExperiences = allExperiences.filter(exp => exp.status === 'rejected');
            break;
        default:
            filteredExperiences = experiences;
    }
    
    if (filteredExperiences.length === 0) {
        const message = getEmptyMessage(currentFilter);
        experiencesList.innerHTML = `<div style="padding: 2rem; text-align: center; color: #666;">${message}</div>`;
        return;
    }
    
    experiencesList.innerHTML = filteredExperiences.map(experience => `
        <div class="admin-experience-item">
            <div class="experience-info">
                <h4>${experience.title}</h4>
                <p>회사명: ${experience.companyName || '미입력'}</p>
                <p>카테고리: ${experience.category || '기타'}</p>
                <p>모집 기간: ${experience.startDate} ~ ${experience.endDate}</p>
                <p>모집 인원: ${experience.participantCount || '미입력'}명</p>
                <p class="popular-status">인기체험단: ${experience.isPopular ? '선택됨' : '미선택'}</p>
                <p class="premium-status">P 체험단: ${experience.isPremium ? `선택됨 (${experience.premiumPoint || 0}원)` : '미선택'}</p>
                ${currentFilter === 'cancelled' ? `<p class="status-info">상태: 거절됨</p>` : ''}
                ${currentFilter === 'ended' ? `<p class="status-info">상태: 모집 종료</p>` : ''}
            </div>
            <div class="experience-actions">
                ${currentFilter === 'active' ? `
                    <button class="btn-popular ${experience.isPopular ? 'active' : ''}" onclick="togglePopularExperience('${experience.id}')">
                        ${experience.isPopular ? '인기 해제' : '인기 선택'}
                    </button>
                    <button class="btn-premium" onclick="openPremiumModal('${experience.id}')" title="P 체험단 설정">
                        <i class="fas fa-coins"></i>
                    </button>
                    <button class="btn-edit" onclick="editExperience('${experience.id}')">편집</button>
                    <button class="btn-delete" onclick="deleteExperience('${experience.id}')">삭제</button>
                ` : `
                    <button class="btn-view" onclick="viewExperienceDetails('${experience.id}')">상세보기</button>
                    ${currentFilter === 'cancelled' ? `<button class="btn-approve" onclick="approveExperience('${experience.id}')">재승인</button>` : ''}
                `}
            </div>
        </div>
    `).join('');
}

// 빈 목록 메시지 반환
function getEmptyMessage(filter) {
    switch(filter) {
        case 'active':
            return '활성 체험단이 없습니다.';
        case 'ended':
            return '종료된 체험단이 없습니다.';
        case 'cancelled':
            return '취소된 체험단이 없습니다.';
        default:
            return '체험단이 없습니다.';
    }
}

// 상태별 체험단 표시
function showExperiencesByStatus(status) {
    window.currentExperienceFilter = status;
    
    // 카드 활성화 상태 업데이트
    document.querySelectorAll('.stat-item.clickable').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.stat-item').classList.add('active');
    
    // 체험단 목록 다시 로드
    loadAdminExperiences();
}

// 체험단 편집
function editExperience(experienceId) {
    switchTab('edit');
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
        'editLocation': experience.location,
        'editRegion': experience.region
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId] || '';
        }
    });
    
    // 채널 라디오 버튼 설정
    if (experience.channel) {
        const channelRadio = document.querySelector(`input[name="editChannel"][value="${experience.channel}"]`);
        if (channelRadio) {
            channelRadio.checked = true;
        }
    }
    
    // 썸네일 이미지 미리보기
    if (experience.thumbnail) {
        const preview = document.getElementById('editThumbnailPreview');
        preview.innerHTML = `
            <div class="uploaded-file">
                <img src="${experience.thumbnail}" alt="현재 썸네일" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
                <p>현재 썸네일 이미지</p>
            </div>
        `;
    }
    
    // 편집 폼 표시
    document.getElementById('editForm').style.display = 'block';
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
    
    // 썸네일 이미지 처리
    const thumbnailFile = document.getElementById('editThumbnail').files[0];
    let thumbnailUrl = experiences[experienceIndex].thumbnail; // 기존 썸네일 유지
    
    if (thumbnailFile) {
        thumbnailUrl = URL.createObjectURL(thumbnailFile);
    }
    
    // 채널 값 가져오기
    const selectedChannel = document.querySelector('input[name="editChannel"]:checked');
    const channelValue = selectedChannel ? selectedChannel.value : '';
    
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
        region: document.getElementById('editRegion').value,
        channel: channelValue,
        thumbnail: thumbnailUrl,
        updatedAt: new Date().toISOString()
    };
    
    // 데이터 업데이트
    experiences[experienceIndex] = updatedExperience;
    localStorage.setItem('experiences', JSON.stringify(experiences));
    
    // 목록 새로고침
    loadAdminExperiences();
    
    alert('체험단이 수정되었습니다.');
    switchTab('experiences');
}

// 체험단 삭제
function deleteExperience(experienceId) {
    if (confirm('정말로 이 체험단을 삭제하시겠습니까?')) {
        const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
        localStorage.setItem('experiences', JSON.stringify(updatedExperiences));
        loadAdminExperiences();
        loadEditExperienceOptions();
        loadDashboardData();
        alert('체험단이 삭제되었습니다.');
    }
}

// 편집 취소
function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('editExperienceSelect').value = '';
}

// 체험단 등록 페이지로 이동
function goToRegistration() {
    switchTab('add');
}

// 체험단 추가 폼 로드
function loadAddExperienceForm() {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('addStartDate').value = today;
    document.getElementById('addEndDate').value = today;
    
    // 체험 일정 자동 설정 (모집 마감일 + 1일부터 14일간)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const experienceStart = tomorrow.toISOString().split('T')[0];
    
    const experienceEnd = new Date();
    experienceEnd.setDate(experienceEnd.getDate() + 14);
    const experienceEndDate = experienceEnd.toISOString().split('T')[0];
    
    document.getElementById('addExperienceStartDate').value = experienceStart;
    document.getElementById('addExperienceEndDate').value = experienceEndDate;
    
    // 폼 제출 이벤트 리스너 추가 (중복 방지)
    const form = document.getElementById('addExperienceForm');
    if (form && !form.hasAttribute('data-listener-added')) {
        form.addEventListener('submit', handleAddExperienceSubmit);
        form.setAttribute('data-listener-added', 'true');
    }
    
    // 썸네일 이미지 미리보기 이벤트 리스너 추가 (중복 방지)
    const thumbnailInput = document.getElementById('addThumbnail');
    if (thumbnailInput && !thumbnailInput.hasAttribute('data-listener-added')) {
        thumbnailInput.addEventListener('change', handleThumbnailPreview);
        thumbnailInput.setAttribute('data-listener-added', 'true');
    }
    
    // 모집 마감일 변경 시 체험 일정 자동 업데이트 (중복 방지)
    const endDateInput = document.getElementById('addEndDate');
    if (endDateInput && !endDateInput.hasAttribute('data-listener-added')) {
        endDateInput.addEventListener('change', updateExperienceDates);
        endDateInput.setAttribute('data-listener-added', 'true');
    }
    
    // 시간 선택 옵션 초기화
    initializeTimeSelects();
}

// 시간 선택 옵션 초기화
function initializeTimeSelects() {
    const startHourSelect = document.getElementById('addStartHour');
    const startMinuteSelect = document.getElementById('addStartMinute');
    const endHourSelect = document.getElementById('addEndHour');
    const endMinuteSelect = document.getElementById('addEndMinute');
    
    if (!startHourSelect || !startMinuteSelect || !endHourSelect || !endMinuteSelect) return;
    
    // 시간 옵션 생성 (0-23시)
    for (let hour = 0; hour < 24; hour++) {
        const hourString = hour.toString().padStart(2, '0');
        startHourSelect.add(new Option(hourString, hourString));
        endHourSelect.add(new Option(hourString, hourString));
    }
    
    // 분 옵션 생성 (0, 15, 30, 45분)
    const minutes = ['00', '15', '30', '45'];
    minutes.forEach(minute => {
        startMinuteSelect.add(new Option(minute, minute));
        endMinuteSelect.add(new Option(minute, minute));
    });
}

// 요일 토글 함수
function toggleDay(button) {
    button.classList.toggle('selected');
}

// 24시간 영업 토글
function toggle24Hours() {
    const is24Hours = document.getElementById('addIs24Hours').checked;
    const timeInputs = document.querySelectorAll('#addStartHour, #addStartMinute, #addEndHour, #addEndMinute');
    
    timeInputs.forEach(input => {
        input.disabled = is24Hours;
        if (is24Hours) {
            input.value = '';
        }
    });
}

// 시간 표시 업데이트
function updateTimeDisplay() {
    // 시간이 변경될 때 필요한 로직이 있다면 여기에 추가
}

// 체험단 추가 폼 제출 처리
function handleAddExperienceSubmit(e) {
    e.preventDefault();
    
    // 폼 유효성 검사
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 체험 일정 자동 업데이트
    updateExperienceDates();
    
    const formData = new FormData(e.target);
    
    // 필수 필드 검사
    const requiredFields = ['title', 'companyName', 'category', 'type', 'channel', 'contactPhone', 'description', 'participantCount', 'region', 'address', 'startDate', 'endDate', 'experienceStartDate', 'experienceEndDate', 'providedServices'];
    for (const field of requiredFields) {
        const value = formData.get(field);
        console.log(`필드 ${field}:`, value);
        if (!value || value.trim() === '') {
            alert(`필수 필드를 모두 입력해주세요. (${field})`);
            return;
        }
    }
    
    // 체험 가능 요일 검사 (선택된 버튼에서 가져오기)
    const selectedDays = document.querySelectorAll('.day-btn.selected');
    const availableDays = Array.from(selectedDays).map(btn => btn.dataset.day);
    if (availableDays.length === 0) {
        alert('체험 가능 요일을 최소 하나 이상 선택해주세요.');
        return;
    }
    
    // 시간 검사 (24시간 영업이 아닌 경우)
    const is24Hours = document.getElementById('addIs24Hours').checked;
    if (!is24Hours) {
        const startHour = document.getElementById('addStartHour').value;
        const startMinute = document.getElementById('addStartMinute').value;
        const endHour = document.getElementById('addEndHour').value;
        const endMinute = document.getElementById('addEndMinute').value;
        
        if (!startHour || !startMinute || !endHour || !endMinute) {
            alert('체험 시간을 모두 선택해주세요.');
            return;
        }
    }
    
    // 썸네일 이미지 처리
    const thumbnailFile = formData.get('thumbnail');
    let thumbnailUrl = 'https://via.placeholder.com/200x200/9B59B6/FFFFFF?text=체험단';
    
    if (thumbnailFile && thumbnailFile.size > 0) {
        thumbnailUrl = URL.createObjectURL(thumbnailFile);
    }
    
    // 체험일정 자동 계산 (모집 마감일 + 1일부터 2주)
    const endDate = new Date(formData.get('endDate'));
    const experienceStartDate = new Date(endDate);
    experienceStartDate.setDate(experienceStartDate.getDate() + 1);
    
    const experienceEndDate = new Date(experienceStartDate);
    experienceEndDate.setDate(experienceEndDate.getDate() + 14);
    
    // 폼 데이터 수집
    const newExperience = {
        id: Date.now().toString(),
        title: formData.get('title'),
        companyName: formData.get('companyName'),
        category: getCategoryName(formData.get('category')),
        type: getExperienceTypeName(formData.get('type')),
        channel: getChannelName(formData.get('channel')),
        contactPhone: formData.get('contactPhone'),
        description: formData.get('description'),
        participantCount: formData.get('participantCount'),
        region: formData.get('region'),
        address: formData.get('address'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        experienceStartDate: experienceStartDate.toISOString().split('T')[0],
        experienceEndDate: experienceEndDate.toISOString().split('T')[0],
        providedServices: formData.get('providedServices'),
        keywords: formData.get('keywords') ? formData.get('keywords').split(',').map(k => k.trim()).filter(k => k) : [],
        url: formData.get('url') || '',
        thumbnail: thumbnailUrl,
        availableDays: availableDays,
        startTime: is24Hours ? '24시간 영업' : `${document.getElementById('addStartHour').value}:${document.getElementById('addStartMinute').value}`,
        endTime: is24Hours ? '24시간 영업' : `${document.getElementById('addEndHour').value}:${document.getElementById('addEndMinute').value}`,
        is24Hours: is24Hours,
        sameDayReservation: document.querySelector('input[name="addSameDayReservation"]:checked').value,
        reservationNotes: formData.get('reservationNotes') || '',
        isPopular: false,
        isPremium: false,
        premiumPoint: 0,
        premiumDescription: '',
        status: 'approved', // 관리자가 추가하는 체험단은 바로 승인
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    
    // localStorage에 저장
    const existingExperiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    existingExperiences.unshift(newExperience);
    localStorage.setItem('experiences', JSON.stringify(existingExperiences));
    
    // 성공 메시지
    alert('체험단이 성공적으로 추가되었습니다.');
    
    // 폼 초기화
    clearAddForm();
    
    // 관련 데이터 새로고침
    loadDashboardData();
    loadAdminExperiences();
    loadEditExperienceOptions();
}

// 체험단 추가 폼 초기화
function clearAddForm() {
    const form = document.getElementById('addExperienceForm');
    if (form) {
        form.reset();
        // 이벤트 리스너 속성 제거 (다음 로드 시 다시 추가되도록)
        form.removeAttribute('data-listener-added');
    }
    
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('addStartDate').value = today;
    document.getElementById('addEndDate').value = today;
    
    // 체험 일정 자동 설정
    updateExperienceDates();
    
    // 썸네일 미리보기 초기화
    const preview = document.getElementById('addThumbnailPreview');
    if (preview) {
        preview.innerHTML = '';
    }
    
    // 체험 가능 요일 버튼 초기화
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.classList.remove('selected');
    });
    
    // 시간 필드 초기화
    document.getElementById('addStartHour').value = '';
    document.getElementById('addStartMinute').value = '';
    document.getElementById('addEndHour').value = '';
    document.getElementById('addEndMinute').value = '';
    
    // 24시간 영업 체크박스 초기화
    document.getElementById('addIs24Hours').checked = false;
    toggle24Hours(); // 시간 입력 필드 활성화
    
    // 당일 예약 라디오 버튼 초기화
    document.querySelector('input[name="addSameDayReservation"][value="possible"]').checked = true;
    
    // 주의사항 초기화
    document.getElementById('addReservationNotes').value = '';
    
    // 다른 입력 필드들의 이벤트 리스너 속성도 제거
    const thumbnailInput = document.getElementById('addThumbnail');
    if (thumbnailInput) {
        thumbnailInput.removeAttribute('data-listener-added');
    }
    
    const endDateInput = document.getElementById('addEndDate');
    if (endDateInput) {
        endDateInput.removeAttribute('data-listener-added');
    }
}

// 썸네일 이미지 미리보기
function handleThumbnailPreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('addThumbnailPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="preview-image">
                    <img src="${e.target.result}" alt="썸네일 미리보기" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 10px;">
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

// 체험 일정 자동 업데이트
function updateExperienceDates() {
    const endDate = document.getElementById('addEndDate').value;
    if (endDate) {
        const endDateObj = new Date(endDate);
        
        // 체험 시작일: 모집 마감일 + 1일
        const experienceStart = new Date(endDateObj);
        experienceStart.setDate(experienceStart.getDate() + 1);
        document.getElementById('addExperienceStartDate').value = experienceStart.toISOString().split('T')[0];
        
        // 체험 마감일: 체험 시작일 + 14일 (2주)
        const experienceEnd = new Date(experienceStart);
        experienceEnd.setDate(experienceEnd.getDate() + 14);
        document.getElementById('addExperienceEndDate').value = experienceEnd.toISOString().split('T')[0];
    }
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

// 채널 이름 가져오기
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

// 승인 대기 체험단 로드
function loadPendingExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const pendingList = document.getElementById('pendingList');
    const approvedList = document.getElementById('approvedList');
    const rejectedList = document.getElementById('rejectedList');
    
    // 상태별로 체험단 분류
    const pendingExperiences = experiences.filter(exp => exp.status === 'pending');
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    const rejectedExperiences = experiences.filter(exp => exp.status === 'rejected');
    
    // 승인 대기 체험단 표시
    if (pendingList) {
        if (pendingExperiences.length === 0) {
            pendingList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">승인 대기 중인 체험단이 없습니다.</div>';
        } else {
            pendingList.innerHTML = pendingExperiences.map(experience => `
                <div class="approval-item">
                    <div class="approval-info">
                        <h4>${experience.title}</h4>
                        <p>회사명: ${experience.companyName || '미입력'}</p>
                        <p>카테고리: ${experience.category || '기타'}</p>
                        <p>모집 기간: ${experience.startDate} ~ ${experience.endDate}</p>
                        <p>등록일: ${new Date(experience.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="approval-actions">
                        <button class="btn-approve" onclick="approveExperience('${experience.id}')">승인</button>
                        <button class="btn-reject" onclick="rejectExperience('${experience.id}')">거절</button>
                        <button class="btn-view" onclick="viewExperienceDetails('${experience.id}')">상세보기</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // 승인 완료 체험단 표시
    if (approvedList) {
        if (approvedExperiences.length === 0) {
            approvedList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">승인된 체험단이 없습니다.</div>';
        } else {
            approvedList.innerHTML = approvedExperiences.map(experience => `
                <div class="approval-item">
                    <div class="approval-info">
                        <h4>${experience.title}</h4>
                        <p>회사명: ${experience.companyName || '미입력'}</p>
                        <p>카테고리: ${experience.category || '기타'}</p>
                        <p>승인일: ${new Date(experience.approvedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="approval-actions">
                        <button class="btn-reject" onclick="rejectExperience('${experience.id}')">거절</button>
                        <button class="btn-view" onclick="viewExperienceDetails('${experience.id}')">상세보기</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // 거절된 체험단 표시
    if (rejectedList) {
        if (rejectedExperiences.length === 0) {
            rejectedList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">거절된 체험단이 없습니다.</div>';
        } else {
            rejectedList.innerHTML = rejectedExperiences.map(experience => `
                <div class="approval-item">
                    <div class="approval-info">
                        <h4>${experience.title}</h4>
                        <p>회사명: ${experience.companyName || '미입력'}</p>
                        <p>카테고리: ${experience.category || '기타'}</p>
                        <p>거절일: ${new Date(experience.rejectedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="approval-actions">
                        <button class="btn-approve" onclick="approveExperience('${experience.id}')">재승인</button>
                        <button class="btn-view" onclick="viewExperienceDetails('${experience.id}')">상세보기</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // 통계 업데이트
    updateApprovalStats(pendingExperiences.length, approvedExperiences.length, rejectedExperiences.length);
}

// 승인 통계 업데이트
function updateApprovalStats(pendingCount, approvedCount, rejectedCount) {
    const pendingCountEl = document.getElementById('pendingCount');
    const approvedCountEl = document.getElementById('approvedCount');
    const rejectedCountEl = document.getElementById('rejectedCount');
    
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
    if (approvedCountEl) approvedCountEl.textContent = approvedCount;
    if (rejectedCountEl) rejectedCountEl.textContent = rejectedCount;
}

// 체험단 승인
function approveExperience(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (experience) {
        experience.status = 'approved';
        experience.approvedAt = new Date().toISOString();
        localStorage.setItem('experiences', JSON.stringify(experiences));
        
        loadPendingExperiences();
        loadAdminExperiences();
        updateDashboardStats();
        
        alert('체험단이 승인되었습니다.');
    }
}

// 체험단 거절
function rejectExperience(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (experience) {
        experience.status = 'rejected';
        experience.rejectedAt = new Date().toISOString();
        localStorage.setItem('experiences', JSON.stringify(experiences));
        
        loadPendingExperiences();
        loadAdminExperiences();
        updateDashboardStats();
        
        alert('체험단이 거절되었습니다.');
    }
}

// 체험단 상세보기
function viewExperienceDetails(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (experience) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${experience.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>회사명:</strong> ${experience.companyName || '미입력'}</p>
                    <p><strong>카테고리:</strong> ${experience.category || '기타'}</p>
                    <p><strong>모집 기간:</strong> ${experience.startDate} ~ ${experience.endDate}</p>
                    <p><strong>모집 인원:</strong> ${experience.participantCount || '미입력'}명</p>
                    <p><strong>설명:</strong> ${experience.description || '미입력'}</p>
                    <p><strong>제공 서비스:</strong> ${experience.providedServices || '미입력'}</p>
                    <p><strong>위치:</strong> ${experience.location || '미입력'}</p>
                    <p><strong>URL:</strong> ${experience.url || '미입력'}</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// 체험단 승인 데이터 로드
function loadApprovalData() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    
    const pendingExperiences = experiences.filter(exp => exp.status === 'pending');
    const approvedExperiences = experiences.filter(exp => exp.status === 'approved');
    const rejectedExperiences = experiences.filter(exp => exp.status === 'rejected');
    
    // 통계 업데이트
    document.getElementById('pendingCount').textContent = pendingExperiences.length;
    document.getElementById('approvedCount').textContent = approvedExperiences.length;
    document.getElementById('rejectedCount').textContent = rejectedExperiences.length;
    
    // 승인 대기 목록 로드
    loadPendingExperiences(pendingExperiences);
    
    // 승인 완료 목록 로드
    loadApprovedExperiences(approvedExperiences);
    
    // 승인 거절 목록 로드
    loadRejectedExperiences(rejectedExperiences);
}

// 승인 대기 체험단 목록 로드
function loadPendingExperiences(experiences) {
    const pendingList = document.getElementById('pendingList');
    
    if (experiences.length === 0) {
        pendingList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">승인 대기 중인 체험단이 없습니다.</div>';
        return;
    }
    
    pendingList.innerHTML = experiences.map(experience => `
        <div class="approval-experience-item">
            <div class="approval-experience-header">
                <div>
                    <div class="approval-experience-title">${experience.title}</div>
                    <div style="color: #666; font-size: 14px;">등록일: ${new Date(experience.createdAt || Date.now()).toLocaleDateString()}</div>
                </div>
                <span class="approval-status pending">승인 대기</span>
            </div>
            
            <div class="approval-experience-details">
                <div class="approval-detail-item">
                    <div class="approval-detail-label">회사명</div>
                    <div class="approval-detail-value">${experience.companyName || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">카테고리</div>
                    <div class="approval-detail-value">${experience.category || '기타'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">체험 유형</div>
                    <div class="approval-detail-value">${experience.type || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">채널</div>
                    <div class="approval-detail-value">${experience.channel || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">연락처</div>
                    <div class="approval-detail-value">${experience.contactPhone || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 기간</div>
                    <div class="approval-detail-value">${experience.startDate} ~ ${experience.endDate}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 인원</div>
                    <div class="approval-detail-value">${experience.participantCount || '미입력'}명</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">지역</div>
                    <div class="approval-detail-value">${experience.region || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">제공 서비스</div>
                    <div class="approval-detail-value">${experience.providedServices || '미입력'}</div>
                </div>
            </div>
            
            <div class="approval-actions">
                <button class="btn-view-details" onclick="viewExperienceDetails('${experience.id}')">상세 보기</button>
                <button class="btn-reject" onclick="rejectExperience('${experience.id}')">거부</button>
                <button class="btn-approve" onclick="approveExperience('${experience.id}')">승인</button>
            </div>
        </div>
    `).join('');
}

// 승인 완료 체험단 목록 로드
function loadApprovedExperiences(experiences) {
    const approvedList = document.getElementById('approvedList');
    
    if (experiences.length === 0) {
        approvedList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">승인된 체험단이 없습니다.</div>';
        return;
    }
    
    approvedList.innerHTML = experiences.map(experience => `
        <div class="approval-experience-item">
            <div class="approval-experience-header">
                <div>
                    <div class="approval-experience-title">${experience.title}</div>
                    <div style="color: #666; font-size: 14px;">승인일: ${new Date(experience.approvedAt || Date.now()).toLocaleDateString()}</div>
                </div>
                <span class="approval-status approved">승인 완료</span>
            </div>
            
            <div class="approval-experience-details">
                <div class="approval-detail-item">
                    <div class="approval-detail-label">회사명</div>
                    <div class="approval-detail-value">${experience.companyName || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">카테고리</div>
                    <div class="approval-detail-value">${experience.category || '기타'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">체험 유형</div>
                    <div class="approval-detail-value">${experience.type || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">채널</div>
                    <div class="approval-detail-value">${experience.channel || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">연락처</div>
                    <div class="approval-detail-value">${experience.contactPhone || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 기간</div>
                    <div class="approval-detail-value">${experience.startDate} ~ ${experience.endDate}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 인원</div>
                    <div class="approval-detail-value">${experience.participantCount || '미입력'}명</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">지역</div>
                    <div class="approval-detail-value">${experience.region || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">제공 서비스</div>
                    <div class="approval-detail-value">${experience.providedServices || '미입력'}</div>
                </div>
            </div>
            
            <div class="approval-actions">
                <button class="btn-view-details" onclick="viewExperienceDetails('${experience.id}')">상세 보기</button>
                <button class="btn-reject" onclick="rejectExperience('${experience.id}')">승인 취소</button>
            </div>
        </div>
    `).join('');
}

// 승인 거절 체험단 목록 로드
function loadRejectedExperiences(experiences) {
    const rejectedList = document.getElementById('rejectedList');
    
    if (experiences.length === 0) {
        rejectedList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">거절된 체험단이 없습니다.</div>';
        return;
    }
    
    rejectedList.innerHTML = experiences.map(experience => `
        <div class="approval-experience-item">
            <div class="approval-experience-header">
                <div>
                    <div class="approval-experience-title">${experience.title}</div>
                    <div style="color: #666; font-size: 14px;">거절일: ${new Date(experience.rejectedAt || Date.now()).toLocaleDateString()}</div>
                </div>
                <span class="approval-status rejected">승인 거절</span>
            </div>
            
            <div class="approval-experience-details">
                <div class="approval-detail-item">
                    <div class="approval-detail-label">회사명</div>
                    <div class="approval-detail-value">${experience.companyName || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">카테고리</div>
                    <div class="approval-detail-value">${experience.category || '기타'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">체험 유형</div>
                    <div class="approval-detail-value">${experience.type || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">채널</div>
                    <div class="approval-detail-value">${experience.channel || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">연락처</div>
                    <div class="approval-detail-value">${experience.contactPhone || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 기간</div>
                    <div class="approval-detail-value">${experience.startDate} ~ ${experience.endDate}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">모집 인원</div>
                    <div class="approval-detail-value">${experience.participantCount || '미입력'}명</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">지역</div>
                    <div class="approval-detail-value">${experience.region || '미입력'}</div>
                </div>
                <div class="approval-detail-item">
                    <div class="approval-detail-label">제공 서비스</div>
                    <div class="approval-detail-value">${experience.providedServices || '미입력'}</div>
                </div>
            </div>
            
            <div class="approval-actions">
                <button class="btn-view-details" onclick="viewExperienceDetails('${experience.id}')">상세 보기</button>
                <button class="btn-approve" onclick="approveExperience('${experience.id}')">재승인</button>
                <button class="btn-delete" onclick="permanentlyDeleteExperience('${experience.id}')">영구 삭제</button>
            </div>
        </div>
    `).join('');
}

// 승인 탭 전환
function switchApprovalTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.approval-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.approval-section').forEach(section => section.classList.remove('active'));
    
    // 선택된 탭 활성화
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'Section').classList.add('active');
}

// 체험단 승인
function approveExperience(experienceId) {
    if (confirm('이 체험단을 승인하시겠습니까?')) {
        const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);
        
        if (experienceIndex !== -1) {
            experiences[experienceIndex].status = 'approved';
            experiences[experienceIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('experiences', JSON.stringify(experiences));
            
            loadApprovalData();
            loadAdminExperiences();
            loadDashboardData();
            
            // 메인 페이지 새로고침
            if (window.opener && window.opener.loadRegisteredExperiences) {
                window.opener.loadRegisteredExperiences();
            }
            
            alert('체험단이 승인되었습니다.');
        }
    }
}

// 체험단 거부
function rejectExperience(experienceId) {
    if (confirm('이 체험단을 거부하시겠습니까?')) {
        const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);
        
        if (experienceIndex !== -1) {
            experiences[experienceIndex].status = 'rejected';
            experiences[experienceIndex].rejectedAt = new Date().toISOString();
            localStorage.setItem('experiences', JSON.stringify(experiences));
            
            loadApprovalData();
            loadAdminExperiences();
            loadDashboardData();
            
            alert('체험단이 거부되었습니다.');
        }
    }
}

// 체험단 영구 삭제
function permanentlyDeleteExperience(experienceId) {
    if (confirm('이 체험단을 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
        localStorage.setItem('experiences', JSON.stringify(updatedExperiences));
        
        loadApprovalData();
        loadAdminExperiences();
        loadDashboardData();
        
        alert('체험단이 영구적으로 삭제되었습니다.');
    }
}

// 체험단 상세 보기
function viewExperienceDetails(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 상세 정보 모달 표시 (간단한 alert로 구현)
    const details = `
체험단 상세 정보:

제목: ${experience.title}
회사명: ${experience.companyName || '미입력'}
카테고리: ${experience.category || '기타'}
체험 유형: ${experience.type || '미입력'}
채널: ${experience.channel || '미입력'}
연락처: ${experience.contactPhone || '미입력'}
모집 기간: ${experience.startDate} ~ ${experience.endDate}
모집 인원: ${experience.participantCount || '미입력'}명
지역: ${experience.region || '미입력'}
제공 서비스: ${experience.providedServices || '미입력'}
체험 상세 정보: ${experience.serviceDetails || '미입력'}
키워드: ${experience.keywords ? experience.keywords.join(', ') : '미입력'}
URL: ${experience.url || '미입력'}
등록일: ${new Date(experience.createdAt || Date.now()).toLocaleString()}
    `;
    
    alert(details);
}

// 인기체험단 토글
function togglePopularExperience(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);
    
    if (experienceIndex === -1) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 인기체험단 상태 토글
    experiences[experienceIndex].isPopular = !experiences[experienceIndex].isPopular;
    
    // localStorage에 저장
    localStorage.setItem('experiences', JSON.stringify(experiences));
    
    // 목록 새로고침
    loadAdminExperiences();
    
    // 메인 페이지의 인기체험단 섹션도 새로고침
    if (window.opener && window.opener.loadPopularExperiences) {
        window.opener.loadPopularExperiences();
    }
    
    const status = experiences[experienceIndex].isPopular ? '인기체험단으로 설정' : '인기체험단에서 해제';
    alert(`${experiences[experienceIndex].title}이(가) ${status}되었습니다.`);
}

// P 체험단 모달 열기
function openPremiumModal(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experience = experiences.find(exp => exp.id === experienceId);
    
    if (!experience) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    // 기존 모달이 있다면 제거
    const existingModal = document.querySelector('.premium-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'premium-modal';
    modal.innerHTML = `
        <div class="modal-content premium-modal-content">
            <div class="modal-header">
                <h2>P 체험단 설정</h2>
                <button class="close-btn" onclick="closePremiumModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="experience-info">
                    <h3>${experience.title}</h3>
                    <p class="company-name">${experience.companyName}</p>
                </div>
                
                <div class="form-group">
                    <label for="premiumPoint">포인트 지급 금액 (원)</label>
                    <input type="number" id="premiumPoint" name="premiumPoint" 
                           value="${experience.premiumPoint || ''}" 
                           placeholder="포인트 금액을 입력하세요" 
                           min="0" step="100">
                </div>
                
                <div class="form-group">
                    <label for="premiumDescription">포인트 지급 조건</label>
                    <textarea id="premiumDescription" name="premiumDescription" 
                              placeholder="포인트 지급 조건을 입력하세요 (선택사항)" 
                              rows="3">${experience.premiumDescription || ''}</textarea>
                </div>
                
                <div class="premium-status">
                    <label class="checkbox-label">
                        <input type="checkbox" id="isPremium" ${experience.isPremium ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        P 체험단으로 설정
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closePremiumModal()">취소</button>
                <button class="btn-primary" onclick="savePremiumSettings('${experienceId}')">저장</button>
            </div>
        </div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .premium-modal {
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
        
        .premium-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
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
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }
        
        .premium-status {
            margin: 20px 0;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 600;
            color: #856404;
        }
        
        .checkbox-label input[type="checkbox"] {
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
        
        .btn-primary:hover {
            background: #0056b3;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #545b62;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 모달 닫기 이벤트
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', closePremiumModal);
    
    // 배경 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePremiumModal();
        }
    });
}

// P 체험단 모달 닫기
function closePremiumModal() {
    const modal = document.querySelector('.premium-modal');
    if (modal) {
        modal.remove();
    }
}

// P 체험단 설정 저장
function savePremiumSettings(experienceId) {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const experienceIndex = experiences.findIndex(exp => exp.id === experienceId);
    
    if (experienceIndex === -1) {
        alert('체험단을 찾을 수 없습니다.');
        return;
    }
    
    const premiumPoint = document.getElementById('premiumPoint').value;
    const premiumDescription = document.getElementById('premiumDescription').value;
    const isPremium = document.getElementById('isPremium').checked;
    
    // 유효성 검사
    if (isPremium && (!premiumPoint || premiumPoint <= 0)) {
        alert('P 체험단으로 설정하려면 포인트 금액을 입력해주세요.');
        return;
    }
    
    // 데이터 업데이트
    experiences[experienceIndex].isPremium = isPremium;
    experiences[experienceIndex].premiumPoint = isPremium ? parseInt(premiumPoint) : 0;
    experiences[experienceIndex].premiumDescription = premiumDescription || '';
    
    // localStorage에 저장
    localStorage.setItem('experiences', JSON.stringify(experiences));
    
    // 목록 새로고침
    loadAdminExperiences();
    
    // 모달 닫기
    closePremiumModal();
    
    const status = isPremium ? 'P 체험단으로 설정' : 'P 체험단에서 해제';
    alert(`${experiences[experienceIndex].title}이(가) ${status}되었습니다.`);
}

// 리뷰 관리
function loadAdminReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewsList = document.getElementById('reviewsList');
    const totalReviews = document.getElementById('totalReviews');
    
    
    if (totalReviews) {
        totalReviews.textContent = reviews.length;
    }
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">등록된 리뷰가 없습니다.</div>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="admin-review-item">
            <div class="review-info">
                <h4>${review.title || '제목 없음'}</h4>
                <p>작성자: ${review.author || '미입력'}</p>
                <p>평점: ${review.rating || 0}/5</p>
                <p>작성일: ${review.date ? new Date(review.date).toLocaleDateString() : '미입력'}</p>
                <p>URL: ${review.url ? `<a href="${review.url}" target="_blank">${review.url}</a>` : '없음'}</p>
                <p>내용: ${review.content ? review.content.substring(0, 50) + '...' : '내용 없음'}</p>
            </div>
            <div class="review-actions">
                <button class="btn-edit" onclick="editReview('${review.id}')">편집</button>
                <button class="btn-delete" onclick="deleteReview('${review.id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 리뷰 추가
function addReview() {
    document.getElementById('reviewModalTitle').textContent = '리뷰 추가';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewDate').value = new Date().toISOString().split('T')[0];
    
    // 채널 라디오 버튼 초기화
    const channelRadios = document.querySelectorAll('input[name="reviewChannel"]');
    channelRadios.forEach(radio => radio.checked = false);
    
    loadReviewExperienceOptions();
    document.getElementById('reviewModal').style.display = 'block';
}

// 리뷰 편집
function editReview(reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
        alert('리뷰를 찾을 수 없습니다.');
        return;
    }
    
    document.getElementById('reviewModalTitle').textContent = '리뷰 편집';
    loadReviewExperienceOptions();
    
    // 폼에 데이터 채우기
    document.getElementById('reviewTitle').value = review.title;
    document.getElementById('reviewAuthor').value = review.author;
    document.getElementById('reviewRating').value = review.rating;
    document.getElementById('reviewDate').value = review.date;
    document.getElementById('reviewContent').value = review.content;
    document.getElementById('reviewExperience').value = review.experienceId || '';
    document.getElementById('reviewUrl').value = review.url || '';
    
    // 채널 라디오 버튼 설정
    if (review.channel) {
        const channelRadio = document.querySelector(`input[name="reviewChannel"][value="${review.channel}"]`);
        if (channelRadio) {
            channelRadio.checked = true;
        }
    }
    
    // 이미지 미리보기
    if (review.image) {
        const preview = document.getElementById('reviewImagePreview');
        preview.innerHTML = `
            <div class="uploaded-file">
                <img src="${review.image}" alt="현재 이미지" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
                <p>현재 이미지</p>
            </div>
        `;
    }
    
    // 편집 모드 저장을 위한 ID 저장
    document.getElementById('reviewForm').setAttribute('data-edit-id', reviewId);
    
    document.getElementById('reviewModal').style.display = 'block';
}

// 리뷰 저장
function saveReview() {
    const form = document.getElementById('reviewForm');
    const formData = new FormData(form);
    const isEdit = form.getAttribute('data-edit-id');
    
    // 채널 값 가져오기
    const selectedChannel = document.querySelector('input[name="reviewChannel"]:checked');
    const channelValue = selectedChannel ? selectedChannel.value : '';
    
    const review = {
        id: isEdit || Date.now().toString(),
        title: formData.get('title'),
        author: formData.get('author'),
        rating: parseInt(formData.get('rating')),
        date: formData.get('date'),
        content: formData.get('content'),
        image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : (isEdit ? JSON.parse(localStorage.getItem('reviews') || '[]').find(r => r.id === isEdit)?.image : null),
        experienceId: formData.get('experienceId') || null,
        url: formData.get('url') || '',
        channel: channelValue,
        createdAt: isEdit ? JSON.parse(localStorage.getItem('reviews') || '[]').find(r => r.id === isEdit)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    if (isEdit) {
        // 편집 모드
        const reviewIndex = reviews.findIndex(r => r.id === isEdit);
        if (reviewIndex !== -1) {
            reviews[reviewIndex] = review;
        }
    } else {
        // 추가 모드
        reviews.push(review);
    }
    
    localStorage.setItem('reviews', JSON.stringify(reviews));
    closeReviewModal();
    loadAdminReviews();
    loadDashboardData();
    alert(isEdit ? '리뷰가 수정되었습니다.' : '리뷰가 추가되었습니다.');
}

// 리뷰 모달 닫기
function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewForm').removeAttribute('data-edit-id');
    document.getElementById('reviewImagePreview').innerHTML = '';
}

// 리뷰 관련 체험단 옵션 로드
function loadReviewExperienceOptions() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const selectElement = document.getElementById('reviewExperience');
    
    if (selectElement) {
        selectElement.innerHTML = '<option value="">체험단 선택 (선택사항)</option>' +
            experiences.map(exp => `<option value="${exp.id}">${exp.title}</option>`).join('');
    }
}

// 리뷰 삭제
function deleteReview(reviewId) {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
        loadAdminReviews();
        loadDashboardData();
        alert('리뷰가 삭제되었습니다.');
    }
}

// 배너 관리
function loadAdminBanners() {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const bannersList = document.getElementById('bannersList');
    const totalBanners = document.getElementById('totalBanners');
    const activeBanners = document.getElementById('activeBanners');
    
    
    if (totalBanners) {
        totalBanners.textContent = banners.length;
    }
    if (activeBanners) {
        activeBanners.textContent = banners.filter(banner => banner.active).length;
    }
    
    if (banners.length === 0) {
        bannersList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">등록된 배너가 없습니다.</div>';
        return;
    }
    
    bannersList.innerHTML = banners.map(banner => `
        <div class="admin-banner-item">
            <div class="banner-info">
                <h4>${banner.title || '제목 없음'}</h4>
                <p>부제목: ${banner.subtitle || '미입력'}</p>
                <p>순서: ${banner.order || 1} | ${banner.active ? '활성' : '비활성'}</p>
                <p>색상: ${banner.color || '미입력'} | 아이콘: ${banner.icon || '미입력'}</p>
                <p>생성일: ${banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : '미입력'}</p>
            </div>
            <div class="banner-actions">
                <button class="btn-edit" onclick="editBanner('${banner.id}')">편집</button>
                <button class="btn-delete" onclick="deleteBanner('${banner.id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 배너 추가 모달 열기
function openAddBannerModal() {
    document.getElementById('addBannerModal').style.display = 'block';
}

// 배너 추가 모달 닫기
function closeAddBannerModal() {
    document.getElementById('addBannerModal').style.display = 'none';
    document.getElementById('addBannerForm').reset();
    document.getElementById('addBannerForm').removeAttribute('data-edit-id');
    document.getElementById('bannerUploadedFiles').innerHTML = '';
}

// 배너 저장
function saveBanner() {
    const form = document.getElementById('addBannerForm');
    const formData = new FormData(form);
    const isEdit = form.getAttribute('data-edit-id');
    
    const banner = {
        id: isEdit || Date.now().toString(),
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        color: formData.get('color'),
        icon: formData.get('icon'),
        image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : (isEdit ? JSON.parse(localStorage.getItem('banners') || '[]').find(b => b.id === isEdit)?.image : null),
        link: formData.get('link'),
        order: parseInt(formData.get('order')),
        displayMode: formData.get('displayMode') || 'double',
        active: formData.get('active') === 'on',
        createdAt: isEdit ? JSON.parse(localStorage.getItem('banners') || '[]').find(b => b.id === isEdit)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    
    if (isEdit) {
        // 편집 모드
        const bannerIndex = banners.findIndex(b => b.id === isEdit);
        if (bannerIndex !== -1) {
            banners[bannerIndex] = banner;
        }
    } else {
        // 추가 모드
        banners.push(banner);
    }
    
    localStorage.setItem('banners', JSON.stringify(banners));
    closeAddBannerModal();
    loadAdminBanners();
    loadDashboardData();
    alert(isEdit ? '배너가 수정되었습니다.' : '배너가 저장되었습니다.');
}

// 배너 편집
function editBanner(bannerId) {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const banner = banners.find(b => b.id === bannerId);
    
    if (!banner) {
        alert('배너를 찾을 수 없습니다.');
        return;
    }
    
    // 배너 추가 모달을 편집 모드로 사용
    document.getElementById('addBannerModal').style.display = 'block';
    
    // 폼에 데이터 채우기
    document.getElementById('bannerTitle').value = banner.title;
    document.getElementById('bannerSubtitle').value = banner.subtitle;
    document.getElementById('bannerColor').value = banner.color;
    document.getElementById('bannerIcon').value = banner.icon;
    document.getElementById('bannerLink').value = banner.link || '';
    document.getElementById('bannerOrder').value = banner.order;
    document.getElementById('bannerDisplayMode').value = banner.displayMode || 'double';
    document.getElementById('bannerActive').checked = banner.active;
    
    // 이미지 미리보기
    if (banner.image) {
        const preview = document.getElementById('bannerUploadedFiles');
        preview.innerHTML = `
            <div class="uploaded-file">
                <img src="${banner.image}" alt="현재 이미지" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
                <p>현재 이미지</p>
            </div>
        `;
    }
    
    // 편집 모드 저장을 위한 ID 저장
    document.getElementById('addBannerForm').setAttribute('data-edit-id', bannerId);
}

// 배너 삭제
function deleteBanner(bannerId) {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
        const banners = JSON.parse(localStorage.getItem('banners') || '[]');
        const updatedBanners = banners.filter(banner => banner.id !== bannerId);
        localStorage.setItem('banners', JSON.stringify(updatedBanners));
        loadAdminBanners();
        loadDashboardData();
        alert('배너가 삭제되었습니다.');
    }
}

// 핫플 맛집 관리
function loadAdminHotplace() {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplaceList = document.getElementById('hotplaceList');
    const totalHotplace = document.getElementById('totalHotplace');
    
    
    if (totalHotplace) {
        totalHotplace.textContent = hotplaces.length;
    }
    
    if (hotplaces.length === 0) {
        hotplaceList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">등록된 맛집이 없습니다.</div>';
        return;
    }
    
    hotplaceList.innerHTML = hotplaces.map(hotplace => `
        <div class="admin-hotplace-item">
            <div class="hotplace-info">
                <h4>${hotplace.name || '맛집명 없음'}</h4>
                <p>위치: ${hotplace.location || '미입력'}</p>
                <p>카테고리: ${hotplace.category || '미입력'}</p>
                <p>평점: ${hotplace.rating || 0}/5</p>
                <p>키워드: ${hotplace.keywords ? hotplace.keywords.join(', ') : '없음'}</p>
                <p>URL: ${hotplace.url ? `<a href="${hotplace.url}" target="_blank">${hotplace.url}</a>` : '없음'}</p>
                <p>설명: ${hotplace.description ? hotplace.description.substring(0, 50) + '...' : '설명 없음'}</p>
            </div>
            <div class="hotplace-actions">
                <button class="btn-edit" onclick="editHotplace('${hotplace.id}')">편집</button>
                <button class="btn-delete" onclick="deleteHotplace('${hotplace.id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 맛집 추가
function addHotplace() {
    document.getElementById('hotplaceModalTitle').textContent = '맛집 추가';
    document.getElementById('hotplaceForm').reset();
    document.getElementById('hotplaceModal').style.display = 'block';
}

// 맛집 편집
function editHotplace(hotplaceId) {
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    const hotplace = hotplaces.find(h => h.id === hotplaceId);
    
    if (!hotplace) {
        alert('맛집을 찾을 수 없습니다.');
        return;
    }
    
    document.getElementById('hotplaceModalTitle').textContent = '맛집 편집';
    
    // 폼에 데이터 채우기
    document.getElementById('hotplaceName').value = hotplace.name;
    document.getElementById('hotplaceCategory').value = hotplace.category;
    document.getElementById('hotplaceLocation').value = hotplace.location;
    document.getElementById('hotplaceRating').value = hotplace.rating;
    document.getElementById('hotplaceDescription').value = hotplace.description;
    document.getElementById('hotplacePrice').value = hotplace.price || '';
    document.getElementById('hotplacePhone').value = hotplace.phone || '';
    document.getElementById('hotplaceKeywords').value = hotplace.keywords ? hotplace.keywords.join(', ') : '';
    document.getElementById('hotplaceUrl').value = hotplace.url || '';
    
    // 이미지 미리보기
    if (hotplace.image) {
        const preview = document.getElementById('hotplaceImagePreview');
        preview.innerHTML = `
            <div class="uploaded-file">
                <img src="${hotplace.image}" alt="현재 이미지" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
                <p>현재 이미지</p>
            </div>
        `;
    }
    
    // 편집 모드 저장을 위한 ID 저장
    document.getElementById('hotplaceForm').setAttribute('data-edit-id', hotplaceId);
    
    document.getElementById('hotplaceModal').style.display = 'block';
}

// 맛집 저장
function saveHotplace() {
    const form = document.getElementById('hotplaceForm');
    const formData = new FormData(form);
    const isEdit = form.getAttribute('data-edit-id');
    
    const hotplace = {
        id: isEdit || Date.now().toString(),
        name: formData.get('name'),
        category: formData.get('category'),
        location: formData.get('location'),
        rating: parseInt(formData.get('rating')),
        description: formData.get('description'),
        image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : (isEdit ? JSON.parse(localStorage.getItem('hotplaces') || '[]').find(h => h.id === isEdit)?.image : null),
        price: formData.get('price') || '',
        phone: formData.get('phone') || '',
        keywords: formData.get('keywords') ? formData.get('keywords').split(',').map(k => k.trim()).filter(k => k) : [],
        url: formData.get('url') || '',
        active: true, // 기본적으로 활성화
        createdAt: isEdit ? JSON.parse(localStorage.getItem('hotplaces') || '[]').find(h => h.id === isEdit)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
    
    if (isEdit) {
        // 편집 모드
        const hotplaceIndex = hotplaces.findIndex(h => h.id === isEdit);
        if (hotplaceIndex !== -1) {
            hotplaces[hotplaceIndex] = hotplace;
        }
    } else {
        // 추가 모드
        hotplaces.push(hotplace);
    }
    
    localStorage.setItem('hotplaces', JSON.stringify(hotplaces));
    closeHotplaceModal();
    loadAdminHotplace();
    loadDashboardData();
    alert(isEdit ? '맛집이 수정되었습니다.' : '맛집이 추가되었습니다.');
}

// 맛집 모달 닫기
function closeHotplaceModal() {
    document.getElementById('hotplaceModal').style.display = 'none';
    document.getElementById('hotplaceForm').reset();
    document.getElementById('hotplaceForm').removeAttribute('data-edit-id');
    document.getElementById('hotplaceImagePreview').innerHTML = '';
}

// 맛집 삭제
function deleteHotplace(hotplaceId) {
    if (confirm('정말로 이 맛집을 삭제하시겠습니까?')) {
        const hotplaces = JSON.parse(localStorage.getItem('hotplaces') || '[]');
        const updatedHotplaces = hotplaces.filter(hotplace => hotplace.id !== hotplaceId);
        localStorage.setItem('hotplaces', JSON.stringify(updatedHotplaces));
        loadAdminHotplace();
        loadDashboardData();
        alert('맛집이 삭제되었습니다.');
    }
}

// 파일 업로드 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 체험단 썸네일 업로드
    const editThumbnailArea = document.getElementById('editThumbnailUploadArea');
    const editThumbnailInput = document.getElementById('editThumbnail');
    if (editThumbnailArea && editThumbnailInput) {
        editThumbnailArea.addEventListener('click', () => editThumbnailInput.click());
        editThumbnailInput.addEventListener('change', handleThumbnailUpload);
    }
    
    // 리뷰 이미지 업로드
    const reviewImageArea = document.getElementById('reviewImageUploadArea');
    const reviewImageInput = document.getElementById('reviewImage');
    if (reviewImageArea && reviewImageInput) {
        reviewImageArea.addEventListener('click', () => reviewImageInput.click());
        reviewImageInput.addEventListener('change', handleReviewImageUpload);
    }
    
    // 맛집 이미지 업로드
    const hotplaceImageArea = document.getElementById('hotplaceImageUploadArea');
    const hotplaceImageInput = document.getElementById('hotplaceImage');
    if (hotplaceImageArea && hotplaceImageInput) {
        hotplaceImageArea.addEventListener('click', () => hotplaceImageInput.click());
        hotplaceImageInput.addEventListener('change', handleHotplaceImageUpload);
    }
    
    // 배너 이미지 업로드
    const bannerImageArea = document.getElementById('bannerFileUploadArea');
    const bannerImageInput = document.getElementById('bannerImage');
    if (bannerImageArea && bannerImageInput) {
        bannerImageArea.addEventListener('click', () => bannerImageInput.click());
        bannerImageInput.addEventListener('change', handleBannerImageUpload);
    }
});

// 썸네일 업로드 처리
function handleThumbnailUpload(event) {
    const file = event.target.files[0];
    if (file) {
        saveImageFile(file, 'editThumbnailPreview', '썸네일 이미지');
    }
}

// 리뷰 이미지 업로드 처리
function handleReviewImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        saveImageFile(file, 'reviewImagePreview', '리뷰 이미지');
    }
}

// 맛집 이미지 업로드 처리
function handleHotplaceImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        saveImageFile(file, 'hotplaceImagePreview', '맛집 이미지');
    }
}

// 배너 이미지 업로드 처리
function handleBannerImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        saveImageFile(file, 'bannerUploadedFiles', '배너 이미지');
    }
}

// 공통 이미지 저장 함수
function saveImageFile(file, previewElementId, imageType) {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const imagePath = `images/${fileName}`;
    
    // 파일 저장 처리
    if ('showSaveFilePicker' in window) {
        saveFileWithFileSystemAPI(file, fileName);
    } else {
        downloadFile(file, fileName);
    }
    
    // 미리보기 생성
    const preview = document.getElementById(previewElementId);
    preview.innerHTML = `
        <div class="uploaded-file">
            <img src="${imagePath}" alt="${imageType}" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
            <p>${imageType}</p>
        </div>
    `;
    
    // 로컬 스토리지에 이미지 경로 저장
    saveImagePathToStorage(imagePath, file.name);
}

// File System Access API를 사용한 파일 저장
async function saveFileWithFileSystemAPI(file, fileName) {
    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
                description: 'Image files',
                accept: {
                    'image/jpeg': ['.jpg', '.jpeg'],
                    'image/png': ['.png']
                }
            }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        
        console.log('파일이 성공적으로 저장되었습니다:', fileName);
    } catch (error) {
        console.log('파일 저장이 취소되었거나 실패했습니다:', error);
        downloadFile(file, fileName);
    }
}

// 다운로드 방식으로 파일 저장
function downloadFile(file, fileName) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('파일이 다운로드되었습니다. images 폴더에 수동으로 이동시켜주세요:', fileName);
    alert(`파일이 다운로드되었습니다.\n파일명: ${fileName}\n\n다운로드 폴더에서 이 파일을 프로젝트의 images 폴더로 이동시켜주세요.`);
}

// 이미지 경로를 로컬 스토리지에 저장
function saveImagePathToStorage(imagePath, originalFileName) {
    const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
    uploadedImages.push({
        path: imagePath,
        originalName: originalFileName,
        uploadTime: new Date().toISOString()
    });
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const bannerModal = document.getElementById('addBannerModal');
    const reviewModal = document.getElementById('reviewModal');
    const hotplaceModal = document.getElementById('hotplaceModal');
    
    if (event.target === bannerModal) {
        closeAddBannerModal();
    } else if (event.target === reviewModal) {
        closeReviewModal();
    } else if (event.target === hotplaceModal) {
        closeHotplaceModal();
    }
}
