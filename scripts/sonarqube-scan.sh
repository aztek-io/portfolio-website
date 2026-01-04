#!/usr/bin/env bash
#
# SonarQube Code Quality Scan Script
# Runs a local SonarQube scan to check code quality before deployment
#
# Usage: bash scripts/sonarqube-scan.sh [--stop]
#   --stop    Stop and remove SonarQube container after scan
#
# Behavior:
#   - Auto-stops SonarQube if scan passes (0 bugs, 0 vulnerabilities, 0 code smells)
#   - Keeps SonarQube running if issues are found (for dashboard review)
#   - Use --stop flag to force stop regardless of results
#

set -euo pipefail

# Source logging library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091 # Dynamic path resolved at runtime
source "${SCRIPT_DIR}/lib/log.sh"

CONTAINER_NAME="sonarqube"
SONAR_PORT="9000"
SONAR_URL="http://localhost:${SONAR_PORT}"
PROJECT_KEY="cdn-website"
PROJECT_NAME="CDN Website"
SONAR_PASSWORD="newadmin123"
TOKEN_NAME="scanner-token"
MAX_WAIT_SECONDS=180

# Track scan results for auto-stop decision
SCAN_PASSED=false

# Check if we should force stop SonarQube after scan
FORCE_STOP=false
if [[ "${1:-}" == "--stop" ]]; then
    FORCE_STOP=true
fi

# Start or ensure SonarQube is running
start_sonarqube() {
    log INFO "Checking SonarQube container..."

    if docker ps -q -f name="^${CONTAINER_NAME}$" | grep -q .; then
        log WARN "SonarQube is already running"
        log INFO "Using existing container for scan"
    elif docker ps -aq -f name="^${CONTAINER_NAME}$" | grep -q .; then
        log INFO "Starting existing SonarQube container..."
        docker start "${CONTAINER_NAME}"
    else
        log INFO "Creating and starting new SonarQube container..."
        docker run -d --name "${CONTAINER_NAME}" -p "${SONAR_PORT}:9000" sonarqube:lts-community
    fi
}

# Wait for SonarQube to be ready
wait_for_sonarqube() {
    log INFO "Waiting for SonarQube to be ready (max ${MAX_WAIT_SECONDS}s)..."

    local elapsed=0
    until curl -s "${SONAR_URL}/api/system/status" 2>/dev/null | grep -q '"status":"UP"'; do
        if [[ $elapsed -ge $MAX_WAIT_SECONDS ]]; then
            log ERROR "SonarQube failed to start within ${MAX_WAIT_SECONDS} seconds"
        fi
        sleep 5
        elapsed=$((elapsed + 5))
        echo -n "."
    done
    echo ""
    log SUCCESS "SonarQube is ready!"
}

# Change default password (first time only)
change_default_password() {
    log INFO "Checking if default password needs to be changed..."

    # Try to authenticate with new password first
    if curl -s -u "admin:${SONAR_PASSWORD}" "${SONAR_URL}/api/authentication/validate" | grep -q '"valid":true'; then
        log INFO "Password already changed"
        return 0
    fi

    # Try to change from default password
    if curl -s -u admin:admin -X POST "${SONAR_URL}/api/users/change_password?login=admin&previousPassword=admin&password=${SONAR_PASSWORD}" | grep -q "error"; then
        log WARN "Could not change password - may already be changed"
    else
        log SUCCESS "Default password changed"
    fi
}

