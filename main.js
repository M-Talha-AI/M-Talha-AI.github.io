/**
 * Muhammad Talha - AI Researcher & ML Engineer Portfolio
 * Complete JavaScript File with Programming Animations
 * Author: Muhammad Talha
 * Version: 3.0 - Now with Programming Vibes!
 */

$(document).ready(function() {
    // Initialize all animations and effects
    initializeBasicFunctionality();
    initializeProgrammingAnimations();
    
    // All elements are already active/visible - no loader needed
    
    // Progress Bar for Scroll Tracking
    window.onscroll = function() {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        document.getElementById("progress-bar").style.width = scrolled + "%";
        
        // Parallax effect for hero section
        const heroOffset = winScroll * 0.3;
        $('.hero::before').css('transform', `translateY(${heroOffset}px)`);
        
        // Make all fade-in elements active immediately when they enter viewport
        $('.fade-in').each(function() {
            let position = $(this).offset().top;
            let scroll = $(window).scrollTop();
            let windowHeight = $(window).height();
            
            if (scroll + windowHeight > position + 50) {
                $(this).addClass('active');
            }
        });
        
        // Header background opacity based on scroll
        const headerOpacity = Math.min(winScroll / 100, 0.95);
        $('#header').css('background-color', `rgba(30, 41, 59, ${headerOpacity})`);
    };
    
    // Make all fade-in elements active immediately on page load
    $('.fade-in').addClass('active');
});

// ================= BASIC FUNCTIONALITY =================
function initializeBasicFunctionality() {
    // Mobile Menu Toggle
    $('#mobile-menu').click(function() {
        $('.nav-links').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    
    // Close mobile menu when clicking a link
    $('.nav-links a').click(function() {
        $('.nav-links').removeClass('active');
        $('#mobile-menu').find('i').removeClass('fa-times').addClass('fa-bars');
    });
    
    // Sticky Header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('sticky');
            $('#back-to-top').addClass('show');
        } else {
            $('#header').removeClass('sticky');
            $('#back-to-top').removeClass('show');
        }
    });
    
    // Check header state immediately on page load
    if ($(window).scrollTop() > 100) {
        $('#header').addClass('sticky');
        $('#back-to-top').addClass('show');
    }
    
    // Enhanced smooth scrolling with easing
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        
        const target = $($(this).attr('href'));
        
        if (target.length) {
            // Add loading animation to clicked link
            $(this).addClass('nav-loading');
            
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, {
                duration: 1200,
                easing: 'easeInOutCubic',
                complete: function() {
                    // Remove loading animation
                    $('.nav-loading').removeClass('nav-loading');
                    
                    // Add bounce effect to target section
                    target.addClass('section-highlight');
                    setTimeout(() => {
                        target.removeClass('section-highlight');
                    }, 1000);
                }
            });
        }
    });
    
    // Add custom easing function
    $.easing.easeInOutCubic = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    };
    
    // Back to top button
    $('#back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
    
    // ======= PROJECT FILTERING AND LOAD MORE FUNCTIONALITY =======
    const projectsPerPage = 6;
    let currentFilter = 'all';
    let visibleProjects = projectsPerPage;
    
    // Initialize project display
    function initializeProjects() {
        $('.project-card').removeClass('visible');
        const $filteredProjects = currentFilter === 'all' 
            ? $('.project-card') 
            : $('.project-card[data-category*="' + currentFilter + '"]');
        $filteredProjects.slice(0, projectsPerPage).addClass('visible');
        toggleLoadMoreButton($filteredProjects.length);
    }
    
    function toggleLoadMoreButton(totalProjects) {
        if (visibleProjects < totalProjects) {
            $('.load-more-container').show();
        } else {
            $('.load-more-container').hide();
        }
    }
    
    // Load more projects
    $('#load-more').click(function() {
        $(this).addClass('loading');
        
        setTimeout(() => {
            const $filteredProjects = currentFilter === 'all' 
                ? $('.project-card') 
                : $('.project-card[data-category*="' + currentFilter + '"]');
            
            $filteredProjects.slice(visibleProjects, visibleProjects + projectsPerPage).addClass('visible');
            visibleProjects += projectsPerPage;
            toggleLoadMoreButton($filteredProjects.length);
            $(this).removeClass('loading');
        }, 500);
    });
    
    // Project filtering
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        visibleProjects = projectsPerPage;
        
        $('.project-card').removeClass('visible');
        
        if (currentFilter === 'all') {
            $('.project-card').slice(0, projectsPerPage).addClass('visible');
            toggleLoadMoreButton($('.project-card').length);
        } else {
            const $filteredProjects = $('.project-card[data-category*="' + currentFilter + '"]');
            $filteredProjects.slice(0, projectsPerPage).addClass('visible');
            toggleLoadMoreButton($filteredProjects.length);
        }
        
        if ($(window).scrollTop() > $('#projects').offset().top + 300) {
            $('html, body').animate({
                scrollTop: $('#projects').offset().top - 100
            }, 500);
        }
    });
    
    initializeProjects();
    
    // Form submission with validation and email redirection
    $('#contact-form').submit(function(e) {
        let valid = true;
        const nameField = $(this).find('input[name="name"]');
        const emailField = $(this).find('input[name="email"]');
        const messageField = $(this).find('textarea[name="message"]');
        
        if (nameField.val().trim() === '') {
            nameField.css('border-color', 'red');
            valid = false;
        } else {
            nameField.css('border-color', '#eaeaea');
        }
        
        if (emailField.val().trim() === '' || !isValidEmail(emailField.val())) {
            emailField.css('border-color', 'red');
            valid = false;
        } else {
            emailField.css('border-color', '#eaeaea');
        }
        
        if (messageField.val().trim() === '') {
            messageField.css('border-color', 'red');
            valid = false;
        } else {
            messageField.css('border-color', '#eaeaea');
        }
        
        if (!valid) {
            e.preventDefault();
            return false;
        }
        
        return true;
    });
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Enhanced theme toggle with animation
    $('#theme-toggle').click(function() {
        $(this).addClass('theme-switching');
        
        // Add transition overlay
        $('body').append('<div class="theme-transition-overlay"></div>');
        
        setTimeout(() => {
            $('body').toggleClass('dark-theme');
            localStorage.setItem('theme', $('body').hasClass('dark-theme') ? 'dark' : 'light');
            
            setTimeout(() => {
                $('.theme-transition-overlay').fadeOut(300, function() {
                    $(this).remove();
                });
                $('#theme-toggle').removeClass('theme-switching');
            }, 300);
        }, 150);
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-theme');
    }
    
    // Project modal controls
    $('.project-btn').off('click').on('click', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal') + '-modal';
        
        if ($('#' + modalId).length) {
            $('#' + modalId).addClass('show');
            $('body').css('overflow', 'hidden');
        } else {
            alert('Project details will be available soon!');
        }
    });
    
    $('.modal-close').click(function() {
        $(this).closest('.modal').removeClass('show');
        $('body').css('overflow', 'auto');
    });
    
    $(document).click(function(e) {
        if ($(e.target).hasClass('modal')) {
            $('.modal').removeClass('show');
            $('body').css('overflow', 'auto');
        }
    });
    
    // Enhanced form interactions
    $('.form-control').on('focus', function() {
        $(this).parent().addClass('form-group-focus');
    }).on('blur', function() {
        $(this).parent().removeClass('form-group-focus');
    });
    
    // Create modal for each project if not already in HTML
    createProjectModals();
}

