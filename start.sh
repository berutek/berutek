#!/bin/bash

#######################################
# Dual Service Startup Script
# Starts NestJS and Next.js projects simultaneously
# with color-coded, labeled logs
#######################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Service labels with colors
NESTJS_LABEL="${MAGENTA}[NestJS]${NC}"
NEXTJS_LABEL="${CYAN}[Next.js]${NC}"

# Configuration - Update these paths to your project directories
NESTJS_DIR="./berutek.serv"      # Path to your NestJS project
NEXTJS_DIR="./berutek.ui"     # Path to your Next.js project

# Log files (optional - for persistent logging)
NESTJS_LOG="/tmp/nestjs-${USER}-$$.log"
NEXTJS_LOG="/tmp/nextjs-${USER}-$$.log"

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    print_warning "Shutting down services..."
    
    # Kill all background processes
    if [ ! -z "$NESTJS_PID" ]; then
        kill $NESTJS_PID 2>/dev/null || true
        print_info "NestJS process terminated"
    fi
    
    if [ ! -z "$NEXTJS_PID" ]; then
        kill $NEXTJS_PID 2>/dev/null || true
        print_info "Next.js process terminated"
    fi
    
    print_info "Services stopped. Logs saved to:"
    print_info "  NestJS: $NESTJS_LOG"
    print_info "  Next.js: $NEXTJS_LOG"
    
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM EXIT

# Validate directories exist
if [ ! -d "$NESTJS_DIR" ]; then
    print_error "NestJS directory not found: $NESTJS_DIR"
    exit 1
fi

if [ ! -d "$NEXTJS_DIR" ]; then
    print_error "Next.js directory not found: $NEXTJS_DIR"
    exit 1
fi

print_info "Starting services..."
echo ""

# Function to stream logs with label
stream_logs() {
    local label=$1
    local process=$2
    
    while IFS= read -r line; do
        echo -e "${label} $line"
    done < <($process)
}

# Start NestJS service in background
(
    cd "$NESTJS_DIR"
    print_info "Starting NestJS from $NESTJS_DIR"
    npm run start 2>&1 | while IFS= read -r line; do
        echo -e "${NESTJS_LABEL} $line"
    done
) > >(tee -a "$NESTJS_LOG") 2>&1 &
NESTJS_PID=$!
print_info "NestJS started with PID: $NESTJS_PID"

# Start Next.js service in background
(
    cd "$NEXTJS_DIR"
    print_info "Starting Next.js from $NEXTJS_DIR"
    npm run dev 2>&1 | while IFS= read -r line; do
        echo -e "${NEXTJS_LABEL} $line"
    done
) > >(tee -a "$NEXTJS_LOG") 2>&1 &
NEXTJS_PID=$!
print_info "Next.js started with PID: $NEXTJS_PID"

echo ""
print_info "Both services are running!"
print_info "Press Ctrl+C to stop both services"
echo ""
print_info "Log location:"
print_info "  SERV: $NESTJS_LOG"
print_info "  UI: $NEXTJS_LOG"
echo ""

# Wait for both processes
wait