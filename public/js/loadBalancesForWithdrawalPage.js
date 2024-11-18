var affiliateBalanceSpan =  document.getElementsByClassName('affiliateBalance');
var nonAffiliateBalanceSpan =  document.getElementsByClassName('nonAffiliateBalance');
var activityBalance =  document.getElementsByClassName('activityBalance');

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
            let totalAffiliateBalanceValue = data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500;

            affiliateBalanceSpan[i].innerHTML = `Affiliate Balance: $${Math.floor(totalAffiliateBalanceValue * 100) / 100}`;
        }
        
        for (let i = 0; i < nonAffiliateBalanceSpan.length; i++) {
            nonAffiliateBalanceSpan[i].innerHTML = !data.getTotalZenCoinsView[0].zenCoins ? `Zen Coins: 0ZC` : `Zen Coins: ${data.getTotalZenCoinsView[0].zenCoins}ZC`;
        }

        for (let i = 0; i < activityBalance.length; i++) {
            let totalZenpointsValue = data.getTotalZenPointsView[0].ZenPoints / 1500;

            activityBalance[i].innerHTML = !data.getTotalZenPointsView[0].ZenPoints ? `Activity Balance: $0` : `Activity Balance: $${Math.floor(totalZenpointsValue * 100) / 100}`;
        }
     } catch (error) {
        return
        // console.log('Error while loading balances: ', error);
     }
}

document.addEventListener('DOMContentLoaded', async ()=>{
    fetchBalance();
});