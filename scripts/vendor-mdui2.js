/**
 * 将 mdui@2 与 Material Symbols（Outlined）从 node_modules 复制到 source/mdui2/，
 * 供 Hexo 在完全离线环境下发布静态资源。
 *
 * 说明：npm 上不存在 @material-symbols/font-outlined，使用等价的 material-symbols 包。
 */
const fs = require("fs");
const path = require("path");

const themeRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(themeRoot, "source");
const nm = path.join(themeRoot, "node_modules");

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const mduiPkg = path.join(nm, "mdui");
const symPkg = path.join(nm, "material-symbols");

if (!fs.existsSync(mduiPkg) || !fs.existsSync(symPkg)) {
  console.error(
    "[vendor-mdui2] 请先在本目录执行: npm install\n" +
      "  缺少: " +
      [!fs.existsSync(mduiPkg) && "mdui", !fs.existsSync(symPkg) && "material-symbols"]
        .filter(Boolean)
        .join(", ")
  );
  process.exit(1);
}

const mdui2Out = path.join(sourceRoot, "mdui2");
copyFile(path.join(mduiPkg, "mdui.css"), path.join(mdui2Out, "mdui.css"));
copyFile(
  path.join(mduiPkg, "mdui.global.js"),
  path.join(mdui2Out, "mdui.global.js")
);

// 与 outlined.css 内 ./material-symbols-outlined.woff2 同目录
copyFile(path.join(symPkg, "outlined.css"), path.join(mdui2Out, "outlined.css"));
copyFile(
  path.join(symPkg, "material-symbols-outlined.woff2"),
  path.join(mdui2Out, "material-symbols-outlined.woff2")
);

console.log(
  "[vendor-mdui2] 已更新 source/mdui2/:\n" +
    "  - mdui.css, mdui.global.js\n" +
    "  - outlined.css, material-symbols-outlined.woff2"
);
