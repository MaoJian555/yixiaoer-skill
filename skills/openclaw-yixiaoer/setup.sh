#!/bin/bash

set -euo pipefail

SERVICE_NAME="openclaw-yixiaoer"
MCP_URL="${YIXIAOER_MCP_URL:-http://127.0.0.1:3737/mcp}"
API_KEY="${YIXIAOER_API_KEY:-}"

check_mcporter() {
    if ! command -v mcporter >/dev/null 2>&1; then
        echo "ERROR:mcporter_not_found"
        exit 1
    fi
}

check_status() {
    if ! mcporter list 2>/dev/null | grep -q "$SERVICE_NAME"; then
        echo "CONFIG_REQUIRED"
        return
    fi

    if [[ -z "$API_KEY" ]]; then
        echo "API_KEY_REQUIRED"
        return
    fi

    echo "READY"
}

configure_service() {
    check_mcporter

    if [[ -z "$API_KEY" ]]; then
        echo "ERROR:missing_api_key"
        exit 1
    fi

    mcporter config add "$SERVICE_NAME" "$MCP_URL" \
        --header "Authorization=Bearer $API_KEY" \
        --transport http \
        --scope home

    echo "CONFIGURED"
}

case "${1:-}" in
    yixiaoer_check)
        check_mcporter
        check_status
        ;;
    yixiaoer_configure)
        configure_service
        ;;
    *)
        echo "Usage: bash ./setup.sh yixiaoer_check|yixiaoer_configure"
        ;;
esac
