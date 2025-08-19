class AdultingScorecard {
    constructor() {
        this.currentScore = 0;
        this.maxScore = 258; // Sum of all possible points
        this.checkboxes = document.querySelectorAll('input[type="checkbox"]');
        this.scoreDisplay = document.getElementById('currentScore');
        this.scoreBar = document.getElementById('scoreBar');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.adultLevel = document.getElementById('adultLevel');
        this.scoreCircle = document.querySelector('.score-circle');
        
        this.adultLevels = [
            { min: 0, max: 35, level: "Baby Adult", emoji: "👶" },
            { min: 36, max: 70, level: "Teenage Adult", emoji: "🧑‍🎓" },
            { min: 71, max: 110, level: "Young Adult", emoji: "🧑‍💼" },
            { min: 111, max: 155, level: "Proper Adult", emoji: "👨‍💻" },
            { min: 156, max: 200, level: "Super Adult", emoji: "🦸‍♀️" },
            { min: 201, max: 245, level: "Ultra Adult", emoji: "👑" },
            { min: 246, max: 258, level: "Legendary Adult", emoji: "🏆" }
        ];
        
        this.init();
    }
    
    init() {
        // Add event listeners to all checkboxes
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateScore());
        });
        
        // Initialize display
        this.updateScore();
        
        // Add some initial animation
        setTimeout(() => {
            this.scoreCircle.style.transform = 'scale(1)';
        }, 100);
    }
    
    calculateScore() {
        let total = 0;
        this.checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.dataset.score);
            }
        });
        return total;
    }
    
    updateScore() {
        const newScore = this.calculateScore();
        const scoreChanged = newScore !== this.currentScore;
        this.currentScore = newScore;
        
        // Update score display with animation
        if (scoreChanged) {
            this.animateScoreChange();
        }
        
        this.scoreDisplay.textContent = this.currentScore;
        
        // Update progress bar
        const percentage = Math.round((this.currentScore / this.maxScore) * 100);
        this.scoreBar.style.setProperty('--progress', `${percentage}%`);
        this.scorePercentage.textContent = `${percentage}%`;
        
        // Update adult level
        this.updateAdultLevel();
        
        // Update category completion status
        this.updateCategoryStatus();
        
        // Save score to localStorage
        this.saveScore();
    }
    
    animateScoreChange() {
        this.scoreCircle.classList.add('updated');
        setTimeout(() => {
            this.scoreCircle.classList.remove('updated');
        }, 300);
    }
    
    updateAdultLevel() {
        const level = this.adultLevels.find(level => 
            this.currentScore >= level.min && this.currentScore <= level.max
        );
        
        if (level) {
            this.adultLevel.innerHTML = `${level.emoji} ${level.level}`;
            
            // Add special styling based on level
            this.adultLevel.className = 'adult-level';
            if (this.currentScore >= 180) {
                this.adultLevel.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
                this.adultLevel.style.webkitBackgroundClip = 'text';
                this.adultLevel.style.webkitTextFillColor = 'transparent';
                this.adultLevel.style.fontWeight = '700';
            } else if (this.currentScore >= 140) {
                this.adultLevel.style.color = '#28a745';
                this.adultLevel.style.fontWeight = '600';
            } else {
                this.adultLevel.style.color = '#667eea';
                this.adultLevel.style.fontWeight = '600';
            }
        }
    }
    
    updateCategoryStatus() {
        const categories = document.querySelectorAll('.category');
        
        categories.forEach(category => {
            const checkboxes = category.querySelectorAll('input[type="checkbox"]');
            const checkedBoxes = category.querySelectorAll('input[type="checkbox"]:checked');
            
            // Mark category as completed if all checkboxes are checked
            if (checkboxes.length > 0 && checkedBoxes.length === checkboxes.length) {
                category.classList.add('completed');
            } else {
                category.classList.remove('completed');
            }
        });
    }
    
    saveScore() {
        const data = {
            score: this.currentScore,
            checkedItems: Array.from(this.checkboxes).map(cb => cb.checked),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('adultingScore', JSON.stringify(data));
    }
    
    loadScore() {
        const saved = localStorage.getItem('adultingScore');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Restore checked state
                data.checkedItems.forEach((checked, index) => {
                    if (this.checkboxes[index]) {
                        this.checkboxes[index].checked = checked;
                    }
                });
                
                // Update display
                this.updateScore();
                
                return true;
            } catch (e) {
                console.warn('Could not load saved score:', e);
                return false;
            }
        }
        return false;
    }
    
    reset() {
        this.checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateScore();
        localStorage.removeItem('adultingScore');
    }
    
    // Method to get detailed breakdown
    getScoreBreakdown() {
        const breakdown = {};
        const categories = document.querySelectorAll('.category');
        
        categories.forEach(category => {
            const categoryName = category.querySelector('h3').textContent.trim();
            const checkboxes = category.querySelectorAll('input[type="checkbox"]');
            let categoryScore = 0;
            let maxCategoryScore = 0;
            
            checkboxes.forEach(checkbox => {
                const score = parseInt(checkbox.dataset.score);
                maxCategoryScore += score;
                if (checkbox.checked) {
                    categoryScore += score;
                }
            });
            
            breakdown[categoryName] = {
                current: categoryScore,
                max: maxCategoryScore,
                percentage: maxCategoryScore > 0 ? Math.round((categoryScore / maxCategoryScore) * 100) : 0
            };
        });
        
        return breakdown;
    }
}

