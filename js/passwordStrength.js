class PasswordStrengthChecker {
    constructor() {
        this.minLength = 12;
        this.patterns = {
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            numbers: /[0-9]/,
            special: /[^A-Za-z0-9]/,
            commonPatterns: /(123|abc|qwerty|password|admin)/i
        };
    }

    calculateStrength(password) {
        if (!password) {
            return {
                score: 0,
                requirements: this.getEmptyRequirements(),
                crackTime: '--'
            };
        }

        const requirements = {
            length: password.length >= this.minLength,
            uppercase: this.patterns.uppercase.test(password),
            lowercase: this.patterns.lowercase.test(password),
            numbers: this.patterns.numbers.test(password),
            special: this.patterns.special.test(password),
            patterns: !this.patterns.commonPatterns.test(password)
        };

        // Calculate base score
        let score = 0;
        Object.values(requirements).forEach(requirement => {
            if (requirement) score += 16.67; // 100 / 6 requirements
        });

        // Calculate entropy and crack time
        const entropy = this.calculateEntropy(password);
        const crackTime = this.estimateCrackTime(entropy);

        return {
            score: Math.min(100, Math.round(score)),
            requirements,
            crackTime
        };
    }

    calculateEntropy(password) {
        let charsetSize = 0;
        if (this.patterns.lowercase.test(password)) charsetSize += 26;
        if (this.patterns.uppercase.test(password)) charsetSize += 26;
        if (this.patterns.numbers.test(password)) charsetSize += 10;
        if (this.patterns.special.test(password)) charsetSize += 32;
        
        return Math.log2(Math.pow(charsetSize, password.length));
    }

    estimateCrackTime(entropy) {
        const guessesPerSecond = 1000000000; // 1 billion guesses per second
        const seconds = Math.pow(2, entropy) / guessesPerSecond;

        if (seconds < 60) return 'instantly';
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        return `${Math.round(seconds / 31536000)} years`;
    }

    getEmptyRequirements() {
        return {
            length: false,
            uppercase: false,
            lowercase: false,
            numbers: false,
            special: false,
            patterns: true
        };
    }
} 