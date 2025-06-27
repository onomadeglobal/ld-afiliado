document.addEventListener('DOMContentLoaded', function() {
    // Card images
    const cardImages = [
        './wp-content/uploads/2025/03/card_wheel_of_fortune-v7.png',
        './wp-content/uploads/2025/03/card_tower-v7.png',
        './wp-content/uploads/2025/03/card-magician-v7.png'
    ];
    
    // Shuffle the card images
    const shuffledImages = [...cardImages].sort(() => Math.random() - 0.5);
    
    // Cookie and URL parameter functions
    function checkCardsSelected() {
        return document.cookie.split(';').some(item => item.trim().startsWith('cardsSelected=true'));
    }

    function setCardsSelectedCookie() {
        const date = new Date();
        date.setTime(date.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days expiry
        document.cookie = `cardsSelected=true;expires=${date.toUTCString()};path=/`;
    }

    function getAllUrlParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let params = '';
        for(const [key, value] of urlParams.entries()) {
            params += (params === '' ? '?' : '&') + key + '=' + encodeURIComponent(value);
        }
        return params;
    }

    function getAllCookies() {
        const cookies = document.cookie.split(';');
        let cookieParams = '';
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value && name !== 'cardsSelected') {
                cookieParams += (cookieParams === '' ? '?' : '&') + name + '=' + encodeURIComponent(value);
            }
        });
        return cookieParams;
    }
    
    // Variables to track game state
    let selectedCards = 0;
    const maxSelections = 3;
    let selectedCardElements = [];
    let animationInProgress = false;
    
    // Determine if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Number of cards to display (9 on mobile for symmetry, 7 on desktop)
    const numCards = isMobile ? 9 : 7;
    
    // Get DOM elements
    const cardsContainer = document.getElementById('cardsContainer');
    const ctaButton = document.getElementById('ctaButton');
    const readingMessage = document.getElementById('readingMessage');
    const progressBar = document.querySelector('.progress-container');
    const progressSegments = [
        document.getElementById('segment1'),
        document.getElementById('segment2'),
        document.getElementById('segment3')
    ];

    // Check if cards were already selected before initializing
    if (checkCardsSelected()) {
        // Show message
        const instructionText = document.querySelector('.instruction-text');
        if (instructionText) {
            instructionText.innerHTML = 'Suas cartas foram selecionadas!';
        }
        
        // Create final cards container
        const finalCardsContainer = document.createElement('div');
        finalCardsContainer.className = 'final-cards-container';
        finalCardsContainer.setAttribute('role', 'region');
        finalCardsContainer.setAttribute('aria-label', 'Cartas selecionadas');
        
        // Create the three selected cards
        for (let i = 0; i < 3; i++) {
            const card = document.createElement('div');
            card.className = 'card flipped selected selected-final';
            if (i === 1) card.classList.add('middle-card');
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            const frontImg = document.createElement('img');
            frontImg.src = cardImages[i];
            frontImg.alt = 'Card Front';
            cardFront.appendChild(frontImg);
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            const backImg = document.createElement('img');
            backImg.src = './wp-content/uploads/2025/03/card_bkg-05.png';
            backImg.alt = 'Card Back';
            cardBack.appendChild(backImg);
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            finalCardsContainer.appendChild(card);
        }
        
        // Clear and add the final container
        cardsContainer.innerHTML = '';
        cardsContainer.appendChild(finalCardsContainer);
        
        // Show reading message
        if (readingMessage) {
            readingMessage.classList.remove('hidden');
            readingMessage.classList.add('visible');
        }
        
        // Show CTA button
        if (ctaButton) {
            ctaButton.classList.remove('hidden');
            ctaButton.classList.add('flex', 'justify-center');
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }
        
        // Update progress bar to show all segments filled
        progressSegments.forEach(segment => segment.classList.add('active'));
        
        return; // Exit early
    }

    // Initialize progress bar
    updateProgressBar();
    
    // Create twinkling stars
    createStars();

    // Modify CTA button to include parameters
    if (ctaButton) {
        const ctaLink = ctaButton.querySelector('a');
        if (ctaLink) {
            ctaLink.addEventListener('click', function(e) {
                e.preventDefault();
                const baseUrl = this.href;
                const urlParams = getAllUrlParams();
                const cookieParams = getAllCookies();
                
                // Combine parameters, avoiding duplicate '?'
                let finalUrl = baseUrl;
                if (urlParams) {
                    finalUrl += urlParams;
                }
                if (cookieParams) {
                    finalUrl += (urlParams ? '&' : '?') + cookieParams.substring(1);
                }
                
                window.location.href = finalUrl;
            });
        }
    }

    // Function to create twinkling stars
    function createStars() {
        const backgroundElement = document.querySelector('.absolute.inset-0.z-0');
        const numStars = 70; // Increased number of stars
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random size between 2px and 5px (larger stars)
            const size = Math.random() * 3 + 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random animation duration and delay
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            star.style.setProperty('--delay', `${Math.random() * 5}s`);
            
            // Add occasional larger "special" stars
            if (i % 10 === 0) {
                star.style.width = '6px';
                star.style.height = '6px';
                star.style.boxShadow = '0 0 15px 4px rgba(255, 215, 0, 0.9)';
            }
            
            backgroundElement.appendChild(star);
        }
    }
    
    // Function to update progress bar
    function updateProgressBar() {
        // Update the appropriate segment based on the number of selected cards
        for (let i = 0; i < maxSelections; i++) {
            if (i < selectedCards) {
                progressSegments[i].classList.add('active');
            } else {
                progressSegments[i].classList.remove('active');
            }
        }
        
        // Update ARIA attributes for accessibility
        progressBar.setAttribute('aria-valuenow', selectedCards);
    }
    
    // Function to create and animate cards with staggered delay
    function createCards() {
        for (let i = 0; i < numCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Carta ${i+1}`);
            card.setAttribute('tabindex', '0'); // Make it focusable
            
            // Set animation delay index for floating effect
            card.style.setProperty('--card-index', i);
            
            // Add staggered animation delay
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            // Add back image to all cards
            const backImg = document.createElement('img');
            backImg.src = './wp-content/uploads/2025/03/card_bkg-05.png';
            backImg.alt = 'Card Back';
            cardBack.appendChild(backImg);
            
            // Add card inner elements
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            // Add click event
            card.addEventListener('click', handleCardClick);
            
            // Add keyboard support for accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick.call(this);
                }
            });
            
            cardsContainer.appendChild(card);
            
            // Staggered animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100 * i);
        }
    }
    
    // Function to handle card click
    function handleCardClick() {
        // Prevent clicks during animations
        if (animationInProgress) return;
        
        // Only allow selection if we haven't reached the maximum
        if (selectedCards < maxSelections && !this.classList.contains('flipped')) {
            // Get the index of the selected card
            const cardIndex = parseInt(this.dataset.index);
            
            // Determine which image to show (cycle through the 3 available images)
            const imageIndex = selectedCards % shuffledImages.length;
            const frontImg = document.createElement('img');
            frontImg.src = shuffledImages[imageIndex];
            frontImg.alt = 'Card Front';
            
            // Add the image to the front of the card
            const frontDiv = this.querySelector('.card-front');
            frontDiv.innerHTML = '';
            frontDiv.appendChild(frontImg);
            
            // Flip the card
            this.classList.add('flipped', 'selected');
            this.setAttribute('aria-pressed', 'true');
            selectedCards++;
            
            // Store the selected card element
            selectedCardElements.push(this);
            
            // Update progress bar
            updateProgressBar();
            
            // Add a subtle sound effect (optional)
            playCardSound();
            
            // Update selection counter if needed
            updateSelectionCounter();
            
            // If we've reached the maximum selections, arrange the selected cards
            if (selectedCards === maxSelections) {
                // Set the cookie to mark cards as selected
                setCardsSelectedCookie();

                // Set animation flag
                animationInProgress = true;
                
                // Fade out non-selected cards with smoother transition
                const nonSelectedCards = document.querySelectorAll('.card:not(.selected)');
                
                nonSelectedCards.forEach(card => {
                    card.classList.add('disabled');
                    card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.7) translateY(10px)';
                });
                
                // Wait for fade out animation to complete
                setTimeout(() => {
                    // Remove non-selected cards
                    nonSelectedCards.forEach(card => card.remove());
                    
                    // Create a new container for the selected cards
                    const finalCardsContainer = document.createElement('div');
                    finalCardsContainer.className = 'final-cards-container';
                    finalCardsContainer.setAttribute('role', 'region');
                    finalCardsContainer.setAttribute('aria-label', 'Cartas selecionadas');
                    
                    // Add selected cards to the final container
                    selectedCardElements.forEach((card, index) => {
                        const clone = card.cloneNode(true);
                        clone.classList.add('selected-final');
                        if (index === 1) clone.classList.add('middle-card');
                        finalCardsContainer.appendChild(clone);
                    });
                    
                    // Clear original container and add the new one
                    cardsContainer.innerHTML = '';
                    cardsContainer.appendChild(finalCardsContainer);
                    
                    // Show reading message and CTA button
                    setTimeout(() => {
                        readingMessage.classList.remove('hidden');
                        setTimeout(() => {
                            readingMessage.classList.add('visible');
                            
                            setTimeout(() => {
                                ctaButton.classList.remove('hidden');
                                ctaButton.classList.add('flex', 'justify-center');
                                ctaButton.style.opacity = '0';
                                ctaButton.style.transform = 'translateY(20px)';
                                
                                setTimeout(() => {
                                    ctaButton.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                                    ctaButton.style.opacity = '1';
                                    ctaButton.style.transform = 'translateY(0)';
                                    
                                    // Add focus to the CTA button for accessibility
                                    const ctaLink = ctaButton.querySelector('a');
                                    if (ctaLink) {
                                        setTimeout(() => {
                                            ctaLink.focus();
                                        }, 100);
                                    }
                                    
                                    // Reset animation flag
                                    animationInProgress = false;
                                }, 50);
                            }, 800);
                        }, 100);
                    }, 500);
                }, 800);
            }
        }
    }
    
    // Function to update selection counter
    function updateSelectionCounter() {
        const remainingSelections = maxSelections - selectedCards;
        const counterText = document.querySelector('.instruction-text');
        
        if (remainingSelections > 0) {
            counterText.innerHTML = `👇 Clique para selecionar mais ${remainingSelections} carta${remainingSelections > 1 ? 's' : ''} 👇`;
        } else {
            counterText.innerHTML = 'Suas cartas foram selecionadas!';
        }
    }
    
    // Function to play card flip sound (optional)
    function playCardSound() {
        // This is optional and can be implemented if desired
        // const audio = new Audio('card-flip.mp3');
        // audio.play();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Only reload if crossing the mobile threshold
        const wasMobile = numCards === 9;
        const isMobileNow = window.innerWidth <= 768;
        
        if (wasMobile !== isMobileNow && selectedCards === 0) {
            location.reload();
        }
    });
    
    // Prevent zoom on double tap for touch devices
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        
        if (typeof lastTap === 'undefined') {
            lastTap = now;
            return;
        }
        
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            e.preventDefault();
        }
        
        lastTap = now;
    }, false);
    
    // Initialize the cards
    createCards();
    
    // Initialize selection counter
    updateSelectionCounter();
});
