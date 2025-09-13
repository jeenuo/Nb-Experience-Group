// Guide Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // FAQ 아이템 클릭 이벤트
    initializeFAQ();
    
    // 검색 기능
    initializeSearch();
    
    // 언어 선택 기능
    initializeLanguageSelector();
});

// FAQ 기능 초기화
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 다른 모든 FAQ 아이템 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 아이템 토글
            item.classList.toggle('active');
        });
    });
}

// 검색 기능 초기화
function initializeSearch() {
    const searchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 검색어가 없으면 모든 아이템 표시
            faqItems.forEach(item => {
                item.style.display = 'block';
                item.classList.remove('search-highlight');
            });
            return;
        }
        
        // 검색어가 있으면 필터링
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-question span:nth-child(2)').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
                
                // 검색어 하이라이트
                highlightSearchTerm(item, searchTerm);
            } else {
                item.style.display = 'none';
                item.classList.remove('search-highlight');
            }
        });
        
        // 검색 결과가 있으면 첫 번째 결과 열기
        const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
        if (visibleItems.length > 0) {
            // 다른 모든 아이템 닫기
            faqItems.forEach(item => item.classList.remove('active'));
            // 첫 번째 결과 열기
            visibleItems[0].classList.add('active');
        }
    });
}

// 검색어 하이라이트
function highlightSearchTerm(item, searchTerm) {
    const questionElement = item.querySelector('.faq-question span:nth-child(2)');
    const answerElement = item.querySelector('.faq-answer p');
    
    // 기존 하이라이트 제거
    removeHighlight(questionElement);
    removeHighlight(answerElement);
    
    // 새로운 하이라이트 적용
    highlightText(questionElement, searchTerm);
    highlightText(answerElement, searchTerm);
}

// 텍스트 하이라이트
function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = text.replace(regex, '<mark class="search-mark">$1</mark>');
    element.innerHTML = highlightedText;
}

// 하이라이트 제거
function removeHighlight(element) {
    const marks = element.querySelectorAll('.search-mark');
    marks.forEach(mark => {
        mark.outerHTML = mark.textContent;
    });
}

// 언어 선택 기능 초기화
function initializeLanguageSelector() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLanguage = document.getElementById('currentLanguage');
    
    // 언어 버튼 클릭 이벤트
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // 언어 옵션 클릭 이벤트
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const langText = this.querySelector('span:last-child').textContent;
            
            // 현재 언어 업데이트
            currentLanguage.textContent = langText;
            
            // 드롭다운 닫기
            languageDropdown.classList.remove('show');
            
            // 언어 변경 처리
            changeLanguage(lang);
        });
    });
    
    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('show');
    });
}

// 언어 변경 처리
function changeLanguage(lang) {
    // 여기에 다국어 처리 로직을 추가할 수 있습니다
    console.log('Language changed to:', lang);
    
    // 예시: 한국어로 고정 (실제로는 다국어 지원 구현)
    if (lang !== 'ko') {
        alert('현재 한국어만 지원됩니다. 곧 다국어 지원을 추가할 예정입니다.');
    }
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션할 요소들 관찰
    const animatedElements = document.querySelectorAll('.question-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 페이지 로드 시 스크롤 애니메이션 초기화
window.addEventListener('load', function() {
    initializeScrollAnimations();
});

// 검색 결과 하이라이트 스타일 추가
const searchHighlightStyle = document.createElement('style');
searchHighlightStyle.textContent = `
    .search-mark {
        background-color: #ffeb3b;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    .search-highlight {
        background-color: #fff3e0 !important;
        border-left: 4px solid #E91E63;
        padding-left: 15px;
    }
    
    .search-highlight .faq-question {
        background-color: #fff3e0;
    }
`;
document.head.appendChild(searchHighlightStyle);

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
    const activeItem = document.querySelector('.faq-item.active');
    const allItems = Array.from(document.querySelectorAll('.faq-item'));
    
    if (!activeItem) return;
    
    const currentIndex = allItems.indexOf(activeItem);
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < allItems.length - 1) {
                allItems[currentIndex + 1].classList.add('active');
                allItems[currentIndex].classList.remove('active');
                allItems[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
                allItems[currentIndex - 1].classList.add('active');
                allItems[currentIndex].classList.remove('active');
                allItems[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            activeItem.classList.toggle('active');
            break;
    }
});

// FAQ 아이템에 포커스 가능하도록 설정
document.querySelectorAll('.faq-question').forEach(question => {
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    
    question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
});

// 검색 페이지로 이동
function goToSearch() {
    window.location.href = 'search.html';
}

