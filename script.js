document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------------------------
   Terminal typing effect
--------------------------------------------- */
const body = document.getElementById("terminalBody");

const lines = [
  { type: "out", text: "Ekalla Jerius Kebila" },
  { type: "out", text: "Software Engineer." },
  { type: "cmd", text: "Bio" },
  {
    type: "out",
    text:
      "Building modern web & mobile apps that solve real\nproblems. Experience in software development,\ntelecom, and application design. Currently building\na real estate platform, and always leveling up in\nbackend, cloud, and AI integration.",
  },
  { type: "cmd", text: "Contact" },
  { type: "out", text: "scroll down, or just email me." },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderStatic() {
  const html = lines
    .map((l) =>
      l.type === "cmd"
        ? `<p><span class="prompt">$</span> ${escapeHtml(l.text)}</p>`
        : `<p>${escapeHtml(l.text).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
  body.innerHTML = `<p><span class="prompt">$</span> whoami</p>` + html;
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

async function typeSequence() {
  body.innerHTML = `<p><span class="prompt">$</span> whoami<span class="caret"></span></p>`;
  await wait(400);

  for (const line of lines) {
    const p = document.createElement("p");
    if (line.type === "cmd") {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "$";
      p.appendChild(prompt);
      p.appendChild(document.createTextNode(" "));
    }
    const caret = document.createElement("span");
    caret.className = "caret";

    // remove caret from previous line
    const prevCaret = body.querySelector(".caret");
    if (prevCaret) prevCaret.remove();

    body.appendChild(p);
    body.appendChild(caret);

    await typeText(p, line.text, caret);
    await wait(220);
  }

  const finalCaret = body.querySelector(".caret");
  if (finalCaret) finalCaret.remove();
}

function typeText(el, text, caret) {
  return new Promise((resolve) => {
    let i = 0;
    const speed = 18;
    const timer = setInterval(() => {
      if (i < text.length) {
        const ch = text[i];
        el.appendChild(document.createTextNode(ch === "\n" ? "" : ch));
        if (ch === "\n") el.appendChild(document.createElement("br"));
        el.parentNode.insertBefore(caret, el.nextSibling);
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

if (reduceMotion) {
  renderStatic();
} else {
  typeSequence();
}
