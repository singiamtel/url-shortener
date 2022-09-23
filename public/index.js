const myform = document.querySelector("#sub-form");
const URL = document.querySelector("#urlform");
const text = document.querySelector("#text");

const isURL = (url) => {
  return /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
    url
  );
};
const create = async (reqBody) => {
  const res = await fetch("/create", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  const json = await res.json();
  setText(json);
  return json;
};

const setText = (url) => {
  text.innerHTML = `Your url is <a target="_blank" href="${url.url}">${url.url}</a>`;
  text.style.border = "2px solid lightblue";
};
myform.addEventListener("submit", (e) => {
  e.preventDefault();
  const reqBody = { url: URL.value };
  if (isURL(reqBody.url)) {
    create(reqBody);
  } else {
    text.innerHTML = "Invalid url!";
    text.style.border = "2px solid red";
  }
});
