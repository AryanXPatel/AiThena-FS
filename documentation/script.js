// AiThena Documentation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize code copying
    initCodeCopying();
    
    // Initialize dark mode toggle
    initThemeToggle();
    
    // Initialize search functionality
    initSearch();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    updateActiveNavLink(this);
                }
            }
        });
    });
    
    // Handle scroll-based navigation highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeLink = document.querySelector(`[href="#${entry.target.id}"]`);
                if (activeLink) {
                    updateActiveNavLink(activeLink);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

function updateActiveNavLink(activeLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

function initMobileMenu() {
    // Create mobile menu toggle button
    const header = document.querySelector('.header');
    if (!header) return;
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.cssText = `
        display: none;
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1000;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 1.25rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
    `;
    
    document.body.appendChild(mobileToggle);
    
    // Add mobile menu styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1024px) {
            .mobile-menu-toggle {
                display: flex !important;
                align-items: center;
                justify-content: center;
            }
            
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                z-index: 999;
            }
            
            .sidebar.open {
                transform: translateX(0);
            }
            
            .sidebar-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .sidebar-overlay.open {
                opacity: 1;
                visibility: visible;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle functionality
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    });
    
    // Close menu when clicking nav links on mobile
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            }
        });
    });
}

function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initCodeCopying() {
    // Add copy buttons to code blocks
    document.querySelectorAll('pre').forEach(pre => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '📋 Copy';
        copyButton.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
        
        pre.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });
        
        copyButton.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                copyButton.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.innerHTML = '❌ Failed';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            }
        });
    });
}

function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 1.25rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

function initSearch() {
    // Create search functionality
    const searchButton = document.createElement('button');
    searchButton.className = 'search-toggle';
    searchButton.innerHTML = '🔍';
    searchButton.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 4rem;
        z-index: 1000;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 1.25rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(searchButton);
    
    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1001;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10vh;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.style.cssText = `
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 0.75rem;
        padding: 1.5rem;
        width: 90%;
        max-width: 600px;
        box-shadow: var(--shadow-xl);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search documentation...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 1rem;
        background: var(--bg-primary);
        color: var(--text-primary);
        margin-bottom: 1rem;
    `;
    
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.cssText = `
        max-height: 300px;
        overflow-y: auto;
    `;
    
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchResults);
    searchModal.appendChild(searchBox);
    document.body.appendChild(searchModal);
    
    // Search functionality
    searchButton.addEventListener('click', () => {
        searchModal.style.opacity = '1';
        searchModal.style.visibility = 'visible';
        searchBox.style.transform = 'translateY(0)';
        searchInput.focus();
    });
    
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchButton.click();
        }
    });
    
    function closeSearch() {
        searchModal.style.opacity = '0';
        searchModal.style.visibility = 'hidden';
        searchBox.style.transform = 'translateY(-20px)';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    // Simple search implementation
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const allText = document.querySelectorAll('h1, h2, h3, h4, p, li');
        const results = [];
        
        allText.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                const header = element.closest('.section')?.querySelector('h2')?.textContent || 'Unknown Section';
                results.push({
                    element,
                    header,
                    text: element.textContent.substring(0, 100) + '...'
                });
            }
        });
        
        displaySearchResults(results.slice(0, 5), query);
    });
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary);">No results found</p>';
            return;
        }
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result" style="
                padding: 1rem;
                border-bottom: 1px solid var(--border-light);
                cursor: pointer;
                transition: background 0.2s ease;
            " onmouseover="this.style.background='var(--bg-secondary)'" 
               onmouseout="this.style.background='transparent'"
               onclick="scrollToElement('${result.element.id || result.element.tagName}')">
                <div style="font-weight: 600; color: var(--primary-color); font-size: 0.875rem; margin-bottom: 0.25rem;">
                    ${result.header}
                </div>
                <div style="color: var(--text-primary); margin-bottom: 0.25rem;">
                    ${highlightQuery(result.text, query)}
                </div>
            </div>
        `).join('');
    }
    
    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--primary-color); color: white; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">$1</mark>');
    }
    
    window.scrollToElement = function(elementId) {
        const element = document.getElementById(elementId) || document.getElementsByTagName(elementId)[0];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            closeSearch();
        }
    };
}

// Add loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg-primary);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Remove loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.remove();
        }, 500);
    });
}

// Initialize loading animation
showLoading();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--primary-color);
        z-index: 1000;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
initScrollProgress();
