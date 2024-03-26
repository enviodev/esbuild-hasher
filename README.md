# esbuild hasher

Small simple js package for generating a hash of an array of filepaths

## usage

`node -e 'require("./index.js")(["./tests/handler-with-imports.js", "./tests/imported-file.js"])'`

or

`node -e 'require("./index.js")()' "./tests/handler-with-imports.js, ./tests/imported-file.js"`
