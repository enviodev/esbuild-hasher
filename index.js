#!/usr/bin/env node

const esbuild = require("esbuild");
const crypto = require("crypto");

// arguments passed in from command line
const args = process.argv.slice(2);

// Function to find the value of a named argument
function getNamedArgValue(name) {
  const index = args.indexOf(`--${name}`);
  if (index !== -1 && index < args.length - 1) {
    return args[index + 1];
  }
  return null;
}

const getHashOfFileTree = async (arrEventHandlerEntries) => {
  // csv of entry points in position two of the args array
  // eg esbuild-hasher --entry-paths "./tests/handler-with-imports.js,./tests/handler-with-imports-2.js"
  const csvEventHandlerEntries = getNamedArgValue("entry-paths");

  if (!csvEventHandlerEntries) {
    console.error(
      "Error: Argument --entry-paths not provided, eg. esbuild-hasher --entry-paths './tests/handler-with-imports.js,./tests/handler-with-imports-2.js'"
    );
  }

  // split the csv into a js array of entry points
  const argsArrEventHandlerEntries = csvEventHandlerEntries
    .split(",")
    .map((entry) => entry.trim());

  let inMemoryBuild = await esbuild.build({
    entryPoints: arrEventHandlerEntries || argsArrEventHandlerEntries, // array of entry points if none passed in take from cli args
    outdir: "./", // required when passing multiple entry points for some reason // https://github.com/evanw/esbuild/issues/2890
    write: false, // keeps it in memory
    bundle: true,
    minify: true,
    platform: "node",
    external: [
      "@ryyppy/rescript-promise",
      "rescript-envsafe",
      "rescript-struct",
      "@greenlabs/ppx-spice",
      "rescript-express",
      "@glennsl/rescript-fetch",
      "@rescript/react",
    ], // hmmmm - rescript.json - bs-dependencies
  });

  // generates a hash of the output file esbuild hashes - https://xxhash.com/ maybe we should use :thinkies:
  const hash = crypto
    .createHash("sha256")
    .update(inMemoryBuild.outputFiles.map(({ hash }) => hash).join(""))
    .digest("hex");

  console.log(hash);
  return hash; // not sure this is needed
};

getHashOfFileTree();
