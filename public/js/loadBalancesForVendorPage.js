// var totalAffiliateBalanceSpan =  document.getElementsByClassName('totalAffiliateBalance');
// var availabletotalAffiliateBalanceSpan =  document.getElementsByClassName('availableAffiliateBalance');
// var ZenCoinsSpan =  document.getElementsByClassName('totalZenCoins');
var ZenPointsSpan =  document.getElementsByClassName('totalZenpoints');
var directReferralBalance =  document.getElementsByClassName('directReferralBalance');
var indirectReferralBalance =  document.getElementsByClassName('indirectReferralBalance');

document.addEventListener('DOMContentLoaded', async ()=>{

    // Load all user's balances
    try {
       const response = await fetch('/loadBalances');

       if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);    
       }
       const data = await response.json();

    //    console.log(data);

      //  totalAffiliateBalanceSpan[0].innerHTML = `$${Math.floor((data.getTotalDirectReferralBalance[0].balance / 1500) * 100) / 100}`;

    //    totalAffiliateBalanceSpan[0].innerHTML = '$' + (Math.floor((data.getTotalDirectReferralBalance[0].balance / 1500) * 100) / 100 + Math.floor((data.getTotalIndirectReferralBalance[0].balance / 1500) * 100) / 100);

      //  totalAffiliateBalanceSpan[0].classList.remove('spinner-border');

      //  availabletotalAffiliateBalanceSpan[0].innerHTML = `$${Math.floor((data.getTotalAffiliateBalanceView[0].affiliateBalance / 1500) * 100) / 100}`;
      //  availabletotalAffiliateBalanceSpan[0].classList.remove('spinner-border');

      //  ZenCoinsSpan[0].innerHTML = !data.getTotalZenCoinsView[0].zenCoins ? `0ZC` : `${data.getTotalZenCoinsView[0].zenCoins}ZC`;

      //  ZenCoinsSpan[0].classList.remove('spinner-border');

      let totalZenpointsValue = data.getTotalZenPointsView[0].ZenPoints / 1500;

      ZenPointsSpan[0].innerHTML = !data.getTotalZenPointsView[0].ZenPoints ? `$0` : `$${Math.floor(totalZenpointsValue * 100) / 100}`;
      
      //  ZenPointsSpan[1].innerHTML = !data.getTotalZenPointsView[0].ZenPoints ? `$0` : `$${Math.floor((data.getTotalZenPointsView[0].ZenPoints / 1500) * 100) / 100}`;

       ZenPointsSpan[0].classList.remove('spinner-border');
      //  ZenPointsSpan[1].classList.remove('spinner-border');

      let getTotalDirectReferralValue = data.getTotalDirectReferralBalance[0].balance / 1500;

      directReferralBalance[0].innerHTML = `$${Math.floor(getTotalDirectReferralValue * 100) / 100}`;

       directReferralBalance[0].classList.remove('spinner-border');
      //  directReferralBalance[1].classList.remove('spinner-border');

      let getTotalIndirectReferralValue = data.getTotalIndirectReferralBalance[0].balance / 1500;

      indirectReferralBalance[0].innerHTML = `$${Math.floor(getTotalIndirectReferralValue * 100) / 100}`;

       indirectReferralBalance[0].classList.remove('spinner-border');
      //  indirectReferralBalance[1].classList.remove('spinner-border');

    //    gameBalance.innerHTML = `$${Math.floor((data.getTotalGameBalanceView[0].gameBalance / 1500) * 100) / 100}`;

    //    gameBalance.classList.remove('spinner-border');
    } catch (error) {
        console.log('Error while loading balances: ', error);
    }
});