// ================= PROGRAMMING ANIMATIONS =================
function initializeProgrammingAnimations() {
    // Initialize Matrix Rain Effect
    createMatrixRain();
    
    // Initialize Binary Code Streams
    createBinaryStreams();
    
    // Initialize Floating Code Symbols
    createFloatingSymbols();
    
    // Initialize Terminal Typing Effect
    initializeTerminalEffect();
    
    // Initialize Glitch Effects
    initializeGlitchEffects();
    
    // Initialize Code Syntax Highlighting
    initializeCodeBlocks();
    
    // Add circuit board background to sections
    addCircuitBackground();
    
    // Enhanced typewriter effect for hero subtitle
    setTimeout(() => {
        enhancedTypewriter();
        addLoadingBars();
        addNeonEffects();
        addRippleEffects();
    }, 1000);
    
    // Add keyboard event listeners for easter eggs
    initializeEasterEggs();
}

// Matrix Rain Effect
// Matrix Rain Effect - ABOUT SECTION ONLY (Where Talha's picture is)
function createMatrixRain() {
    const aboutSection = $('#about'); // Target About Me section instead of hero
    if (aboutSection.length === 0) return;
    
    // Ensure about section has relative positioning
    aboutSection.css('position', 'relative');
    
    const matrixBg = $('<div class="matrix-bg"></div>');
    aboutSection.append(matrixBg);
    
    const characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890';
    const columnCount = Math.floor(window.innerWidth / 40); // More frequent columns
    
    for (let i = 0; i < columnCount; i++) {
        createMatrixColumn(matrixBg, characters, i);
    }
}

function createMatrixColumn(container, characters, index) {
    const column = $('<div class="matrix-column"></div>');
    const charactersCount = Math.floor(Math.random() * 20) + 10; // More characters per column
    let text = '';
    
    for (let i = 0; i < charactersCount; i++) {
        text += characters[Math.floor(Math.random() * characters.length)];
        if (i < charactersCount - 1) text += '<br>';
    }
    
    column.html(text);
    column.css({
        left: index * 40 + 'px', // Closer spacing between columns
        animationDuration: (Math.random() * 6 + 8) + 's', // Faster: 8-14 seconds
        animationDelay: Math.random() * 4 + 's' // Shorter delays
    });
    
    container.append(column);
    
    // Remove and recreate column after animation - shorter intervals
    setTimeout(() => {
        column.remove();
        setTimeout(() => createMatrixColumn(container, characters, index), Math.random() * 4000 + 2000); // 2-6 second delays
    }, 16000);
}

// Binary Code Streams
function createBinaryStreams() {
    const sections = $('.section');
    
    sections.each(function(index) {
        if (index % 2 === 0) {
            const section = $(this);
            if (section.find('.binary-bg').length === 0) {
                const binaryBg = $('<div class="binary-bg"></div>');
                section.css('position', 'relative').append(binaryBg);
                
                for (let i = 0; i < 3; i++) {
                    createBinaryStream(binaryBg, i);
                }
            }
        }
    });
}

function createBinaryStream(container, index) {
    const stream = $('<div class="binary-stream"></div>');
    let binaryText = '';
    
    for (let i = 0; i < 100; i++) {
        binaryText += Math.random() > 0.5 ? '1' : '0';
        if (i % 8 === 7) binaryText += ' ';
    }
    
    stream.text(binaryText);
    stream.css({
        top: (index * 30 + 20) + '%',
        animationDelay: index * 3 + 's', // Slower delays
        animationDuration: (15 + Math.random() * 8) + 's' // Slower: 15-23 seconds
    });
    
    container.append(stream);
    
    // Recreate stream after animation - longer intervals
    setTimeout(() => {
        stream.remove();
        setTimeout(() => createBinaryStream(container, index), Math.random() * 5000);
    }, 25000);
}

