// 자영업자 체험단 등록 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 자영업자 체험단 등록 폼 초기화
    initializeBusinessRecruitForm();
});

// 자영업자 체험단 등록 폼 초기화
function initializeBusinessRecruitForm() {
    console.log('initializeBusinessRecruitForm 시작');
    const businessForm = document.getElementById('businessExperienceForm');
    if (!businessForm) {
        console.log('businessExperienceForm을 찾을 수 없음');
        return;
    }
    console.log('businessExperienceForm 찾음');

    // 파일 업로드 관련 요소들
    const fileUploadArea = document.getElementById('businessFileUploadArea');
    const thumbnailFile = document.getElementById('businessThumbnailFile');
    const uploadedFiles = document.getElementById('businessUploadedFiles');
    
    console.log('파일 업로드 요소들:', {
        fileUploadArea: !!fileUploadArea,
        thumbnailFile: !!thumbnailFile,
        uploadedFiles: !!uploadedFiles
    });
    
    // 전화번호 입력 요소들
    const phoneInputs = document.querySelectorAll('#businessPhone1, #businessPhone2, #businessPhone3');
    console.log('전화번호 입력 요소들:', phoneInputs.length);
    
    // 시간 선택 옵션 초기화
    initializeBusinessTimeSelects();
    
    // 문자 수 카운터 초기화
    initializeBusinessCharCounters();
    
    // 날짜 자동 설정
    setBusinessDefaultDates();
    
    // 새로운 폼 요소들 초기화
    initializeNewBusinessFormElements();
    
    // 체험 유형 변경 시 필드 토글
    const experienceTypeSelect = document.getElementById('businessExperienceType');
    if (experienceTypeSelect) {
        experienceTypeSelect.addEventListener('change', toggleJournalistFields);
    }
    
    // 파일 업로드 이벤트 리스너
    if (fileUploadArea && thumbnailFile) {
        fileUploadArea.addEventListener('click', () => {
            thumbnailFile.click();
        });
        
        // 드래그 앤 드롭 이벤트
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleBusinessFileUpload(files[0]);
            }
        });
        
        // 파일 선택 이벤트
        thumbnailFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleBusinessFileUpload(e.target.files[0]);
            }
        });
    }
    
    // 전화번호 입력 자동 포커스 이동
    phoneInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            const maxLength = parseInt(e.target.getAttribute('maxlength'));
            
            if (value.length === maxLength && index < phoneInputs.length - 1) {
                phoneInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                phoneInputs[index - 1].focus();
            }
        });
        
        // 숫자만 입력 허용
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
    
    // 폼 제출 이벤트
    businessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('자영업자 체험단 등록 폼 제출 시도');
        
        try {
            if (validateBusinessForm()) {
                console.log('자영업자 폼 검증 통과');
                // 폼 데이터 수집
                const formData = collectBusinessFormData();
                console.log('자영업자 폼 데이터 수집 완료:', formData);
                
                // 체험단 데이터 저장
                console.log('자영업자 체험단 데이터 저장 시작');
                saveBusinessExperienceData(formData);
                console.log('자영업자 체험단 데이터 저장 완료');
                
                // 성공 메시지 표시
                showBusinessSuccessMessage();
            } else {
                console.log('자영업자 폼 검증 실패');
                alert('필수 항목을 모두 입력해주세요.');
            }
        } catch (error) {
            console.error('자영업자 폼 제출 중 오류 발생:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
}

// 시간 선택 옵션 초기화
function initializeBusinessTimeSelects() {
    const hourSelects = document.querySelectorAll('#businessStart_hour, #businessEnd_hour');
    const minuteSelects = document.querySelectorAll('#businessStart_minute, #businessEnd_minute');
    
    // 시간 옵션 생성 (00-23)
    hourSelects.forEach(select => {
        for (let i = 0; i < 24; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString().padStart(2, '0');
            select.appendChild(option);
        }
    });
    
    // 분 옵션 생성 (00, 15, 30, 45)
    minuteSelects.forEach(select => {
        const minutes = ['00', '15', '30', '45'];
        minutes.forEach(minute => {
            const option = document.createElement('option');
            option.value = minute;
            option.textContent = minute;
            select.appendChild(option);
        });
    });
    
    // 24시간 영업 체크박스 이벤트
    const twentyFourHoursCheckbox = document.getElementById('businessTwenty_four_hours');
    const timeSelects = document.querySelectorAll('#businessStart_hour, #businessStart_minute, #businessEnd_hour, #businessEnd_minute');
    
    if (twentyFourHoursCheckbox) {
        twentyFourHoursCheckbox.addEventListener('change', function() {
            if (this.checked) {
                timeSelects.forEach(select => {
                    select.disabled = true;
                    select.style.opacity = '0.5';
                });
            } else {
                timeSelects.forEach(select => {
                    select.disabled = false;
                    select.style.opacity = '1';
                });
            }
        });
    }
}

// 문자 수 카운터 초기화
function initializeBusinessCharCounters() {
    const reservationNotes = document.getElementById('businessReservation_notes');
    const charCount = document.getElementById('businessNotes_char_count');
    
    if (reservationNotes && charCount) {
        reservationNotes.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 90) {
                charCount.style.color = '#dc3545';
            } else if (currentLength > 80) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#666';
            }
        });
    }
}

