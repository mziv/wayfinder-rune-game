const addVoteA = async () => {
  let method = "POST";
  let opts = { method };
  let body = {};
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  let res = await fetch("/api/votes/CLOSE/add", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const addVoteB = async () => {
  let method = "POST";
  let opts = { method };
  let body = {};
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  let res = await fetch("/api/votes/DESTROY/add", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const tallyVotes = async () => {
  let method = "GET";
  let opts = { method };
  let res = await fetch("/api/votes", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const init = async () => {
  let method = "POST";
  let opts = { method };
  let body = { "runes": ["CLOSE", "DESTROY"] };
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  let res = await fetch("/api/init", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const close = async () => {
  let method = "POST";
  let opts = { method };
  let body = {};
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  let res = await fetch("/api/status/close", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const check = async () => {
  let method = "GET";
  let opts = { method };
  let res = await fetch("/api/status/done", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const main = () => {
  let voteA = document.querySelector("#voteA");
  voteA.addEventListener('click', addVoteA);

  let voteB = document.querySelector("#voteB");
  voteB.addEventListener('click', addVoteB);

  let tally = document.querySelector("#tally");
  tally.addEventListener('click', tallyVotes);

  let initB = document.querySelector("#init");
  initB.addEventListener('click', init);

  initB = document.querySelector("#close");
  initB.addEventListener('click', close);

  initB = document.querySelector("#check");
  initB.addEventListener('click', check);
}

main();