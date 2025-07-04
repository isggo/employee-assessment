// 역량별 평가 기준
const competencyMapping = {
    'leadership': 'leadership',
    'communication': 'communication',
    'creativity': 'creativity',
    'problemSolving': 'problemSolving',
    'teamwork': 'teamwork'
};

// 5점 척도 점수 매핑
const scoreMapping = {
    0: 0,   // 매우 아니다
    1: 25,  // 아니다
    2: 50,  // 보통
    3: 75,  // 그렇다
    4: 100  // 매우 그렇다
};

// 점수 구간별 피드백 데이터
const feedbackData = {
    basic: {
        level: "기본 역량 다지기 집중 구간",
        content: "해당 모듈의 핵심 내용에 대한 이해도가 아직 부족한 것으로 보입니다. 교육 과정을 통해 제공되는 자료를 충실히 학습하고, 궁금한 점은 적극적으로 질문하며 기본기를 탄탄히 다지는 노력이 필요합니다. 모르는 부분을 채워나가는 과정에서 큰 성장을 경험하실 수 있을 것입니다.",
        class: "basic"
    },
    intermediate: {
        level: "응용 및 심화 역량 강화 구간",
        content: "해당 모듈의 기본적인 개념은 잘 이해하고 계신 것으로 보입니다. 이제 교육 내용을 바탕으로 실제 업무 상황에 어떻게 적용할 수 있을지 고민하고, 다양한 사례를 접하며 숙련도를 높여나갈 시기입니다. 한 걸음 더 나아가 역량을 강화해보세요.",
        class: "intermediate"
    },
    advanced: {
        level: "전문 역량 발휘 및 공유 구간",
        content: "해당 모듈에 대한 이해도가 매우 높고 관련 역량이 탁월합니다. 학습한 내용을 자신 있게 실무에 적극적으로 적용하여 눈에 보이는 성과를 창출하고, 더 나아가 다른 동료들과도 지식을 공유하며 함께 성장하는 리더십을 발휘할 수 있을 것으로 기대됩니다.",
        class: "advanced"
    }
};

// 종합 점수 구간별 유형 데이터
const scoreTypeData = {
    rookie: {
        icon: "🐣",
        name: "새싹 인재 유형",
        description: "아직 배워갈 점이 무궁무진한, 성장 잠재력이 가득한 신입사원!",
        message: "지금은 새싹 단계지만, 꾸준히 물 주고 햇볕 쬐어주면 금방 무럭무럭 자랄 거예요! 교육 내용을 다시 살펴보며 하나씩 내 것으로 만들어가 봐요! 화이팅! 🌱"
    },
    growing: {
        icon: "🌱",
        name: "성장 기대 인재 유형",
        description: "기본적인 틀은 갖췄고, 조금만 더 노력하면 훨씬 더 멋진 모습으로 성장할 인재!",
        message: "기본기가 탄탄하네요! 여기에 교육 내용을 더해서 실력을 갈고 닦으면, 회사에 꼭 필요한 인재가 될 수 있을 거예요! 앞으로의 성장이 정말 기대돼요! ✨"
    },
    prepared: {
        icon: "🌳",
        name: "준비된 인재 유형",
        description: "교육 내용을 잘 소화했고, 실무에 바로 투입되어도 문제 없을 준비된 신입사원!",
        message: "와우! 교육 내용을 정말 잘 이해했네요! 탄탄한 준비를 바탕으로 이제 실무에서 마음껏 능력을 펼쳐봐요! 당신의 활약을 응원합니다! 🚀"
    },
    core: {
        icon: "⭐",
        name: "핵심 인재 유형",
        description: "뛰어난 이해도와 잠재력을 갖춘, 앞으로 회사를 이끌어갈 핵심 인재 후보!",
        message: "최고예요! 교육 내용을 완벽하게 소화했고, 스스로 발전하려는 의지도 뛰어나네요! 당신의 잠재력이라면 우리 회사의 미래를 밝게 비출 수 있을 거예요! 🎉"
    }
};

// 점수에 따른 피드백 레벨 결정
function getFeedbackLevel(score) {
    if (score > 0 && score <= 50) {
        return feedbackData.basic;
    } else if (score > 50 && score <= 80) {
        return feedbackData.intermediate;
    } else if (score > 80 && score <= 100) {
        return feedbackData.advanced;
    }
    return feedbackData.basic; // 기본값
}

