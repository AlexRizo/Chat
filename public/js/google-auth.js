const url = (window.location.hostname.includes('localhost') 
            ? 'http://localhost:8080/api/auth/'  
            : 'https://chat-perro.herokuapp.com/api/auth/');

const _token = localStorage.getItem('token') || '';

const form = document.querySelector('form');

if (_token && _token.length > 10) {
    window.location = 'chat.html';
}

form.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for(let el of form.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    } 

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if (msg) {
            return console.error(msg);
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err);
    })
})

function handleCredentialResponse(response) {
    const body = {id_token: response.credential};

    fetch(url + 'google', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({token}) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');

button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}