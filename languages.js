// 다국어 지원 언어 설정 파일

const languages = {
    ko: {
        // 네비게이션
        'nav.main': '메인',
        'nav.hotplace': '핫플 맛집',
        'nav.experience': '체험단 모집',
        'nav.review': '이달의 리뷰',
        'nav.guide': '이용가이드',
        'nav.search': '검색',
        'nav.login': '로그인',
        'nav.logout': '로그아웃',
        'nav.profile': '회원정보',
        'nav.admin': '관리자 센터',
        'nav.language': '언어',
        
        // 메인 페이지
        'main.title': '체험단 모집 플랫폼',
        'main.subtitle': '인플루언서와 사업자를 연결하는 플랫폼',
        'main.search_placeholder': '지역, 카테고리, 키워드로 검색하세요',
        'main.search_button': '검색',
        'main.experience_list': '체험단 목록',
        'main.no_experience': '등록된 체험단이 없습니다.',
        'main.apply_button': '지원하기',
        'main.view_details': '상세보기',
        'main.deadline': '마감일',
        'main.participants': '신청자',
        
        // 로그인 관련
        'login.title': '로그인',
        'login.subtitle': '계정에 로그인하세요',
        'login.email': '이메일',
        'login.password': '비밀번호',
        'login.login_button': '로그인',
        'login.register_button': '회원가입',
        'login.forgot_password': '비밀번호 찾기',
        'login.user_type': '사용자 유형',
        'login.user_type.normal': '일반 사용자',
        'login.user_type.business': '자영업자',
        'login.user_type.admin': '관리자',
        'login.remember_me': '로그인 상태 유지',
        'login.login_success': '로그인되었습니다.',
        'login.login_error': '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
        'login.logout_success': '로그아웃되었습니다.',
        'login.required_email': '이메일을 입력해주세요.',
        'login.required_password': '비밀번호를 입력해주세요.',
        'login.invalid_email': '올바른 이메일 형식이 아닙니다.',
        'login.welcome_back': '다시 오신 것을 환영합니다!',
        'login.email_placeholder': '이메일 또는 이메일 @ 앞부분을 입력하세요',
        'login.password_placeholder': '비밀번호를 입력하세요',
        'login.sns_login': 'SNS 간편로그인',
        'login.naver_login': '네이버 로그인',
        'login.instagram_login': '인스타 로그인',
        'login.admin_link': '관리자 센터 바로가기',
        
        // 회원가입 관련
        'register.title': '회원가입',
        'register.subtitle': '새 계정을 만드세요',
        'register.name': '이름',
        'register.email': '이메일',
        'register.password': '비밀번호',
        'register.confirm_password': '비밀번호 확인',
        'register.phone': '전화번호',
        'register.birth_date': '생년월일',
        'register.gender': '성별',
        'register.gender.male': '남성',
        'register.gender.female': '여성',
        'register.gender.other': '기타',
        'register.terms': '이용약관 동의',
        'register.privacy': '개인정보처리방침 동의',
        'register.marketing': '마케팅 정보 수신 동의',
        'register.register_button': '회원가입',
        'register.register_success': '회원가입이 완료되었습니다.',
        'register.register_error': '회원가입에 실패했습니다.',
        'register.password_mismatch': '비밀번호가 일치하지 않습니다.',
        'register.email_exists': '이미 사용 중인 이메일입니다.',
        
        // 체험단 관련
        'experience.title': '체험단 제목',
        'experience.company': '회사명',
        'experience.category': '카테고리',
        'experience.region': '지역',
        'experience.type': '체험 유형',
        'experience.channel': '채널',
        'experience.deadline': '모집 마감일',
        'experience.start_date': '모집 시작일',
        'experience.end_date': '모집 마감일',
        'experience.experience_start': '체험 시작일',
        'experience.experience_end': '체험 종료일',
        'experience.participants': '모집 인원',
        'experience.description': '체험단 설명',
        'experience.provided_services': '제공 내역',
        'experience.keywords': '홍보 키워드',
        'experience.location': '위치',
        'experience.contact': '연락처',
        'experience.address': '상세 주소',
        'experience.schedule': '체험 일정',
        'experience.available_days': '방문 가능 요일',
        'experience.available_time': '방문 가능 시간',
        'experience.reservation_notes': '예약 시 주의사항',
        
        // 카테고리
        'category.restaurant': '맛집',
        'category.cafe': '카페',
        'category.accommodation': '숙박',
        'category.travel': '여행',
        'category.beauty': '뷰티',
        'category.fashion': '패션',
        'category.health': '건강',
        'category.sports': '스포츠',
        'category.culture': '문화',
        'category.other': '기타',
        
        // 체험 유형
        'type.visit': '방문형',
        'type.delivery': '배송형',
        'type.packaging': '포장형',
        'type.online': '온라인',
        'type.journalist': '기자단',
        
        // 채널
        'channel.blog': '블로그',
        'channel.reels': '릴스',
        'channel.instagram': '인스타그램',
        'channel.youtube': '유튜브',
        'channel.xiaohongshu': '샤오홍슈',
        'channel.blog_clip': '블로그+클립',
        'channel.shorts': '쇼츠',
        'channel.clip': '클립',
        'channel.tiktok': '틱톡',
        'channel.twitter': 'X(트위터)',
        
        // 지역
        'region.seoul': '서울',
        'region.busan': '부산',
        'region.daegu': '대구',
        'region.incheon': '인천',
        'region.gwangju': '광주',
        'region.daejeon': '대전',
        'region.ulsan': '울산',
        'region.sejong': '세종',
        'region.gyeonggi': '경기',
        'region.gangwon': '강원',
        'region.chungbuk': '충북',
        'region.chungnam': '충남',
        'region.jeonbuk': '전북',
        'region.jeonnam': '전남',
        'region.gyeongbuk': '경북',
        'region.gyeongnam': '경남',
        'region.jeju': '제주',
        
        // 버튼 및 액션
        'button.register': '등록하기',
        'button.cancel': '취소',
        'button.save': '저장',
        'button.delete': '삭제',
        'button.edit': '수정',
        'button.search': '검색',
        'button.reset': '초기화',
        'button.apply': '지원하기',
        'button.close': '닫기',
        'button.submit': '제출',
        'button.back': '뒤로가기',
        'button.next': '다음으로',
        'button.confirm': '확인',
        'button.approve': '승인',
        'button.reject': '거절',
        
        // 상태
        'status.pending': '대기중',
        'status.approved': '승인됨',
        'status.rejected': '거절됨',
        'status.active': '진행중',
        'status.completed': '완료됨',
        
        // 메시지
        'message.success': '성공적으로 처리되었습니다.',
        'message.error': '오류가 발생했습니다.',
        'message.required_field': '필수 입력 항목입니다.',
        'message.invalid_format': '올바른 형식이 아닙니다.',
        'message.login_required': '로그인이 필요합니다.',
        'message.permission_denied': '권한이 없습니다.',
        'message.confirm_delete': '정말 삭제하시겠습니까?',
        'message.data_saved': '데이터가 저장되었습니다.',
        'message.data_deleted': '데이터가 삭제되었습니다.',
        'message.preparing': '기능은 준비 중입니다.',
        
        // 폼 관련
        'form.required': '필수 입력 항목',
        'form.optional': '선택 입력 항목',
        'form.select_option': '선택해주세요',
        'form.enter_text': '텍스트를 입력하세요',
        'form.upload_file': '파일을 업로드하세요',
        'form.max_length': '최대 {0}자까지 입력 가능',
        'form.min_length': '최소 {0}자 이상 입력하세요',
        
        // 날짜 및 시간
        'date.today': '오늘',
        'date.yesterday': '어제',
        'date.tomorrow': '내일',
        'time.24hours': '24시간',
        'time.morning': '오전',
        'time.afternoon': '오후',
        'time.evening': '저녁',
        'time.night': '밤',
        
        // 요일
        'day.monday': '월',
        'day.tuesday': '화',
        'day.wednesday': '수',
        'day.thursday': '목',
        'day.friday': '금',
        'day.saturday': '토',
        'day.sunday': '일',
        
        // 가이드 페이지
        'guide.help_title': '무엇을 도와드릴까요?',
        'guide.search_placeholder': '체험단 연장, 취소, 리뷰, 포인트, 선정',
        'guide.q1_title': '체험단 연장은 어떻게 하나요?',
        'guide.q1_answer': '체험단 연장 신청은 체험단 상세 페이지에서 신청 가능합니다. 신청 상태를 확인하고 연장 신청을 진행해주세요. 단, 일부 체험단의 경우 연장이 불가능할 수 있습니다.',
        'guide.q2_title': '체험단 취소는 언제까지 가능한가요?',
        'guide.q2_answer': '체험단 취소는 체험 시작 3일 전까지 가능합니다. 그 이후 취소 시에는 포인트가 차감될 수 있습니다.',
        'guide.q3_title': '리뷰 작성은 필수인가요?',
        'guide.q3_answer': '네, 체험 완료 후 리뷰 작성은 필수입니다. 리뷰 미작성 시 다음 체험단 신청이 제한될 수 있습니다.',
        'guide.q4_title': '포인트는 어떻게 적립되나요?',
        'guide.q4_answer': '체험 완료 및 리뷰 작성 완료 시 자동으로 포인트가 적립됩니다. 포인트는 다음 체험단 신청 시 사용할 수 있습니다.',
        'guide.q5_title': '체험단 선정 기준은 무엇인가요?',
        'guide.q5_answer': '체험단 선정은 신청자 수, 지역, 관심사, 이전 리뷰 품질 등을 종합적으로 고려하여 선정됩니다.',
        
        // 핫플레이스 페이지
        'hotplace.title': '핫플 맛집',
        'hotplace.subtitle': '인기 맛집을 찾아보세요',
        'hotplace.search_placeholder': '지역, 음식 종류로 검색하세요',
        'hotplace.category.all': '전체',
        'hotplace.category.korean': '한식',
        'hotplace.category.chinese': '중식',
        'hotplace.category.japanese': '일식',
        'hotplace.category.western': '양식',
        'hotplace.category.cafe': '카페',
        'hotplace.category.dessert': '디저트',
        'hotplace.rating': '평점',
        'hotplace.reviews': '리뷰',
        'hotplace.address': '주소',
        'hotplace.phone': '전화번호',
        'hotplace.hours': '영업시간',
        
        // 리뷰 페이지
        'reviews.title': '이달의 리뷰',
        'reviews.subtitle': '베스트 체험단 리뷰를 확인하세요',
        'reviews.monthly_best': '이달의 베스트 리뷰',
        'reviews.featured_review': '추천 리뷰',
        'reviews.review_count': '리뷰 수',
        'reviews.helpful': '도움됨',
        'reviews.rating': '평점',
        'reviews.writer': '작성자',
        'reviews.date': '작성일',
        'reviews.experience': '체험 내용',
        'reviews.impression': '인상',
        'reviews.recommend': '추천',
        
        // 검색 페이지
        'search.title': '체험단 검색',
        'search.subtitle': '원하는 체험단을 찾아보세요',
        'search.filters': '필터',
        'search.category': '카테고리',
        'search.region': '지역',
        'search.type': '체험 유형',
        'search.channel': '채널',
        'search.results': '검색 결과',
        'search.no_results': '검색 결과가 없습니다',
        'search.sort_by': '정렬',
        'search.sort.latest': '최신순',
        'search.sort.popular': '인기순',
        'search.sort.rating': '평점순',
        'search.sort.deadline': '마감일순'
    },
    
    en: {
        // Navigation
        'nav.main': 'Main',
        'nav.hotplace': 'Hot Places',
        'nav.experience': 'Experience Recruitment',
        'nav.review': 'Review of the Month',
        'nav.guide': 'User Guide',
        'nav.search': 'Search',
        'nav.login': 'Login',
        'nav.logout': 'Logout',
        'nav.profile': 'Profile',
        'nav.admin': 'Admin Center',
        'nav.language': 'Language',
        
        // Main page
        'main.title': 'Experience Recruitment Platform',
        'main.subtitle': 'Connecting Influencers and Businesses',
        'main.search_placeholder': 'Search by region, category, keywords',
        'main.search_button': 'Search',
        'main.experience_list': 'Experience List',
        'main.no_experience': 'No registered experiences.',
        'main.apply_button': 'Apply',
        'main.view_details': 'View Details',
        'main.deadline': 'Deadline',
        'main.participants': 'Participants',
        
        // Login related
        'login.title': 'Login',
        'login.subtitle': 'Sign in to your account',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.login_button': 'Login',
        'login.register_button': 'Register',
        'login.forgot_password': 'Forgot Password',
        'login.user_type': 'User Type',
        'login.user_type.normal': 'General User',
        'login.user_type.business': 'Business Owner',
        'login.user_type.admin': 'Administrator',
        'login.remember_me': 'Remember me',
        'login.login_success': 'You have been logged in.',
        'login.login_error': 'Login failed. Please check your email and password.',
        'login.logout_success': 'You have been logged out.',
        'login.required_email': 'Please enter your email.',
        'login.required_password': 'Please enter your password.',
        'login.invalid_email': 'Invalid email format.',
        'login.welcome_back': 'Welcome back!',
        'login.email_placeholder': 'Enter email or email prefix',
        'login.password_placeholder': 'Enter your password',
        'login.sns_login': 'SNS Easy Login',
        'login.naver_login': 'Naver Login',
        'login.instagram_login': 'Instagram Login',
        'login.admin_link': 'Go to Admin Center',
        
        // Registration related
        'register.title': 'Register',
        'register.subtitle': 'Create a new account',
        'register.name': 'Name',
        'register.email': 'Email',
        'register.password': 'Password',
        'register.confirm_password': 'Confirm Password',
        'register.phone': 'Phone Number',
        'register.birth_date': 'Date of Birth',
        'register.gender': 'Gender',
        'register.gender.male': 'Male',
        'register.gender.female': 'Female',
        'register.gender.other': 'Other',
        'register.terms': 'Terms of Service Agreement',
        'register.privacy': 'Privacy Policy Agreement',
        'register.marketing': 'Marketing Information Consent',
        'register.register_button': 'Register',
        'register.register_success': 'Registration completed successfully.',
        'register.register_error': 'Registration failed.',
        'register.password_mismatch': 'Passwords do not match.',
        'register.email_exists': 'Email is already in use.',
        
        // Experience related
        'experience.title': 'Experience Title',
        'experience.company': 'Company Name',
        'experience.category': 'Category',
        'experience.region': 'Region',
        'experience.type': 'Experience Type',
        'experience.channel': 'Channel',
        'experience.deadline': 'Recruitment Deadline',
        'experience.start_date': 'Recruitment Start Date',
        'experience.end_date': 'Recruitment End Date',
        'experience.experience_start': 'Experience Start Date',
        'experience.experience_end': 'Experience End Date',
        'experience.participants': 'Recruitment Count',
        'experience.description': 'Experience Description',
        'experience.provided_services': 'Provided Services',
        'experience.keywords': 'Promotional Keywords',
        'experience.location': 'Location',
        'experience.contact': 'Contact',
        'experience.address': 'Detailed Address',
        'experience.schedule': 'Experience Schedule',
        'experience.available_days': 'Available Days',
        'experience.available_time': 'Available Time',
        'experience.reservation_notes': 'Reservation Notes',
        
        // Categories
        'category.restaurant': 'Restaurant',
        'category.cafe': 'Cafe',
        'category.accommodation': 'Accommodation',
        'category.travel': 'Travel',
        'category.beauty': 'Beauty',
        'category.fashion': 'Fashion',
        'category.health': 'Health',
        'category.sports': 'Sports',
        'category.culture': 'Culture',
        'category.other': 'Other',
        
        // Experience types
        'type.visit': 'Visit Type',
        'type.delivery': 'Delivery Type',
        'type.packaging': 'Packaging Type',
        'type.online': 'Online',
        'type.journalist': 'Journalist',
        
        // Channels
        'channel.blog': 'Blog',
        'channel.reels': 'Reels',
        'channel.instagram': 'Instagram',
        'channel.youtube': 'YouTube',
        'channel.xiaohongshu': 'Xiaohongshu',
        'channel.blog_clip': 'Blog+Clip',
        'channel.shorts': 'Shorts',
        'channel.clip': 'Clip',
        'channel.tiktok': 'TikTok',
        'channel.twitter': 'X (Twitter)',
        
        // Regions
        'region.seoul': 'Seoul',
        'region.busan': 'Busan',
        'region.daegu': 'Daegu',
        'region.incheon': 'Incheon',
        'region.gwangju': 'Gwangju',
        'region.daejeon': 'Daejeon',
        'region.ulsan': 'Ulsan',
        'region.sejong': 'Sejong',
        'region.gyeonggi': 'Gyeonggi',
        'region.gangwon': 'Gangwon',
        'region.chungbuk': 'Chungbuk',
        'region.chungnam': 'Chungnam',
        'region.jeonbuk': 'Jeonbuk',
        'region.jeonnam': 'Jeonnam',
        'region.gyeongbuk': 'Gyeongbuk',
        'region.gyeongnam': 'Gyeongnam',
        'region.jeju': 'Jeju',
        
        // Buttons and actions
        'button.register': 'Register',
        'button.cancel': 'Cancel',
        'button.save': 'Save',
        'button.delete': 'Delete',
        'button.edit': 'Edit',
        'button.search': 'Search',
        'button.reset': 'Reset',
        'button.apply': 'Apply',
        'button.close': 'Close',
        'button.submit': 'Submit',
        'button.back': 'Back',
        'button.next': 'Next',
        'button.confirm': 'Confirm',
        'button.approve': 'Approve',
        'button.reject': 'Reject',
        
        // Status
        'status.pending': 'Pending',
        'status.approved': 'Approved',
        'status.rejected': 'Rejected',
        'status.active': 'Active',
        'status.completed': 'Completed',
        
        // Messages
        'message.success': 'Successfully processed.',
        'message.error': 'An error occurred.',
        'message.required_field': 'This is a required field.',
        'message.invalid_format': 'Invalid format.',
        'message.login_required': 'Login required.',
        'message.permission_denied': 'Permission denied.',
        'message.confirm_delete': 'Are you sure you want to delete?',
        'message.data_saved': 'Data has been saved.',
        'message.data_deleted': 'Data has been deleted.',
        'message.preparing': 'feature is being prepared.',
        
        // Form related
        'form.required': 'Required',
        'form.optional': 'Optional',
        'form.select_option': 'Please select',
        'form.enter_text': 'Enter text',
        'form.upload_file': 'Upload file',
        'form.max_length': 'Maximum {0} characters',
        'form.min_length': 'Minimum {0} characters',
        
        // Date and time
        'date.today': 'Today',
        'date.yesterday': 'Yesterday',
        'date.tomorrow': 'Tomorrow',
        'time.24hours': '24 Hours',
        'time.morning': 'Morning',
        'time.afternoon': 'Afternoon',
        'time.evening': 'Evening',
        'time.night': 'Night',
        
        // Days of week
        'day.monday': 'Mon',
        'day.tuesday': 'Tue',
        'day.wednesday': 'Wed',
        'day.thursday': 'Thu',
        'day.friday': 'Fri',
        'day.saturday': 'Sat',
        'day.sunday': 'Sun',
        
        // Guide page
        'guide.help_title': 'How can we help you?',
        'guide.search_placeholder': 'Experience extension, cancellation, review, points, selection',
        'guide.q1_title': 'How do I extend an experience?',
        'guide.q1_answer': 'Experience extension requests can be made on the experience detail page. Please check your application status and proceed with the extension request. However, some experiences may not be extendable.',
        'guide.q2_title': 'When can I cancel an experience?',
        'guide.q2_answer': 'You can cancel an experience up to 3 days before the start date. Cancellations after that may result in point deductions.',
        'guide.q3_title': 'Is writing a review mandatory?',
        'guide.q3_answer': 'Yes, writing a review after completing the experience is mandatory. Failure to write a review may limit your next experience applications.',
        'guide.q4_title': 'How are points earned?',
        'guide.q4_answer': 'Points are automatically earned upon completion of the experience and review writing. Points can be used when applying for the next experience.',
        'guide.q5_title': 'What are the selection criteria for experiences?',
        'guide.q5_answer': 'Experience selection is based on comprehensive consideration of the number of applicants, region, interests, and previous review quality.',
        
        // Hotplace page
        'hotplace.title': 'Hot Places',
        'hotplace.subtitle': 'Find popular restaurants',
        'hotplace.search_placeholder': 'Search by region, food type',
        'hotplace.category.all': 'All',
        'hotplace.category.korean': 'Korean',
        'hotplace.category.chinese': 'Chinese',
        'hotplace.category.japanese': 'Japanese',
        'hotplace.category.western': 'Western',
        'hotplace.category.cafe': 'Cafe',
        'hotplace.category.dessert': 'Dessert',
        'hotplace.rating': 'Rating',
        'hotplace.reviews': 'Reviews',
        'hotplace.address': 'Address',
        'hotplace.phone': 'Phone',
        'hotplace.hours': 'Hours',
        
        // Reviews page
        'reviews.title': 'Review of the Month',
        'reviews.subtitle': 'Check out the best experience reviews',
        'reviews.monthly_best': 'This Month\'s Best Review',
        'reviews.featured_review': 'Featured Review',
        'reviews.review_count': 'Reviews',
        'reviews.helpful': 'Helpful',
        'reviews.rating': 'Rating',
        'reviews.writer': 'Writer',
        'reviews.date': 'Date',
        'reviews.experience': 'Experience',
        'reviews.impression': 'Impression',
        'reviews.recommend': 'Recommend',
        
        // Search page
        'search.title': 'Experience Search',
        'search.subtitle': 'Find your desired experience',
        'search.filters': 'Filters',
        'search.category': 'Category',
        'search.region': 'Region',
        'search.type': 'Experience Type',
        'search.channel': 'Channel',
        'search.results': 'Search Results',
        'search.no_results': 'No search results found',
        'search.sort_by': 'Sort By',
        'search.sort.latest': 'Latest',
        'search.sort.popular': 'Popular',
        'search.sort.rating': 'Rating',
        'search.sort.deadline': 'Deadline'
    },
    
    zh: {
        // 导航
        'nav.main': '主页',
        'nav.hotplace': '热门场所',
        'nav.experience': '体验团招募',
        'nav.review': '月度评论',
        'nav.guide': '使用指南',
        'nav.search': '搜索',
        'nav.login': '登录',
        'nav.logout': '登出',
        'nav.profile': '会员信息',
        'nav.admin': '管理员中心',
        'nav.language': '语言',
        
        // 主页
        'main.title': '体验团招募平台',
        'main.subtitle': '连接网红和企业的平台',
        'main.search_placeholder': '按地区、类别、关键词搜索',
        'main.search_button': '搜索',
        'main.experience_list': '体验团列表',
        'main.no_experience': '暂无注册的体验团。',
        'main.apply_button': '申请',
        'main.view_details': '查看详情',
        'main.deadline': '截止日期',
        'main.participants': '参与者',
        
        // 登录相关
        'login.title': '登录',
        'login.subtitle': '登录您的账户',
        'login.email': '电子邮件',
        'login.password': '密码',
        'login.login_button': '登录',
        'login.register_button': '注册',
        'login.forgot_password': '忘记密码',
        'login.user_type': '用户类型',
        'login.user_type.normal': '普通用户',
        'login.user_type.business': '企业主',
        'login.user_type.admin': '管理员',
        'login.remember_me': '记住我',
        'login.login_success': '登录成功。',
        'login.login_error': '登录失败。请检查您的电子邮件和密码。',
        'login.logout_success': '已退出登录。',
        'login.required_email': '请输入您的电子邮件。',
        'login.required_password': '请输入您的密码。',
        'login.invalid_email': '电子邮件格式不正确。',
        'login.welcome_back': '欢迎回来！',
        'login.email_placeholder': '输入电子邮件或电子邮件前缀',
        'login.password_placeholder': '输入您的密码',
        'login.sns_login': 'SNS简易登录',
        'login.naver_login': 'Naver登录',
        'login.instagram_login': 'Instagram登录',
        'login.admin_link': '前往管理员中心',
        
        // 注册相关
        'register.title': '注册',
        'register.subtitle': '创建新账户',
        'register.name': '姓名',
        'register.email': '电子邮件',
        'register.password': '密码',
        'register.confirm_password': '确认密码',
        'register.phone': '电话号码',
        'register.birth_date': '出生日期',
        'register.gender': '性别',
        'register.gender.male': '男性',
        'register.gender.female': '女性',
        'register.gender.other': '其他',
        'register.terms': '服务条款同意',
        'register.privacy': '隐私政策同意',
        'register.marketing': '营销信息接收同意',
        'register.register_button': '注册',
        'register.register_success': '注册完成。',
        'register.register_error': '注册失败。',
        'register.password_mismatch': '密码不匹配。',
        'register.email_exists': '电子邮件已被使用。',
        
        // 体验团相关
        'experience.title': '体验团标题',
        'experience.company': '公司名称',
        'experience.category': '类别',
        'experience.region': '地区',
        'experience.type': '体验类型',
        'experience.channel': '渠道',
        'experience.deadline': '招募截止日期',
        'experience.start_date': '招募开始日期',
        'experience.end_date': '招募结束日期',
        'experience.experience_start': '体验开始日期',
        'experience.experience_end': '体验结束日期',
        'experience.participants': '招募人数',
        'experience.description': '体验团描述',
        'experience.provided_services': '提供服务',
        'experience.keywords': '宣传关键词',
        'experience.location': '位置',
        'experience.contact': '联系方式',
        'experience.address': '详细地址',
        'experience.schedule': '体验日程',
        'experience.available_days': '可访问日期',
        'experience.available_time': '可访问时间',
        'experience.reservation_notes': '预订注意事项',
        
        // 类别
        'category.restaurant': '餐厅',
        'category.cafe': '咖啡厅',
        'category.accommodation': '住宿',
        'category.travel': '旅行',
        'category.beauty': '美容',
        'category.fashion': '时尚',
        'category.health': '健康',
        'category.sports': '运动',
        'category.culture': '文化',
        'category.other': '其他',
        
        // 体验类型
        'type.visit': '访问型',
        'type.delivery': '配送型',
        'type.packaging': '包装型',
        'type.online': '在线',
        'type.journalist': '记者团',
        
        // 渠道
        'channel.blog': '博客',
        'channel.reels': '短视频',
        'channel.instagram': 'Instagram',
        'channel.youtube': 'YouTube',
        'channel.xiaohongshu': '小红书',
        'channel.blog_clip': '博客+剪辑',
        'channel.shorts': '短片',
        'channel.clip': '剪辑',
        'channel.tiktok': 'TikTok',
        'channel.twitter': 'X (Twitter)',
        
        // 地区
        'region.seoul': '首尔',
        'region.busan': '釜山',
        'region.daegu': '大邱',
        'region.incheon': '仁川',
        'region.gwangju': '光州',
        'region.daejeon': '大田',
        'region.ulsan': '蔚山',
        'region.sejong': '世宗',
        'region.gyeonggi': '京畿道',
        'region.gangwon': '江原道',
        'region.chungbuk': '忠清北道',
        'region.chungnam': '忠清南道',
        'region.jeonbuk': '全罗北道',
        'region.jeonnam': '全罗南道',
        'region.gyeongbuk': '庆尚北道',
        'region.gyeongnam': '庆尚南道',
        'region.jeju': '济州岛',
        
        // 按钮和操作
        'button.register': '注册',
        'button.cancel': '取消',
        'button.save': '保存',
        'button.delete': '删除',
        'button.edit': '编辑',
        'button.search': '搜索',
        'button.reset': '重置',
        'button.apply': '申请',
        'button.close': '关闭',
        'button.submit': '提交',
        'button.back': '返回',
        'button.next': '下一步',
        'button.confirm': '确认',
        'button.approve': '批准',
        'button.reject': '拒绝',
        
        // 状态
        'status.pending': '待处理',
        'status.approved': '已批准',
        'status.rejected': '已拒绝',
        'status.active': '进行中',
        'status.completed': '已完成',
        
        // 消息
        'message.success': '处理成功。',
        'message.error': '发生错误。',
        'message.required_field': '这是必填项。',
        'message.invalid_format': '格式无效。',
        'message.login_required': '需要登录。',
        'message.permission_denied': '权限不足。',
        'message.confirm_delete': '确定要删除吗？',
        'message.data_saved': '数据已保存。',
        'message.data_deleted': '数据已删除。',
        'message.preparing': '功能正在准备中。',
        
        // 表单相关
        'form.required': '必填',
        'form.optional': '可选',
        'form.select_option': '请选择',
        'form.enter_text': '输入文本',
        'form.upload_file': '上传文件',
        'form.max_length': '最多{0}个字符',
        'form.min_length': '至少{0}个字符',
        
        // 日期和时间
        'date.today': '今天',
        'date.yesterday': '昨天',
        'date.tomorrow': '明天',
        'time.24hours': '24小时',
        'time.morning': '上午',
        'time.afternoon': '下午',
        'time.evening': '晚上',
        'time.night': '夜间',
        
        // 星期
        'day.monday': '周一',
        'day.tuesday': '周二',
        'day.wednesday': '周三',
        'day.thursday': '周四',
        'day.friday': '周五',
        'day.saturday': '周六',
        'day.sunday': '周日',
        
        // 指南页面
        'guide.help_title': '我们能为您做什么？',
        'guide.search_placeholder': '体验团延期、取消、评论、积分、选拔',
        'guide.q1_title': '如何延期体验团？',
        'guide.q1_answer': '体验团延期申请可在体验团详情页面进行。请查看申请状态并继续延期申请。但是，某些体验团可能无法延期。',
        'guide.q2_title': '体验团什么时候可以取消？',
        'guide.q2_answer': '体验团可在开始前3天取消。之后取消可能会扣除积分。',
        'guide.q3_title': '写评论是必须的吗？',
        'guide.q3_answer': '是的，体验完成后写评论是必须的。未写评论可能会限制下次体验团申请。',
        'guide.q4_title': '积分如何获得？',
        'guide.q4_answer': '体验完成和评论完成后会自动获得积分。积分可用于下次体验团申请。',
        'guide.q5_title': '体验团选拔标准是什么？',
        'guide.q5_answer': '体验团选拔综合考虑申请人数、地区、兴趣、以往评论质量等因素。',
        
        // 热门场所页面
        'hotplace.title': '热门场所',
        'hotplace.subtitle': '寻找热门餐厅',
        'hotplace.search_placeholder': '按地区、食物类型搜索',
        'hotplace.category.all': '全部',
        'hotplace.category.korean': '韩餐',
        'hotplace.category.chinese': '中餐',
        'hotplace.category.japanese': '日餐',
        'hotplace.category.western': '西餐',
        'hotplace.category.cafe': '咖啡厅',
        'hotplace.category.dessert': '甜品',
        'hotplace.rating': '评分',
        'hotplace.reviews': '评论',
        'hotplace.address': '地址',
        'hotplace.phone': '电话',
        'hotplace.hours': '营业时间',
        
        // 评论页面
        'reviews.title': '本月评论',
        'reviews.subtitle': '查看最佳体验团评论',
        'reviews.monthly_best': '本月最佳评论',
        'reviews.featured_review': '推荐评论',
        'reviews.review_count': '评论数',
        'reviews.helpful': '有用',
        'reviews.rating': '评分',
        'reviews.writer': '作者',
        'reviews.date': '日期',
        'reviews.experience': '体验内容',
        'reviews.impression': '印象',
        'reviews.recommend': '推荐',
        
        // 搜索页面
        'search.title': '体验团搜索',
        'search.subtitle': '找到您想要的体验团',
        'search.filters': '筛选',
        'search.category': '类别',
        'search.region': '地区',
        'search.type': '体验类型',
        'search.channel': '渠道',
        'search.results': '搜索结果',
        'search.no_results': '没有搜索结果',
        'search.sort_by': '排序',
        'search.sort.latest': '最新',
        'search.sort.popular': '热门',
        'search.sort.rating': '评分',
        'search.sort.deadline': '截止日期'
    }
};

