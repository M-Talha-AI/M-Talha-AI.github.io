/**
 * Muhammad Talha - AI Researcher & ML Engineer Portfolio
 * Main JavaScript File with Enhanced Project Filtering and Load More
 * Author: Muhammad Talha
 * Version: 2.0
 */

$(document).ready(function() {
    // All elements are already active/visible - no loader needed
    
    // Progress Bar for Scroll Tracking
    window.onscroll = function() {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        document.getElementById("progress-bar").style.width = scrolled + "%";
        
        // Make all fade-in elements active immediately when they enter viewport
        $('.fade-in').each(function() {
            let position = $(this).offset().top;
            let scroll = $(window).scrollTop();
            let windowHeight = $(window).height();
            
            if (scroll + windowHeight > position + 50) {
                $(this).addClass('active');
            }
        });
    };
    
    // Make all fade-in elements active immediately on page load
    $('.fade-in').addClass('active');
    
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
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        
        const target = $($(this).attr('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });
    
    // Back to top button
    $('#back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
    
    // ======= ENHANCED PROJECT FILTERING AND LOAD MORE FUNCTIONALITY =======
    
    // Variables for project management
    const projectsPerPage = 6;
    let currentFilter = 'all';
    let visibleProjects = projectsPerPage;
    
    // Initialize project display
    function initializeProjects() {
        // Hide all projects initially
        $('.project-card').removeClass('visible');
        
        // Get projects matching the current filter
        const $filteredProjects = currentFilter === 'all' 
            ? $('.project-card') 
            : $('.project-card[data-category*="' + currentFilter + '"]');
        
        // Show first batch of projects
        $filteredProjects.slice(0, projectsPerPage).addClass('visible');
        
        // Show/hide load more button if needed
        toggleLoadMoreButton($filteredProjects.length);
    }
    
    // Toggle load more button visibility
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
        
        // Simulate loading delay (remove in production if not needed)
        setTimeout(() => {
            // Get projects matching the current filter
            const $filteredProjects = currentFilter === 'all' 
                ? $('.project-card') 
                : $('.project-card[data-category*="' + currentFilter + '"]');
            
            // Show next batch of projects
            $filteredProjects.slice(visibleProjects, visibleProjects + projectsPerPage).addClass('visible');
            
            // Update count of visible projects
            visibleProjects += projectsPerPage;
            
            // Update load more button visibility
            toggleLoadMoreButton($filteredProjects.length);
            
            $(this).removeClass('loading');
        }, 500);
    });
    
    // Project filtering
    $('.filter-btn').click(function() {
        // Update active button
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Get filter value
        currentFilter = $(this).data('filter');
        
        // Reset visible projects count
        visibleProjects = projectsPerPage;
        
        // Apply filtering
        $('.project-card').removeClass('visible');
        
        if (currentFilter === 'all') {
            // Show first batch of all projects
            $('.project-card').slice(0, projectsPerPage).addClass('visible');
            
            // Update load more button
            toggleLoadMoreButton($('.project-card').length);
        } else {
            // Get projects matching the filter
            const $filteredProjects = $('.project-card[data-category*="' + currentFilter + '"]');
            
            // Show first batch of filtered projects
            $filteredProjects.slice(0, projectsPerPage).addClass('visible');
            
            // Update load more button
            toggleLoadMoreButton($filteredProjects.length);
        }
        
        // Scroll to projects section if not already in view
        if ($(window).scrollTop() > $('#projects').offset().top + 300) {
            $('html, body').animate({
                scrollTop: $('#projects').offset().top - 100
            }, 500);
        }
    });
    
    // Initialize projects on page load
    initializeProjects();
    
    // Center the load more button
    $('.load-more-container').css({
        'display': 'flex',
        'justify-content': 'center',
        'margin': '3rem auto 0',
        'width': '100%'
    });
    
    $('#load-more').css({
        'margin': '0 auto',
        'display': 'block'
    });
    
    // Form submission with validation and email redirection
    $('#contact-form').submit(function(e) {
        // Basic form validation
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
        
        // This form will redirect to the email client when submitted
        return true;
    });
    
    // Email validation helper function
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Theme toggle
    $('#theme-toggle').click(function() {
        $('body').toggleClass('dark-theme');
        localStorage.setItem('theme', $('body').hasClass('dark-theme') ? 'dark' : 'light');
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-theme');
    }
    
    // Project modal controls - UPDATED
    $('.project-btn').off('click').on('click', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal') + '-modal';
        console.log('Opening modal: ' + modalId);
        
        if ($('#' + modalId).length) {
            $('#' + modalId).addClass('show');
            $('body').css('overflow', 'hidden');
        } else {
            console.error('Modal not found: ' + modalId);
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
    
    // Profile image is immediately visible
    $('#profile-image').css('opacity', '1');
    
    // Add hover effect to profile image
    $('.about-img').hover(function() {
        $(this).find('img').css('transform', 'scale(1.03)');
    }, function() {
        $(this).find('img').css('transform', 'scale(1)');
    });
    
    // Project card hover effects
    $('.project-card').hover(function() {
        $(this).find('.project-img i').css('transform', 'scale(1.2) rotate(5deg)');
    }, function() {
        $(this).find('.project-img i').css('transform', 'scale(1) rotate(0)');
    });
    
    // Create modal for each project if not already in HTML
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
                technologies: 'DeepSeek Aimo 2, PyTorch, NVIDIA H-100, DeepSpeed, Pytorch, PEFT, SciPy, SymPy, FaskAPI, MlFlow',
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
            },
            {
                id: 'multimodal-chatbot',
                title: 'MultiModal Chatbot',
                timeline: 'January 2024 - July 2024',
                client: 'Research Project',
                description: 'The MultiModal Chatbot is an advanced AI system capable of processing and understanding both text and image inputs. It provides contextually relevant responses by combining vision and language understanding capabilities, making it useful for applications requiring visual context awareness.',
                features: [
                    'Vision-language integration using state-of-the-art multimodal models',
                    'Image understanding with detailed scene analysis and object recognition',
                    'Contextual response generation that considers both visual and textual inputs',
                    'Memory system that maintains conversation context across multiple turns',
                    'Deployment-ready API for easy integration with mobile and web applications'
                ],
                technologies: 'LLaVA, VitBERT, Hugging Face Transformers, PyTorch, FLask, Docker, ONNX',
                outcome: 'The multimodal chatbot demonstrated a 30% improvement in user satisfaction metrics compared to text-only systems. The research was published as a technical report and the system is being considered for commercial applications in customer service and accessibility tools.'
            },
            {
                id: 'nft-generator',
                title: 'NFT Influencer Generator',
                timeline: 'May 2023 - November 2023',
                client: 'ArtGeist',
                description: 'An autonomous AI system that monitors Twitter for trending influencers, analyzes their visual aesthetic and communication style, and leverages GANs to create collections of 10,000 unique NFTs inspired by each influencer\'s style. The system includes an OpenAI-powered chatbot that markets these collections by posting on Twitter in the influencer\'s tone.',
                features: [
                    'Real-time trend analysis and influencer identification on Twitter',
                    'Custom GAN architecture for generating thematically consistent NFT collections',
                    'Influencer communication style modeling using OpenAI\'s GPT for authentic marketing',
                    'Automated NFT minting and blockchain deployment process',
                    'Autonomous social media engagement and response system'
                ],
                technologies: 'StyleGAN, OpenAI API, Twitter API, Ethereum, IPFS, Python, TensorFlow, Web3.js',
                outcome: 'The system successfully generated and marketed over 50,000 NFTs across 5 different collections, achieving 72% engagement rates on promotional posts and a 35% increase in follower growth for the associated accounts. Two collections were notably successful, with 80% of NFTs sold within the first week of launch.'
            },
            {
                id: 'social-media-ai',
                title: 'AI Social Post Creator',
                timeline: 'October 2024 - Present',
                client: 'Digital Marketing Agency',
                description: 'A specialized content generation system built by fine-tuning Microsoft\'s Phi-4 model on a custom dataset of high-performing social media content. The system generates platform-specific content for Instagram, Facebook, and TikTok, complete with SEO-optimized hashtags and captions tailored to user-specified topics.',
                features: [
                    'Custom fine-tuning methodology using a curated dataset of 50,000+ high-engagement social media posts',
                    'Platform-specific content generation with distinct stylistic adaptation for Instagram, Facebook, and TikTok',
                    'Automated SEO-friendly hashtag generation based on current platform trends and topic relevance',
                    'Content scheduling and posting capability through platform APIs',
                    'Detailed content analysis and suggestion system for existing posts with engagement metrics'
                ],
                technologies: 'Microsoft Phi-4, PyTorch, PEFT, LoRA, Hugging Face, Instagram API, Facebook Graph API, TikTok API, ChromaDB, RestAPI',
                outcome: 'The system has generated content for over 30 clients, resulting in an average 45% increase in engagement rates across platforms. Content created by the AI outperformed human-written posts in A/B testing by 28%. The improvement suggestion feature has helped increase client post performance by an average of 35% when implemented.'
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
    
    // Initialize project modals
    createProjectModals();
});