// 피드백 표시 함수
function displayCompetencyFeedback(competency, score) {
    const feedbackElement = document.querySelector(`.competency-feedback[data-competency="${competency}"]`);
    if (!feedbackElement) return;

    const feedback = getFeedbackLevel(score);

    const levelElement = feedbackElement.querySelector('.feedback-level');
    const contentElement = feedbackElement.querySelector('.feedback-content');

    if (levelElement && contentElement) {
        levelElement.textContent = feedback.level;
        levelElement.className = `feedback-level ${feedback.class}`;
        contentElement.textContent = feedback.content;
    }
}

// 역량별 문항 범위 (1-based index)
const competencyRanges = {
    leadership: { start: 1, end: 15 },      // 1-15번
    communication: { start: 16, end: 30 },   // 16-30번  
    creativity: { start: 31, end: 45 },      // 31-45번
    problemSolving: { start: 46, end: 60 },  // 46-60번
    teamwork: { start: 61, end: 75 }         // 61-75번
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    initializeResultPage();
});

// 결과 페이지 초기화
async function initializeResultPage() {
    // 로그인 상태 확인
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = '/';
        return;
    }

    // 1차: 마이페이지에서 전달된 서버 데이터 확인 (우선순위 최상위)
    const tempViewResult = localStorage.getItem('tempViewResult');
    if (tempViewResult) {
        console.log('✅ 마이페이지에서 전달된 서버 데이터 발견');
        const serverResult = JSON.parse(tempViewResult);

        // 임시 데이터 사용 후 삭제 (보안)
        localStorage.removeItem('tempViewResult');

        calculateAndDisplayResults(serverResult);
        return;
    }

    // 2차: localStorage에서 테스트 결과 확인 (최근 테스트 완료 시)
    const testResult = localStorage.getItem('testResult');
    if (testResult) {
        console.log('✅ localStorage에서 테스트 결과 발견');
        calculateAndDisplayResults(JSON.parse(testResult));
        return;
    }

    // 3차: 서버에서 최근 테스트 결과 불러오기 (백업)
    console.log('⚠️ 로컬 데이터 없음, 서버에서 최근 결과 조회 시도...');
    try {
        await loadLatestResultFromServer();
    } catch (error) {
        console.error('서버에서 결과 조회 실패:', error);
        alert('테스트 결과를 찾을 수 없습니다. 테스트를 먼저 진행해주세요.');
        window.location.href = '/';
    }
}

// 결과 계산 및 표시
function calculateAndDisplayResults(testResult) {
    console.log('테스트 결과 데이터:', testResult);
    console.log('세션 ID:', testResult.sessionId || '없음');

    // 서버에서 이미 계산된 점수가 있는지 확인
    if (testResult.competencyScores && testResult.overallScore !== undefined) {
        console.log('서버에서 계산된 점수 사용:', testResult.competencyScores);
        console.log('서버에서 계산된 종합 점수:', testResult.overallScore);

        // 기존 결과인지 확인
        if (testResult.isExisting) {
            console.log('기존에 제출된 테스트의 결과를 표시합니다.');
        }

        // 서버 계산 결과 직접 사용
        displayOverallScore(testResult.overallScore);
        displayCompetencyScores(testResult.competencyScores);
        displayTestInfo(testResult);

        // 자동 저장 (중복 체크 포함)
        autoSaveResult(testResult, testResult.competencyScores, testResult.overallScore);

        // 애니메이션 효과
        animateResults();
        return;
    }

    // 서버 계산 결과가 없으면 클라이언트에서 계산 (백업)
    console.log('클라이언트에서 점수 계산 시작');
    console.log('답변 데이터:', testResult.answers);

    // 역량별 점수 계산
    const competencyScores = {};

    // 답변 데이터가 배열인지 객체인지 확인
    let answers = testResult.answers;
    if (Array.isArray(answers)) {
        // 배열을 객체로 변환 (id를 키로 사용)
        const answersObj = {};
        answers.forEach(answer => {
            answersObj[answer.id] = answer.answer;
        });
        answers = answersObj;
    }

    // 각 역량별로 점수 계산
    Object.keys(competencyRanges).forEach(competency => {
        const range = competencyRanges[competency];
        let totalScore = 0;
        let questionCount = 0;

        console.log(`\n=== ${competency} 역량 계산 ===`);
        console.log(`문항 범위: ${range.start} - ${range.end}`);

        // 해당 역량의 문항들 점수 합계
        for (let questionId = range.start; questionId <= range.end; questionId++) {
            const answerValue = answers[questionId];
            if (answerValue !== undefined) {
                const score = scoreMapping[answerValue] || 0;
                totalScore += score;
                questionCount++;
                console.log(`문항 ${questionId}: 답변=${answerValue}, 점수=${score}`);
            } else {
                console.log(`문항 ${questionId}: 답변 없음`);
            }
        }

        // 평균 점수 계산 (0-100점)
        competencyScores[competency] = questionCount > 0 ?
            Math.round(totalScore / questionCount) : 0;

        console.log(`${competency} 총점: ${totalScore}, 문항수: ${questionCount}, 평균: ${competencyScores[competency]}`);
    });

    console.log('\n최종 역량별 점수:', competencyScores);

    // 종합 점수 계산 (모든 역량 평균)
    const competencyValues = Object.values(competencyScores);
    const overallScore = competencyValues.length > 0 ?
        Math.round(competencyValues.reduce((sum, score) => sum + score, 0) / competencyValues.length) : 0;

    console.log('종합 점수:', overallScore);

    // 결과 표시
    displayOverallScore(overallScore);
    displayCompetencyScores(competencyScores);
    displayTestInfo(testResult);

    // 자동 저장
    autoSaveResult(testResult, competencyScores, overallScore);

    // 애니메이션 효과
    animateResults();
}

