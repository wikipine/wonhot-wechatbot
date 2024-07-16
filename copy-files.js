import fs from "fs-extra";
import path from "path";

// 替换路径
const replaceArr = [
  { src: "wechaty-grpc/dist/esm", dest: "wechaty-grpc/dist/esm" },
  { src: "google-protobuf", dest: "google-protobuf" },
];
replaceArr.forEach((val) => {
  const srcDir = path.resolve("node_modules/" + val.src);
  const destDir = path.resolve("dist/server/node_modules/" + val.dest);
  fs.copySync(srcDir, destDir);
});

console.log("Files copied successfully!");
