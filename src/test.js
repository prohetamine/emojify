const svgtofont = require("svgtofont");
const path = require("path");

svgtofont({
  src: path.resolve(process.cwd(), "svg"), // svg path
  dist: path.resolve(process.cwd(), "font"),
  css: true,
  useNameAsUnicode: true,
}).then(() => {
  console.log('done!');
});
