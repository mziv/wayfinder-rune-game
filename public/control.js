const addVoteA = async () => {
  let method = "POST";
  let opts = { method };
  let res = await fetch("/api/votes/A/add", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const addVoteB = async () => {
  let method = "POST";
  let opts = { method };
  let res = await fetch("/api/votes/B/add", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const tallyVotes = async () => {
  let method = "GET";
  let opts = { method };
  let res = await fetch("/api/votes", opts);
  let json = await res.json();
  alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);

  // let res = await fetch("/api/votes/winner", opts);
  // let json = await res.json();
  // alert(`Status: ${res.status}\n\n${JSON.stringify(json, null, 2)}`);
}

const init = async () => {
  let method = "POST";
  let opts = { method };
  let body = { "runes": ["C", "D"] };
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  let res = await fetch("/api/init", opts);
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
}

main();