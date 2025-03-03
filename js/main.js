document.addEventListener('DOMContentLoaded', () => {
    const passwordChecker = new PasswordStrengthChecker();
    const elements = {
        password: document.getElementById('password'),
        togglePassword: document.getElementById('togglePassword'),
        strengthMeter: document.getElementById('strength-meter-fill'),
        strengthLabel: document.getElementById('strength-label'),
        strengthScore: document.getElementById('strength-score'),
        timeToCrack: document.getElementById('time-to-crack'),
        generateButton: document.getElementById('generate-password'),
        copyButton: document.getElementById('copy-password'),
        criteriaIcons: {
            length: document.getElementById('length-icon'),
            uppercase: document.getElementById('uppercase-icon'),
            lowercase: document.getElementById('lowercase-icon'),
            numbers: document.getElementById('numbers-icon'),
            special: document.getElementById('special-icon'),
            patterns: document.getElementById('patterns-icon')
        }
    };

    function updateUI(result) {
        // Update strength meter
        elements.strengthMeter.style.width = `${result.score}%`;
        elements.strengthScore.textContent = `${result.score}/100`;

        // Update strength label and color
        let strengthText = 'Very Weak';
        let color = 'var(--danger-color)';

        if (result.score >= 80) {
            strengthText = 'Very Strong';
            color = 'var(--success-color)';
        } else if (result.score >= 60) {
            strengthText = 'Strong';
            color = '#70e000';
        } else if (result.score >= 40) {
            strengthText = 'Medium';
            color = 'var(--warning-color)';
        } else if (result.score >= 20) {
            strengthText = 'Weak';
            color = '#fb5607';
        }

        elements.strengthLabel.textContent = `Strength: ${strengthText}`;
        elements.strengthMeter.style.backgroundColor = color;

        // Update crack time
        elements.timeToCrack.textContent = `Time to crack: ${result.crackTime}`;
        elements.timeToCrack.style.backgroundColor = getTimeColor(result.crackTime);

        // Update criteria icons
        Object.entries(result.requirements).forEach(([requirement, isMet]) => {
            const icon = elements.criteriaIcons[requirement];
            if (icon) {
                icon.classList.toggle('success', isMet);
                icon.classList.toggle('pending', !isMet);
            }
        });
    }

    function getTimeColor(timeText) {
        if (timeText.includes('instantly') || 
            timeText.includes('seconds') || 
            timeText.includes('minutes')) {
            return '#ffccd5';
        } else if (timeText.includes('hours') || 
                   timeText.includes('days')) {
            return '#ffe5d9';
        } else if (timeText.includes('years') && !timeText.includes('centuries')) {
            return '#e9f5db';
        } else {
            return '#d8f3dc';
        }
    }

    // Event Listeners
    elements.password.addEventListener('input', (e) => {
        const result = passwordChecker.calculateStrength(e.target.value);
        updateUI(result);
    });

    elements.togglePassword.addEventListener('click', () => {
        const type = elements.password.type === 'password' ? 'text' : 'password';
        elements.password.type = type;
        elements.togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    elements.generateButton.addEventListener('click', () => {
        const password = generateStrongPassword();
        elements.password.value = password;
        elements.password.type = 'text';
        elements.togglePassword.textContent = 'Hide';
        const result = passwordChecker.calculateStrength(password);
        updateUI(result);
    });

    elements.copyButton.addEventListener('click', async () => {
        if (elements.password.value) {
            try {
                await navigator.clipboard.writeText(elements.password.value);
                elements.copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    elements.copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    });
});

function generateStrongPassword() {
    const length = 16;
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()-_=+'
    };

    let password = '';
    
    // Ensure at least one character from each set
    Object.values(charset).forEach(chars => {
        password += chars[Math.floor(Math.random() * chars.length)];
    });

    // Fill the rest with random characters
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
} 