// 언어 선택 컴포넌트

function createLanguageSelector() {
    const selector = document.createElement('div');
    selector.className = 'language-selector-container';
    
    selector.innerHTML = `
        <select class="language-selector" onchange="changeLanguage(this.value)">
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
        </select>
    `;
    
    return selector;
}

// 언어 선택 스타일
const languageSelectorStyle = `
.language-selector-container {
    position: relative;
    display: inline-block;
}

.language-selector {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
}

.language-selector:hover {
    border-color: #007bff;
    box-shadow: 0 2px 4px rgba(0,123,255,0.1);
}

.language-selector:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

/* 헤더에 언어 선택기가 있을 때의 스타일 */
.header .language-selector-container {
    margin-left: auto;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
    .language-selector {
        font-size: 12px;
        padding: 6px 8px;
        min-width: 70px;
    }
}

/* 네비게이션에 언어 선택기가 있을 때 */
.nav-links .language-selector-container {
    margin-left: 15px;
}

.nav .language-selector-container {
    margin-left: 15px;
}
`;

// 스타일 추가
function addLanguageSelectorStyles() {
    if (!document.getElementById('language-selector-styles')) {
        const style = document.createElement('style');
        style.id = 'language-selector-styles';
        style.textContent = languageSelectorStyle;
        document.head.appendChild(style);
    }
}

// 언어 선택기를 헤더에 추가 (비활성화)
function addLanguageSelectorToHeader() {
    // 헤더에 언어 선택기 추가하지 않음
}

// 언어 선택기를 네비게이션에 추가 (비활성화)
function addLanguageSelectorToNav() {
    // 네비게이션에 언어 선택기 추가하지 않음
}

// 페이지 로드 시 언어 선택기 초기화 (비활성화)
document.addEventListener('DOMContentLoaded', function() {
    // 기존 언어 선택기들 제거
    const existingSelectors = document.querySelectorAll('.language-selector-container');
    existingSelectors.forEach(selector => {
        selector.remove();
    });
});
