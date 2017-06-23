var userInput = document.getElementById('user');
var passInput = document.getElementById('pass');

var regBtn = document.getElementById('reg-btn');
var regNameInput = document.getElementById('reg-name');

var loginBtn = document.getElementById('login-btn');

var createBtn = document.getElementById('create-btn');
var joinBtn = document.getElementById('join-btn');
var getBtn = document.getElementById('get-btn');
var leaveBtn = document.getElementById('leave-btn');
var roomIDInput = document.getElementById('room-id');
var roomNameInput = document.getElementById('room-name');
var roomPwInput = document.getElementById('room-pw');

var postBtn = document.getElementById('post-btn');
var delTrans = document.getElementById('del-trans');
var transID = document.getElementById('trans-id');
var amountInput = document.getElementById('amount');
var descInput = document.getElementById('desc');

var authBtn = document.getElementById('auth-btn');
var logoutBtn = document.getElementById('logout-btn');

var resText = document.getElementById('res-text');

function sendRequest(type, url, params, callback){
    console.log(type);
    if (params !== '') params += '&';
    params += 'username=' + userInput.value +
              '&password=' + passInput.value;
    console.log(params);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            callback(xhr.responseText);
        }
    }
    xhr.open(type, 'https://wheel-app.herokuapp.com' + url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    resText.innerText = 'Waiting...';
}


postBtn.addEventListener('click', function() {
    var id = roomIDInput.value,
        amount = amountInput.value,
        desc = descInput.value;

    var params = 'id=' + id +
                 '&amount=' + amount +
                 '&desc=' + desc;

    sendRequest('POST', '/transactions/add', params, function(res) {
        resText.innerText = res;
    });
});

delTrans.addEventListener('click', function() {
    var rid = roomIDInput.value,
        tid = transID.value;

    var params = 'roomid=' + rid +
                 '&transid=' + tid;

    sendRequest('POST', '/transactions/delete', params, function(res) {
        resText.innerText = res;
    });
});

regBtn.addEventListener('click', function() {
    var name = regNameInput.value;
    var params = 'name=' + name;

    sendRequest('POST', '/register', params, function(res) {
        resText.innerText = res;
    });
});

loginBtn.addEventListener('click', function() {
    sendRequest('POST', '/login', '', function(res) {
        resText.innerText = res;
    });
});

createBtn.addEventListener('click', function() {
    var name = roomNameInput.value;
    var pw = roomPwInput.value;
    var params = 'roomName=' + name +
                 '&roomPassword=' + pw;

    sendRequest('POST', '/rooms/create', params, function(res) {
        resText.innerText = res;
    });
});

joinBtn.addEventListener('click', function() {
    var id = roomIDInput.value;
    var pw = roomPwInput.value;
    var params = 'id=' + id +
                 '&roomPassword=' + pw;

    sendRequest('POST', '/rooms/join', params, function(res) {
        resText.innerText = res;
    });
});

getBtn.addEventListener('click', function() {
    var id = roomIDInput.value;
    var params = 'id=' + id;

    sendRequest('POST', '/rooms/get', params, function(res) {
        resText.innerText = res;
    });
});

leaveBtn.addEventListener('click', function() {
    var id = roomIDInput.value;
    var params = 'id=' + id;

    sendRequest('POST', '/rooms/leave', params, function(res) {
        resText.innerText = res;
    });
});

authBtn.addEventListener('click', function() {
    sendRequest('POST', '/auth', '', function(res) {
        resText.innerText = res;
    });
});

logoutBtn.addEventListener('click', function() {
    sendRequest('GET', '/logout', '', function(res) {
        resText.innerText = res;
    });
});