// 파일 업로드 처리 함수
function handleBusinessFileUpload(file) {
    // 파일 유효성 검사
    if (!validateBusinessFile(file)) {
        return;
    }
    
    // 기존 파일 제거
    const uploadedFiles = document.getElementById('businessUploadedFiles');
    if (uploadedFiles) {
        uploadedFiles.innerHTML = '';
    }
    
    // 파일 미리보기 생성
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileItem = createBusinessFileItem(file, e.target.result);
        if (uploadedFiles) {
            uploadedFiles.appendChild(fileItem);
        }
    };
    reader.readAsDataURL(file);
}

// 파일 유효성 검사
function validateBusinessFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
        alert('JPEG 또는 PNG 파일만 업로드 가능합니다.');
        return false;
    }
    
    if (file.size > maxSize) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return false;
    }
    
    return true;
}

// 파일 아이템 생성
function createBusinessFileItem(file, previewUrl) {
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file';
    
    fileItem.innerHTML = `
        <img src="${previewUrl}" alt="파일 미리보기">
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="remove-file" onclick="removeBusinessFile(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return fileItem;
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 제거 함수
function removeBusinessFile(button) {
    const fileItem = button.closest('.uploaded-file');
    fileItem.remove();
    const thumbnailFile = document.getElementById('businessThumbnailFile');
    if (thumbnailFile) {
        thumbnailFile.value = '';
    }
}

// 폼 유효성 검사
function validateBusinessForm() {
    console.log('자영업자 폼 검증 시작');
    const businessForm = document.getElementById('businessExperienceForm');
    const requiredFields = businessForm.querySelectorAll('[required]');
    let isValid = true;
    console.log('자영업자 필수 필드 개수:', requiredFields.length);
    
    requiredFields.forEach(field => {
        console.log('자영업자 필드 검증:', field.id, field.type, field.value);
        
        if (field.type === 'file') {
            // 파일 필드 처리
            if (!field.files.length) {
                console.log('자영업자 파일 필드 검증 실패:', field.id);
                isValid = false;
            }
        } else if (!field.value.trim()) {
            console.log('자영업자 텍스트 필드 검증 실패:', field.id);
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            field.style.borderColor = '#e9ecef';
        }
    });
    
    // 전화번호 유효성 검사
    const phone1 = document.getElementById('businessPhone1').value;
    const phone2 = document.getElementById('businessPhone2').value;
    const phone3 = document.getElementById('businessPhone3').value;
    
    if (phone1 !== '010' || phone2.length !== 4 || phone3.length !== 4) {
        alert('올바른 전화번호를 입력해주세요. (010-XXXX-XXXX 형식)');
        isValid = false;
    }
    
    // 새로운 필드들 검증
    // 지역 선택 검증
    const region = document.getElementById('businessRegion');
    if (region && !region.value) {
        alert('지역을 선택해주세요.');
        isValid = false;
    }
    
    // 체험 유형 검증
    const experienceType = document.getElementById('businessExperienceType');
    if (experienceType && !experienceType.value) {
        alert('체험 유형을 선택해주세요.');
        isValid = false;
    }
    
    // 모집 인원 검증
    const recruitCount = document.getElementById('businessRecruitCount');
    if (recruitCount && (!recruitCount.value || recruitCount.value < 1 || recruitCount.value > 100)) {
        alert('모집 인원을 1명 이상 100명 이하로 입력해주세요.');
        isValid = false;
    }
    
    // 날짜 검증
    const startDate = document.getElementById('businessStartDate');
    const endDate = document.getElementById('businessEndDate');
    if (startDate && endDate) {
        if (!startDate.value) {
            alert('모집 시작일을 선택해주세요.');
            isValid = false;
        } else if (!endDate.value) {
            alert('모집 마감일을 선택해주세요.');
            isValid = false;
        } else if (new Date(startDate.value) >= new Date(endDate.value)) {
            alert('모집 마감일은 시작일보다 늦어야 합니다.');
            isValid = false;
        }
    }
    
    // 키워드 검증
    const keyword1 = document.getElementById('businessKeyword1');
    const keyword2 = document.getElementById('businessKeyword2');
    const keyword3 = document.getElementById('businessKeyword3');
    if (keyword1 && keyword2 && keyword3) {
        if (!keyword1.value.trim()) {
            alert('키워드 1을 입력해주세요.');
            isValid = false;
        } else if (!keyword2.value.trim()) {
            alert('키워드 2를 입력해주세요.');
            isValid = false;
        } else if (!keyword3.value.trim()) {
            alert('키워드 3을 입력해주세요.');
            isValid = false;
        }
    }
    
    // 당일 예약 라디오 버튼 검증
    const sameDayReservation = document.querySelector('input[name="same_day_reservation"]:checked');
    if (!sameDayReservation) {
        alert('당일 예약 및 방문 여부를 선택해주세요.');
        isValid = false;
    }
    
    // 위치 검증
    const location = document.getElementById('businessLocation');
    if (location && !location.value.trim()) {
        alert('위치를 입력해주세요.');
        isValid = false;
    }
    
    // 연결 URL 검증
    const connectUrl = document.getElementById('businessConnectUrl');
    if (connectUrl && !connectUrl.value.trim()) {
        alert('연결 URL을 입력해주세요.');
        isValid = false;
    } else if (connectUrl && connectUrl.value.trim()) {
        // URL 형식 검증
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(connectUrl.value.trim())) {
            alert('올바른 URL 형식을 입력해주세요. (http:// 또는 https://로 시작)');
            isValid = false;
        }
    }
    
    // 채널 선택 검사
    const selectedChannel = businessForm.querySelector('input[name="channel"]:checked');
    if (!selectedChannel) {
        alert('채널을 선택해주세요.');
        isValid = false;
    }
    
    console.log('자영업자 폼 검증 결과:', isValid);
    return isValid;
}

// 폼 데이터 수집
function collectBusinessFormData() {
    const formData = new FormData();
    
    // 기본 정보
    const companyName = document.getElementById('businessCompanyName');
    if (companyName) formData.append('companyName', companyName.value);
    
    // 지역
    const region = document.getElementById('businessRegion');
    if (region) formData.append('region', region.value);
    
    // 카테고리
    const category = document.getElementById('businessCategory');
    if (category) formData.append('category', category.value);
    
    // 파일
    const thumbnailFile = document.getElementById('businessThumbnailFile');
    if (thumbnailFile && thumbnailFile.files.length > 0) {
        formData.append('thumbnailFile', thumbnailFile.files[0]);
    }
    
    // 연락처
    const phone1 = document.getElementById('businessPhone1');
    const phone2 = document.getElementById('businessPhone2');
    const phone3 = document.getElementById('businessPhone3');
    if (phone1 && phone2 && phone3) {
        const phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
        formData.append('contactPhone', phone);
    }
    
    // 채널 선택
    const selectedChannel = document.querySelector('input[name="channel"]:checked');
    if (selectedChannel) {
        formData.append('channel', selectedChannel.value);
    }
    
    // 체험단 상세 정보
    const experienceTitle = document.getElementById('businessExperienceTitle');
    if (experienceTitle) formData.append('experienceTitle', experienceTitle.value);
    
    const experienceDescription = document.getElementById('businessExperienceDescription');
    if (experienceDescription) formData.append('experienceDescription', experienceDescription.value);
    
    const experienceType = document.getElementById('businessExperienceType');
    if (experienceType) formData.append('experienceType', experienceType.value);
    
    const recruitCount = document.getElementById('businessRecruitCount');
    if (recruitCount) formData.append('recruitCount', recruitCount.value);
    
    const startDate = document.getElementById('businessStartDate');
    if (startDate) formData.append('startDate', startDate.value);
    
    const endDate = document.getElementById('businessEndDate');
    if (endDate) formData.append('endDate', endDate.value);
    
    const providedServices = document.getElementById('businessProvidedServices');
    if (providedServices) formData.append('providedServices', providedServices.value);
    
    // 키워드
    const keyword1 = document.getElementById('businessKeyword1');
    const keyword2 = document.getElementById('businessKeyword2');
    const keyword3 = document.getElementById('businessKeyword3');
    if (keyword1) formData.append('keyword1', keyword1.value);
    if (keyword2) formData.append('keyword2', keyword2.value);
    if (keyword3) formData.append('keyword3', keyword3.value);
    
    // 당일 예약
    const sameDayReservation = document.querySelector('input[name="same_day_reservation"]:checked');
    if (sameDayReservation) formData.append('sameDayReservation', sameDayReservation.value);
    
    // 추가 정보
    const location = document.getElementById('businessLocation');
    if (location) formData.append('location', location.value);
    
    const connectUrl = document.getElementById('businessConnectUrl');
    if (connectUrl) formData.append('connectUrl', connectUrl.value);
    
    // 예약 시 주의사항
    const reservationNotes = document.getElementById('businessReservation_notes');
    if (reservationNotes) formData.append('reservationNotes', reservationNotes.value);
    
    // 현재 사용자 정보 추가
    const currentUserData = sessionStorage.getItem('currentUser');
    if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        formData.append('businessUserId', currentUser.id);
        formData.append('businessUserName', currentUser.name);
        formData.append('businessUserEmail', currentUser.email);
    }
    
    return formData;
}

// 자영업자 체험단 데이터 저장
function saveBusinessExperienceData(data) {
    console.log('자영업자 saveBusinessExperienceData 함수 시작');
    console.log('받은 데이터:', data);
    
    // localStorage에 체험단 데이터 저장
    const existingExperiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    console.log('기존 체험단 개수:', existingExperiences.length);
    console.log('저장할 체험단 데이터:', data);
    
    const newExperience = {
        id: Date.now().toString(),
        title: data.get('experienceTitle') || `${data.get('companyName') || '상호명'} - ${getExperienceTypeName(data.get('experienceType'))}`,
        category: getCategoryName(data.get('category')),
        region: getRegionName(data.get('region')),
        type: '방문형', // 기본값
        channel: getChannelName(data.get('channel')),
        contactPhone: data.get('contactPhone') || '미입력',
        thumbnail: data.get('thumbnailFile') ? URL.createObjectURL(data.get('thumbnailFile')) : 'https://via.placeholder.com/200x200/9B59B6/FFFFFF?text=실',
        price: data.get('providedServices') || '체험단 상세 정보',
        company: data.get('companyName') || '회사명',
        companyName: data.get('companyName') || '회사명',
        description: data.get('experienceDescription') || data.get('providedServices') || '체험단 설명',
        experienceType: data.get('experienceType') || 'other',
        recruitCount: data.get('recruitCount') || '10',
        startDate: data.get('startDate') || '',
        endDate: data.get('endDate') || '',
        keywords: [data.get('keyword1'), data.get('keyword2'), data.get('keyword3')].filter(k => k),
        sameDayReservation: data.get('sameDayReservation') || 'impossible',
        location: data.get('location') || '',
        connectUrl: data.get('connectUrl') || '',
        url: data.get('connectUrl') || '', // 메인 페이지에서 바로가기 버튼용
        participantCount: data.get('recruitCount') || '10',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30일 후
        // 모집 기간 (사용자가 입력한 날짜 사용)
        recruitmentStartDate: data.get('startDate') || new Date().toISOString().split('T')[0],
        recruitmentEndDate: data.get('endDate') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // 체험 일정 (모집 마감일 다음날부터 2주간)
        experienceStartDate: calculateExperienceStartDate(data.get('endDate')),
        experienceEndDate: calculateExperienceEndDate(data.get('endDate')),
            
        // 상세 주소 (위치 정보 사용) - 메인 페이지에서 address로 참조
        address: data.get('location') || '',
        detailedAddress: data.get('location') || '',
        
        // 방문 가능 요일 (기본값 설정)
        availableDays: ['화', '수', '목', '금', '토'],
        
        // 방문 가능 시간 (기본값 설정)
        availableTime: '09:00 - 16:00',
        
        experienceSchedule: calculateExperienceSchedule(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        status: 'pending', // 승인 상태: pending(대기), approved(승인), rejected(거절)
        isPopular: false,
        isPremium: false,
        premiumPoint: 0,
        premiumDescription: '',
        approvedAt: null, // 승인일
        createdAt: new Date().toISOString(), // 등록일
        availableDays: getSelectedBusinessDays(),
        startTime: isBusinessTwentyFourHours() ? '24시간' : getFormattedBusinessTime(data.get('start_hour'), data.get('start_minute')),
        endTime: isBusinessTwentyFourHours() ? '24시간' : getFormattedBusinessTime(data.get('end_hour'), data.get('end_minute')),
        address: '',
        reservationNotes: data.get('reservationNotes') || '',
        businessUserId: data.get('businessUserId') || '',
        businessUserName: data.get('businessUserName') || '',
        businessUserEmail: data.get('businessUserEmail') || ''
    };
    
    console.log('새 자영업자 체험단 데이터:', newExperience);
    
    existingExperiences.unshift(newExperience); // 최신 항목을 맨 앞에 추가
    console.log('업데이트된 체험단 배열:', existingExperiences);
    
    localStorage.setItem('experiences', JSON.stringify(existingExperiences));
    console.log('localStorage에 저장 완료');
    console.log('새 자영업자 체험단 상태:', newExperience.status);
    console.log('새 자영업자 체험단 등록일:', newExperience.createdAt);
    console.log('저장된 체험단 URL:', newExperience.url);
    console.log('저장된 체험단 주소:', newExperience.address);
    console.log('저장된 체험단 키워드:', newExperience.keywords);
    console.log('사용자 입력 키워드 1:', data.get('keyword1'));
    console.log('사용자 입력 키워드 2:', data.get('keyword2'));
    console.log('사용자 입력 키워드 3:', data.get('keyword3'));
    
    // 저장 확인
    const savedExperiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    console.log('저장 확인 - 현재 체험단 개수:', savedExperiences.length);
    console.log('승인 대기 체험단 개수:', savedExperiences.filter(exp => exp.status === 'pending').length);
}

// 체험 일정 계산 (모집마감일 기준 2주)
function calculateExperienceSchedule(endDate) {
    try {
        if (!endDate) return '';
        
        const endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) return '';
        
        const experienceStartDate = new Date(endDateObj);
        experienceStartDate.setDate(endDateObj.getDate() + 1); // 모집마감일 다음날부터
        
        const experienceEndDate = new Date(experienceStartDate);
        experienceEndDate.setDate(experienceStartDate.getDate() + 13); // 2주간 (14일)
        
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        return `${formatDate(experienceStartDate)} ~ ${formatDate(experienceEndDate)}`;
    } catch (error) {
        console.error('체험 일정 계산 중 오류:', error);
        return '';
    }
}

// 체험 시작일 계산
function calculateExperienceStartDate(endDate) {
    try {
        if (!endDate) return '';
        
        const endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) return '';
        
        const experienceStartDate = new Date(endDateObj);
        experienceStartDate.setDate(endDateObj.getDate() + 1); // 모집마감일 다음날부터
        
        return experienceStartDate.toISOString().split('T')[0];
    } catch (error) {
        console.error('체험 시작일 계산 중 오류:', error);
        return '';
    }
}

// 체험 종료일 계산
function calculateExperienceEndDate(endDate) {
    try {
        if (!endDate) return '';
        
        const endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) return '';
        
        const experienceStartDate = new Date(endDateObj);
        experienceStartDate.setDate(endDateObj.getDate() + 1); // 모집마감일 다음날부터
        
        const experienceEndDate = new Date(experienceStartDate);
        experienceEndDate.setDate(experienceStartDate.getDate() + 13); // 2주간 (14일)
        
        return experienceEndDate.toISOString().split('T')[0];
    } catch (error) {
        console.error('체험 종료일 계산 중 오류:', error);
        return '';
    }
}

// 선택된 요일 가져오기
function getSelectedBusinessDays() {
    const selectedDays = [];
    const dayCheckboxes = document.querySelectorAll('input[name="available_days"]:checked');
    
    dayCheckboxes.forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });
    
    return selectedDays;
}

// 시간 포맷팅 함수
function getFormattedBusinessTime(hour, minute) {
    if (!hour || !minute) return '';
    return `${hour}:${minute}`;
}

// 24시간 영업 여부 확인
function isBusinessTwentyFourHours() {
    const twentyFourHoursCheckbox = document.getElementById('businessTwenty_four_hours');
    return twentyFourHoursCheckbox && twentyFourHoursCheckbox.checked;
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

// 채널 이름 가져오기
function getChannelName(channelValue) {
    const channels = {
        'blog': '블로그',
        'reels': '릴스',
        'instagram': '인스타그램',
        'youtube': '유튜브'
    };
    return channels[channelValue] || '블로그';
}

// 성공 메시지 표시
function showBusinessSuccessMessage() {
    console.log('자영업자 showSuccessMessage 함수 시작');
    const businessForm = document.getElementById('businessExperienceForm');
    const submitBtn = businessForm.querySelector('.btn-primary');
    
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '등록 중...';
        submitBtn.disabled = true;
        console.log('자영업자 제출 버튼 상태 변경됨');
    }
    
    // 성공 메시지 표시
    setTimeout(() => {
        try {
            console.log('자영업자 성공 메시지 표시 시작');
            showBusinessRegistrationSuccess();
            console.log('자영업자 성공 메시지 표시 완료');
            
            // 폼 리셋
            setTimeout(() => {
                resetBusinessForm();
                // 버튼 상태 복원
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 2000);
        } catch (error) {
            console.error('자영업자 성공 메시지 표시 중 오류 발생:', error);
            alert('체험단 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
            
            // 버튼 상태 복원
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    }, 1000);
}

// 등록 성공 메시지 표시
function showBusinessRegistrationSuccess() {
    // 성공 모달 생성
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>체험단 등록 완료!</h2>
            <p>체험단이 성공적으로 등록되었습니다.</p>
            <p>관리자 승인 후 메인 페이지에 표시됩니다.</p>
            <div class="success-actions">
                <button class="btn-primary" onclick="this.closest('.success-modal').remove()">확인</button>
            </div>
        </div>
    `;
    
    // 모달 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
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
        .success-modal-content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .success-icon {
            font-size: 60px;
            color: #28a745;
            margin-bottom: 20px;
        }
        .success-modal-content h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 24px;
        }
        .success-modal-content p {
            color: #666;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .success-actions {
            margin-top: 30px;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// 폼 리셋
function resetBusinessForm() {
    const businessForm = document.getElementById('businessExperienceForm');
    if (businessForm) {
        businessForm.reset();
        
        // 업로드된 파일 제거
        const uploadedFiles = document.getElementById('businessUploadedFiles');
        if (uploadedFiles) {
            uploadedFiles.innerHTML = '';
        }
        
        // 문자 수 카운터 리셋
        const charCount = document.getElementById('businessNotes_char_count');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#666';
        }
        
        // 시간 선택 활성화
        const timeSelects = document.querySelectorAll('#businessStart_hour, #businessStart_minute, #businessEnd_hour, #businessEnd_minute');
        timeSelects.forEach(select => {
            select.disabled = false;
            select.style.opacity = '1';
        });
        
        // 24시간 영업 체크박스 해제
        const twentyFourHoursCheckbox = document.getElementById('businessTwenty_four_hours');
        if (twentyFourHoursCheckbox) {
            twentyFourHoursCheckbox.checked = false;
        }
    }
}

