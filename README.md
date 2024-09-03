# Simple Development Server

A simple, portable implementation of a development server like Vite, Parcel or
Webpack. [Read the article](https://general-metrics.com/articles/simple-hmr/).

## Features

- CSS hot module replacement.
- JavaScript live reload.
- A simple file server written in Deno, which handles event streams.

## Requirements

If not using Nix Flakes, ensure these programs/languages are installed.

- `entr` - [Website](https://eradman.com/entrproject/). Available on many
  package managers like Homebrew, etc.
- Deno -
  [Installation Instructions](https://docs.deno.com/runtime/#install-deno)

## Installation

After cloning this repository, follow the following steps:

1. If using Nix Flakes, run `$ nix develop`.
2. Create an environment file by copying the example file
   `$ mv env.example .env`
3. If using a different port
4. Update permissions on `dev.sh`, `$ chmod +x dev.sh`.
5. Run the shell script, `$ ./dev.sh`.

A server should be available at http://localhost:8000, and the file watching
program should be running. `Ctrl+c` to exit.

### Optional Instructions

This example repository uses Deno to demonstrate the server and API, but can
easily be swapped out to another language. Swap out line 57 with the server
command you would like to use:

```diff
server()
{
- deno run --allow-net --allow-read --allow-env --watch main.ts
+  <YOUR SERVER COMMAND HERE>
}
```

Also if using Nix Flakes, be sure to update any dependencies in the `flake.nix`
file. You will need to adapt your server to return an event stream response and
a `POST` endpoint to receive file HTTP requests from the file watcher script.
Check out `main.ts` to see the Deno implementation in action.
