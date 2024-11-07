// Script to handle mystery box logic
const mysteryValue = document.getElementById('mysteryValue');
var giftValue2 = document.getElementById('mysteryGiftValue');
var mysteryImg = document.getElementById('mysteryImg');
var closeBtn = document.getElementsByClassName('closeBtn');

document.addEventListener('DOMContentLoaded', ()=>{
    // First, display the users' reward based on the value gotten from tyhe db
    if (mysteryValue.innerHTML > 0 && mysteryValue.innerHTML < 51) {
        // Update the nystery reward
        giftValue2.innerHTML = '100 naira';
    } else if (mysteryValue.innerHTML > 50 && mysteryValue.innerHTML < 71){
        // Update the nystery reward
        giftValue2.innerHTML = '200 naira';
    } else if (mysteryValue.innerHTML > 70 && mysteryValue.innerHTML < 81){
        // Update the nystery reward
        giftValue2.innerHTML = '300 naira';
    } else if (mysteryValue.innerHTML > 80 && mysteryValue.innerHTML < 86){
        // Update the nystery reward
        giftValue2.innerHTML = '400 naira';
    } else if (mysteryValue.innerHTML > 85 && mysteryValue.innerHTML < 91) {
        // Update the nystery reward
        giftValue2.innerHTML = '500 naira';
    } else if (mysteryValue.innerHTML > 90 && mysteryValue.innerHTML < 101) {
        // Update the nystery reward
        giftValue2.innerHTML = 'A free coupon code';
    } else {
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

closeBtn[0].addEventListener('click', ()=>{
    location.assign('/user/dashboard');
});