// 자영업자 로그인 확인 함수
function checkBusinessLogin() {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    const currentUserData = sessionStorage.getItem('currentUser');
    
    if (!userLoggedIn || !currentUserData) {
        alert('자영업자 로그인이 필요합니다.');
        // 로그인 모달 열기 또는 로그인 페이지로 이동
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const currentUser = JSON.parse(currentUserData);
        if (currentUser.userType !== 'business') {
            alert('자영업자만 체험단 모집이 가능합니다.');
            return;
        }
        
        // 자영업자 프로필 페이지로 이동
        window.location.href = 'profile-with-recruit.html';
    } catch (e) {
        console.error('사용자 데이터 파싱 오류:', e);
        alert('사용자 정보를 불러올 수 없습니다.');
        window.location.href = 'index.html';
    }
}

// 새로운 폼 요소들 초기화
function initializeNewBusinessFormElements() {
    console.log('새로운 폼 요소들 초기화 시작');
    
    // 지역 선택 초기화
    const regionSelect = document.getElementById('businessRegion');
    if (regionSelect) {
        console.log('지역 선택 요소 찾음');
    }
    
    // 체험단 제목 초기화
    const experienceTitleInput = document.getElementById('businessExperienceTitle');
    if (experienceTitleInput) {
        console.log('체험단 제목 요소 찾음');
    }
    
    // 체험단 설명 초기화
    const experienceDescriptionInput = document.getElementById('businessExperienceDescription');
    if (experienceDescriptionInput) {
        console.log('체험단 설명 요소 찾음');
    }
    
    // 체험 유형 초기화
    const experienceTypeSelect = document.getElementById('businessExperienceType');
    if (experienceTypeSelect) {
        console.log('체험 유형 요소 찾음');
    }
    
    // 모집 인원 초기화
    const recruitCountInput = document.getElementById('businessRecruitCount');
    if (recruitCountInput) {
        console.log('모집 인원 요소 찾음');
    }
    
    // 날짜 입력 초기화
    const startDateInput = document.getElementById('businessStartDate');
    const endDateInput = document.getElementById('businessEndDate');
    if (startDateInput && endDateInput) {
        console.log('날짜 입력 요소들 찾음');
        // 오늘 날짜를 기본값으로 설정
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
    }
    
    // 키워드 입력 초기화
    const keywordInputs = document.querySelectorAll('#businessKeyword1, #businessKeyword2, #businessKeyword3');
    console.log('키워드 입력 요소들:', keywordInputs.length);
    
    // 당일 예약 라디오 버튼 초기화
    const reservationRadios = document.querySelectorAll('input[name="same_day_reservation"]');
    console.log('당일 예약 라디오 버튼들:', reservationRadios.length);
    
    // 위치 및 URL 입력 초기화
    const locationInput = document.getElementById('businessLocation');
    const connectUrlInput = document.getElementById('businessConnectUrl');
    if (locationInput && connectUrlInput) {
        console.log('위치 및 URL 입력 요소들 찾음');
    }
    
    // 새로운 채널 옵션들 초기화
    const channelOptions = document.querySelectorAll('input[name="channel"]');
    console.log('채널 옵션들:', channelOptions.length);
}

