function checkGateForm(event) {
  let value = document.querySelector("#gateFormInput").value.toLowerCase();
  return value == GATE_PASS;
}


const main = () => {
  let gateForm = document.querySelector("#gateForm");
  gateForm.onsubmit = checkGateForm;

  let vid = document.getElementById("intro");
  
  setTimeout(function(){ vid.muted = false; }, 1500);

  // setTimeout(function(){ gateForm.classList.remove('hide'); }, 1000);
  setTimeout(function(){ gateForm.classList.remove('hide'); }, 67000);
}

main();
