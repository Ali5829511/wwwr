#!/bin/bash
# Script to check for uncommitted changes and allow proceeding anyway
# Usage: ./check-changes.sh [--force]

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "================================================"
echo "  Git Status Check"
echo "================================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✓ No uncommitted changes detected${NC}"
    echo "  Working tree is clean. Safe to proceed."
    exit 0
else
    echo -e "${YELLOW}⚠ Uncommitted changes detected${NC}"
    echo ""
    echo "The following files have changes:"
    echo ""
    git status --short
    echo ""
    
    # Check if --force flag is provided
    if [ "$1" == "--force" ]; then
        echo -e "${GREEN}✓ Force flag provided. Proceeding anyway...${NC}"
        exit 0
    fi
    
    # Ask user if they want to proceed
    echo -e "${YELLOW}Do you want to proceed anyway? (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✓ Proceeding with uncommitted changes...${NC}"
        exit 0
    else
        echo -e "${RED}✗ Aborted by user${NC}"
        exit 1
    fi
fi