// Floating Code Symbols
function createFloatingSymbols() {
    const hero = $('.hero');
    if (hero.length === 0) return;
    
    const symbolsContainer = $('<div class="code-symbols"></div>');
    hero.append(symbolsContainer);
    
    const symbols = ['{', '}', '(', ')', '[', ']', '<', '>', '/', '\\', ';', ':', '=', '+', '-', '*', '%', '&', '|', '!', '?', '#', '@', '$'];
    
    setInterval(() => {
        if (symbolsContainer.children().length < 10) { // Reduced count for slower effect
            createFloatingSymbol(symbolsContainer, symbols);
        }
    }, 4000); // Slower interval
}

function createFloatingSymbol(container, symbols) {
    const symbol = $('<div class="floating-symbol"></div>');
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    symbol.text(randomSymbol);
    symbol.css({
        left: Math.random() * 100 + '%',
        animationDuration: (20 + Math.random() * 15) + 's', // Slower: 20-35 seconds
        fontSize: (16 + Math.random() * 16) + 'px'
    });
    
    container.append(symbol);
    
    // Remove symbol after animation - longer timeout
    setTimeout(() => {
        symbol.remove();
    }, 35000);
}

// Terminal Typing Effect
function initializeTerminalEffect() {
    const aboutSection = $('#about');
    if (aboutSection.length === 0) return;
    
    const terminalHtml = `
        <div class="terminal-window" style="margin: 2rem 0;">
            <div class="terminal-header">
                <div class="terminal-button close"></div>
                <div class="terminal-button minimize"></div>
                <div class="terminal-button maximize"></div>
                <span style="margin-left: 10px; color: #ccc; font-size: 14px;">terminal — talha@ai-dev</span>
            </div>
            <div class="terminal-body">
                <div class="terminal-line terminal-prompt" style="--delay: 0s;">cd ~/projects/RLVR</div>
                <div class="terminal-line terminal-prompt" style="--delay: 0.5s;">python train_model.py --model=qwen3</div>
                <div class="terminal-line" style="--delay: 1s;">Training started... Epoch 7/100</div>
                <div class="terminal-line" style="--delay: 1.5s;">Accuracy: 94.2% | Loss: 0.023</div>
                <div class="terminal-line terminal-prompt" style="--delay: 2s;">git add . && git commit -m "feat: improved model accuracy"</div>
                <div class="terminal-line" style="--delay: 2.5s;">[main a7b3c2d] feat: improved model accuracy</div>
                <div class="terminal-line terminal-prompt" style="--delay: 3s;">python run project.py<span class="terminal-cursor"></span></div>
            </div>
        </div>
    `;
    
    aboutSection.find('.about-text').append(terminalHtml);
}

// Glitch Effects
function initializeGlitchEffects() {
    const heroTitle = $('.hero h1');
    if (heroTitle.length > 0) {
        heroTitle.addClass('glitch-text').attr('data-text', heroTitle.text());
        
        setInterval(() => {
            if (Math.random() > 0.8) { // Less frequent glitch activation
                heroTitle.addClass('glitch-active');
                setTimeout(() => {
                    heroTitle.removeClass('glitch-active');
                }, 800);
            }
        }, 8000); // Much slower interval
    }
    
    $('.section-title h2').each(function() {
        const title = $(this);
        // Don't add glitch effect to Professional Journey heading
        if (!title.closest('#experience').length && Math.random() > 0.6) {
            title.addClass('glitch-text').attr('data-text', title.text());
        }
    });
}

// Code Syntax Highlighting
function initializeCodeBlocks() {
    const experienceSection = $('#experience');
    if (experienceSection.length === 0) return;
    
    const codeBlockHtml = `
        <div class="code-block" style="margin: 2rem 0; font-size: 14px;">
            <div style="margin-bottom: 10px; color: #6a9955;">// Current focus: Building next-gen AI systems</div>
            <div><span class="keyword">class</span> <span class="function">AIDeveloper</span> {</div>
            <div style="padding-left: 20px;">
                <span class="keyword">constructor</span>() {<br>
                <div style="padding-left: 20px;">
                    <span class="keyword">this</span>.<span class="variable">skills</span> = [<span class="string">'Agentic/Generative AI'</span> , <span class="string">'Machine/Deep Learning'</span>, <span class="string">'Computer Vision'</span>, <span class="string">'Reinforcement Learning'</span>];<br>
                    <span class="keyword">this</span>.<span class="variable">passion</span> = <span class="string">'Turning processes Autonomous and Ideas into Reality through AI'</span>;<br>
                    <span class="keyword">this</span>.<span class="variable">experience</span> = <span class="number">4+</span>; <span class="comment">// years</span>
                </div>
                }
            </div>
            <div style="padding-left: 20px;">
                <span class="function">buildIntelligentSolutions</span>() {<br>
                <div style="padding-left: 20px;">
                    <span class="keyword">return</span> <span class="keyword">this</span>.<span class="function">innovate</span>() + <span class="keyword">this</span>.<span class="function">collaborate</span>();
                </div>
                }
            </div>
            <div>}</div>
        </div>
    `;
    
    experienceSection.find('.container').append(codeBlockHtml);
}

// Circuit Board Background
function addCircuitBackground() {
    const projectsSection = $('#projects');
    if (projectsSection.length > 0) {
        projectsSection.css('position', 'relative');
        const circuit = $('<div class="circuit-bg"></div>');
        projectsSection.prepend(circuit);
    }
}