// 언어 설정 관리
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'ko';
        this.initializeLanguage();
    }
    
    initializeLanguage() {
        this.updateLanguage(this.currentLanguage);
    }
    
    updateLanguage(lang) {
        if (!languages[lang]) {
            console.warn(`Language ${lang} not supported. Falling back to Korean.`);
            lang = 'ko';
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // 모든 data-translate 속성이 있는 요소 업데이트
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const text = this.getTranslation(key);
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // 언어 선택 드롭다운 업데이트
        this.updateLanguageSelector();
        
        // 페이지별 특별 처리
        this.handlePageSpecificTranslations();
    }
    
    getTranslation(key, params = []) {
        let text = languages[this.currentLanguage][key];
        if (!text) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
        
        // 매개변수 치환
        params.forEach((param, index) => {
            text = text.replace(`{${index}}`, param);
        });
        
        return text;
    }
    
    updateLanguageSelector() {
        const languageSelectors = document.querySelectorAll('.language-selector');
        languageSelectors.forEach(selector => {
            selector.value = this.currentLanguage;
        });
    }
    
    handlePageSpecificTranslations() {
        // 체험단 목록 업데이트
        if (typeof updateExperienceList === 'function') {
            updateExperienceList();
        }
        
        // 검색 결과 업데이트
        if (typeof updateSearchResults === 'function') {
            updateSearchResults();
        }
        
        // 카테고리 및 지역 옵션 업데이트
        this.updateSelectOptions();
    }
    
    updateSelectOptions() {
        // 카테고리 선택 옵션 업데이트
        document.querySelectorAll('select[name="category"], select[id*="category"]').forEach(select => {
            Array.from(select.options).forEach(option => {
                if (option.value) {
                    const translationKey = `category.${option.value}`;
                    const translatedText = this.getTranslation(translationKey);
                    if (translatedText !== translationKey) {
                        option.textContent = translatedText;
                    }
                }
            });
        });
        
        // 지역 선택 옵션 업데이트
        document.querySelectorAll('select[name="region"], select[id*="region"]').forEach(select => {
            Array.from(select.options).forEach(option => {
                if (option.value) {
                    const translationKey = `region.${option.value}`;
                    const translatedText = this.getTranslation(translationKey);
                    if (translatedText !== translationKey) {
                        option.textContent = translatedText;
                    }
                }
            });
        });
        
        // 체험 유형 선택 옵션 업데이트
        document.querySelectorAll('select[name="type"], select[id*="type"]').forEach(select => {
            Array.from(select.options).forEach(option => {
                if (option.value) {
                    const translationKey = `type.${option.value}`;
                    const translatedText = this.getTranslation(translationKey);
                    if (translatedText !== translationKey) {
                        option.textContent = translatedText;
                    }
                }
            });
        });
    }
}

