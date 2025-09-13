// 체험단 등록 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 파일 업로드 관련 요소들
    const fileUploadArea = document.getElementById('fileUploadArea');
    const thumbnailFile = document.getElementById('thumbnailFile');
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    // 폼 요소들
    const experienceForm = document.getElementById('experienceForm');
    const phoneInputs = document.querySelectorAll('.phone-input-group input');
    
    // 커스텀 셀렉트 초기화
    initializeCustomSelects();
    
    // 카테고리 선택 강제 초기화 (문제 해결용)
    setTimeout(() => {
        console.log('카테고리 셀렉트 강제 초기화 시작');
        initializeCategorySelect();
    }, 200);
    
    // 지역 선택 초기화
    initializeRegionSelect();
    
    // 시간 선택 옵션 초기화
    initializeTimeSelects();
    
    // 문자 수 카운터 초기화
    initializeCharCounters();
    
    // 커스텀 셀렉트 초기화 함수
    function initializeCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        
        customSelects.forEach(select => {
            // 카테고리 셀렉트는 별도로 초기화되므로 건너뛰기
            if (select.id === 'categorySelect') {
                return;
            }
            const trigger = select.querySelector('.select-trigger');
            const options = select.querySelector('.select-options');
            const hiddenInput = select.querySelector('input[type="hidden"]');
            const placeholder = select.querySelector('.select-placeholder');
            
            // 트리거 클릭 이벤트
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 다른 셀렉트 닫기 (카테고리 셀렉트 제외)
                customSelects.forEach(otherSelect => {
                    if (otherSelect !== select && otherSelect.id !== 'categorySelect') {
                        const otherTrigger = otherSelect.querySelector('.select-trigger');
                        const otherOptions = otherSelect.querySelector('.select-options');
                        if (otherTrigger && otherOptions) {
                            otherTrigger.classList.remove('active');
                            otherOptions.classList.remove('show');
                        }
                    }
                });
                
                // 현재 셀렉트 토글
                trigger.classList.toggle('active');
                options.classList.toggle('show');
            });
            
            // 옵션 클릭 이벤트 (이벤트 위임 사용)
            options.addEventListener('click', (e) => {
                if (e.target.classList.contains('select-option')) {
                    e.stopPropagation();
                    console.log('옵션 클릭됨:', e.target.textContent, e.target.getAttribute('data-value'));
                    
                    // 모든 옵션에서 selected 클래스 제거
                    const allOptions = options.querySelectorAll('.select-option');
                    allOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    // 클릭된 옵션에 selected 클래스 추가
                    e.target.classList.add('selected');
                    
                    // 플레이스홀더 업데이트
                    placeholder.textContent = e.target.textContent;
                    placeholder.style.color = '#333';
                    
                    // 히든 인풋 업데이트
                    hiddenInput.value = e.target.getAttribute('data-value');
                    console.log('히든 인풋 값 설정:', hiddenInput.value);
                    
                    // 셀렉트 닫기
                    trigger.classList.remove('active');
                    options.classList.remove('show');
                    
                    // 유효성 검사 업데이트
                    validateSelectField(select);
                }
            });
            
            console.log('셀렉트 초기화 완료:', select.id);
        });
        
        // 외부 클릭 시 셀렉트 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                customSelects.forEach(select => {
                    select.querySelector('.select-trigger').classList.remove('active');
                    select.querySelector('.select-options').classList.remove('show');
                });
            }
        });
    }
    
    // 카테고리 선택 초기화
    function initializeCategorySelect() {
        const categorySelect = document.getElementById('categorySelect');
        if (!categorySelect) {
            console.log('카테고리 셀렉트를 찾을 수 없습니다.');
            return;
        }
        
        const trigger = categorySelect.querySelector('.select-trigger');
        const options = categorySelect.querySelector('.select-options');
        const hiddenInput = document.getElementById('category');
        const placeholder = categorySelect.querySelector('.select-placeholder');
        
        if (!trigger || !options || !hiddenInput || !placeholder) {
            console.log('카테고리 셀렉트 하위 요소를 찾을 수 없습니다.');
            console.log('trigger:', trigger);
            console.log('options:', options);
            console.log('hiddenInput:', hiddenInput);
            console.log('placeholder:', placeholder);
            return;
        }
        
        console.log('카테고리 선택 초기화 시작');
        
        // 기존 이벤트 리스너 제거를 위해 새로운 요소로 교체
        const newTrigger = trigger.cloneNode(true);
        const newOptions = options.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        options.parentNode.replaceChild(newOptions, options);
        
        // 트리거 클릭 이벤트
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('카테고리 트리거 클릭됨');
            
            // 다른 셀렉트 닫기
            const allSelects = document.querySelectorAll('.custom-select');
            allSelects.forEach(otherSelect => {
                if (otherSelect !== categorySelect) {
                    const otherTrigger = otherSelect.querySelector('.select-trigger');
                    const otherOptions = otherSelect.querySelector('.select-options');
                    if (otherTrigger && otherOptions) {
                        otherTrigger.classList.remove('active');
                        otherOptions.classList.remove('show');
                    }
                }
            });
            
            // 현재 셀렉트 토글
            const isActive = newTrigger.classList.contains('active');
            if (isActive) {
                newTrigger.classList.remove('active');
                newOptions.classList.remove('show');
                console.log('카테고리 드롭다운 닫힘');
            } else {
                newTrigger.classList.add('active');
                newOptions.classList.add('show');
                console.log('카테고리 드롭다운 열림');
            }
        });
        
        // 옵션 클릭 이벤트 (개별 옵션에 직접 이벤트 추가)
        const optionElements = newOptions.querySelectorAll('.select-option');
        console.log('카테고리 옵션 개수:', optionElements.length);
        
        optionElements.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`카테고리 옵션 ${index} 클릭됨:`, option.textContent, option.getAttribute('data-value'));
                
                // 모든 옵션에서 selected 클래스 제거
                optionElements.forEach(opt => opt.classList.remove('selected'));
                
                // 클릭된 옵션에 selected 클래스 추가
                option.classList.add('selected');
                
                // 플레이스홀더 업데이트
                placeholder.textContent = option.textContent;
                placeholder.style.color = '#333';
                
                // 히든 인풋 업데이트
                const selectedValue = option.getAttribute('data-value');
                hiddenInput.value = selectedValue;
                console.log('카테고리 히든 인풋 값 설정:', selectedValue);
                console.log('카테고리 히든 인풋 실제 값 확인:', hiddenInput.value);
                console.log('카테고리 플레이스홀더 텍스트:', placeholder.textContent);
                
                // 셀렉트 닫기
                newTrigger.classList.remove('active');
                newOptions.classList.remove('show');
                
                // 유효성 검사 업데이트
                validateSelectField(categorySelect);
                
                console.log('카테고리 선택 완료:', option.textContent, '값:', selectedValue);
            });
        });
        
        console.log('카테고리 선택 초기화 완료');
    }
    
    // 지역 선택 초기화
    function initializeRegionSelect() {
        const regionSelect = document.getElementById('regionSelect');
        
        if (!regionSelect) return;
        
        // 지역 선택 이벤트
        const regionOptions = regionSelect.querySelectorAll('.select-option');
        regionOptions.forEach(option => {
            option.addEventListener('click', function() {
                const regionValue = this.dataset.value;
                const regionText = this.textContent;
                
                // 지역 값 설정
                document.getElementById('region').value = regionValue;
                
                // 선택된 지역 표시
                const regionTrigger = document.getElementById('regionTrigger');
                regionTrigger.querySelector('.select-placeholder').textContent = regionText;
                
                // 셀렉트 닫기
                regionSelect.querySelector('.select-trigger').classList.remove('active');
                regionSelect.querySelector('.select-options').classList.remove('show');
            });
        });
    }
    
    
    // 셀렉트 필드 유효성 검사
    function validateSelectField(select) {
        let hiddenInput;
        
        // 카테고리 셀렉트의 경우 특별 처리
        if (select.id === 'categorySelect') {
            hiddenInput = document.getElementById('category');
        } else {
            hiddenInput = select.querySelector('input[type="hidden"]');
        }
        
        const trigger = select.querySelector('.select-trigger');
        
        if (hiddenInput && hiddenInput.value) {
            trigger.style.borderColor = '#e9ecef';
        } else {
            trigger.style.borderColor = '#dc3545';
        }
    }
    
    // 시간 선택 옵션 초기화
    function initializeTimeSelects() {
        const hourSelects = document.querySelectorAll('#start_hour, #end_hour');
        const minuteSelects = document.querySelectorAll('#start_minute, #end_minute');
        
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
        const twentyFourHoursCheckbox = document.getElementById('twenty_four_hours');
        const timeSelects = document.querySelectorAll('.time-select');
        
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
    
    // 문자 수 카운터 초기화
    function initializeCharCounters() {
        const reservationNotes = document.getElementById('reservation_notes');
        const charCount = document.getElementById('notes_char_count');
        
        if (reservationNotes && charCount) {
            reservationNotes.addEventListener('input', function() {
                const currentLength = this.value.length;
                charCount.textContent = currentLength;
                
                if (currentLength > 45) {
                    charCount.style.color = '#dc3545';
                } else if (currentLength > 35) {
                    charCount.style.color = '#ffc107';
                } else {
                    charCount.style.color = '#666';
                }
            });
        }
        
        // 제공 서비스 문자 수 카운터
        const providedServices = document.getElementById('providedServices');
        const servicesCharCount = document.getElementById('services_char_count');
        
        if (providedServices && servicesCharCount) {
            providedServices.addEventListener('input', function() {
                const currentLength = this.value.length;
                servicesCharCount.textContent = currentLength;
                
                if (currentLength > 450) {
                    servicesCharCount.style.color = '#dc3545';
                } else if (currentLength > 400) {
                    servicesCharCount.style.color = '#ffc107';
                } else {
                    servicesCharCount.style.color = '#666';
                }
            });
        }
    }
    
    // 파일 업로드 이벤트 리스너
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
            handleFileUpload(files[0]);
        }
    });
    
    // 파일 선택 이벤트
    thumbnailFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    // 파일 업로드 처리 함수
    function handleFileUpload(file) {
        // 파일 유효성 검사
        if (!validateFile(file)) {
            return;
        }
        
        // 기존 파일 제거
        uploadedFiles.innerHTML = '';
        
        // 파일을 images 폴더에 저장
        saveFileToImagesFolder(file);
    }
    
    // 파일을 images 폴더에 저장하는 함수
    function saveFileToImagesFolder(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 고유한 파일명 생성 (타임스탬프 + 원본 파일명)
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const imagePath = `images/${fileName}`;
            
            // File System Access API를 사용하여 파일 저장
            if ('showSaveFilePicker' in window) {
                // 최신 브라우저에서 파일 저장
                saveFileWithFileSystemAPI(file, fileName);
            } else {
                // 구형 브라우저에서는 다운로드로 처리
                downloadFile(file, fileName);
            }
            
            // 미리보기 생성 (실제 저장된 경로 사용)
            const fileItem = createFileItem(file, imagePath);
            uploadedFiles.appendChild(fileItem);
            
            // 로컬 스토리지에 이미지 경로 저장
            saveImagePathToStorage(imagePath, file.name);
        };
        reader.readAsDataURL(file);
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
            // 사용자가 취소한 경우 다운로드로 처리
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
    
    // 파일 유효성 검사
    function validateFile(file) {
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
    function createFileItem(file, previewUrl) {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file';
        
        fileItem.innerHTML = `
            <img src="${previewUrl}" alt="파일 미리보기">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" onclick="removeFile(this)">
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
    window.removeFile = function(button) {
        const fileItem = button.closest('.uploaded-file');
        fileItem.remove();
        thumbnailFile.value = '';
    };
    
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
    experienceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('폼 제출 시도');
        
        try {
            if (validateForm()) {
                console.log('폼 검증 통과');
                // 폼 데이터 수집
                const formData = collectFormData();
                console.log('폼 데이터 수집 완료:', formData);
                
                // 체험단 데이터 저장
                console.log('체험단 데이터 저장 시작');
                saveExperienceData(formData);
                console.log('체험단 데이터 저장 완료');
                
                // 성공 메시지 표시
                showSuccessMessage();
                
                // 관리자 센터 새로고침 (열려있는 경우)
                if (window.opener && window.opener.loadApprovalData) {
                    try {
                        window.opener.loadApprovalData();
                        window.opener.loadDashboardData();
                        console.log('관리자 센터 데이터 새로고침 완료');
                    } catch (error) {
                        console.error('관리자 센터 새로고침 중 오류:', error);
                    }
                } else {
                    console.log('관리자 센터가 열려있지 않거나 loadApprovalData 함수가 없습니다.');
                }
            } else {
                console.log('폼 검증 실패');
                alert('필수 항목을 모두 입력해주세요.');
            }
        } catch (error) {
            console.error('폼 제출 중 오류 발생:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
    
    // 폼 유효성 검사
    function validateForm() {
        console.log('폼 검증 시작');
        const requiredFields = experienceForm.querySelectorAll('[required]');
        let isValid = true;
        console.log('필수 필드 개수:', requiredFields.length);
        
        requiredFields.forEach(field => {
            console.log('필드 검증:', field.id, field.type, field.value);
            
            if (field.type === 'hidden') {
                // 커스텀 셀렉트의 히든 인풋 처리
                if (!field.value) {
                    console.log('히든 필드 검증 실패:', field.id);
                    const select = field.closest('.custom-select');
                    if (select) {
                        const trigger = select.querySelector('.select-trigger');
                        trigger.style.borderColor = '#dc3545';
                        isValid = false;
                    }
                } else {
                    const select = field.closest('.custom-select');
                    if (select) {
                        const trigger = select.querySelector('.select-trigger');
                        trigger.style.borderColor = '#e9ecef';
                    }
                }
            } else if (field.type === 'file') {
                // 파일 필드 처리
                if (!field.files.length) {
                    console.log('파일 필드 검증 실패:', field.id);
                    isValid = false;
                }
            } else if (!field.value.trim()) {
                console.log('텍스트 필드 검증 실패:', field.id);
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#e9ecef';
            }
        });
        
        // 전화번호 유효성 검사
        const phone1 = document.getElementById('phone1').value;
        const phone2 = document.getElementById('phone2').value;
        const phone3 = document.getElementById('phone3').value;
        
        if (phone1 !== '010' || phone2.length !== 4 || phone3.length !== 4) {
            alert('올바른 전화번호를 입력해주세요. (010-XXXX-XXXX 형식)');
            isValid = false;
        }
        
        // 날짜 유효성 검사
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            alert('모집 마감일은 시작일보다 늦어야 합니다.');
            isValid = false;
        }
        
        // 채널 선택 검사
        const selectedChannel = document.querySelector('input[name="channel"]:checked');
        if (!selectedChannel) {
            alert('채널을 선택해주세요.');
            isValid = false;
        }
        
        // 지역 선택 검사
        const region = document.getElementById('region');
        if (!region || !region.value) {
            alert('지역을 선택해주세요.');
            isValid = false;
        }
        
        
        // 파일 업로드 검사는 위의 requiredFields 루프에서 처리됨
        
        console.log('폼 검증 결과:', isValid);
        return isValid;
    }
    
    // 폼 데이터 수집
    function collectFormData() {
        const formData = new FormData();
        
        // 기본 정보
        const companyName = document.getElementById('companyName');
        if (companyName) formData.append('companyName', companyName.value);
        
        // 지역 정보
        const region = document.getElementById('region');
        if (region) formData.append('region', region.value);
        
        // URL 정보
        const naverMapUrl = document.getElementById('naver_map_url');
        if (naverMapUrl) formData.append('url', naverMapUrl.value);
        
        // 파일 - 이미지 경로 처리
        const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        if (uploadedImages.length > 0) {
            const latestImage = uploadedImages[uploadedImages.length - 1];
            formData.append('thumbnail', latestImage.path);
        } else {
            formData.append('thumbnail', 'https://via.placeholder.com/300x220/9B59B6/FFFFFF?text=이미지');
        }
        
        // 연락처
        const phone1 = document.getElementById('phone1');
        const phone2 = document.getElementById('phone2');
        const phone3 = document.getElementById('phone3');
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
        const experienceTitle = document.getElementById('experienceTitle');
        if (experienceTitle) formData.append('experienceTitle', experienceTitle.value);
        
        const experienceDescription = document.getElementById('experienceDescription');
        if (experienceDescription) formData.append('experienceDescription', experienceDescription.value);
        
        const experienceType = document.getElementById('experienceType');
        if (experienceType) formData.append('experienceType', experienceType.value);
        
        const participantCount = document.getElementById('participantCount');
        if (participantCount) formData.append('participantCount', participantCount.value);
        
        const startDate = document.getElementById('startDate');
        if (startDate) formData.append('startDate', startDate.value);
        
        const endDate = document.getElementById('endDate');
        if (endDate) formData.append('endDate', endDate.value);
        
        const providedServices = document.getElementById('providedServices');
        if (providedServices) formData.append('providedServices', providedServices.value);
        
        // 카테고리 추가
        const category = document.getElementById('category');
        const categorySelect = document.getElementById('categorySelect');
        const categoryPlaceholder = categorySelect ? categorySelect.querySelector('.select-placeholder') : null;
        
        console.log('카테고리 수집 시작');
        console.log('카테고리 히든 인풋:', category);
        console.log('카테고리 히든 인풋 값:', category ? category.value : '없음');
        console.log('카테고리 플레이스홀더:', categoryPlaceholder ? categoryPlaceholder.textContent : '없음');
        
        if (category && category.value) {
            console.log('카테고리 값 수집:', category.value);
            formData.append('category', category.value);
        } else {
            console.log('카테고리 값이 비어있습니다. 기본값 사용');
            formData.append('category', 'other'); // 기본값으로 'other' 사용
        }
        
        // 추가 정보
        const location = document.getElementById('location');
        if (location) formData.append('location', location.value);
        
        const serviceDetails = document.getElementById('service_details');
        if (serviceDetails) formData.append('service_details', serviceDetails.value);
        
        // 키워드
        const keyword1 = document.getElementById('keyword1');
        if (keyword1) formData.append('keyword1', keyword1.value);
        
        const keyword2 = document.getElementById('keyword2');
        if (keyword2) formData.append('keyword2', keyword2.value);
        
        const keyword3 = document.getElementById('keyword3');
        if (keyword3) formData.append('keyword3', keyword3.value);
        
        // 예약 시 주의사항
        const reservationNotes = document.getElementById('reservation_notes');
        if (reservationNotes) formData.append('reservationNotes', reservationNotes.value);
        
        return formData;
    }
    
    // 성공 메시지 표시
    function showSuccessMessage() {
        console.log('showSuccessMessage 함수 시작');
        const submitBtn = experienceForm.querySelector('.btn-primary');
        
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '등록 중...';
            submitBtn.disabled = true;
            console.log('제출 버튼 상태 변경됨');
        }
        
        // 성공 메시지 표시
        setTimeout(() => {
            try {
                console.log('성공 메시지 표시 시작');
                showRegistrationSuccess();
                console.log('성공 메시지 표시 완료');
                
                // 폼 초기화
                document.getElementById('experienceForm').reset();
                uploadedFiles.innerHTML = '';
                localStorage.removeItem('uploadedImages');
                
                // 메인 페이지로 이동
                setTimeout(() => {
                    window.location.href = 'index.html?registered=true';
                }, 2000);
            } catch (error) {
                console.error('성공 메시지 표시 중 오류 발생:', error);
                alert('체험단 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
                
                // 버튼 상태 복원
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        }, 1000);
    }
    
    // 체험단 데이터 저장
    function saveExperienceData(data) {
        console.log('saveExperienceData 함수 시작');
        console.log('받은 데이터:', data);
        
        // localStorage에 체험단 데이터 저장
        const existingExperiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        console.log('기존 체험단 개수:', existingExperiences.length);
        
        const newExperience = {
            id: Date.now().toString(),
            title: data.get('experienceTitle') || '체험단 제목',
            category: getCategoryName(data.get('category')),
            type: getExperienceTypeName(data.get('experienceType')),
            channel: getChannelName(data.get('channel')),
            contactPhone: data.get('contactPhone') || '미입력',
            thumbnail: data.get('thumbnailFile') ? URL.createObjectURL(data.get('thumbnailFile')) : 'https://via.placeholder.com/200x200/9B59B6/FFFFFF?text=실',
            price: data.get('providedServices') || data.get('service_details') || '체험단 상세 정보',
            company: data.get('companyName') || '회사명',
            companyName: data.get('companyName') || '회사명',
            description: data.get('experienceDescription') || '체험단 설명',
            participantCount: data.get('participantCount') || '10',
            startDate: data.get('startDate') || new Date().toISOString().split('T')[0],
            endDate: data.get('endDate') || new Date().toISOString().split('T')[0],
            experienceSchedule: calculateExperienceSchedule(data.get('endDate')) || '',
            experienceStartDate: calculateExperienceStartDate(data.get('endDate')),
            experienceEndDate: calculateExperienceEndDate(data.get('endDate')),
            providedServices: data.get('providedServices') || '',
            location: data.get('location') || '',
            serviceDetails: data.get('service_details') || '',
            region: data.get('region') || '',
            url: data.get('url') || '',
            status: 'pending', // 승인 상태: pending(대기), approved(승인), rejected(거절)
            isPopular: false,
            isPremium: false,
            premiumPoint: 0,
            premiumDescription: '',
            approvedAt: null, // 승인일
            createdAt: new Date().toISOString(), // 등록일
            keywords: [
                data.get('keyword1') || '',
                data.get('keyword2') || '',
                data.get('keyword3') || ''
            ].filter(k => k),
            availableDays: getSelectedDays(),
            startTime: isTwentyFourHours() ? '24시간' : getFormattedTime(data.get('start_hour'), data.get('start_minute')),
            endTime: isTwentyFourHours() ? '24시간' : getFormattedTime(data.get('end_hour'), data.get('end_minute')),
            address: data.get('location') || '',
            reservationNotes: data.get('reservationNotes') || ''
        };
        
        console.log('새 체험단 데이터:', newExperience);
        
        existingExperiences.unshift(newExperience); // 최신 항목을 맨 앞에 추가
        console.log('업데이트된 체험단 배열:', existingExperiences);
        
        localStorage.setItem('experiences', JSON.stringify(existingExperiences));
        console.log('localStorage에 저장 완료');
        console.log('새 체험단 상태:', newExperience.status);
        console.log('새 체험단 등록일:', newExperience.createdAt);
        
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
    function getSelectedDays() {
        const selectedDays = [];
        const dayCheckboxes = document.querySelectorAll('input[name="available_days"]:checked');
        
        dayCheckboxes.forEach(checkbox => {
            selectedDays.push(checkbox.value);
        });
        
        return selectedDays;
    }
    
    // 시간 포맷팅 함수
    function getFormattedTime(hour, minute) {
        if (!hour || !minute) return '';
        return `${hour}:${minute}`;
    }
    
    // 24시간 영업 여부 확인
    function isTwentyFourHours() {
        const twentyFourHoursCheckbox = document.getElementById('twenty_four_hours');
        return twentyFourHoursCheckbox && twentyFourHoursCheckbox.checked;
    }

    // 지역 선택 시 구/군 옵션 업데이트
    function updateDistrictOptions() {
        const regionSelect = document.getElementById('region');
        const districtSelect = document.getElementById('district');
        const selectedRegion = regionSelect.value;
        
        // 구/군 옵션 초기화
        districtSelect.innerHTML = '<option value="">구/군을 선택하세요</option>';
        
        if (selectedRegion === 'seoul') {
            const seoulDistricts = [
                { value: 'gangnam', text: '강남구' },
                { value: 'gangdong', text: '강동구' },
                { value: 'gangbuk', text: '강북구' },
                { value: 'gangseo', text: '강서구' },
                { value: 'gwanak', text: '관악구' },
                { value: 'gwangjin', text: '광진구' },
                { value: 'guro', text: '구로구' },
                { value: 'geumcheon', text: '금천구' },
                { value: 'nowon', text: '노원구' },
                { value: 'dobong', text: '도봉구' },
                { value: 'dongdaemun', text: '동대문구' },
                { value: 'dongjak', text: '동작구' },
                { value: 'mapo', text: '마포구' },
                { value: 'seodaemun', text: '서대문구' },
                { value: 'seocho', text: '서초구' },
                { value: 'seongdong', text: '성동구' },
                { value: 'seongbuk', text: '성북구' },
                { value: 'songpa', text: '송파구' },
                { value: 'yangcheon', text: '양천구' },
                { value: 'yeongdeungpo', text: '영등포구' },
                { value: 'yongsan', text: '용산구' },
                { value: 'eunpyeong', text: '은평구' },
                { value: 'jongno', text: '종로구' },
                { value: 'jung', text: '중구' },
                { value: 'jungnang', text: '중랑구' }
            ];
            
            seoulDistricts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.value;
                option.textContent = district.text;
                districtSelect.appendChild(option);
            });
            
            districtSelect.style.display = 'block';
        } else {
            districtSelect.style.display = 'none';
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
    
    // 등록 성공 메시지 표시
    function showRegistrationSuccess() {
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
    
    // 이전 체험단 불러오기 버튼
    const loadPreviousBtn = document.querySelector('.load-previous-btn');
    loadPreviousBtn.addEventListener('click', () => {
        // 실제로는 서버에서 이전 데이터를 가져와야 함
        alert('이전 체험단 불러오기 기능은 준비 중입니다.');
    });
    
    // 취소 버튼
    const cancelBtn = experienceForm.querySelector('.btn-secondary');
    cancelBtn.addEventListener('click', () => {
        if (confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
            window.location.href = 'index.html';
        }
    });
    
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    
    // 최소 날짜 설정
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
    
    // 시작일 변경 시 마감일 최소값 업데이트
    document.getElementById('startDate').addEventListener('change', (e) => {
        document.getElementById('endDate').setAttribute('min', e.target.value);
    });
});

// 검색 페이지로 이동
function goToSearch() {
    window.location.href = 'search.html';
}
