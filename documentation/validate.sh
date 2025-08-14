#!/bin/bash

# AiThena Documentation Validation Script
# This script validates the complete documentation system

echo "🔍 AiThena Documentation Validation"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
total_checks=0
passed_checks=0

# Function to check file existence and size
check_file() {
    local file=$1
    local min_size=$2
    local description=$3
    
    total_checks=$((total_checks + 1))
    
    if [[ -f "$file" ]]; then
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [[ $size -gt $min_size ]]; then
            echo -e "${GREEN}✅ $description${NC} (${size} bytes)"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "${RED}❌ $description - File too small${NC} (${size} bytes, expected > ${min_size})"
        fi
    else
        echo -e "${RED}❌ $description - File missing${NC}"
    fi
}

# Function to check for specific content
check_content() {
    local file=$1
    local search_term=$2
    local description=$3
    
    total_checks=$((total_checks + 1))
    
    if [[ -f "$file" ]] && grep -q "$search_term" "$file"; then
        echo -e "${GREEN}✅ $description${NC}"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}❌ $description${NC}"
    fi
}

echo -e "${BLUE}📁 Checking Documentation Files...${NC}"
echo ""

# Check main documentation files
check_file "documentation/index.html" 15000 "Main Documentation Index"
check_file "documentation/frontend.html" 40000 "Frontend Architecture Documentation"
check_file "documentation/backend.html" 25000 "Backend Services Documentation"
check_file "documentation/api.html" 45000 "API Reference Documentation"
check_file "documentation/setup.html" 30000 "Setup & Deployment Guide"
check_file "documentation/development.html" 35000 "Development Guide"

# Check supporting files
check_file "documentation/styles.css" 10000 "CSS Stylesheet"
check_file "documentation/script.js" 15000 "JavaScript Functionality"
check_file "documentation/README.md" 8000 "Documentation README"

echo ""
echo -e "${BLUE}🔍 Checking Content Quality...${NC}"
echo ""

# Check for essential content in each file
check_content "documentation/index.html" "AiThena Platform" "Index page has platform title"
check_content "documentation/frontend.html" "Next.js 14" "Frontend docs mention Next.js"
check_content "documentation/backend.html" "Express" "Backend docs mention Express"
check_content "documentation/api.html" "POST /api/assistant/chat" "API docs include assistant endpoint"
check_content "documentation/setup.html" "Prerequisites" "Setup guide includes prerequisites"
check_content "documentation/development.html" "Development Workflow" "Development guide includes workflow"

# Check for proper navigation
check_content "documentation/index.html" "frontend.html" "Index has frontend navigation"
check_content "documentation/frontend.html" "backend.html" "Frontend has backend navigation"
check_content "documentation/api.html" "setup.html" "API docs link to setup"

# Check for code examples
check_content "documentation/api.html" "curl http://localhost" "API docs include curl examples"
check_content "documentation/frontend.html" "import.*from" "Frontend docs include import examples"
check_content "documentation/development.html" "npm.*test" "Development docs include npm commands"

echo ""
echo -e "${BLUE}🎨 Checking Interactive Features...${NC}"
echo ""

# Check for interactive features
check_content "documentation/script.js" "addEventListener" "JavaScript includes event listeners"
check_content "documentation/styles.css" "@media" "CSS includes responsive design"
check_content "documentation/script.js" "copy.*clipboard" "Copy to clipboard functionality"
check_content "documentation/script.js" "theme.*toggle" "Theme toggle functionality"

echo ""
echo -e "${BLUE}📊 Checking Documentation Structure...${NC}"
echo ""

# Check for proper HTML structure
check_content "documentation/index.html" "<nav.*sidebar" "Index has sidebar navigation"
check_content "documentation/frontend.html" "prism.*highlight" "Frontend docs include syntax highlighting"
check_content "documentation/api.html" "<table" "API docs include tables"
check_content "documentation/setup.html" "bash.*language" "Setup docs include bash code blocks"

# Check for comprehensive coverage
check_content "documentation/api.html" "AiThena.*Backend.*DocIntel.*FlashcardStudio" "API docs cover all services"
check_content "documentation/frontend.html" "17.*tools" "Frontend docs mention tool count"
check_content "documentation/backend.html" "Google.*Gemini" "Backend docs mention AI integration"

echo ""
echo -e "${BLUE}🔗 Checking Cross-References...${NC}"
echo ""

# Check for proper cross-references
check_content "documentation/index.html" "frontend.html.*backend.html.*api.html" "Index links to all main sections"
check_content "documentation/setup.html" "development.html" "Setup links to development guide"
check_content "documentation/api.html" "setup.html" "API docs reference setup guide"

echo ""
echo "=================================="
echo -e "${BLUE}📈 Validation Summary${NC}"
echo "=================================="

# Calculate percentage
percentage=$(( passed_checks * 100 / total_checks ))

echo "Total Checks: $total_checks"
echo "Passed: $passed_checks"
echo "Failed: $((total_checks - passed_checks))"
echo "Success Rate: $percentage%"

if [[ $percentage -ge 90 ]]; then
    echo -e "${GREEN}🎉 Excellent! Documentation is comprehensive and well-structured.${NC}"
elif [[ $percentage -ge 75 ]]; then
    echo -e "${YELLOW}⚠️  Good documentation with some minor issues.${NC}"
else
    echo -e "${RED}❌ Documentation needs significant improvements.${NC}"
fi

echo ""
echo -e "${BLUE}📚 Documentation Statistics:${NC}"

# Calculate total documentation size
total_size=0
for file in documentation/*.html documentation/*.css documentation/*.js documentation/*.md; do
    if [[ -f "$file" ]]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        total_size=$((total_size + size))
    fi
done

echo "Total Documentation Size: $(( total_size / 1024 ))KB"
echo "Number of Documentation Files: $(ls documentation/ | wc -l)"

echo ""
echo -e "${BLUE}🌐 Next Steps:${NC}"
echo "1. Open documentation/index.html in your browser"
echo "2. Test all navigation links"
echo "3. Verify interactive features work"
echo "4. Share with team for review"
echo ""
echo -e "${GREEN}✅ Documentation validation complete!${NC}"
