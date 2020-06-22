function checkGateForm(event) {
  let value = document.querySelector("#gateFormInput").value;
  return value == GATE_PASS;
}


const main = () => {
  let gateForm = document.querySelector("#gateForm");
  gateForm.onsubmit = checkGateForm;

  // setTimeout(function(){ gateForm.classList.remove('hide'); }, 1000);
  setTimeout(function(){ gateForm.classList.remove('hide'); }, 67000);
}

main();
