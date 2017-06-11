var getBtn = document.getElementById('get-btn');

var postBtn = document.getElementById('post-btn');
var personInput = document.getElementById('person');
var amountInput = document.getElementById('amount');
var descInput = document.getElementById('desc');

var delBtn = document.getElementById('del-btn');
var idInput = document.getElementById('id');

var regBtn = document.getElementById('reg-btn');
var regNameInput = document.getElementById('reg-name');
var regUserInput = document.getElementById('reg-user');
var regPwInput = document.getElementById('reg-pw');

var loginBtn = document.getElementById('login-btn');
var loginUserInput = document.getElementById('login-user');
var loginPwInput = document.getElementById('login-pw');

var createBtn = document.getElementById('create-btn');
var joinBtn = document.getElementById('join-btn');
var roomIDInput = document.getElementById('room-id');
var roomNameInput = document.getElementById('room-name');
var roomPwInput = document.getElementById('room-pw');

var authBtn = document.getElementById('auth-btn');
var logoutBtn = document.getElementById('logout-btn');

var resText = document.getElementById('res-text');

function sendRequest(type, url, params, callback){
    console.log(type);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            callback(xhr.responseText);
        }
    }
    xhr.open(type, 'http://localhost:5000' + url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    resText.innerText = 'Waiting...';
}

getBtn.addEventListener('click', function() {
    sendRequest('GET', '/get', null, function(res) {
        console.log(res);
        try {
            var data = JSON.parse(res);
            resText.innerText = 'Count: ' + data[0] + '\n';
            for(var i = 1; i < data.length; i++){
                resText.innerText += '#' + i + ': ' + data[i] + '\n';
            }
        } catch(err) {
            resText.innerText = res;
        }
    });
});

function valid(pIn, aIn, dIn){
    return pIn !== '' ||
           aIn !== '' ||
           dIn !== '';
}

postBtn.addEventListener('click', function() {
    var pIn = personInput.value,
        aIn = amountInput.value,
        dIn = descInput.value;
    if(!valid(pIn, aIn, dIn)) {
        resText.innerText = "Inputs not valid";
        return;
    };

    var params = 'person=' + pIn +
                 '&amount=' + aIn +
                 '&desc=' + dIn;

    sendRequest('POST', '/add', params, function(res) {
        resText.innerText = res;
    });
});

delBtn.addEventListener('click', function() {
    var params = 'id=' + idInput.value;

    sendRequest('DELETE', '', params, function(res) {
        resText.innerText = res;
    });
});

regBtn.addEventListener('click', function() {
    var name = regNameInput.value;
    var user = regUserInput.value;
    var pw = regPwInput.value;
    var params = 'name=' + name +
                 '&username=' + user +
                 '&password=' + pw;

    sendRequest('POST', '/register', params, function(res) {
        resText.innerText = res;
    });
});

loginBtn.addEventListener('click', function() {
    var username = loginUserInput.value;
    var password = loginPwInput.value;
    var params = 'username=' + username +
                 '&password=' + password;

    sendRequest('POST', '/login', params, function(res) {
        resText.innerText = res;
    });
});

createBtn.addEventListener('click', function() {
    var id = roomIDInput.value;
    var name = roomNameInput.value;
    var pw = roomPwInput.value;
    var params = 'id=' + id +
                 '&name=' + name +
                 '&password=' + pw;

    sendRequest('POST', '/rooms/create', params, function(res) {
        resText.innerText = res;
    });
});

joinBtn.addEventListener('click', function() {
    var id = roomIDInput.value;
    var pw = roomPwInput.value;
    var params = 'id=' + id +
                 '&password=' + pw;

    sendRequest('POST', '/rooms/join', params, function(res) {
        resText.innerText = res;
    });
});

authBtn.addEventListener('click', function() {
    sendRequest('GET', '/auth', null, function(res) {
        resText.innerText = res;
    });
});

logoutBtn.addEventListener('click', function() {
    sendRequest('GET', '/logout', null, function(res) {
        resText.innerText = res;
    });
});
