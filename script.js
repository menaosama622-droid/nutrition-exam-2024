let currentScore = 0;
let answeredQuestions = 0;

// تهيئة الامتحان
function initializeQuiz() {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = '';
    
    quizData.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <div class="question-number">السؤال ${index + 1} من ${quizData.length}</div>
            <div class="question-text">${q.question}</div>
            <input 
                type="text" 
                class="answer-input" 
                id="answer-${q.id}" 
                placeholder="أكمل الفراغ..."
                onkeypress="handleKeyPress(event, ${q.id})"
            />
            <div class="hint">💡 ${q.hint}</div>
        `;
        quizContent.appendChild(questionCard);
    });
    
    document.getElementById('totalQuestions').textContent = quizData.length;
    updateProgress();
}

// معالجة اضغط Enter
function handleKeyPress(event, questionId) {
    if (event.key === 'Enter') {
        checkSingleAnswer(questionId);
    }
}

// التحقق من إجابة واحدة
function checkSingleAnswer(questionId) {
    const question = quizData.find(q => q.id === questionId);
    const inputElement = document.getElementById(`answer-${questionId}`);
    const userAnswer = inputElement.value.trim();
    
    if (userAnswer === '') {
        alert('من فضلك أدخل إجابة!');
        return;
    }
    
    const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
    
    inputElement.classList.remove('correct', 'incorrect');
    inputElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    inputElement.disabled = true;
    
    if (isCorrect && !inputElement.dataset.counted) {
        currentScore++;
        inputElement.dataset.counted = 'true';
        answeredQuestions++;
    }
    
    updateStats();
}

// التحقق من جميع الإجابات
function checkAnswers() {
    const quizContent = document.getElementById('quizContent');
    const inputs = quizContent.querySelectorAll('.answer-input');
    
    let allAnswered = true;
    inputs.forEach((input, index) => {
        if (input.value.trim() === '') {
            allAnswered = false;
            input.style.borderColor = '#f44336';
        } else {
            checkSingleAnswer(quizData[index].id);
        }
    });
    
    if (!allAnswered) {
        alert('من فضلك أكمل جميع الأسئلة!');
        return;
    }
    
    // عرض النتائج
    showResults();
}

// عرض النتائج
function showResults() {
    const percentage = Math.round((currentScore / quizData.length) * 100);
    
    document.getElementById('finalScore').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = currentScore;
    document.getElementById('totalCount').textContent = quizData.length;
    document.getElementById('percentage').textContent = percentage + '%';
    
    let message = '';
    if (percentage >= 90) {
        message = '🌟 ممتاز جداً! أداء رائع!';
    } else if (percentage >= 75) {
        message = '👍 جيد جداً! استمر في التحسن!';
    } else if (percentage >= 60) {
        message = '📚 جيد! استمر في الدراسة!';
    } else if (percentage >= 50) {
        message = '⚠️ متوسط. حاول الدراسة أكثر!';
    } else {
        message = '💪 تحتاج إلى مراجعة أكثر. لا تستسلم!';
    }
    
    document.getElementById('resultMessage').textContent = message;
    
    document.getElementById('results').classList.add('show');
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('buttonContainer').innerHTML = '<button class="btn-reset" onclick="resetQuiz()">إعادة الامتحان</button>';
}

// إعادة تعيين الامتحان
function resetQuiz() {
    currentScore = 0;
    answeredQuestions = 0;
    
    document.getElementById('results').classList.remove('show');
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('score').textContent = '0';
    document.getElementById('currentQuestion').textContent = '1';
    document.getElementById('buttonContainer').innerHTML = '<button class="btn-submit" onclick="checkAnswers()">تحقق من الإجابات</button><button class="btn-reset" onclick="resetQuiz()">إعادة تعيين</button>';
    
    initializeQuiz();
}

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('score').textContent = currentScore;
}

// تحديث شريط التقدم
function updateProgress() {
    const inputs = document.querySelectorAll('.answer-input');
    const filled = document.querySelectorAll('.answer-input:not(:placeholder-shown)').length;
    const progress = (filled / quizData.length) * 100;
    
    document.getElementById('progressFill').style.width = progress + '%';
}

// بدء الامتحان
window.onload = function() {
    initializeQuiz();
};