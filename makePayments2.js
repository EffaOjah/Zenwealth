import Flutterwave from 'flutterwave-node-v3';
const flw = new Flutterwave('FLWPUBK-0647d4046dee374ec82ca12d2d0e51cc-X', 'FLWSECK-4dc0795b2077db65fe10629efc413d43-18e2fd91e82vt-X');

const details = {
    title:  "Staff salary for April",
    bulk_data: [
        {
            bank_code: "057",
            account_number: "2598536725",
            amount: 100,
            currency: "NGN",
            narration: "Salary payment for April",
        },
        {
            bank_code: "044",
            account_number: "1632841092",
            amount: 100,
            currency: "NGN",
            narration: "Salary payment for April",
        }
    ]
};
const response = await flw.Transfer.bulk(details)
.then((response)=>{
    console.log(response);
})
.catch((err)=>{
    console.log(err);
});