const currentUrl = window.location.href;
const everything = currentUrl.split('?');
let formData = everything[1].split('&');

const currentDate = new Date();
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
};
const currentDateTime = currentDate.toLocaleString(undefined, options);
console.log(currentDateTime);


function show(cup) {
    console.log(cup)
    formData.forEach(element => {
        if (element.startsWith(cup)) {
            result=element.split('=')[1].replace("%40", "@")
        }
    });
    return(result)
}

const showInfo = document.querySelector('#results');
showInfo.innerHTML = `
    <p>Full Name: ${show('fname')} ${show('lname')}</p>
    <p>Email: ${show('email')}</p>
    <p>Phone Number ${show('phone-number')}</p>
    <p>Organization Name: ${show('age')}</p>
    <p>Date Submitted: ${currentDateTime}</p> 

`;