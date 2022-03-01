const watch = require("node-watch");
const { exec } = require("child_process");

const run = (network) => {
  console.log("🛠  Compiling & Deploying...");
  let networkArg = network ? `:${network}` : "";
  exec(`npm run deploy${networkArg}`, function (error, stdout, stderr) {
    console.log(stdout);
    if (error) console.log(error);
    if (stderr) console.log(stderr);
  });
};
const network = process.argv.slice(2);

console.log("🔬 Watching Contracts...");
watch(
  ["./contracts", "contract.config.json"],
  { recursive: true },
  function (evt, name) {
    console.log("%s changed.", name);
    run(network);
  }
);
run(network);