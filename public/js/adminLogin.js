
//login User
document.addEventListener('DOMContentLoaded', () => {
    try {
        //making sure that we don't try to getelementbyid until after the user clicks submit
        const form = document.getElementById('logInForm');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            //pass the username & pass to the server as res
            const res =  await fetch('/admin/login', {
                method: 'Post',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ username, password })
            });




            if (res.status === 200) {
                // login success → redirect to admin page
                window.location.href = '/admin/home';
            } else if (res.status === 400 ) {
                alert('Did not recieve credentials');
            } else if (res.status === 404 || res.status === 401 ) {
                alert('Incorrect Credentials');
            } else if (res.status === 500) {
                alert('Database Error');
            } else {
                alert('Server error');
            }
                
        });
    
    } catch (err) {

        console.error(err);
        // alert('Request failed');
    }


});           

