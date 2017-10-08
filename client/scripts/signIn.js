var socket = io();

// sign
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

signDivSignIn.onclick = () => {
    socket.emit('signIn', {username:signDivUsername.value, password:signDivPassword.value});
}
signDivSignUp.onclick = () => {
    socket.emit('signUp', {username:signDivUsername.value, password:signDivPassword.value});
}
socket.on('signInResponse', (data) => {
    if (data.success) {
        signDiv.style.display = 'none';
        gameDiv.style.display = 'inline-block';
    } else {
        alert ('sign in unsuccessful');
    }
});
socket.on('signUpresponse', (data) => {
    if (data.success) {
        alert('sign up successful');
    } else {
        alert('sign up unsuccessful');
    }
});