const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const charAnalysis = document.getElementById('charAnalysis');
const crackTime = document.getElementById('crackTime');
const tips = document.getElementById('tips');

let isPasswordVisible = false;

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    togglePassword.textContent = isPasswordVisible ? '🙈' : '👁️';
});

// Real-time password analysis
passwordInput.addEventListener('input', analyzePassword);

function analyzePassword() {
    const password = passwordInput.value;

    if (password.length === 0) {
        resetDisplay();
        return;
    }

    const analysis = getPasswordAnalysis(password);
    updateStrengthDisplay(analysis);
    updateCharacterAnalysis(analysis);
    updateCrackTimeDisplay(analysis);
    updateTips(analysis);
}

function getPasswordAnalysis(password) {
    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const charsetSize =
        (hasLower ? 26 : 0) +
        (hasUpper ? 26 : 0) +
        (hasNumbers ? 10 : 0) +
        (hasSpecial ? 32 : 0);

    const score = calculateScore(length, hasLower, hasUpper, hasNumbers, hasSpecial);
    const strength = getStrengthLevel(score);
    const crackTime = calculateCrackTime(length, charsetSize);

    return {
        length,
        hasLower,
        hasUpper,
        hasNumbers,
        hasSpecial,
        charsetSize,
        score,
        strength,
        crackTime
    };
}

function calculateScore(length, hasLower, hasUpper, hasNumbers, hasSpecial) {
    let score = 0;
    score += Math.min(length * 4, 40);
    score += hasLower ? 10 : 0;
    score += hasUpper ? 10 : 0;
    score += hasNumbers ? 15 : 0;
    score += hasSpecial ? 20 : 0;

    // Bonus for length beyond 12
    if (length > 12) score += (length - 12) * 3;

    return Math.min(score, 100);
}

function getStrengthLevel(score) {
    if (score < 25) return 'very-weak';
    if (score < 50) return 'weak';
    if (score < 75) return 'moderate';
    if (score < 90) return 'strong';
    return 'very-strong';
}

function calculateCrackTime(length, charsetSize) {
    // Assume 10 billion guesses per second (modern GPU cracking rig)
    const guessesPerSecond = 1e10;
    const totalCombinations = Math.pow(charsetSize, length);
    const seconds = totalCombinations / guessesPerSecond;

    return formatTime(seconds);
}

// 🔥 UPDATED FUNCTION - Now shows millions, billions, trillions!
function formatTime(seconds) {
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;

    // NEW: Large number formatting
    const years = seconds / 31536000;

    if (years < 1000) return `${Math.round(years)} years`;

    const suffixes = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];
    let suffixIndex = 0;
    let value = years;

    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
    }

    return `${Math.round(value)} ${suffixes[suffixIndex]} years`;
}

function updateStrengthDisplay(analysis) {
    const { strength, score } = analysis;

    // Update bar
    const percentages = {
        'very-weak': 20,
        'weak': 40,
        'moderate': 60,
        'strong': 80,
        'very-strong': 100
    };

    strengthFill.style.width = percentages[strength] + '%';
    strengthFill.className = `fill ${strength}`;

    // Update text
    strengthText.textContent = `${analysis.strength.replace('-', ' ').toUpperCase()} (${score}/100)`;
    strengthText.className = `strength-text ${strength}`;
}

function updateCharacterAnalysis(analysis) {
    let html = `
        <div class="char-item"><span>Lowercase:</span><span class="char-count">${analysis.hasLower ? '✓ ' + countChars(/[a-z]/, analysis.length) : '✗'}</span></div>
        <div class="char-item"><span>Uppercase:</span><span class="char-count">${analysis.hasUpper ? '✓ ' + countChars(/[A-Z]/, analysis.length) : '✗'}</span></div>
        <div class="char-item"><span>Numbers:</span><span class="char-count">${analysis.hasNumbers ? '✓ ' + countChars(/[0-9]/, analysis.length) : '✗'}</span></div>
        <div class="char-item"><span>Special:</span><span class="char-count">${analysis.hasSpecial ? '✓ ' + countChars(/[!@#$%^&*(),.?":{}|<>]/, analysis.length) : '✗'}</span></div>
        <div class="char-item"><span>Charset Size:</span><span class="char-count">${analysis.charsetSize}</span></div>
    `;
    charAnalysis.innerHTML = html;
}

function countChars(regex, totalLength) {
    const password = passwordInput.value;
    const matches = (password.match(new RegExp(regex.source, 'g')) || []).length;
    return matches;
}

function updateCrackTimeDisplay(analysis) {
    crackTime.innerHTML = `
        <div class="time-item"><span>Brute Force:</span><span>${analysis.crackTime}</span></div>
        <div class="time-item" style="font-size: 12px; opacity: 0.8;">
            <span>(10B guesses/sec)</span>
        </div>
    `;
}

function updateTips(analysis) {
    const tipsMap = {
        'very-weak': [
            'Password is extremely easy to crack',
            'Add length (12+ chars)',
            'Include uppercase, numbers, symbols'
        ],
        'weak': [
            'Password is still vulnerable',
            'Make it 12+ characters long',
            'Mix all character types'
        ],
        'moderate': [
            'Better, but can be improved',
            'Try 14+ characters',
            'Avoid common words/patterns'
        ],
        'strong': [
            'Good password!',
            'Consider 16+ characters',
            'Avoid personal info/dates'
        ],
        'very-strong': [
            'Excellent! Very secure',
            'This would take centuries to crack',
            'Perfect balance of complexity'
        ]
    };

    const tipsList = tipsMap[analysis.strength];
    tips.innerHTML = `
        <strong>${analysis.strength.replace('-', ' ').toUpperCase()} TIPS:</strong>
        <ul>${tipsList.map(tip => `<li>${tip}</li>`).join('')}</ul>
    `;
}

function resetDisplay() {
    strengthFill.style.width = '0%';
    strengthFill.className = 'fill';
    strengthText.textContent = 'Enter a password';
    strengthText.className = 'strength-text';
    charAnalysis.innerHTML = '';
    crackTime.innerHTML = '';
    tips.innerHTML = '';
}

// Initialize
resetDisplay();