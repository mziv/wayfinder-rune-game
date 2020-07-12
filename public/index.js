function checkGateForm(event) {
  let value = document.querySelector("#gateFormInput").value.toLowerCase();
  return value == GATE_PASS;
}


const main = async () => {
  let gateForm = document.querySelector("#gateForm");
  gateForm.onsubmit = checkGateForm;

  let vid = document.getElementById("intro");
  
  setTimeout(function(){ vid.muted = false; }, 1500);

  // setTimeout(function(){ gateForm.classList.remove('hide'); }, 1000);
  setTimeout(function(){ gateForm.classList.remove('hide'); }, 67000);

  let method = "POST";
  let opts = { method };
  let res = await fetch("/api/votes/A/add", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);

  method = "GET";
  opts = { method };
  res = await fetch("/api/votes", opts);
  json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

main();