# Get or create scanner token
get_scanner_token() {
    log INFO "Getting scanner token..."

    # Check if token file exists
    local token_file="${HOME}/.sonar-token-${PROJECT_KEY}"

    if [[ -f "${token_file}" ]]; then
        SONAR_TOKEN=$(cat "${token_file}")
        log INFO "Using cached token"
        return 0
    fi

    # Generate new token
    local response
    response=$(curl -s -u "admin:${SONAR_PASSWORD}" -X POST \
        "${SONAR_URL}/api/user_tokens/generate?name=${TOKEN_NAME}-$(date +%s)")

    if echo "${response}" | grep -q '"token"'; then
        SONAR_TOKEN=$(echo "${response}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        echo "${SONAR_TOKEN}" > "${token_file}"
        chmod 600 "${token_file}"
        log SUCCESS "Scanner token generated and cached"
    else
        log ERROR "Failed to generate scanner token: ${response}"
    fi
}

# Create project if it doesn't exist
create_project() {
    log INFO "Ensuring project exists..."

    # Check if project exists
    if curl -s -u "admin:${SONAR_PASSWORD}" "${SONAR_URL}/api/projects/search?projects=${PROJECT_KEY}" | grep -q '"key":"'"${PROJECT_KEY}"'"'; then
        log INFO "Project already exists"
        return 0
    fi

    # Create project
    local response
    response=$(curl -s -u "admin:${SONAR_PASSWORD}" -X POST \
        "${SONAR_URL}/api/projects/create?project=${PROJECT_KEY}&name=${PROJECT_NAME// /+}")

    if echo "${response}" | grep -q '"key"'; then
        log SUCCESS "Project created"
    else
        log WARN "Project may already exist: ${response}"
    fi
}

# Run the scan
run_scan() {
    log INFO "Running SonarQube analysis..."

    docker run --rm \
        -e SONAR_HOST_URL="http://host.docker.internal:${SONAR_PORT}" \
        -e SONAR_TOKEN="${SONAR_TOKEN}" \
        -v "$(pwd):/usr/src" \
        sonarsource/sonar-scanner-cli \
        -Dsonar.projectKey="${PROJECT_KEY}"

    log SUCCESS "Analysis complete!"
}

# Wait for analysis to be processed and fetch results
fetch_results() {
    log INFO "Waiting for analysis to be processed..."
    sleep 3  # Give SonarQube time to process the report

    # Fetch metrics
    local response
    response=$(curl -s -u "admin:${SONAR_PASSWORD}" \
        "${SONAR_URL}/api/measures/component?component=${PROJECT_KEY}&metricKeys=bugs,vulnerabilities,code_smells")

    # Parse metrics
    local bugs vulnerabilities code_smells
    bugs=$(echo "${response}" | grep -o '"metric":"bugs","value":"[^"]*"' | grep -o '"value":"[^"]*"' | cut -d'"' -f4 || echo "0")
    vulnerabilities=$(echo "${response}" | grep -o '"metric":"vulnerabilities","value":"[^"]*"' | grep -o '"value":"[^"]*"' | cut -d'"' -f4 || echo "0")
    code_smells=$(echo "${response}" | grep -o '"metric":"code_smells","value":"[^"]*"' | grep -o '"value":"[^"]*"' | cut -d'"' -f4 || echo "0")

    # Display results
    echo ""
    echo "=========================================="
    echo "  SonarQube Analysis Results"
    echo "=========================================="
    echo ""

    if [[ "${bugs}" == "0" ]]; then
        log SUCCESS "Bugs: ${bugs}"
    else
        log ERROR "Bugs: ${bugs}"
    fi

    if [[ "${vulnerabilities}" == "0" ]]; then
        log SUCCESS "Vulnerabilities: ${vulnerabilities}"
    else
        log ERROR "Vulnerabilities: ${vulnerabilities}"
    fi

    if [[ "${code_smells}" == "0" ]]; then
        log SUCCESS "Code Smells: ${code_smells}"
    else
        log WARN "Code Smells: ${code_smells}"
    fi

    echo ""

    # Set SCAN_PASSED if all metrics are 0
    if [[ "${bugs}" == "0" && "${vulnerabilities}" == "0" && "${code_smells}" == "0" ]]; then
        SCAN_PASSED=true
        log SUCCESS "All quality gates passed!"
    else
        SCAN_PASSED=false
        log WARN "Quality issues detected - review dashboard for details"
    fi
}

# Show results URL
show_results() {
    log INFO "Dashboard: ${SONAR_URL}/dashboard?id=${PROJECT_KEY}"
}

# Stop SonarQube based on scan results or force flag
stop_sonarqube() {
    # Auto-stop if scan passed OR force stop requested
    if [[ "${FORCE_STOP}" == "true" ]]; then
        log INFO "Force stopping SonarQube (--stop flag)..."
        docker stop "${CONTAINER_NAME}" && docker rm "${CONTAINER_NAME}"
        log SUCCESS "SonarQube stopped and removed"
    elif [[ "${SCAN_PASSED}" == "true" ]]; then
        log INFO "Scan passed - auto-stopping SonarQube..."
        docker stop "${CONTAINER_NAME}" && docker rm "${CONTAINER_NAME}"
        log SUCCESS "SonarQube stopped and removed"
    else
        log WARN "Issues detected - keeping SonarQube running for review"
        log INFO "Stop manually with: docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
    fi
}

# Main execution
main() {
    echo ""
    echo "=========================================="
    echo "  SonarQube Code Quality Scan"
    echo "=========================================="
    echo ""

    start_sonarqube
    wait_for_sonarqube
    change_default_password
    get_scanner_token
    create_project
    run_scan
    fetch_results
    show_results
    stop_sonarqube
}

main
