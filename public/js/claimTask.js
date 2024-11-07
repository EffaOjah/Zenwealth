var claimTaskBtn = document.getElementById('claimTaskBtn');

claimTaskBtn.addEventListener('click', ()=>{
    // Check which task is to be claimed
    if (claimTaskBtn.innerHTML == 'Claim task 1') {
        // Send a request to the server to claim task 1
        fetch('/claim-task/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            location.assign('/user/dashboard');
        })
        .catch((err)=>{
            console.error(err);
        });
    } else if (claimTaskBtn.innerHTML == 'Claim task 2') {        
        // Send a request to the server to claim task 2
        fetch('/claim-task/2', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            location.assign('/user/dashboard');
        })
        .catch((err)=>{
            console.error(err);
        });
    } else if (claimTaskBtn.innerHTML == 'Claim all task') {
        // Send a request to the server to claim ALL task
        fetch('/claim-task/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            location.assign('/user/dashboard');
        })
        .catch((err)=>{
            console.error(err);
        });
    } else{
        location.assign('/user/dashboard');
    }
});