var affiliateBalanceSpan =  document.getElementsByClassName('affiliateBalance');
var nonAffiliateBalanceSpan =  document.getElementsByClassName('nonAffiliateBalance');
var gameBalance =  document.getElementsByClassName('gameBalance');

// Function to fetch the balances
async function fetchBalance() {
    // Load all user's balances
    try {
        const response = await fetch('/loadBalances');
 
        if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);    
        }
        const data = await response.json();
 
        // console.log(data);
 
        for (let i = 0; i < affiliateBalanceSpan.length; i++) {
            affiliateBalanceSpan[i].innerHTML = `Affiliate Balance: $${Math.floor((data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500) * 100) / 100}`;
        }
        
        for (let i = 0; i < nonAffiliateBalanceSpan.length; i++) {
            nonAffiliateBalanceSpan[i].innerHTML = `Zen Coins: ${data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance}`;
        }

        // for (let i = 0; i < gameBalance.length; i++) {
        //     gameBalance[i].innerHTML = `Game Balance: ${data.getTotalGameBalanceView[0].gameBalance / 1000}`;
        // }
     } catch (error) {
        return
        // console.log('Error while loading balances: ', error);
     }
}

document.addEventListener('DOMContentLoaded', async ()=>{
    fetchBalance();
});