// 전역 언어 관리자 인스턴스
const languageManager = new LanguageManager();

// 언어 변경 함수
function changeLanguage(lang) {
    languageManager.updateLanguage(lang);
    
    // 언어 선택 표시 업데이트
    setTimeout(() => {
        updateLanguageSelection();
    }, 100);
}

// 번역 텍스트 가져오기 함수
function t(key, ...params) {
    return languageManager.getTranslation(key, params);
}

// 사용자 아이콘에 언어 선택 기능 추가
function addLanguageSelectorToUserIcon() {
    // 기존 언어 선택 드롭다운이 있는지 확인
    const existingSelector = document.querySelector('.user-language-dropdown');
    if (existingSelector) {
        existingSelector.remove();
    }
    
    const userIcon = document.querySelector('.fa-user');
    if (!userIcon) return;
    
    // 언어 선택 드롭다운 생성
    const languageDropdown = document.createElement('div');
    languageDropdown.className = 'user-language-dropdown';
    languageDropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        min-width: 120px;
        display: none;
    `;
    
    languageDropdown.innerHTML = `
        <div class="language-option" onclick="changeLanguage('ko')">
            <span class="flag">🇰🇷</span>
            <span>한국어</span>
        </div>
        <div class="language-option" onclick="changeLanguage('en')">
            <span class="flag">🇺🇸</span>
            <span>English</span>
        </div>
        <div class="language-option" onclick="changeLanguage('zh')">
            <span class="flag">🇨🇳</span>
            <span>中文</span>
        </div>
    `;
    
    // 언어 선택 옵션 스타일
    const optionStyle = document.createElement('style');
    optionStyle.textContent = `
        .user-language-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 120px;
            display: none;
        }
        
        .language-option {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .language-option:hover {
            background-color: #f5f5f5;
        }
        
        .language-option .flag {
            margin-right: 8px;
            font-size: 16px;
        }
        
        .user-icon-container {
            position: relative;
        }
        
        .user-icon-container:hover .user-language-dropdown {
            display: block;
        }
    `;
    
    if (!document.getElementById('user-language-styles')) {
        optionStyle.id = 'user-language-styles';
        document.head.appendChild(optionStyle);
    }
    
    // 사용자 아이콘을 컨테이너로 감싸기
    const userIconContainer = userIcon.parentElement;
    if (!userIconContainer.classList.contains('user-icon-container')) {
        userIconContainer.classList.add('user-icon-container');
        userIconContainer.style.position = 'relative';
    }
    
    userIconContainer.appendChild(languageDropdown);
    
    // 현재 언어에 따라 체크 표시
    updateLanguageSelection();
}

// 언어 선택 표시 업데이트
function updateLanguageSelection() {
    const dropdown = document.querySelector('.user-language-dropdown');
    if (!dropdown) return;
    
    const options = dropdown.querySelectorAll('.language-option');
    const currentLang = languageManager.currentLanguage;
    
    options.forEach(option => {
        const flag = option.querySelector('.flag');
        const text = option.querySelector('span:last-child');
        
        // 체크 표시 제거
        option.style.fontWeight = 'normal';
        option.style.backgroundColor = '';
        
        // 현재 언어 체크 표시
        if ((currentLang === 'ko' && flag.textContent === '🇰🇷') ||
            (currentLang === 'en' && flag.textContent === '🇺🇸') ||
            (currentLang === 'zh' && flag.textContent === '🇨🇳')) {
            option.style.fontWeight = 'bold';
            option.style.backgroundColor = '#e3f2fd';
        }
    });
}

// DOM이 로드된 후 언어 초기화
document.addEventListener('DOMContentLoaded', function() {
    languageManager.initializeLanguage();
    
    // 사용자 아이콘에 언어 선택 기능 추가
    setTimeout(() => {
        addLanguageSelectorToUserIcon();
    }, 500);
});