// 자동 저장 함수
function autoSaveResult(testResult, competencyScores, overallScore) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
        console.error('사용자 정보가 없어 저장할 수 없습니다.');
        return;
    }

    // 세션 ID 확인
    const sessionId = testResult.sessionId;
    if (!sessionId) {
        console.error('세션 ID가 없어 저장을 건너뜁니다.');
        return;
    }

    // 기존 저장된 결과들 가져오기
    let savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];

    // 같은 세션 ID로 이미 저장된 결과가 있는지 확인
    const existingResultIndex = savedResults.findIndex(result =>
        result.sessionId === sessionId
    );

    if (existingResultIndex !== -1) {
        console.log(`세션 ID ${sessionId}에 대한 결과가 이미 저장되어 있습니다. 중복 저장하지 않습니다.`);
        return;
    }

    const now = new Date().toISOString();
    const resultData = {
        userInfo: userInfo,
        testResult: testResult,
        competencyScores: competencyScores,
        overallScore: overallScore,
        savedAt: now,
        testDate: testResult.testDate || now,
        sessionId: sessionId // 세션 ID 추가
    };

    // 새 결과 추가
    savedResults.push(resultData);

    // 최대 20개까지만 보관 (오래된 것부터 삭제)
    if (savedResults.length > 20) {
        savedResults = savedResults.slice(-20);
    }

    // 저장
    localStorage.setItem('savedResults', JSON.stringify(savedResults));

    console.log(`새로운 결과가 자동 저장되었습니다 (세션 ID: ${sessionId}):`, resultData);
}

// 종합 점수 표시
function displayOverallScore(score) {
    document.getElementById('overallScore').textContent = score;

    // 점수에 따른 유형 정보 표시
    const scoreType = getScoreType(score);

    document.getElementById('scoreTypeIcon').textContent = scoreType.icon;
    document.getElementById('scoreTypeName').textContent = scoreType.name;
    document.getElementById('scoreTypeDescription').textContent = scoreType.description;
    document.getElementById('scoreTypeMessage').textContent = scoreType.message;

    // 4단계 프로그레스 바 업데이트
    updateProgressSteps(score);
}

// 4단계 프로그레스 바 업데이트 함수
function updateProgressSteps(score) {
    // 현재 단계 결정
    let currentStep = 1;
    if (score > 40 && score <= 60) currentStep = 2;
    else if (score > 60 && score <= 80) currentStep = 3;
    else if (score > 80 && score <= 100) currentStep = 4;

    // 모든 단계 초기화
    const allSteps = document.querySelectorAll('.progress-step');
    allSteps.forEach(step => {
        const circle = step.querySelector('.step-circle');
        step.classList.remove('active', 'completed');
        circle.classList.remove('active', 'completed');
    });

    // 현재 단계의 동그라미만 활성화
    if (currentStep <= 4) {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const currentCircle = currentStepElement.querySelector('.step-circle');
        currentStepElement.classList.add('active');
        currentCircle.classList.add('active');
    }

    // 프로그레스 라인은 비활성화 (0%로 유지)
    const progressLineFill = document.getElementById('progressLineFill');
    if (progressLineFill) {
        progressLineFill.style.width = '0%';
    }

    console.log(`점수: ${score}, 현재 단계: ${currentStep} - 해당 단계 동그라미만 활성화`);
}

