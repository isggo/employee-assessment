/**
 * Header Component - 헤더 컴포넌트 모듈
 * @author Employee Test System
 * @version 2.0.0
 */

const Header = (() => {
    'use strict';

    let initialized = false;

    /**
     * 초기화
     */
    function init() {
        if (initialized) return;

        Core.DOM.ready(() => {
            createHeader();
            setupEventListeners();
            updateUserInfo();
            applyResponsiveStyles();
            initialized = true;
        });
    }

    /**
     * 헤더 생성
     */
    function createHeader() {
        const headerContainer = Core.DOM.$('.header .header-container');
        if (!headerContainer) return;

        const currentPage = getCurrentPage();
        const headerContent = generateHeaderContent(currentPage);

        headerContainer.innerHTML = headerContent;
        setupLogoErrorHandling();
    }

    /**
     * 현재 페이지 식별
     * @returns {string}
     */
    function getCurrentPage() {
        const path = window.location.pathname;

        if (path === '/' || path.includes('index.html')) return 'main';
        if (path.includes('login.html')) return 'login';
        if (path.includes('signup.html') || path.includes('signup-form.html')) return 'signup';
        if (path.includes('test.html')) return 'test';
        if (path.includes('result.html')) return 'result';
        if (path.includes('mypage.html')) return 'mypage';

        return 'other';
    }

    /**
     * 헤더 콘텐츠 생성
     * @param {string} pageType 
     * @returns {string}
     */
    function generateHeaderContent(pageType) {
        const homeButton = generateHomeButton(pageType);
        const logo = generateLogo();
        const authNav = generateAuthNav(pageType);

        return `${homeButton}${logo}${authNav}`;
    }

    /**
     * 홈 버튼 생성
     * @param {string} pageType 
     * @returns {string}
     */
    function generateHomeButton(pageType) {
        if (pageType === 'main') {
            return '<div class="home-btn-container"><!-- 빈 공간 유지용 --></div>';
        }

        return `
            <div class="home-btn-container">
                <button class="home-btn" data-action="goHome" title="홈으로 이동">
                    ← 홈
                </button>
            </div>
        `;
    }

    /**
     * 로고 생성
     * @returns {string}
     */
    function generateLogo() {
        return `
            <div class="logo">
                <img src="images/logo.png" alt="회사 로고" />
            </div>
        `;
    }

    /**
     * 인증 네비게이션 생성
     * @param {string} pageType 
     * @returns {string}
     */
    function generateAuthNav(pageType) {
        const isLoggedIn = User.isLoggedIn();

        switch (pageType) {
            case 'main':
                return isLoggedIn ? generateLoggedInNav() : generateGuestNav();

            case 'login':
                return `
                    <nav class="auth-nav">
                        <button class="auth-btn signup-btn" data-action="goToSignup">
                            회원가입
                        </button>
                    </nav>
                `;

            case 'signup':
                return `
                    <nav class="auth-nav">
                        <button class="auth-btn login-btn" data-action="goToLogin">
                            로그인
                        </button>
                    </nav>
                `;

            default:
                return isLoggedIn ? generateLoggedInNav() : generateGuestNav();
        }
    }

    /**
     * 로그인된 사용자용 네비게이션
     * @returns {string}
     */
    function generateLoggedInNav() {
        return `
            <nav class="auth-nav">
                <button class="auth-btn mypage-btn" data-action="goToMyPage">
                    마이페이지
                </button>
                <button class="auth-btn logout-btn" data-action="logout">
                    로그아웃
                </button>
            </nav>
        `;
    }

    /**
     * 게스트용 네비게이션
     * @returns {string}
     */
    function generateGuestNav() {
        return `
            <nav class="auth-nav">
                <button class="auth-btn login-btn" data-action="goToLogin">
                    로그인
                </button>
                <button class="auth-btn signup-btn" data-action="goToSignup">
                    회원가입
                </button>
            </nav>
        `;
    }

    /**
     * 반응형 스타일 적용
     * styles.css의 스타일을 사용하므로 중복 제거
     */
    function applyResponsiveStyles() {
        // styles.css의 스타일 사용, 중복 스타일 제거
        // 필요시 특수한 케이스만 여기서 처리
    }

    /**
     * 로고 에러 핸들링 설정
     */
    function setupLogoErrorHandling() {
        const logoImg = Core.DOM.$('.logo img');
        if (!logoImg) return;

        Core.EventManager.on(logoImg, 'error', () => {
            logoImg.style.display = 'none';

            const logoText = Core.DOM.create('h2', {
                textContent: 'COMPANY',
                style: 'color: #1e293b; font-weight: 700; margin: 0; font-size: 1.5rem;'
            });

            logoImg.parentElement.appendChild(logoText);
        });
    }

    /**
     * 이벤트 리스너 설정
     */
    function setupEventListeners() {
        // 이벤트 위임을 사용하여 동적으로 생성된 버튼들 처리
        Core.EventManager.delegate(document, '[data-action]', 'click', handleAction);
    }

    /**
     * 액션 핸들링
     * @param {Event} event 
     */
    function handleAction(event) {
        const action = event.target.dataset.action;

        switch (action) {
            case 'goHome':
                navigateToHome();
                break;
            case 'goToLogin':
                navigateToLogin();
                break;
            case 'goToSignup':
                navigateToSignup();
                break;
            case 'goToMyPage':
                navigateToMyPage();
                break;
            case 'logout':
                handleLogout();
                break;
        }
    }

    /**
     * 네비게이션 함수들
     */
    function navigateToHome() {
        window.location.href = '/';
    }

    function navigateToLogin() {
        window.location.href = '/login.html';
    }

    function navigateToSignup() {
        window.location.href = '/signup.html';
    }

    function navigateToMyPage() {
        if (User.isLoggedIn()) {
            window.location.href = '/mypage.html';
        } else {
            UI.Notification.show('로그인이 필요합니다.', 'warning');
            navigateToLogin();
        }
    }

    /**
     * 로그아웃 처리
     */
    async function handleLogout() {
        try {
            const confirmed = await UI.Modal.confirm(
                '로그아웃 하시겠습니까?',
                '로그아웃 확인'
            );

            if (confirmed) {
                User.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            UI.Notification.show('로그아웃 중 오류가 발생했습니다.', 'error');
        }
    }

    /**
     * 사용자 정보 업데이트
     */
    function updateUserInfo() {
        // 로그인 상태가 변경되었을 때 헤더를 새로 생성
        // 환영 인사가 제거되었으므로 전체 헤더를 리프레시
        createHeader();
        setupEventListeners();
    }

    /**
     * 헤더 리프레시 (사용자 상태 변경 시 호출)
     */
    function refresh() {
        createHeader();
        setupEventListeners();
        updateUserInfo();
    }

    // Public API
    return {
        init,
        refresh,
        updateUserInfo
    };
})();

// 전역 스코프에 노출
window.Header = Header; 