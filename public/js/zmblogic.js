// Script to handle mystery box logic
var mysteryImg = document.getElementById('mysteryImg');
const mysteryGif = document.getElementById('mysteryGif');
const gift = document.querySelector('.mystery-gift');
var giftValue = document.getElementsByClassName('mysteryGiftValue');
const mysteryValue = document.getElementById('mysteryValue');
var giftValue2 = document.getElementById('mysteryGiftValue');
var closeBtn = document.getElementById('closeBtn');
var mysteryGiftImg = document.getElementById('mysteryGiftImg'); 

mysteryImg.addEventListener('click', () => {
mysteryImg.style.animation = 'swellAndShake 3s forwards';

// After 4 seconds, hide the image and show the gif
setTimeout(() => {
    mysteryImg.style.display = 'none';
    mysteryGif.style.display = 'block';

    setTimeout(() => {
    gift.style.display = 'block';
    }, 300);

    setTimeout(() => {
    giftValue[0].style.display = 'block';
    giftValue[0].style.textAlign = 'center';
    giftValue[0].style.marginTop = '80px';

    mysteryImg.style.marginTop = '-20px';
    closeBtn.style.display = 'block';
    }, 800);

    // Add the move-down class after a delay to animate the movement
    setTimeout(() => {
    mysteryGif.classList.add('move-down');
    }, 50); // Delay before downward movement starts
}, 1000);
});


document.addEventListener('DOMContentLoaded', ()=>{
    // First, display the users' reward based on the value gotten from tyhe db
    if (mysteryValue.innerHTML > 0 && mysteryValue.innerHTML < 77) {
        // Update the nystery reward
        giftValue2.innerHTML = '100 naira';
    } else if (mysteryValue.innerHTML > 76 && mysteryValue.innerHTML < 87){
        // Update the nystery reward
        giftValue2.innerHTML = '200 naira';
    } else if (mysteryValue.innerHTML > 86 && mysteryValue.innerHTML < 92){
        // Update the nystery reward
        giftValue2.innerHTML = '300 naira';
    } else if (mysteryValue.innerHTML > 91 && mysteryValue.innerHTML < 97){
        // Update the nystery reward
        giftValue2.innerHTML = '400 naira';
    } else if (mysteryValue.innerHTML > 96 && mysteryValue.innerHTML < 101) {
        // Update the nystery reward
        giftValue2.innerHTML = '500 naira';
    } 
    // else if (mysteryValue.innerHTML > 96 && mysteryValue.innerHTML < 101) {
    //     // Update the nystery reward
    //     giftValue2.innerHTML = 'A free coupon code';
    //     // Set the mystery gift image
    //     mysteryGiftImg.src = '/img/coupon.png';
    // } 
    else {
       ('Invalid reward value');
        // Update the nystery reward
        giftValue2.innerHTML = 'null';
    }
});

mysteryImg.addEventListener('click', claimMysteryBoxReward);

// Function to claim mystery box reward
function claimMysteryBoxReward() {
    // Send a request to the server
    fetch('/claim-mystery-reward', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

closeBtn.addEventListener('click', ()=>{
    location.assign('/user/dashboard');
});