// 지역명 변환 함수
function getRegionName(regionValue) {
    const regionMap = {
        'seoul': '서울',
        'busan': '부산',
        'daegu': '대구',
        'incheon': '인천',
        'gwangju': '광주',
        'daejeon': '대전',
        'ulsan': '울산',
        'sejong': '세종',
        'gyeonggi': '경기',
        'gangwon': '강원',
        'chungbuk': '충북',
        'chungnam': '충남',
        'jeonbuk': '전북',
        'jeonnam': '전남',
        'gyeongbuk': '경북',
        'gyeongnam': '경남',
        'jeju': '제주'
    };
    return regionMap[regionValue] || regionValue;
}

// 체험 유형명 변환 함수
function getExperienceTypeName(experienceTypeValue) {
    const experienceTypeMap = {
        'visit': '방문형',
        'delivery': '배송형',
        'packaging': '포장형',
        'online': '온라인',
        'journalist': '기자단'
    };
    return experienceTypeMap[experienceTypeValue] || experienceTypeValue;
}

// 기자단 필드 토글 함수 (자영업자 페이지에서는 사용하지 않음)
function toggleJournalistFields() {
    // 자영업자 페이지에서는 기자단 옵션이 없으므로 항상 모든 필드 표시
    const scheduleSection = document.getElementById('experienceScheduleSection');
    const locationFieldGroup = document.getElementById('locationFieldGroup');
    
    if (scheduleSection) {
        scheduleSection.style.display = 'block';
    }
    if (locationFieldGroup) {
        locationFieldGroup.style.display = 'block';
    }
}

