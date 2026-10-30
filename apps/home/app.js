import { GRADES, hub } from "./profile.js";

const kidsEl = document.querySelector("#kids");
const form = document.querySelector("#add-form");
const note = document.querySelector("#note");
const playing = document.querySelector("#playing");
const games = [...document.querySelectorAll(".game")];

function gradeLabel(grade) {
  if (grade === "K") return "Kindergarten";
  return `Grade ${grade}`;
}

function render() {
  const store = hub();
  const kids = store.listChildren();
  const current = store.getCurrentChild();
  kidsEl.replaceChildren();
  for (const child of kids) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = child.id === current?.id ? "kid current" : "kid";
    button.textContent = `${child.name} · ${gradeLabel(child.grade)}`;
    button.addEventListener("click", () => {
      store.setCurrentChild(child.id);
      render();
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = `Remove ${child.name}`;
    remove.addEventListener("click", () => {
      store.removeChild(child.id);
      render();
    });
    kidsEl.append(button, remove);
  }
  const ready = Boolean(current);
  playing.textContent = ready
    ? `${current.name} is playing · ${gradeLabel(current.grade)}`
    : "Add a kid or tap a name to start.";
  for (const link of games) {
    if (ready) link.removeAttribute("aria-disabled");
    else link.setAttribute("aria-disabled", "true");
  }
}

for (const link of games) {
  link.addEventListener("click", (event) => {
    if (!hub().getCurrentChild()) event.preventDefault();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  note.textContent = "";
  const name = document.querySelector("#name").value;
  const grade = document.querySelector("#grade").value;
  if (!GRADES.includes(grade)) {
    note.textContent = "Pick kindergarten or grade 1, 2, or 3.";
    return;
  }
  try {
    hub().addChild({ name, grade });
    form.reset();
    render();
  } catch (error) {
    note.textContent = error.message;
  }
});

render();
