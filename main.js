const startButton = document.getElementById("startButton");
const start = document.getElementById("start");
const game = document.getElementById("game");
const box = document.getElementById("box");
const endGame = document.getElementById("endGame");
const endGameScore = document.getElementById("endGameScore")
console.log("JS loaded");
const windowWidth = window.innerWidth; //screen width
const windowHeight = window.innerHeight; //screen height
const parentID = box.parentElement.id;
const timeDisplay = document.getElementById("timeDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const livesDisplay = document.getElementById("livesDisplay");
let score = 0;
let seconds = 5;
let timerCount;
let lives =3;




startButton.addEventListener("click", (e) =>{
console.log("Game started");
startGame();
});

console.log('screen is '+ windowWidth +" by "+windowHeight);


function startGame(){
    start.style.display = 'none';
    game.style.display = 'flex';
    generateBox();

    timer();
}

function generateBox(){
const width = box.parentElement.clientWidth;
const height = box.parentElement.clientHeight;
console.log(parentID +' is '+width+" by "+height);
box.style.background = generateRandomHexColor();
    box.style.left = (getRandomNumber(box.clientWidth,width)-box.clientWidth)+'px';
    box.style.top = (getRandomNumber(box.clientHeight,height)-box.clientHeight)+'px';
timer();
livesCount();
}

function getRandomNumber(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*     let count = 5;
    const timerId = setInterval(() => {
      console.log(`Count: ${count = count-0.1}`);
      timeDisplay.textContent = count;
      if (count === 0) {
        generateBox();
        clearInterval(timerId); // Stop the interval after 5 counts
      }
    }, 500); */

/* function caught(){
    score = score + 100;
    scoreDisplay.textContent = score;
    generateBox();
    mySound.play();


} */

function unCaught(){
  //lives -1
  livesCount('reduce');

      if(lives <= 0){
      gameOver();
    }


  //reset timer
generateBox();
  //generate box
}

function livesCount(action){
if (action === 'reduce'){
  lives = lives - 1;
}
livesDisplay.innerText = lives;
}

function timer(){

  
    if(timerCount){
clearInterval(timerCount);
  }



  let count = seconds;
  timerCount = setInterval(() => {
    count = Math.max(0, (count - 0.1).toFixed(1));
    timeDisplay.textContent = count;
    if (count <= 0) {
      clearInterval(timerCount);
      // You can add game over logic here if needed
      unCaught();
    }
  }, 100);
}

function gameOver(){
  game.style.display = 'none';
  endGame.style.display = 'flex';
  endGameScore.textContent = score;
} 

function generateRandomHexColor() {
  // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
  const randomColor = Math.floor(Math.random() * 16777216);
  
  // Convert to hexadecimal and pad with zeros if needed
  const hexColor = '#' + randomColor.toString(16).padStart(6, '0');
  
  return hexColor;
}

class SoundPlayer {
  constructor(audioUrl) {
    this.audio = new Audio(audioUrl); // Use the parameter, not hardcoded path
    this.audio.preload = 'auto';
  }
  
  play() {
    this.audio.currentTime = 0; // Reset to beginning
    this.audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
}

// Create an instance first
const mySound = new SoundPlayer('sounds/334849__dneproman__ma_sfx_8bit_tech_gui_4.wav');

// Then play the sound


// Add this to your main.js file

// Explosion system
function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();
    
    // Get the center position of the clicked element
    const centerX = rect.left + rect.width / 2 - parentRect.left;
    const centerY = rect.top + rect.height / 2 - parentRect.top;
    
    // Get the element's color for particles
    const elementColor = window.getComputedStyle(element).backgroundColor;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'explosion-container';
    particleContainer.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.parentElement.appendChild(particleContainer);
    
    // Create particles
    const particleCount = 12;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        // Random angle for each particle
        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const velocity = 100 + Math.random() * 50; // Random speed
        const size = 4 + Math.random() * 4; // Random size
        
        particle.style.cssText = `
            position: absolute;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${elementColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
        `;
        
        particleContainer.appendChild(particle);
        particles.push({
            element: particle,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1.0,
            decay: 0.02 + Math.random() * 0.01
        });
    }
    
    // Animate particles
    function animateParticles() {
        let activeParticles = 0;
        
        particles.forEach(particle => {
            if (particle.life <= 0) return;
            
            activeParticles++;
            
            // Update position
            const currentLeft = parseFloat(particle.element.style.left);
            const currentTop = parseFloat(particle.element.style.top);
            
            particle.element.style.left = (currentLeft + particle.vx * 0.016) + 'px';
            particle.element.style.top = (currentTop + particle.vy * 0.016) + 'px';
            
            // Apply gravity
            particle.vy += 200 * 0.016;
            
            // Fade out
            particle.life -= particle.decay;
            particle.element.style.opacity = Math.max(0, particle.life);
            
            // Shrink
            const scale = particle.life;
            particle.element.style.transform = `scale(${scale})`;
        });
        
        if (activeParticles > 0) {
            requestAnimationFrame(animateParticles);
        } else {
            // Clean up
            particleContainer.remove();
        }
    }
    
    // Start animation
    requestAnimationFrame(animateParticles);
}

// Enhanced explosion with shape fragments
function createShapeExplosion(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2 - parentRect.left;
    const centerY = rect.top + rect.height / 2 - parentRect.top;
    
    // Get element properties
    const computedStyle = window.getComputedStyle(element);
    const elementColor = computedStyle.backgroundColor;
    const elementBorder = computedStyle.border;
    
    // Create explosion container
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'shape-explosion-container';
    explosionContainer.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.parentElement.appendChild(explosionContainer);
    
    // Create shape fragments
    const fragmentCount = 8;
    const fragments = [];
    
    for (let i = 0; i < fragmentCount; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'explosion-fragment';
        
        const angle = (i / fragmentCount) * Math.PI * 2;
        const velocity = 80 + Math.random() * 40;
        const size = (rect.width / 4) + Math.random() * (rect.width / 4);
        const rotation = Math.random() * 360;
        
        fragment.style.cssText = `
            position: absolute;
            left: ${centerX - size/2}px;
            top: ${centerY - size/2}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${elementColor};
            border: ${elementBorder};
            transform: rotate(${rotation}deg);
            pointer-events: none;
            z-index: 1001;
        `;
        
        // Copy shape class for different shapes
        if (element.classList.contains('square')) {
            fragment.classList.add('square');
        }
        // Add more shape types here as you create them
        
        explosionContainer.appendChild(fragment);
        fragments.push({
            element: fragment,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            rotation: rotation,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.01
        });
    }
    
    // Animate fragments
    function animateFragments() {
        let activeFragments = 0;
        
        fragments.forEach(fragment => {
            if (fragment.life <= 0) return;
            
            activeFragments++;
            
            // Update position
            const currentLeft = parseFloat(fragment.element.style.left);
            const currentTop = parseFloat(fragment.element.style.top);
            
            fragment.element.style.left = (currentLeft + fragment.vx * 0.016) + 'px';
            fragment.element.style.top = (currentTop + fragment.vy * 0.016) + 'px';
            
            // Apply gravity
            fragment.vy += 150 * 0.016;
            
            // Update rotation
            fragment.rotation += fragment.rotationSpeed;
            
            // Fade and shrink
            fragment.life -= fragment.decay;
            const opacity = Math.max(0, fragment.life);
            const scale = Math.max(0.1, fragment.life * 0.8);
            
            fragment.element.style.transform = `rotate(${fragment.rotation}deg) scale(${scale})`;
            fragment.element.style.opacity = opacity;
        });
        
        if (activeFragments > 0) {
            requestAnimationFrame(animateFragments);
        } else {
            explosionContainer.remove();
        }
    }
    
    requestAnimationFrame(animateFragments);
}

// Update your caught() function to include explosion
function caught() {
    const box = document.getElementById("box");
    
    // Create explosion effect
    createShapeExplosion(box); // or use createExplosion(box) for particle effect
    
    // Hide the original box immediately
    box.style.opacity = '0';
    box.style.transform = 'scale(1.2)';
    
    // Update score and play sound
    score = score + 100;
    scoreDisplay.textContent = score;
    mySound.play();
    
    // Generate new box after a short delay
    setTimeout(() => {
        box.style.opacity = '1';
        box.style.transform = 'scale(1)';
        generateBox();
    }, 200);
}