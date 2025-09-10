# Print a debug message to STDOUT only if DEBUG_MODE is set
function debug {
    if [[ -n "$DEBUG_MODE" ]]; then
        echo "[DEBUG] $@"
    fi
}

# Print a "done" message (optionally, supplemented by arg input) and return
function end {
    if [[ -n "$@" ]]; then
        info "$@"
    fi

    info "Done."

    exit 0
}

# Print an error message to STDERR
function err {
    echo "[ERROR] $@" 1>&2
}

# Print an error message and abort
function fail {
    err "$@"

    exit 1
}

# print an info message to STDOUT
function info {
    echo "[INFO] $@"
}