// Utility functions for additional features
function showScoreBreakdown() {
    const breakdown = scorecard.getScoreBreakdown();
    let message = "Score Breakdown:\n\n";
    
    Object.entries(breakdown).forEach(([category, data]) => {
        message += `${category}: ${data.current}/${data.max} (${data.percentage}%)\n`;
    });
    
    alert(message);
}

function shareScore() {
    const score = scorecard.currentScore;
    const percentage = Math.round((score / scorecard.maxScore) * 100);
    const level = scorecard.adultLevels.find(level => 
        score >= level.min && score <= level.max
    );
    
    const shareText = `I scored ${score}/${scorecard.maxScore} (${percentage}%) on the "Am I An Adult?" test! I'm a ${level.level} ${level.emoji}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Adulting Score',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.href)
            .then(() => alert('Score copied to clipboard!'))
            .catch(() => alert(shareText));
    }
}

// Initialize the scorecard when the page loads
let scorecard;

document.addEventListener('DOMContentLoaded', () => {
    scorecard = new AdultingScorecard();
    
    // Try to load saved score
    scorecard.loadScore();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    if (confirm('Reset all checkboxes? This cannot be undone.')) {
                        scorecard.reset();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    shareScore();
                    break;
                case 'b':
                    e.preventDefault();
                    showScoreBreakdown();
                    break;
            }
        }
    });
    
    // Add some easter eggs for high scores
    document.addEventListener('click', (e) => {
        if (scorecard.currentScore >= 200 && Math.random() < 0.1) {
            createConfetti();
        }
    });
});

// Confetti animation for high scores
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const fall = confetti.animate([
            { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        fall.addEventListener('finish', () => {
            confetti.remove();
        });
    }
}

// Add a help function
function showHelp() {
    const helpText = `
🧑‍💼 Am I An Adult? - Help

Keyboard Shortcuts:
• Ctrl/Cmd + R: Reset all checkboxes
• Ctrl/Cmd + S: Share your score
• Ctrl/Cmd + B: Show score breakdown

Tips:
• Your progress is automatically saved
• Check off items that apply to you
• Watch your adult level change as you score points
• Aim for "Legendary Adult" status!

Scoring:
• Age milestones: 20 points each
• Major life events: 10-15 points
• Basic responsibilities: 2-5 points
• Total possible: 232 points
    `;
    
    alert(helpText);
}

// Make help function available globally
window.showHelp = showHelp;
