#!/usr/bin/env bash
#
# Logging Library
# Provides a structured logging function with color output and log levels.
#
# Usage: source scripts/lib/log.sh
#        log INFO "Your message here"
#
# Log Levels (in order of verbosity):
#   DEBUG   - Detailed debugging information (magenta)
#   INFO    - General information (cyan)
#   WARN    - Warning messages (yellow)
#   ERROR   - Error messages, exits with code 2 (red)
#   SUCCESS - Success messages (green)
#
# Environment Variables:
#   LOG_LEVEL - Controls which messages are displayed (default: INFO)
#               Set to DEBUG, INFO, WARN, or ERROR
#

# Logging configuration
LOG_LEVEL="${LOG_LEVEL:-INFO}"
NORMAL=$'\e[0m'

log() {
    local LOGGING="$1"
    local MESSAGE="$2"
    local TIMESTAMP
    TIMESTAMP="[$(date '+%Y-%m-%d %H:%M:%S')]"
    local COLOR
    local DEBUG_ENABLED INFO_ENABLED WARN_ENABLED ERROR_ENABLED
    local EXIT_CODE=0

    case "$LOG_LEVEL" in
        DEBUG)
            DEBUG_ENABLED=true
            INFO_ENABLED=true
            WARN_ENABLED=true
            ERROR_ENABLED=true
            ;;
        INFO)
            DEBUG_ENABLED=false
            INFO_ENABLED=true
            WARN_ENABLED=true
            ERROR_ENABLED=true
            ;;
        WARN)
            DEBUG_ENABLED=false
            INFO_ENABLED=false
            WARN_ENABLED=true
            ERROR_ENABLED=true
            ;;
        ERROR)
            DEBUG_ENABLED=false
            INFO_ENABLED=false
            WARN_ENABLED=false
            ERROR_ENABLED=true
            ;;
        *)
            echo "Invalid LOG_LEVEL - $LOG_LEVEL"
            exit 2
            ;;
    esac

    case "$LOGGING" in
        DEBUG)
            "$DEBUG_ENABLED" || return 0
            COLOR=$'\e[35m'
            ;;
        INFO)
            "$INFO_ENABLED" || return 0
            COLOR=$'\e[36m'
            ;;
        WARN)
            "$WARN_ENABLED" || return 0
            COLOR=$'\e[33m'
            ;;
        ERROR)
            "$ERROR_ENABLED" || return 0
            COLOR=$'\e[31m'
            EXIT_CODE=2
            ;;
        SUCCESS)
            "$INFO_ENABLED" || return 0
            COLOR=$'\e[32m'
            ;;
        *)
            echo "Invalid log level - $LOGGING"
            EXIT_CODE=3
            ;;
    esac

    echo "$TIMESTAMP - ${COLOR}${LOGGING}${NORMAL} - $MESSAGE"

    if [[ "$EXIT_CODE" != "0" ]]; then
        exit "$EXIT_CODE"
    fi
}
