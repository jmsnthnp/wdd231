document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            // Get the form data
            const formData = {
                fname: document.getElementById('fname').value,
                lname: document.getElementById('lname').value,
                email: document.getElementById('email').value,
                phoneNumber: document.getElementById('phone-number').value,
                message: document.getElementById('your-message').value
            };

            // Store the form data in localStorage
            localStorage.setItem('contactFormData', JSON.stringify(formData));

            // Optionally, you can show a confirmation message
            alert('Your information has been saved locally.');
        });

        

        // Optionally, you can pre-fill the form with data from localStorage if it exists
        window.addEventListener('load', function() {
            const storedData = localStorage.getItem('contactFormData');
            if (storedData) {
                const formData = JSON.parse(storedData);
                document.getElementById('fname').value = formData.fname;
                document.getElementById('lname').value = formData.lname;
                document.getElementById('email').value = formData.email;
                document.getElementById('phone-number').value = formData.phoneNumber;
                document.getElementById('your-message').value = formData.message;
            }
        });
    } else {
        console.error('Contact form not found');
    }
});