// var affiliateBalanceSpan =  document.getElementsByClassName('totalAffiliateBalance');
// var nonAffiliateBalanceSpan =  document.getElementsByClassName('totalNonAffiliateBalance');
var directReferralBalance =  document.getElementsByClassName('directReferralBalance');
var indirectReferralBalance =  document.getElementsByClassName('indirectReferralBalance');
// var gameBalance =  document.getElementById('gameBalance');

document.addEventListener('DOMContentLoaded', async ()=>{

    // Load all user's balances
    try {
       const response = await fetch('/loadBalances');

       if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);    
       }
       const data = await response.json();

    //    console.log(data);

    //    affiliateBalanceSpan[0].innerHTML = `$${Math.floor((data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500) * 100) / 100}`;
    //    affiliateBalanceSpan[1].innerHTML = `$${Math.floor((data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500) * 100) / 100}`;
    //    affiliateBalanceSpan[2].innerHTML = `$${Math.floor((data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500) * 100) / 100}`;

    //    affiliateBalanceSpan[0].classList.remove('spinner-border');
    //    affiliateBalanceSpan[1].classList.remove('spinner-border');
    //    affiliateBalanceSpan[2].classList.remove('spinner-border');

    //    nonAffiliateBalanceSpan[0].innerHTML = !data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance ? `0ZenCoins` : `${data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance}ZenCoins`;
    //    nonAffiliateBalanceSpan[1].innerHTML = !data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance ? `0ZenCoins` : `${data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance}ZenCoins`;

    //    nonAffiliateBalanceSpan[0].classList.remove('spinner-border');
    //    nonAffiliateBalanceSpan[1].classList.remove('spinner-border');

       directReferralBalance[0].innerHTML = `$${Math.floor((data.getTotalDirectReferralBalance[0].balance / 1500) * 100) / 100}`;
    //    directReferralBalance[1].innerHTML = `$${Math.floor((data.getTotalDirectReferralBalance[0].balance / 1500) * 100) / 100}`;

       directReferralBalance[0].classList.remove('spinner-border');
    //    directReferralBalance[1].classList.remove('spinner-border');

       indirectReferralBalance[0].innerHTML = `$${Math.floor((data.getTotalIndirectReferralBalance[0].balance / 1500) * 100) / 100}`;
    //    indirectReferralBalance[1].innerHTML = `$${Math.floor((data.getTotalIndirectReferralBalance[0].balance / 1500) * 100) / 100}`;

       indirectReferralBalance[0].classList.remove('spinner-border');
    //    indirectReferralBalance[1].classList.remove('spinner-border');

    //    gameBalance.innerHTML = `$${Math.floor((data.getTotalGameBalanceView[0].gameBalance / 1500) * 100) / 100}`;

    //    gameBalance.classList.remove('spinner-border');
    } catch (error) {
        console.log('Error while loading balances: ', error);
    }
});