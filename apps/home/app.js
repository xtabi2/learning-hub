import { AVATARS, GRADES, ageFrom, getLevel, gradeLabel, hub } from "./profile.js";
import { avatarLabel, avatarSvg } from "./avatars.js";

const kidsEl = document.querySelector("#kids");
const form = document.querySelector("#add-form");
const note = document.querySelector("#note");
const playing = document.querySelector("#playing");
const games = [...document.querySelectorAll(".game")];
const menuButton = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");
const dialog = document.querySelector("#add-dialog");
const avatarGrid = document.querySelector("#avatar-grid");
const removeCurrent = document.querySelector("#remove-current");

const SHORT_GRADE = { PreK: "Pre-K", K: "K", 1: "1st", 2: "2nd", 3: "3rd" };

/** Age from the birthday and the grade for today, e.g. { age: 7, grade: "1" }. */
function kidInfo(child) {
  return { age: ageFrom(child), grade: getLevel(child).grade ?? child.grade };
}

function kidLabel(child) {
  const { age, grade } = kidInfo(child);
  const ageText = Number.isInteger(age) ? `, age ${age}` : "";
  return `${child.name}${ageText}, ${gradeLabel(grade)}, ${avatarLabel(child.avatar)}`;
}

function kidMeta(child) {
  const { age, grade } = kidInfo(child);
  return [Number.isInteger(age) ? `${age}` : null, SHORT_GRADE[grade] ?? null].filter(Boolean).join(" · ");
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
    button.dataset.avatar = child.avatar;
    button.setAttribute("aria-pressed", String(child.id === current?.id));
    button.setAttribute("aria-label", kidLabel(child));
    button.innerHTML = `<span class="face">${avatarSvg(child.avatar)}</span><span class="kid-name"></span><span class="kid-meta"></span>`;
    button.querySelector(".kid-name").textContent = child.name;
    button.querySelector(".kid-meta").textContent = kidMeta(child);
    button.addEventListener("click", () => {
      store.setCurrentChild(child.id);
      render();
    });
    kidsEl.append(button);
  }
  const ready = Boolean(current);
  playing.textContent = ready
    ? `${current.name} is playing · ${gradeLabel(kidInfo(current).grade)}`
    : "Tap your animal to start.";
  removeCurrent.hidden = !ready;
  removeCurrent.textContent = ready ? `Remove ${current.name}` : "Remove selected kid";
  for (const link of games) {
    if (ready) {
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
    } else {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
    }
  }
}

for (const link of games) {
  link.addEventListener("click", (event) => {
    if (!hub().getCurrentChild()) event.preventDefault();
  });
}

function setMenu(open) {
  menu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  if (open) menu.querySelector("button:not([hidden])")?.focus();
}

menuButton.addEventListener("click", () => setMenu(menu.hidden));
document.addEventListener("click", (event) => {
  if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});
menu.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    menuButton.focus();
  }
});

for (const [i, id] of AVATARS.entries()) {
  const label = document.createElement("label");
  label.className = "avatar-option";
  label.innerHTML = `<input type="radio" name="avatar" value="${id}" ${i === 0 ? "checked" : ""} />${avatarSvg(id)}<span class="sr-only"></span>`;
  label.querySelector(".sr-only").textContent = avatarLabel(id);
  label.title = avatarLabel(id);
  avatarGrid.append(label);
}

document.querySelector("#open-add").addEventListener("click", () => {
  setMenu(false);
  note.textContent = "";
  dialog.showModal();
  document.querySelector("#name").focus();
});

removeCurrent.addEventListener("click", () => {
  const current = hub().getCurrentChild();
  setMenu(false);
  if (current && confirm(`Remove ${current.name}?`)) hub().removeChild(current.id);
  render();
});

document.querySelector("#cancel-add").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  form.reset();
  menuButton.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  note.textContent = "";
  const name = document.querySelector("#name").value;
  const grade = document.querySelector("#grade").value;
  const birthMonth = document.querySelector("#birth-month").value;
  const birthYear = document.querySelector("#birth-year").value;
  const kStartYear = document.querySelector("#k-start").value;
  const avatar = form.querySelector('input[name="avatar"]:checked')?.value;
  if (grade && !GRADES.includes(grade)) {
    note.textContent = "Pick Pre-K, kindergarten, or grade 1, 2, or 3.";
    return;
  }
  if (!grade && !kStartYear) {
    note.textContent = "Add the kindergarten start year, or pick a grade.";
    return;
  }
  try {
    // A picked grade is a manual override; otherwise the grade follows the K start year.
    hub().addChild({ name, grade, avatar, birthMonth, birthYear, kStartYear, gradeOverride: kStartYear ? grade : "" });
    dialog.close();
    render();
  } catch (error) {
    note.textContent = error.message;
  }
});

render();
