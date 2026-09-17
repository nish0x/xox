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
          t("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }, null, -1),
          t(
            "path",
            { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" },
            null,
            -1,
          ),
        ])),
    ])
  );
}
const c = { render: l };
export { c as default, l as render };