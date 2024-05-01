const tryBtn = document.querySelector('.tryBtn');
const formCustBtn = document.querySelector('#getStarted');

const btnParams = new URLSearchParams(window.location.search);

const paramArrString = btnParams.get('logged');
const paramArr = JSON.parse(paramArrString);

console.log(paramArr);

if (Array.isArray(paramArr) && paramArr[0] === true) {
  tryBtn.disabled = true;
  formCustBtn.disabled = true;

  const logRegBtn = document.querySelector('#getStarted');
  logRegBtn.textContent = "Welcome back, Mr/Mrs " + paramArr[1];
}


