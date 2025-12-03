#!/usr/bin/env bash
#
# File: .claude/hooks/tts-queue.sh
#
# TTS Queue Manager for Party Mode
# Queues TTS requests and plays them sequentially in the background
# This allows Claude to continue generating responses while audio plays in order

set -euo pipefail

# Security: Use secure temp directory with restrictive permissions
# Check if XDG_RUNTIME_DIR is available (more secure than /tmp)
if [[ -n "${XDG_RUNTIME_DIR:-}" ]] && [[ -d "$XDG_RUNTIME_DIR" ]]; then
  QUEUE_DIR="$XDG_RUNTIME_DIR/agentvibes-tts-queue"
else
  # Fallback to user-specific temp directory
  # Use USERNAME on Windows, USER on Unix
  QUEUE_DIR="/tmp/agentvibes-tts-queue-${USER:-${USERNAME:-unknown}}"
fi

QUEUE_LOCK="$QUEUE_DIR/queue.lock"
WORKER_PID_FILE="$QUEUE_DIR/worker.pid"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Initialize queue directory with restrictive permissions
if [[ ! -d "$QUEUE_DIR" ]]; then
  mkdir -p "$QUEUE_DIR"
  chmod 700 "$QUEUE_DIR"  # Only owner can read/write/execute
fi

# @function add_to_queue
# @intent Add a TTS request to the queue for sequential playback
# @param $1 dialogue text
# @param $2 voice name (optional)
add_to_queue() {
  local text="$1"
  local voice="${2:-}"

  # Create unique queue item with timestamp
  local timestamp=$(date +%s%N)
  local queue_file="$QUEUE_DIR/$timestamp.queue"

  # Write request to queue file (base64 encoded to handle all special chars)
  cat > "$queue_file" <<EOF
TEXT_B64=$(echo -n "$text" | base64 -w0)
VOICE_B64=$(echo -n "$voice" | base64 -w0)
EOF

  # Start queue worker if not already running
  start_worker_if_needed
}

# @function start_worker_if_needed
# @intent Start the queue worker process if it's not already running
start_worker_if_needed() {
  # Security: Use file locking to prevent race condition
  # flock is not available on Windows/Git Bash, use mkdir-based locking instead
  if command -v flock &>/dev/null; then
    # Linux/macOS: Use flock for proper file locking
    exec 200>"$QUEUE_LOCK"

    # Acquire exclusive lock (flock -x) with timeout
    if ! flock -x -w 5 200; then
      echo "Warning: Could not acquire queue lock" >&2
      return 1
    fi

    # Check if worker is already running (within lock)
    if [[ -f "$WORKER_PID_FILE" ]]; then
      local pid=$(cat "$WORKER_PID_FILE")
      if kill -0 "$pid" 2>/dev/null; then
        # Worker is running, release lock and return
        flock -u 200
        exec 200>&-
        return 0
      fi
    fi

    # Start worker in background
    "$SCRIPT_DIR/tts-queue-worker.sh" &
    local worker_pid=$!
    echo $worker_pid > "$WORKER_PID_FILE"

    # Release lock
    flock -u 200
    exec 200>&-
  else
    # Windows/Git Bash: Use mkdir-based locking (atomic operation)
    local lock_dir="$QUEUE_DIR/.lock"

    # Try to acquire lock via mkdir (atomic)
    if ! mkdir "$lock_dir" 2>/dev/null; then
      # Lock exists, check if stale (older than 30 seconds)
      if [[ -d "$lock_dir" ]]; then
        local lock_age=$(($(date +%s) - $(stat -c %Y "$lock_dir" 2>/dev/null || echo 0)))
        if [[ $lock_age -gt 30 ]]; then
          rm -rf "$lock_dir"
          mkdir "$lock_dir" 2>/dev/null || return 1
        else
          # Lock is fresh, another process is working
          return 0
        fi
      fi
    fi

    # Check if worker is already running
    if [[ -f "$WORKER_PID_FILE" ]]; then
      local pid=$(cat "$WORKER_PID_FILE")
      # On Windows, kill -0 may not work the same way
      if kill -0 "$pid" 2>/dev/null; then
        rm -rf "$lock_dir"
        return 0
      fi
    fi

    # Start worker in background
    "$SCRIPT_DIR/tts-queue-worker.sh" &
    local worker_pid=$!
    echo $worker_pid > "$WORKER_PID_FILE"

    # Release lock
    rm -rf "$lock_dir"
  fi
}

# @function clear_queue
# @intent Clear all pending TTS requests (emergency stop)
clear_queue() {
  rm -f "$QUEUE_DIR"/*.queue
  echo "✅ Queue cleared"
}

# @function show_queue
# @intent Display current queue status
show_queue() {
  local count=$(ls -1 "$QUEUE_DIR"/*.queue 2>/dev/null | wc -l)
  echo "📊 Queue status: $count items pending"

  if [[ -f "$WORKER_PID_FILE" ]]; then
    local pid=$(cat "$WORKER_PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      echo "✅ Worker process running (PID: $pid)"
    else
      echo "❌ Worker process not running"
    fi
  else
    echo "❌ Worker process not running"
  fi
}

# Main command dispatcher
case "${1:-help}" in
  add)
    add_to_queue "${2:-}" "${3:-}"
    ;;
  clear)
    clear_queue
    ;;
  status)
    show_queue
    ;;
  *)
    echo "Usage: tts-queue.sh {add|clear|status}"
    echo ""
    echo "Commands:"
    echo "  add <text> [voice]  Add TTS request to queue"
    echo "  clear               Clear all pending requests"
    echo "  status              Show queue status"
    exit 1
    ;;
esac
