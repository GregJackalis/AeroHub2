const tryBtn = document.querySelector('.tryBtn');
const formCustBtn = document.querySelector('#getStarted');

const btnParams = new URLSearchParams(window.location.search);
const loggedStatus = btnParams.get('logged');

if (loggedStatus === "true") {
  tryBtn.disabled = true;
  formCustBtn.disabled = true;
}