// 자영업자 체험단 폼 날짜 자동 설정 함수
function setBusinessDefaultDates() {
    const today = new Date();
    
    // 모집 시작일: 오늘
    const startDate = today.toISOString().split('T')[0];
    
    // 모집 마감일: 오늘부터 2주 후
    const endDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    const endDateString = endDate.toISOString().split('T')[0];
    
    // 날짜 입력 필드에 설정 (읽기 전용)
    const startDateInput = document.getElementById('businessStartDate');
    const endDateInput = document.getElementById('businessEndDate');
    
    if (startDateInput) {
        startDateInput.value = startDate;
        startDateInput.readOnly = true;
        console.log('모집 시작일 설정:', startDate);
    }
    
    if (endDateInput) {
        endDateInput.value = endDateString;
        endDateInput.readOnly = true;
        console.log('모집 마감일 설정:', endDateString);
    }
    
    // 체험 일정 표시 업데이트
    updateBusinessExperienceScheduleDisplay(endDateString);
    
    console.log('자영업자 체험단 날짜 자동 설정 완료');
    console.log('모집 기간:', startDate, '~', endDateString);
}

// 자영업자 체험 일정 표시 업데이트 함수
function updateBusinessExperienceScheduleDisplay(endDate) {
    const experienceStartDate = calculateExperienceStartDate(endDate);
    const experienceEndDate = calculateExperienceEndDate(endDate);
    
    const startDisplay = document.getElementById('businessExperienceStartDisplay');
    const endDisplay = document.getElementById('businessExperienceEndDisplay');
    
    if (startDisplay) {
        startDisplay.textContent = experienceStartDate || '-';
    }
    
    if (endDisplay) {
        endDisplay.textContent = experienceEndDate || '-';
    }
    
    console.log('체험 일정 표시 업데이트:', experienceStartDate, '~', experienceEndDate);
}
