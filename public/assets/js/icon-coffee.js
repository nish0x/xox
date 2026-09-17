import { c as o, o as r, a as t } from "./main.js";
const n = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg",
};
function l(s, e) {
  return (
    r(),
    o("svg", n, [
      ...(e[0] ||
        (e[0] = [
          t("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }, null, -1),
          t("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }, null, -1),
          t("line", { x1: "6", y1: "1", x2: "6", y2: "4" }, null, -1),
          t("line", { x1: "10", y1: "1", x2: "10", y2: "4" }, null, -1),
          t("line", { x1: "14", y1: "1", x2: "14", y2: "4" }, null, -1),
        ])),
    ])
  );
}
const c = { render: l };
export { c as default, l as render };