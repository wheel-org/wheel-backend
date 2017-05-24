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

var resText = document.getElementById('res-text');

function sendRequest(type, url, params, callback){
    console.log(type);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            callback(xhr.responseText);
        }
    }
    xhr.open(type, 'https://wheel-app.herokuapp.com' + url, true);
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
