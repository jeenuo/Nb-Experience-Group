// 회원정보 페이지 JavaScript

let currentUser = null;

// 헤더 검색 기능
function performSearch() {
    const searchInput = document.getElementById('headerSearchInput');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // 검색 페이지로 이동하면서 검색어 전달
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    } else {
        // 검색어가 없으면 검색 페이지로 이동
        window.location.href = 'search.html';
    }
}

// 엔터키로 검색
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    checkLoginStatus();
    
    // 사용자 정보 로드
    loadUserInfo();
    
    // 폼 이벤트 리스너
    initializeForms();
    
    // 사용자 유형에 따른 탭 설정
    setupTabsForUserType();
    
    // 체험단 관련 데이터 로드
    loadRecruitStats();
    loadManagedExperiences();
});

// 로그인 상태 확인
function checkLoginStatus() {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    const currentUserData = sessionStorage.getItem('currentUser');
    
    if (!userLoggedIn || !currentUserData) {
        alert('로그인이 필요합니다.');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(currentUserData);
    } catch (e) {
        console.error('사용자 데이터 파싱 오류:', e);
        alert('사용자 정보를 불러올 수 없습니다.');
        window.location.href = 'index.html';
    }
}

// 사용자 정보 로드
function loadUserInfo() {
    if (!currentUser) return;
    
    // 기본 정보 표시
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userType').textContent = currentUser.userType === 'influencer' ? '인플루언서' : '자영업자';
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // 기본정보 폼 채우기
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editPhone').value = currentUser.phone;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editRegion').value = currentUser.region;
    
    // 프로필 정보 채우기
    if (currentUser.profile) {
        document.getElementById('profileBio').value = currentUser.profile.bio || '';
        
        // 카테고리 체크박스 설정
        if (currentUser.profile.categories) {
            currentUser.profile.categories.forEach(category => {
                const checkbox = document.querySelector(`input[name="categories"][value="${category}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }
    
    // SNS 계정 상태 로드
    loadSNSStatus();
    
    // 체험단 내역 로드
    loadExperiences();
    
    // 알림 설정
    document.getElementById('experienceNotification').checked = currentUser.notifications?.experience || true;
    document.getElementById('marketingNotification').checked = currentUser.agreeMarketing || false;
    
    // 통계 업데이트
    updateStats();
}

// 통계 업데이트
function updateStats() {
    // 체험단 참여 수 (임시 데이터)
    const experienceCount = Math.floor(Math.random() * 10) + 1;
    document.getElementById('experienceCount').textContent = experienceCount;
    
    // 후기 작성 수 (임시 데이터)
    const reviewCount = Math.floor(Math.random() * 8) + 1;
    document.getElementById('reviewCount').textContent = reviewCount;
    
    // 포인트 (임시 데이터)
    const pointCount = Math.floor(Math.random() * 5000) + 1000;
    document.getElementById('pointCount').textContent = pointCount.toLocaleString();
}

// 폼 초기화
function initializeForms() {
    // 기본정보 폼
    const infoForm = document.getElementById('infoForm');
    if (infoForm) {
        infoForm.addEventListener('submit', handleInfoUpdate);
    }
    
    // 비밀번호 폼
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // 프로필 폼
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

// 기본정보 업데이트
function handleInfoUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        region: formData.get('region')
    };
    
    // 사용자 데이터 업데이트
    currentUser.name = updatedData.name;
    currentUser.phone = updatedData.phone;
    currentUser.region = updatedData.region;
    
    // 로컬 스토리지 업데이트
    updateUserInStorage();
    
    // 화면 업데이트
    loadUserInfo();
    
    alert('기본정보가 업데이트되었습니다.');
}

// 비밀번호 변경
function handlePasswordChange(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // 현재 비밀번호 확인
    if (currentPassword !== currentUser.password) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
    }
    
    // 새 비밀번호 확인
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 비밀번호 강도 검증
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        alert('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
        return;
    }
    
    // 비밀번호 업데이트
    currentUser.password = newPassword;
    updateUserInStorage();
    
    // 폼 초기화
    e.target.reset();
    
    alert('비밀번호가 변경되었습니다.');
}

// 프로필 업데이트
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categories = formData.getAll('categories');
    
    // 프로필 정보 업데이트
    if (!currentUser.profile) {
        currentUser.profile = {};
    }
    
    currentUser.profile.bio = formData.get('bio');
    currentUser.profile.categories = categories;
    
    // 로컬 스토리지 업데이트
    updateUserInStorage();
    
    alert('프로필이 업데이트되었습니다.');
}

// SNS 계정 상태 로드
function loadSNSStatus() {
    if (!currentUser.snsAccounts) {
        currentUser.snsAccounts = {};
    }
    
    const platforms = ['naver', 'instagram', 'youtube', 'xiaohongshu', 'twitter', 'tiktok'];
    
    platforms.forEach(platform => {
        const statusElement = document.getElementById(`${platform}Status`);
        const btnElement = document.getElementById(`${platform}Btn`);
        const cardElement = document.querySelector(`[data-platform="${platform}"]`);
        
        if (currentUser.snsAccounts[platform]) {
            const account = currentUser.snsAccounts[platform];
            statusElement.textContent = account.followers ? `팔로워 ${account.followers}명` : '인증됨';
            statusElement.classList.add('authenticated');
            btnElement.textContent = '내 계정 인증하기';
            btnElement.classList.add('authenticated');
            cardElement.classList.add('authenticated');
        } else {
            statusElement.textContent = '미등록';
            statusElement.classList.remove('authenticated');
            btnElement.textContent = '등록하기';
            btnElement.classList.remove('authenticated');
            cardElement.classList.remove('authenticated');
        }
    });
}

// SNS 계정 인증
function authenticateSNS(platform) {
    const account = currentUser.snsAccounts?.[platform];
    
    if (account) {
        // 이미 인증된 경우 - 재인증 또는 정보 수정
        const newFollowers = prompt(`${getPlatformName(platform)} 팔로워 수를 입력하세요:`, account.followers || '');
        if (newFollowers !== null) {
            if (!currentUser.snsAccounts) {
                currentUser.snsAccounts = {};
            }
            currentUser.snsAccounts[platform] = {
                ...account,
                followers: newFollowers,
                lastUpdated: new Date().toISOString()
            };
            updateUserInStorage();
            loadSNSStatus();
            alert(`${getPlatformName(platform)} 계정이 업데이트되었습니다.`);
        }
    } else {
        // 새로 등록하는 경우
        const username = prompt(`${getPlatformName(platform)} 사용자명을 입력하세요:`, '');
        if (username) {
            const followers = prompt('팔로워 수를 입력하세요 (선택사항):', '');
            
            if (!currentUser.snsAccounts) {
                currentUser.snsAccounts = {};
            }
            
            currentUser.snsAccounts[platform] = {
                username: username,
                followers: followers || null,
                registeredAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            updateUserInStorage();
            loadSNSStatus();
            alert(`${getPlatformName(platform)} 계정이 등록되었습니다.`);
        }
    }
}

// 플랫폼 이름 반환
function getPlatformName(platform) {
    const names = {
        'naver': '네이버 블로그/카페',
        'instagram': '인스타그램',
        'youtube': '유튜브',
        'xiaohongshu': '샤오홍슈',
        'twitter': 'X (트위터)',
        'tiktok': '틱톡'
    };
    return names[platform] || platform;
}

// 체험단 내역 로드
function loadExperiences() {
    if (!currentUser.experiences) {
        currentUser.experiences = [];
    }
    
    // 임시 체험단 데이터 생성 (실제로는 서버에서 가져와야 함)
    if (currentUser.experiences.length === 0) {
        currentUser.experiences = [
            {
                id: 'exp1',
                title: '뷰티 체험단',
                category: '뷰티',
                company: 'ABC 화장품',
                appliedDate: '2024-01-15',
                startDate: '2024-01-20',
                endDate: '2024-02-20',
                status: 'ongoing',
                description: '신제품 립스틱 체험단'
            },
            {
                id: 'exp2',
                title: '패션 체험단',
                category: '패션',
                company: 'XYZ 브랜드',
                appliedDate: '2024-01-10',
                startDate: '2024-01-15',
                endDate: '2024-01-30',
                status: 'completed',
                description: '신상 의류 체험단'
            },
            {
                id: 'exp3',
                title: '식품 체험단',
                category: '식품',
                company: 'DEF 푸드',
                appliedDate: '2024-02-01',
                startDate: '2024-02-10',
                endDate: '2024-02-25',
                status: 'applied',
                description: '건강식품 체험단'
            }
        ];
        updateUserInStorage();
    }
    
    filterExperiences('all');
}

// 체험단 필터링
function filterExperiences(status) {
    // 필터 버튼 활성화 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(status + 'Filter').classList.add('active');
    
    let filteredExperiences = currentUser.experiences;
    
    if (status !== 'all') {
        filteredExperiences = currentUser.experiences.filter(exp => exp.status === status);
    }
    
    displayExperiences(filteredExperiences);
}

// 체험단 목록 표시
function displayExperiences(experiences) {
    const experienceList = document.getElementById('experienceList');
    
    if (experiences.length === 0) {
        experienceList.innerHTML = '<div class="no-experiences">체험단 내역이 없습니다.</div>';
        return;
    }
    
    experienceList.innerHTML = experiences.map(exp => {
        const statusText = getStatusText(exp.status);
        const statusClass = getStatusClass(exp.status);
        
        return `
            <div class="experience-item">
                <div class="experience-info">
                    <h4>${exp.title}</h4>
                    <p class="experience-company">${exp.company}</p>
                    <p class="experience-description">${exp.description}</p>
                    <div class="experience-dates">
                        <span>신청일: ${exp.appliedDate}</span>
                        <span>체험기간: ${exp.startDate} ~ ${exp.endDate}</span>
                    </div>
                    <div class="experience-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="experience-actions">
                    ${getActionButtons(exp.status)}
                </div>
            </div>
        `;
    }).join('');
}

// 상태 텍스트 반환
function getStatusText(status) {
    const statusTexts = {
        'applied': '신청완료',
        'ongoing': '진행중',
        'completed': '종료됨'
    };
    return statusTexts[status] || status;
}

// 상태 클래스 반환
function getStatusClass(status) {
    const statusClasses = {
        'applied': 'status-applied',
        'ongoing': 'status-ongoing',
        'completed': 'status-completed'
    };
    return statusClasses[status] || '';
}

// 액션 버튼 반환
function getActionButtons(status) {
    switch (status) {
        case 'applied':
            return '<button class="btn btn-secondary" onclick="cancelApplication()">신청 취소</button>';
        case 'ongoing':
            return '<button class="btn btn-primary" onclick="writeReview()">리뷰 작성</button>';
        case 'completed':
            return '<button class="btn btn-outline" onclick="viewReview()">리뷰 보기</button>';
        default:
            return '';
    }
}

// 신청 취소
function cancelApplication() {
    if (confirm('정말로 신청을 취소하시겠습니까?')) {
        alert('신청이 취소되었습니다.');
        // 실제로는 해당 체험단의 상태를 업데이트해야 함
    }
}

// 리뷰 작성
function writeReview() {
    alert('리뷰 작성 페이지로 이동합니다.');
    // 실제로는 리뷰 작성 페이지로 이동
}

// 리뷰 보기
function viewReview() {
    alert('작성한 리뷰를 확인합니다.');
    // 실제로는 리뷰 상세 페이지로 이동
}

// 준비중 팝업 표시
function showComingSoon(serviceName) {
    alert(`${serviceName} 서비스는 현재 준비중입니다.\n빠른 시일 내에 서비스할 예정입니다.`);
}

// 로컬 스토리지에서 사용자 정보 업데이트
function updateUserInStorage() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        // 세션 스토리지도 업데이트
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// 사용자 유형에 따른 탭 설정
function setupTabsForUserType() {
    if (currentUser && currentUser.userType === 'business') {
        // 자영업자인 경우 체험단 모집, 체험단 관리 탭만 표시
        const recruitTab = document.getElementById('recruitTab');
        const manageTab = document.getElementById('manageTab');
        
        if (recruitTab && manageTab) {
            recruitTab.style.display = 'block';
            manageTab.style.display = 'block';
        }
    } else {
        // 인플루언서인 경우 기존 탭들 표시
        const recruitTab = document.getElementById('recruitTab');
        const manageTab = document.getElementById('manageTab');
        
        if (recruitTab && manageTab) {
            recruitTab.style.display = 'none';
            manageTab.style.display = 'none';
        }
    }
}

// 탭 전환
function showTab(tabName) {
    console.log('showTab 호출됨:', tabName);
    
    // 모든 탭 버튼과 콘텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 버튼 활성화
    const tabButton = document.querySelector(`button[onclick="showTab('${tabName}')"]`);
    if (tabButton) {
        tabButton.classList.add('active');
        console.log('탭 버튼 활성화됨:', tabButton.textContent);
    } else {
        console.log('탭 버튼을 찾을 수 없음:', `button[onclick="showTab('${tabName}')"]`);
    }
    
    // 선택된 탭 콘텐츠 활성화
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) {
        tabContent.classList.add('active');
        console.log('탭 콘텐츠 활성화됨:', tabContent.id);
        
        // 체험단 모집 탭이 활성화되면 폼 초기화
        if (tabName === 'recruit') {
            setTimeout(() => {
                console.log('체험단 모집 폼 초기화 시작');
                initializeBusinessRecruitForm();
            }, 100);
        }
    } else {
        console.log('탭 콘텐츠를 찾을 수 없음:', tabName + 'Tab');
    }
}

// 체험단 모집 페이지로 이동
function goToRecruitment() {
    window.location.href = 'experience-registration.html';
}

// 체험단 모집 통계 로드
function loadRecruitStats() {
    if (!currentUser || currentUser.userType !== 'business') return;
    
    // 임시 데이터 (실제로는 서버에서 가져와야 함)
    const stats = {
        total: 5,
        active: 2,
        completed: 3
    };
    
    document.getElementById('totalRecruits').textContent = stats.total;
    document.getElementById('activeRecruits').textContent = stats.active;
    document.getElementById('completedRecruits').textContent = stats.completed;
}

// 관리하는 체험단 목록 로드
function loadManagedExperiences() {
    if (!currentUser || currentUser.userType !== 'business') return;
    
    const managedExperienceList = document.getElementById('managedExperienceList');
    if (!managedExperienceList) return;
    
    // 임시 데이터 (실제로는 서버에서 가져와야 함)
    const managedExperiences = [
        {
            id: 'exp1',
            title: '뷰티 제품 체험단',
            company: currentUser.businessName || '내 사업체',
            description: '신제품 립스틱 체험단 모집',
            startDate: '2024-02-01',
            endDate: '2024-02-28',
            status: 'recruiting',
            applicants: 15,
            maxApplicants: 20
        },
        {
            id: 'exp2',
            title: '카페 체험단',
            company: currentUser.businessName || '내 사업체',
            description: '신메뉴 체험단 모집',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            status: 'ongoing',
            applicants: 8,
            maxApplicants: 10
        },
        {
            id: 'exp3',
            title: '패션 체험단',
            company: currentUser.businessName || '내 사업체',
            description: '신상 의류 체험단',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'completed',
            applicants: 12,
            maxApplicants: 15
        }
    ];
    
    filterManagedExperiences('all', managedExperiences);
}

// 관리하는 체험단 필터링
function filterManagedExperiences(status, experiences = null) {
    if (!experiences) {
        // experiences가 제공되지 않으면 다시 로드
        loadManagedExperiences();
        return;
    }
    
    const managedExperienceList = document.getElementById('managedExperienceList');
    if (!managedExperienceList) return;
    
    // 필터 버튼 활성화 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(status + 'Filter').classList.add('active');
    
    let filteredExperiences = experiences;
    
    if (status !== 'all') {
        filteredExperiences = experiences.filter(exp => exp.status === status);
    }
    
    displayManagedExperiences(filteredExperiences);
}

// 관리하는 체험단 목록 표시
function displayManagedExperiences(experiences) {
    const managedExperienceList = document.getElementById('managedExperienceList');
    
    if (experiences.length === 0) {
        managedExperienceList.innerHTML = '<div class="no-managed-experiences">관리하는 체험단이 없습니다.</div>';
        return;
    }
    
    managedExperienceList.innerHTML = experiences.map(exp => {
        const statusText = getManagedStatusText(exp.status);
        const statusClass = getManagedStatusClass(exp.status);
        
        return `
            <div class="managed-experience-item">
                <div class="managed-experience-info">
                    <h4>${exp.title}</h4>
                    <p class="managed-experience-company">${exp.company}</p>
                    <p class="managed-experience-description">${exp.description}</p>
                    <div class="managed-experience-dates">
                        <span>모집기간: ${exp.startDate} ~ ${exp.endDate}</span>
                        <span>신청자: ${exp.applicants}/${exp.maxApplicants}명</span>
                    </div>
                    <div class="managed-experience-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="managed-experience-actions">
                    ${getManagedActionButtons(exp.status)}
                </div>
            </div>
        `;
    }).join('');
}

// 관리 상태 텍스트 반환
function getManagedStatusText(status) {
    const statusTexts = {
        'recruiting': '모집중',
        'ongoing': '진행중',
        'completed': '완료'
    };
    return statusTexts[status] || status;
}

// 관리 상태 클래스 반환
function getManagedStatusClass(status) {
    const statusClasses = {
        'recruiting': 'status-applied',
        'ongoing': 'status-ongoing',
        'completed': 'status-completed'
    };
    return statusClasses[status] || '';
}

// 관리 액션 버튼 반환
function getManagedActionButtons(status) {
    switch (status) {
        case 'recruiting':
            return `
                <button class="btn btn-primary" onclick="viewApplicants()">신청자 보기</button>
                <button class="btn btn-secondary" onclick="editExperience()">수정</button>
            `;
        case 'ongoing':
            return `
                <button class="btn btn-primary" onclick="viewParticipants()">참여자 관리</button>
                <button class="btn btn-secondary" onclick="viewProgress()">진행상황</button>
            `;
        case 'completed':
            return `
                <button class="btn btn-outline" onclick="viewResults()">결과 보기</button>
                <button class="btn btn-secondary" onclick="viewReviews()">후기 보기</button>
            `;
        default:
            return '';
    }
}

// 관리 액션 함수들
function viewApplicants() {
    alert('신청자 목록을 확인합니다.');
}

function editExperience() {
    alert('체험단 정보를 수정합니다.');
}

function viewParticipants() {
    alert('참여자 관리 페이지로 이동합니다.');
}

function viewProgress() {
    alert('진행상황을 확인합니다.');
}

function viewResults() {
    alert('체험단 결과를 확인합니다.');
}

function viewReviews() {
    alert('작성된 후기를 확인합니다.');
}

// 준비중 팝업 표시
function showComingSoon(serviceName) {
    alert(`${serviceName} 서비스는 현재 준비중입니다.\n빠른 시일 내에 서비스할 예정입니다.`);
}

// 폼 리셋
function resetForm() {
    loadUserInfo();
}

function resetPasswordForm() {
    document.getElementById('passwordForm').reset();
}

function resetProfileForm() {
    loadUserInfo();
}



// 프로필 사진 변경
function changeProfilePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImage').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// 사용자 메뉴 토글
function toggleUserMenu() {
    // 사용자 메뉴 토글 로직
    if (confirm('로그아웃 하시겠습니까?')) {
        logout();
    }
}

// 로그아웃
function logout() {
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('autoLogin');
    localStorage.removeItem('autoLoginUser');
    
    alert('로그아웃 되었습니다.');
    window.location.href = 'index.html';
}

// 계정 삭제
function deleteAccount() {
    if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        if (confirm('계정 삭제를 최종 확인하시겠습니까?')) {
            // 사용자 데이터 삭제
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(user => user.id !== currentUser.id);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // 세션 정리
            sessionStorage.clear();
            localStorage.removeItem('autoLogin');
            localStorage.removeItem('autoLoginUser');
            
            alert('계정이 삭제되었습니다.');
            window.location.href = 'index.html';
        }
    }
}