// 서버에서 최근 테스트 결과 불러오기
async function loadLatestResultFromServer() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('인증 토큰이 없습니다.');
    }

    console.log('🔍 서버에서 사용자 프로필 및 테스트 결과 조회 중...');

    const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('서버 응답:', data);

    if (!data.testResults || data.testResults.length === 0) {
        throw new Error('저장된 테스트 결과가 없습니다.');
    }

    // 가장 최근 결과 (첫 번째 결과)
    const latestResult = data.testResults[0];
    console.log('✅ 최근 테스트 결과 발견:', latestResult);

    // result.js에서 기대하는 형식으로 변환
    const transformedResult = {
        competencyScores: latestResult.competencyScores,
        overallScore: latestResult.overallScore,
        testDate: latestResult.testDate,
        submittedAt: latestResult.submittedAt,
        sessionId: latestResult.sessionId,
        id: latestResult.id,
        isExisting: true,
        message: '서버에서 불러온 기존 결과입니다.'
    };

    console.log('✅ 서버에서 최근 결과를 성공적으로 불러왔습니다.');

    // 결과 표시
    calculateAndDisplayResults(transformedResult);
}

// 역량별 점수 표시
function displayCompetencyScores(scores) {
    Object.entries(scores).forEach(([competency, score]) => {
        // 점수 숫자 표시 업데이트
        const scoreElement = document.querySelector(`.competency-score[data-competency="${competency}"]`);
        if (scoreElement) {
            scoreElement.textContent = score;
        }

        // 프로그레스 바 너비 업데이트
        const fillElement = document.querySelector(`.competency-fill[data-competency="${competency}"]`);
        if (fillElement) {
            fillElement.style.width = `${score}%`;
        }

        console.log(`${competency}: ${score}점, 프로그레스 바 너비: ${score}%`);

        // 피드백 표시
        displayCompetencyFeedback(competency, score);
    });

    // 60점 미만인 항목이 있는지 확인하고 향상방안 섹션 표시
    displayImprovementRecommendations(scores);
}

// 향상방안 섹션 표시 함수
function displayImprovementRecommendations(scores) {
    const improvementSection = document.getElementById('improvementRecommendations');
    let hasLowScores = false;

    // 60점 미만인 항목들 찾기
    Object.entries(scores).forEach(([competency, score]) => {
        const improvementCard = document.querySelector(`.improvement-item-card[data-competency="${competency}"]`);

        if (improvementCard) {
            if (score < 60) {
                // 60점 미만인 경우 카드 표시
                improvementCard.style.display = 'block';
                hasLowScores = true;
                console.log(`${competency}: ${score}점 - 향상방안 카드 표시`);
            } else {
                // 60점 이상인 경우 카드 숨김
                improvementCard.style.display = 'none';
                console.log(`${competency}: ${score}점 - 향상방안 카드 숨김`);
            }
        }
    });

    // 60점 미만인 항목이 하나라도 있으면 전체 섹션 표시
    if (hasLowScores && improvementSection) {
        improvementSection.style.display = 'block';
        console.log('향상방안 섹션 표시 - 60점 미만인 역량이 있음');
    } else if (improvementSection) {
        improvementSection.style.display = 'none';
        console.log('향상방안 섹션 숨김 - 모든 역량이 60점 이상');
    }
}

// 테스트 정보 표시
function displayTestInfo(testResult) {
    // 제출 시간 표시 - 저장된 제출 시간 사용
    let completedTime;
    if (testResult.submittedAt) {
        // 저장된 제출 시간 사용
        completedTime = new Date(testResult.submittedAt);
    } else if (testResult.testDate) {
        // testDate가 있으면 사용 (호환성)
        completedTime = new Date(testResult.testDate);
    } else {
        // 저장된 시간이 없으면 현재 시간 (백업)
        completedTime = new Date();
        console.warn('제출 시간 정보가 없어서 현재 시간을 사용합니다.');
    }

    document.getElementById('completedTime').textContent =
        completedTime.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    // 응답 문항 수 표시
    const answeredCount = Object.keys(testResult.answers).length;
    document.getElementById('answeredQuestions').textContent = `${answeredCount} / 75`;
}

// 결과 애니메이션
function animateResults() {
    // 프로그레스 바 애니메이션
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.competency-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width || '0%';
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease-out';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }, 500);

    // 카드 애니메이션
    const cards = document.querySelectorAll('.competency-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// 홈으로 이동
function goHome() {
    window.location.href = '/';
}

// 마이페이지로 이동
function goToMyPage() {
    window.location.href = '/mypage.html';
}

// 로그아웃
function handleLogout() {
    if (confirm('로그아웃하시겠습니까?')) {
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    }
}

// 종합 점수에 따른 유형 결정
function getScoreType(score) {
    if (score >= 0 && score <= 40) {
        return scoreTypeData.rookie;
    } else if (score > 40 && score <= 60) {
        return scoreTypeData.growing;
    } else if (score > 60 && score <= 80) {
        return scoreTypeData.prepared;
    } else if (score > 80 && score <= 100) {
        return scoreTypeData.core;
    }
    return scoreTypeData.rookie; // 기본값
} 