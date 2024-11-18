// Get the form element
const myForm = document.getElementById('withdrawalForm');

// Get all the inputs
const withdrawalType = myForm.withdrawalType;
const amount = myForm.amount;
const pin = myForm.pin;

myForm.addEventListener('submit', async(e)=>{
    // Prevent the form from submitting
    e.preventDefault();

    const data = {
        withdrawalType: withdrawalType.value,
        amount: amount.value,
        pin: pin.value
    }
    console.log(data);
    
    // Sending a post request to the server
    const fetchUrl = '/submit-withdrawal';
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(fetchUrl, fetchOptions)
    .then((response)=>{
        return response.json();
    })
    .then((result)=>{
        console.log('result: ', result);

        if (result.success) {
            // izitoastAlert('Success:', result.success, 'light', 'green');

            var myOffcanvas = new bootstrap.Offcanvas(document.getElementById('confirmCanvas'));

            document.getElementById('successMessage').innerHTML = result.success;
            myOffcanvas.show();

            fetchBalance();
        } else{
            // izitoastAlert('Error:', result.error, 'light', 'red');

            var myOffcanvas = new bootstrap.Offcanvas(document.getElementById('failureCanvas'));

            document.getElementById('errorMessage').innerHTML = result.error;
            myOffcanvas.show();
        }
    })
    .catch((error)=>{
        console.log('error: ', error);
        // izitoastAlert('Error:', error.error, 'light', 'red');

        var myOffcanvas = new bootstrap.Offcanvas(document.getElementById('failureCanvas'));

            document.getElementById('errorMessage').innerHTML = error.error;
            myOffcanvas.show();
    });
});