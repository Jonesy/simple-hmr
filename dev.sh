#!/bin/sh

# Load environment variables into scope
set -a
if [ -f ./.env ]; then
  . ./.env
else
  echo "Unable to find .env file. Make sure you rename env.example"
  exit 1
fi
set +a

# If no URL is set, bail out early
if ! [ "$HMR_URL" ]; then
  echo "Unable to read HMR_URL, did you forget to set it?"
  exit 1
fi

# Check for entr
if ! command -v entr > /dev/null; then
  echo "entr is not installed"
  exit 1
fi

# Takes in a changed file from entr and removes the absolute path
handle_file_change ()
{
  current_dir=$PWD
  file_path="$0"
  result="/${file_path#"$current_dir/"}"
  url="http://$HOST:$PORT$HMR_URL"
  if ! curl -X POST -d "name=$result" "$url"; then 
    echo "unable to connect to server"
  fi
}

export -f handle_file_change 

# Sets up file change watcher, entr
watcher ()
{
  echo "Development server started"
  echo "Ctrl+C to stop"

  # `while` loop tells entr to watch for new files
  while true; do
    # Filter which file types you'd like to watch
    fd . src -e css -e js -e html | 
    # Tell entr to run `handle_file_change` when any file changes
    entr -cdp sh -c "handle_file_change $0" /_ && 
    break 
  done
}

# Fires up the web server, which receives POST messages
server()
{
  deno run --allow-net --allow-read --allow-env --watch main.ts
}

(trap 'kill 0' SIGINT; server & watcher)