// Enhanced typewriter effect for hero subtitle
function enhancedTypewriter() {
    const subtitle = $('.hero-subtitle');
    if (subtitle.length === 0) return;
    
    const originalText = subtitle.text();
    const prefixes = ['> ', '$ ', '➜ ', '>> '];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    subtitle.text('').addClass('typewriter-text').css('--characters', originalText.length);
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i === 0) {
            subtitle.text(prefix);
        } else if (i <= originalText.length) {
            subtitle.text(prefix + originalText.substring(0, i));
        } else {
            clearInterval(typeInterval);
            subtitle.append('<span class="terminal-cursor"></span>');
        }
        i++;
            }, 200); // Slower typing speed
}

// Loading bar animations for project cards
function addLoadingBars() {
    $('.project-card').each(function() {
        const card = $(this);
        const loadingBar = $(`
            <div class="loading-bar" style="margin-top: 10px;">
                <div class="loading-progress"></div>
            </div>
        `);
        
        card.find('.project-content').append(loadingBar);
        
        card.hover(
            function() {
                $(this).find('.loading-progress').css('animation-play-state', 'running');
            },
            function() {
                $(this).find('.loading-progress').css('animation-play-state', 'paused');
            }
        );
    });
}

// Enhanced skill icon hover effects - IMPROVED VISIBILITY
function addNeonEffects() {
    $('.nav-links a').hover(
        function() {
            $(this).addClass('neon-text');
        },
        function() {
            $(this).removeClass('neon-text');
        }
    );
    
    // Improved skill tag hover - better text visibility
    $('.skill-tag').each(function() {
        let isAnimating = false;
        const $tag = $(this);
        const originalBg = $tag.css('background-color');
        const originalColor = $tag.css('color');
        
        $tag.hover(
            function() {
                if (!isAnimating) {
                    isAnimating = true;
                    
                    // Store original styles
                    $tag.data('original-bg', originalBg);
                    $tag.data('original-color', originalColor);
                    
                    // Apply hover styles with proper contrast
                    if ($('body').hasClass('dark-theme')) {
                        $tag.css({
                            'background-color': '#64B5F6',
                            'color': '#121212',
                            'transform': 'translateY(-8px) rotateY(360deg) scale(1.05)',
                            'box-shadow': '0 10px 25px rgba(100, 181, 246, 0.4)'
                        });
                        $tag.find('i').css('color', '#121212');
                    } else {
                        $tag.css({
                            'background-color': 'var(--primary)',
                            'color': 'white',
                            'transform': 'translateY(-8px) rotateY(360deg) scale(1.05)',
                            'box-shadow': '0 10px 25px rgba(0, 80, 162, 0.3)'
                        });
                        $tag.find('i').css('color', 'white');
                    }
                }
            },
            function() {
                // Reset to original styles
                $tag.css({
                    'background-color': '',
                    'color': '',
                    'transform': 'translateY(0) rotateY(0deg) scale(1)',
                    'box-shadow': ''
                });
                $tag.find('i').css('color', '');
                
                // Reset animation flag after transition completes
                setTimeout(() => {
                    isAnimating = false;
                }, 600);
            }
        );
    });
}

// Ripple effects for buttons
function addRippleEffects() {
    $('.btn, .project-btn, .form-submit').on('click', function(e) {
        const button = $(this);
        const ripple = $('<span class="ripple"></span>');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.css({
            width: size,
            height: size,
            left: x,
            top: y
        });
        
        button.append(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Easter eggs and special effects
function initializeEasterEggs() {
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    $(document).keydown(function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateMatrixMode();
            konamiCode = [];
        }
    });
}

// Easter egg: Matrix mode
function activateMatrixMode() {
    $('body').addClass('matrix-mode');
    
    // Add matrix mode styles dynamically
    if (!$('#matrix-mode-styles').length) {
        $('head').append(`
            <style id="matrix-mode-styles">
                .matrix-mode {
                    background: #000 !important;
                    color: #00ff41 !important;
                }
                .matrix-mode * {
                    color: #00ff41 !important;
                    text-shadow: 0 0 5px #00ff41 !important;
                }
                .matrix-mode .hero {
                    background: #000 !important;
                }
            </style>
        `);
    }
    
    // Show message
    const message = $(`
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: #00ff41;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Courier New', monospace;
            text-align: center;
            border: 2px solid #00ff41;
        ">
            <h3>🌟 MATRIX MODE ACTIVATED 🌟</h3>
            <p>Welcome to the Matrix, Neo...</p>
            <button onclick="$(this).parent().remove(); $('body').removeClass('matrix-mode');" 
                    style="margin-top: 10px; padding: 5px 15px; background: #00ff41; color: #000; border: none; cursor: pointer;">
                Exit Matrix
            </button>
        </div>
    `);
    
    $('body').append(message);
    
    setTimeout(() => {
        message.fadeOut();
        $('body').removeClass('matrix-mode');
    }, 10000);
}

// Performance optimization: Pause animations when not visible
let animationsPaused = false;

$(window).on('blur', function() {
    if (!animationsPaused) {
        $('.matrix-column, .binary-stream, .floating-symbol').css('animation-play-state', 'paused');
        animationsPaused = true;
    }
});

$(window).on('focus', function() {
    if (animationsPaused) {
        $('.matrix-column, .binary-stream, .floating-symbol').css('animation-play-state', 'running');
        animationsPaused = false;
    }
});

// Enhanced project card interactions
function enhanceProjectCards() {
    $('.project-card').hover(
        function() {
            $(this).addClass('project-hover');
            // Add magnetic effect
            $(this).on('mousemove.magnetic', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                $(this).css('transform', `translateY(-15px) rotateX(5deg) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg)`);
            });
        },
        function() {
            $(this).removeClass('project-hover');
            $(this).off('mousemove.magnetic');
            $(this).css('transform', '');
        }
    );
}

// Create project modals dynamically
function createProjectModals() {
    const projects = [
        {
            id: 'inexor-llm',
            title: 'INEXOR-LLM — Financial Domain Model',
            timeline: 'January 2025 - Present',
            client: 'INEXOR AI',
            description: 'A proprietary Large Language Model developed from scratch specifically for finance applications. This specialized LLM leverages cutting-edge techniques like Rotary Position Embedding (RoPE), multi-latent attention mechanisms, and Mixture of Experts (MoE) architecture to deliver precise and contextually relevant financial analysis and insights.',
            features: [
                'Custom architecture optimized for financial reasoning and decision-making',
                'Specialized pretraining on comprehensive financial corpus including regulations, reports, and market analyses',
                'Mixture of Experts approach allowing for domain-specific reasoning paths',
                'Distributed GPU training infrastructure for efficient model scaling',
                'Fine-tuning pipeline for client-specific financial applications'
            ],
            technologies: 'PyTorch, DeepSpeed, Accelerate, NVIDIA H100 GPUs, MLHA, LangChain, AutoGen, RoPE, MLFlow, MoE',
            outcome: 'The model is currently in development with initial benchmarks showing 40% improvement in financial reasoning tasks compared to general-purpose LLMs of similar size. Target completion is set for Q2 2026.'
        },
        {
            id: 'latex-python',
            title: 'LaTeX to Python Converter',
            timeline: 'June 2023 - December 2024',
            client: 'SkyElectric',
            description: 'An advanced tool that accurately converts complex LaTeX mathematical expressions into executable Python code. Built by fine-tuning DeepSeek\'s math-specialized LLM (Aimo 2) and optimized for high-performance computing environments.',
            features: [
                'Specialized fine-tuning methodology for mathematical code generation',
                'Support for complex mathematical notations and operations',
                'Integration with scientific computing libraries (NumPy, SciPy, SymPy)',
                'Custom tokenization for mathematical symbols and expressions',
                'Web interface for easy conversion and testing'
            ],
            technologies: 'DeepSeek Aimo 2, PyTorch, NVIDIA H-100, DeepSpeed, Pytorch, PEFT, SciPy, SymPy, FastAPI, MLFlow',
            outcome: '95% accuracy on complex mathematical expressions, reducing development time for computational algorithms by 60%. Successfully deployed at Interstellus Research for use by mathematicians and researchers.'
        },
        {
            id: 'industrial-rag',
            title: 'Industrial RAG System',
            timeline: 'August 2023 - November 2024',
            client: 'GuestGuru.ai',
            description: 'A Retrieval-Augmented Generation system designed for the hospitality industry, enabling contextually relevant responses based on extensive domain knowledge. The system leverages advanced vector database architecture with optimized chunking and embedding strategies.',
            features: [
                'Custom document processing pipeline with semantic segmentation',
                'Multi-vector retrieval system for improved context understanding',
                'Hybrid search combining sparse and dense embeddings',
                'Real-time relevance feedback mechanism',
                'Custom evaluation framework for response quality assessment'
            ],
            technologies: 'LangChain, SupaBase(Vectorized), Open AI Embeddings, OpenAI API, Node.js, RestAPI, Redis',
            outcome: 'Achieved 40% reduction in response time while improving answer accuracy by 25% compared to traditional chatbots. The system is now handling over 5,000 daily queries with a 98% satisfaction rate.'
        },
        {
            id: 'ev-detection',
            title: 'EV Intrusion Detection System',
            timeline: 'April 2021 - September 2023',
            client: 'Automotive Security Consortium',
            description: 'A cybersecurity system for electric vehicles that uses deep learning to detect intrusions and anomalies in vehicle communications networks. The system monitors CAN bus and other in-vehicle networks to identify malicious activities in real-time.',
            features: [
                'Real-time monitoring of vehicle network communications',
                'Anomaly detection using advanced deep learning models',
                'Low false positive rate through contextual analysis',
                'Lightweight implementation optimized for embedded automotive systems',
                'Secure reporting and alert mechanism'
            ],
            technologies: 'PyTorch, TensorFlow Lite, LSTM Networks, Autoencoders, CAN Protocol, Embedded Linux',
            outcome: 'Achieved 98% detection accuracy with a false positive rate under 0.5%. The system has been adopted for integration in next-generation electric vehicles by two major automotive manufacturers.'
        }
    ];
    
    projects.forEach(function(project) {
        // Check if modal already exists
        if ($('#' + project.id + '-modal').length === 0) {
            const modalHtml = `
            <div class="modal" id="${project.id}-modal">
                <div class="modal-content">
                    <div class="modal-close" data-modal="${project.id}-modal">
                        <i class="fas fa-times"></i>
                    </div>
                    <h2>${project.title}</h2>
                    <p><strong>Timeline:</strong> ${project.timeline}</p>
                    <p><strong>Client:</strong> ${project.client}</p>
                    <p><strong>Description:</strong></p>
                    <p>${project.description}</p>
                    <p><strong>Key Features:</strong></p>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <p><strong>Technologies Used:</strong></p>
                    <p>${project.technologies}</p>
                    <p><strong>Outcome:</strong></p>
                    <p>${project.outcome}</p>
                </div>
            </div>
            `;
            
            $('body').append(modalHtml);
            
            // Attach event listeners to newly created modals
            $('.modal-close').click(function() {
                $(this).closest('.modal').removeClass('show');
                $('body').css('overflow', 'auto');
            });
        }
    });
}

// Add all the missing CSS styles dynamically
function addDynamicStyles() {
    if (!$('#programming-animations-styles').length) {
        $('head').append(`
            <style id="programming-animations-styles">
                /* Matrix Rain Effect - ABOUT SECTION ONLY */
                #about .matrix-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                #about .matrix-column {
                    position: absolute;
                    top: -100%;
                    font-family: 'Courier New', monospace;
                    font-size: 16px;
                    color: #00ff41;
                    text-shadow: 0 0 8px #00ff41, 0 0 15px #00ff41;
                    animation: matrixFall linear infinite;
                    opacity: 0.4;
                    z-index: 0;
                    font-weight: normal;
                    line-height: 1.2;
                }

                /* Prevent matrix in other sections */
                .hero .matrix-bg,
                .section:not(#about) .matrix-bg,
                #experience .matrix-bg,
                #projects .matrix-bg,
                #contact .matrix-bg {
                    display: none !important;
                }

                @keyframes matrixFall {
                    0% { 
                        top: -100%; 
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.4;
                    }
                    90% { 
                        opacity: 0.4;
                    }
                    100% { 
                        top: 100%; 
                        opacity: 0;
                    }
                }

                /* Binary Code Animation - SLOWER */
                .binary-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    opacity: 0.02;
                    pointer-events: none;
                }

                .binary-stream {
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: var(--primary);
                    animation: binaryFlow 20s linear infinite;
                    white-space: nowrap;
                }

                @keyframes binaryFlow {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100vw); }
                }

                /* Terminal Window Effect */
                .terminal-window {
                    background: #1a1a1a;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    font-family: 'Courier New', monospace;
                    margin: 20px 0;
                }

                .terminal-header {
                    background: #333;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .terminal-button {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .terminal-button.close { background: #ff5f57; }
                .terminal-button.minimize { background: #ffbd2e; }
                .terminal-button.maximize { background: #28ca42; }

                .terminal-body {
                    padding: 20px;
                    color: #00ff41;
                    background: #000;
                    min-height: 200px;
                    overflow: hidden;
                }

                .terminal-line {
                    margin-bottom: 10px;
                    opacity: 0;
                    animation: terminalTyping 0.5s ease-out forwards;
                    animation-delay: var(--delay, 0s);
                }

                .terminal-prompt::before {
                    content: '➜ ';
                    color: #61dafb;
                    margin-right: 5px;
                }

                .terminal-cursor {
                    display: inline-block;
                    background: #00ff41;
                    width: 8px;
                    height: 16px;
                    animation: terminalBlink 1s step-end infinite;
                    margin-left: 2px;
                }

                @keyframes terminalTyping {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes terminalBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }

                /* Glitch Text Effects - SLOWER */
                .glitch-text {
                    position: relative;
                    color: white;
                    font-weight: bold;
                    animation: glitchBase 2s ease-in-out infinite alternate;
                }

                .glitch-text::before,
                .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .glitch-text::before {
                    animation: glitchRed 2s ease-in-out infinite alternate;
                    color: #ff073a;
                    z-index: -1;
                }

                .glitch-text::after {
                    animation: glitchBlue 2s ease-in-out infinite alternate;
                    color: #00d4ff;
                    z-index: -2;
                }

                @keyframes glitchBase {
                    0% { transform: translate(0); }
                    20% { transform: translate(-1px, 1px); }
                    40% { transform: translate(-1px, -1px); }
                    60% { transform: translate(1px, 1px); }
                    80% { transform: translate(1px, -1px); }
                    100% { transform: translate(0); }
                }

                @keyframes glitchRed {
                    0% { transform: translate(0); }
                    20% { transform: translate(1px, 1px); }
                    40% { transform: translate(1px, -1px); }
                    60% { transform: translate(-1px, 1px); }
                    80% { transform: translate(-1px, -1px); }
                    100% { transform: translate(0); }
                }

                @keyframes glitchBlue {
                    0% { transform: translate(0); }
                    20% { transform: translate(-1px, -1px); }
                    40% { transform: translate(-1px, 1px); }
                    60% { transform: translate(1px, -1px); }
                    80% { transform: translate(1px, 1px); }
                    100% { transform: translate(0); }
                }

                /* Code Syntax Highlighting Effect */
                .code-block {
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: 'Fira Code', 'Courier New', monospace;
                    line-height: 1.6;
                    position: relative;
                    overflow: hidden;
                }

                .code-block::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.1), transparent);
                    transform: translateX(-100%);
                    animation: codeScan 3s ease-in-out infinite;
                }

                .keyword { color: #569bd4; }
                .string { color: #ce9178; }
                .comment { color: #6a9955; font-style: italic; }
                .function { color: #dcdcaa; }
                .number { color: #b5cea8; }
                .variable { color: #9cdcfe; }

                @keyframes codeScan {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(100%); }
                }

                /* Circuit Board Background - SLOWER */
                .circuit-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.02;
                    background-image: 
                        linear-gradient(90deg, var(--primary) 1px, transparent 1px),
                        linear-gradient(var(--primary) 1px, transparent 1px);
                    background-size: 20px 20px;
                    animation: circuitMove 40s linear infinite;
                }

                .circuit-bg::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20px 20px, var(--accent) 2px, transparent 2px),
                        radial-gradient(circle at 60px 60px, var(--primary) 1px, transparent 1px);
                    background-size: 80px 80px, 40px 40px;
                    animation: circuitPulse 8s ease-in-out infinite;
                }

                @keyframes circuitMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 20px 20px; }
                }

                @keyframes circuitPulse {
                    0%, 100% { opacity: 0.02; }
                    50% { opacity: 0.05; }
                }

                /* Floating Brackets Animation - SLOWER */
                .code-symbols {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .floating-symbol {
                    position: absolute;
                    font-family: 'Fira Code', monospace;
                    font-size: 24px;
                    color: var(--accent);
                    opacity: 0.08;
                    animation: floatSymbol 25s linear infinite;
                }

                @keyframes floatSymbol {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.08; }
                    90% { opacity: 0.08; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }

                /* Neon Glow Effects - SLOWER */
                .neon-text {
                    color: var(--accent);
                    text-shadow: 
                        0 0 5px var(--accent),
                        0 0 10px var(--accent),
                        0 0 15px var(--accent),
                        0 0 20px var(--accent);
                    animation: neonPulse 4s ease-in-out infinite alternate;
                }

                @keyframes neonPulse {
                    from {
                        text-shadow: 
                            0 0 5px var(--accent),
                            0 0 10px var(--accent),
                            0 0 15px var(--accent),
                            0 0 20px var(--accent);
                    }
                    to {
                        text-shadow: 
                            0 0 2px var(--accent),
                            0 0 5px var(--accent),
                            0 0 8px var(--accent),
                            0 0 12px var(--accent),
                            0 0 15px var(--accent);
                    }
                }

                /* Loading Bar Animation - SLOWER */
                .loading-bar {
                    width: 100%;
                    height: 4px;
                    background: #333;
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                }

                .loading-progress {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent), var(--primary));
                    border-radius: 2px;
                    animation: loadingProgress 6s ease-in-out infinite;
                    position: relative;
                }

                .loading-progress::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    animation: loadingShine 3s ease-in-out infinite;
                }

                @keyframes loadingProgress {
                    0% { width: 0%; }
                    50% { width: 75%; }
                    100% { width: 100%; }
                }

                @keyframes loadingShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                /* Ripple Effect */
                .btn, .project-btn, .form-submit {
                    position: relative;
                    overflow: hidden;
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: rippleEffect 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes rippleEffect {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                /* Dark Theme Matrix Rain - ABOUT SECTION ONLY */
                body.dark-theme #about .matrix-column {
                    color: #00ff41;
                    text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41;
                    opacity: 0.6;
                    font-weight: normal;
                }

                /* Light Theme Matrix Rain - ABOUT SECTION ONLY */
                body:not(.dark-theme) #about .matrix-column {
                    color: #00ff41;
                    text-shadow: 0 0 8px #00ff41, 0 0 15px #00ff41;
                    opacity: 0.4;
                    font-weight: normal;
                }

                /* About Section Dark Mode Fix */
                body.dark-theme #about {
                    background-color: #121212 !important;
                    color: #f8f9fa !important;
                }

                body.dark-theme #about .section-title h2 {
                    color: #f8f9fa !important;
                }

                body.dark-theme #about .section-title p {
                    color: #bbb !important;
                }

                body.dark-theme #about .about-text h3 {
                    color: #f8f9fa !important;
                }

                body.dark-theme #about .about-text p {
                    color: #bbb !important;
                }

                /* Professional Journey (Experience) Dark Mode Fix */
                body.dark-theme #experience {
                    background-color: #1a1a1a !important;
                    color: #f8f9fa !important;
                }

                body.dark-theme #experience .section-title h2 {
                    color: #f8f9fa !important;
                }

                body.dark-theme #experience .section-title p {
                    color: #bbb !important;
                }

                body.dark-theme .experience-section {
                    background-color: #1a1a1a !important;
                }

                /* Fix glitch effect on Professional Journey heading */
                body.dark-theme #experience .section-title h2.glitch-text {
                    color: #f8f9fa !important;
                }

                body.dark-theme #experience .section-title h2.glitch-text::before,
                body.dark-theme #experience .section-title h2.glitch-text::after {
                    color: #f8f9fa !important;
                }

                /* Remove glitch effect from experience section title */
                #experience .section-title h2 {
                    animation: none !important;
                }

                #experience .section-title h2::before,
                #experience .section-title h2::after {
                    display: none !important;
                }

                /* Skill Tag Hover Effects - FIXED VISIBILITY */
                .skill-tag {
                    background-color: rgba(0, 80, 162, 0.1);
                    color: var(--primary);
                    padding: 0.6rem 1.2rem;
                    border-radius: 50px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transform-style: preserve-3d;
                    border: 1px solid transparent;
                }

                .skill-tag:hover {
                    background-color: var(--primary);
                    color: white !important;
                    transform: translateY(-8px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(0, 80, 162, 0.3);
                    border-color: var(--primary);
                }

                .skill-tag:hover i {
                    color: white !important;
                }

                .skill-tag i {
                    margin-right: 6px;
                    font-size: 0.9rem;
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    color: inherit;
                }

                /* Dark theme skill tags - IMPROVED VISIBILITY */
                body.dark-theme .skill-tag {
                    background-color: rgba(100, 181, 246, 0.15);
                    color: #64B5F6;
                    border: 1px solid rgba(100, 181, 246, 0.3);
                }

                body.dark-theme .skill-tag:hover {
                    background-color: #64B5F6;
                    color: #121212 !important;
                    border-color: #64B5F6;
                    box-shadow: 0 10px 25px rgba(100, 181, 246, 0.4);
                }

                body.dark-theme .skill-tag:hover i {
                    color: #121212 !important;
                }

                /* Light theme skill tags - IMPROVED VISIBILITY */
                body:not(.dark-theme) .skill-tag {
                    background-color: rgba(0, 80, 162, 0.1);
                    color: var(--primary);
                    border: 1px solid rgba(0, 80, 162, 0.2);
                }

                body:not(.dark-theme) .skill-tag:hover {
                    background-color: var(--primary);
                    color: white !important;
                    border-color: var(--primary);
                }

                body:not(.dark-theme) .skill-tag:hover i {
                    color: white !important;
                }

                /* Ensure all content stays above matrix in About section only */
                #about .about-content {
                    position: relative;
                    z-index: 2;
                }

                #about .container {
                    position: relative;
                    z-index: 2;
                }

                #about .section-title {
                    position: relative;
                    z-index: 2;
                }

                .navbar {
                    position: relative;
                    z-index: 3;
                }

                /* Make sure ALL other sections don't have matrix */
                .hero .matrix-bg,
                .section:not(#about) .matrix-bg,
                #experience .matrix-bg,
                #projects .matrix-bg,
                #contact .matrix-bg {
                    display: none !important;
                }

                body.dark-theme .terminal-window {
                    background: #0d1117;
                    border: 1px solid #30363d;
                }

                body.dark-theme .terminal-header {
                    background: #21262d;
                }

                body.dark-theme .terminal-body {
                    background: #0d1117;
                    color: #00ff41;
                }

                body.dark-theme .code-block {
                    background: #0d1117;
                    border: 1px solid #30363d;
                    color: #e6edf3;
                }

                body.dark-theme .keyword { color: #79c0ff; }
                body.dark-theme .string { color: #a5d6ff; }
                body.dark-theme .comment { color: #8b949e; }
                body.dark-theme .function { color: #d2a8ff; }
                body.dark-theme .number { color: #79c0ff; }
                body.dark-theme .variable { color: #ffa657; }

                body.dark-theme .circuit-bg {
                    background-image: 
                        linear-gradient(90deg, #64B5F6 1px, transparent 1px),
                        linear-gradient(#64B5F6 1px, transparent 1px);
                }

                body.dark-theme .circuit-bg::before {
                    background-image: 
                        radial-gradient(circle at 20px 20px, #64B5F6 2px, transparent 2px),
                        radial-gradient(circle at 60px 60px, #2196F3 1px, transparent 1px);
                }

                body.dark-theme .loading-bar {
                    background: #21262d;
                }

                body.dark-theme .loading-progress {
                    background: linear-gradient(90deg, #64B5F6, #2196F3);
                }

                body.dark-theme .glitch-text {
                    color: #e6edf3;
                }

                body.dark-theme .neon-text {
                    color: #64B5F6;
                    text-shadow: 
                        0 0 5px #64B5F6,
                        0 0 10px #64B5F6,
                        0 0 15px #64B5F6,
                        0 0 20px #64B5F6;
                }

                /* Light Theme Compatibility */
                body:not(.dark-theme) .matrix-column {
                    color: #00ff41;
                    text-shadow: 0 0 5px #00ff41;
                }

                body:not(.dark-theme) .binary-stream {
                    color: #0050A2;
                }

                body:not(.dark-theme) .floating-symbol {
                    color: #0050A2;
                }

                body:not(.dark-theme) .terminal-window {
                    background: #1a1a1a;
                    border: 1px solid #333;
                }

                body:not(.dark-theme) .code-block {
                    background: #1e1e1e;
                    color: #d4d4d4;
                }

                body:not(.dark-theme) .circuit-bg {
                    background-image: 
                        linear-gradient(90deg, #0050A2 1px, transparent 1px),
                        linear-gradient(#0050A2 1px, transparent 1px);
                }

                body:not(.dark-theme) .circuit-bg::before {
                    background-image: 
                        radial-gradient(circle at 20px 20px, #64B5F6 2px, transparent 2px),
                        radial-gradient(circle at 60px 60px, #0050A2 1px, transparent 1px);
                }

                body:not(.dark-theme) .neon-text {
                    color: #64B5F6;
                    text-shadow: 
                        0 0 5px #64B5F6,
                        0 0 10px #64B5F6,
                        0 0 15px #64B5F6,
                        0 0 20px #64B5F6;
                }

                /* About Section Image Alignment Fix */
                .about-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 5rem;
                }

                .about-img {
                    flex: 1;
                    position: relative;
                    max-width: 400px;
                    margin: 0;
                    align-self: flex-start;
                    margin-top: 0;
                }

                .about-text {
                    flex: 1;
                    padding-top: 0;
                }

                .about-text h3 {
                    margin-top: 0;
                    line-height: 1.2;
                }

                /* Responsive alignment fixes */
                @media (max-width: 992px) {
                    .about-content {
                        flex-direction: column;
                        align-items: center;
                        gap: 3rem;
                    }
                    
                    .about-img {
                        max-width: 350px;
                        margin: 0 auto;
                    }
                    
                    .about-text {
                        text-align: center;
                    }
                }

                /* Theme Transition Styles */
                .theme-transition-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, rgba(30, 41, 59, 0.9) 100%);
                    z-index: 9999;
                    animation: themeTransition 0.6s ease-in-out;
                }
                
                @keyframes themeTransition {
                    0% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0; transform: scale(1); }
                }
                
                .theme-switching {
                    animation: themeSwitchRotate 0.6s ease-in-out;
                }
                
                @keyframes themeSwitchRotate {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
                
                .section-highlight {
                    animation: sectionBounce 1s ease-out;
                }
                
                @keyframes sectionBounce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                .nav-loading::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--accent), var(--primary));
                    animation: navLoading 1.2s ease-in-out;
                }
                
                @keyframes navLoading {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }

                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .matrix-column {
                        font-size: 12px;
                    }
                    
                    .binary-stream {
                        font-size: 10px;
                    }
                    
                    .floating-symbol {
                        font-size: 18px;
                    }
                    
                    .terminal-body {
                        padding: 15px;
                        font-size: 14px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .matrix-column,
                    .binary-stream,
                    .floating-symbol,
                    .neon-text {
                        animation: none;
                    }
                    
                    .glitch-text::before,
                    .glitch-text::after {
                        display: none;
                    }
                }
            </style>
        `);
    }
}

// Initialize everything when DOM is ready
$(document).ready(function() {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize enhanced project cards
    setTimeout(() => {
        enhanceProjectCards();
    }, 2000);
});