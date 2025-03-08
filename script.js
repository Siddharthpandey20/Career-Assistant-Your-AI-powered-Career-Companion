// document.getElementById("uploadForm").addEventListener("submit", async function(event) {
//     event.preventDefault();
    
//     const loadingDiv = document.getElementById("loading");
//     const outputDiv = document.getElementById("output");
//     loadingDiv.style.display = "block";
//     outputDiv.style.display = "none";

//     let fileInput = document.getElementById("fileInput").files[0];
//     let positionInput = document.getElementById("positionInput").value;

//     if (!fileInput || !positionInput) {
//         alert("Please select a file and enter the position.");
//         loadingDiv.style.display = "none";
//         return;
//     }

//     let formData = new FormData();
//     formData.append("file", fileInput);
//     formData.append("position", positionInput);

//     try {
//         const response = await fetch("http://127.0.0.1:8000/gemini/", {
//             method: "POST",
//             body: formData,
//             mode: 'cors',
//             credentials: 'same-origin', // Changed from 'include'
//             headers: {
//                 'Accept': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
        
//         // Format the response in a more readable way
//         const formattedOutput = `
// Analysis Results:
// ----------------
// Comments: ${data.comments}

// Verdict: ${data.verdict}

// Reason for ${data.verdict}: ${data.Reason || 'Not specified'}

// Improvements Needed:
// ${data.improvements ? data.improvements.map(imp => '- ' + imp).join('\n') : 'None specified'}

// Job Opportunities:
// ${data.job_opportunities ? (Array.isArray(data.job_opportunities) ? data.job_opportunities.map(job => '- ' + job).join('\n') : '- ' + data.job_opportunities) : 'None specified'}

// Missing Technologies:
// ${data.missing_technologies ? data.missing_technologies.map(tech => '- ' + tech).join('\n') : 'None specified'}

// Expected Package:
// ${data.average_package || 'Not specified'}
// `;

//         outputDiv.innerText = formattedOutput;
//         outputDiv.style.display = "block";

//     } catch (error) {
//         console.error("Error details:", error);
//         outputDiv.innerText = "Error: " + error.message + "\nPlease try again.";
//         outputDiv.style.color = "red";
//     } finally {
//         loadingDiv.style.display = "none";
//     }
// });



// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page navigation
    initializePageNavigation();
    
    // Initialize chat functionality
    initializeChatBot();
    
    // Initialize modal functionality
    initializeModalForms();
    
    // Initialize forms with their respective event listeners
    initializeForms();
    
    // Initialize the trends section
    initializeTrends();
});

// Function to handle page navigation
function initializePageNavigation() {
    // Get all navigation links and feature cards
    const navLinks = document.querySelectorAll('.nav-links a');
    const featureCards = document.querySelectorAll('.feature-card');
    const pages = {
        home: document.getElementById('homePage'),
        analyze: document.getElementById('analyzePage'),
        enhance: document.getElementById('enhancePage'),
        jobs: document.getElementById('jobsPage'),
        trends: document.getElementById('trendsPage')
    };

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pages[pageId]) {
                // Hide all pages
                Object.values(pages).forEach(page => page.style.display = 'none');
                // Show selected page
                pages[pageId].style.display = 'block';
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Handle feature card clicks
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetPage = card.getAttribute('data-target');
            if (pages[targetPage]) {
                // Hide all pages
                Object.values(pages).forEach(page => page.style.display = 'none');
                // Show selected page
                pages[targetPage].style.display = 'block';
                // Update active state in navigation
                navLinks.forEach(link => {
                    if (link.getAttribute('data-page') === targetPage) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Remove or comment out the showPage function since we're using the new navigation system
// function showPage(pageId) { ... }

// Function to initialize chat bot
function initializeChatBot() {
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    
    // Check if elements exist before adding listeners
    if (!chatIcon || !chatWindow || !chatClose || !chatMessages || !chatInput || !sendMessage) {
        console.log('Chat elements not found, skipping chat initialization');
        return;
    }
    
    // Toggle chat window
    chatIcon.addEventListener('click', function() {
        chatWindow.style.display = chatWindow.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close chat window
    chatClose.addEventListener('click', function() {
        chatWindow.style.display = 'none';
    });
    
    // Send message
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Simulate bot response (would connect to API in production)
            setTimeout(() => {
                const responses = [
                    "I can help you with resume analysis, job recommendations, and career advice. What specific help do you need today?",
                    "Have you tried our resume analysis tool? It can provide personalized feedback on your resume.",
                    "Looking for job recommendations? Upload your resume and we'll match you with suitable positions.",
                    "Our career trends section shows the latest in-demand skills and industry insights.",
                    "Do you have any specific questions about the job market or resume writing?"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }
    
    // Add message to chat
    function addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(type + '-message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Event listeners for sending messages
    sendMessage.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
}

// Function to initialize modals
function initializeModalForms() {
    const loginBtn = document.querySelector('.login-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Login button click handler
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }

    // Close button handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Form submission handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add your login logic here
            console.log('Login form submitted');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add your registration logic here
            console.log('Register form submitted');
        });
    }
}

// Helper functions for modal operations
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchForm(formType) {
    if (formType === 'login') {
        closeModal('registerModal');
        openModal('loginModal');
    } else {
        closeModal('loginModal');
        openModal('registerModal');
    }
}

// Function to Analyse Resume

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINTS = {
    analyze: '/gemini/',
    enhance: '/enhancement/',
    jobs: '/find_jobs'
};

function initializeForms() {
    // Resume Analysis Form
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            await handleFormSubmission(
                event,
                API_ENDPOINTS.analyze,
                "loading",
                "output",
                formatAnalysisResult
            );
        });
    }

    // Resume Enhancement Form
    const enhanceForm = document.getElementById("enhanceForm");
    if (enhanceForm) {
        enhanceForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            await handleFormSubmission(
                event,
                API_ENDPOINTS.enhance,
                "enhanceLoading",
                "enhanceOutput",
                formatEnhancementResult
            );
        });
    }

    // Job Search Form
    const jobSearchForm = document.getElementById("jobSearchForm");
    if (jobSearchForm) {
        jobSearchForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const skills = document.getElementById("skillsInput").value;
            const location = document.getElementById("locationInput").value;
            
            const loadingDiv = document.getElementById("jobsLoading");
            const outputDiv = document.getElementById("jobsOutput");
            
            try {
                loadingDiv.style.display = "block";
                outputDiv.style.display = "none";
                
                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.jobs}?skills=${encodeURIComponent(skills)}&location=${encodeURIComponent(location)}`);
                const data = await response.json();
                
                if (!response.ok) throw new Error(data.error || 'Failed to fetch jobs');
                
                outputDiv.innerHTML = formatJobResults(data);
                outputDiv.style.display = "block";
            } catch (error) {
                console.error('Error:', error);
                showError(outputDiv, error.message);
            } finally {
                loadingDiv.style.display = "none";
            }
        });
    }
}

// Generic form submission handler
async function handleFormSubmission(event, endpoint, loadingId, outputId, formatFunc) {
    const loadingDiv = document.getElementById(loadingId);
    const outputDiv = document.getElementById(outputId);
    
    try {
        const formData = new FormData(event.target);
        loadingDiv.style.display = "block";
        outputDiv.style.display = "none";

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            body: formData,
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                // Remove any credentials or cookie headers
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        outputDiv.innerHTML = formatFunc(data);
        outputDiv.style.display = "block";
    } catch (error) {
        console.error('Error:', error);
        showError(outputDiv, error.message);
    } finally {
        loadingDiv.style.display = "none";
    }
}

// Format functions for different responses
function formatAnalysisResult(data) {
    return `
        <div class="analysis-result">
            <div class="result-section">
                <h3>Analysis Results</h3>
                <p>${data.comments}</p>
            </div>
            
            <div class="result-section">
                <h4>Verdict: <span class="${data.verdict.toLowerCase()}">${data.verdict}</span></h4>
                <p><strong>Reason:</strong> ${data.Reason}</p>
            </div>
            
            <div class="result-section">
                <h4>Improvements Needed:</h4>
                <ul>
                    ${data.improvements.map(imp => `<li>${imp}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4>Job Opportunities:</h4>
                <ul>
                    ${Array.isArray(data.job_opportunities) 
                        ? data.job_opportunities.map(job => `<li>${job}</li>`).join('') 
                        : `<li>${data.job_opportunities}</li>`}
                </ul>
            </div>
            
            <div class="result-section">
                <h4>Missing Technologies:</h4>
                <div class="skills-list">
                    ${data.missing_technologies.map(tech => 
                        `<span class="skill-badge missing">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="result-section">
                <h4>Expected Package:</h4>
                <p>${data.average_package}</p>
            </div>
        </div>
    `;
}

function formatEnhancementResult(data) {
    if (!data || !data.enhancements) {
        return '<div class="error-message">Failed to process enhancement request</div>';
    }

    const { enhancements, learning_resources } = data;

    return `
        <div class="enhancement-result">
            <div class="enhancements-section">
                <h3>Resume Enhancements</h3>
                
                <h4>Overall Improvements</h4>
                <ul>
                    ${Array.isArray(enhancements.overall_improvements) 
                        ? enhancements.overall_improvements.map(imp => `<li>${imp}</li>`).join('')
                        : `<li>${enhancements.overall_improvements}</li>`}
                </ul>
                
                <h4>Recommended Skills</h4>
                <div class="skills-list">
                    ${Array.isArray(enhancements.skills_to_add)
                        ? enhancements.skills_to_add.map(skill => 
                            `<span class="skill-badge missing">${skill}</span>`).join('')
                        : '<p>No specific skills suggested</p>'}
                </div>
                
                <h4>Recommended Certifications</h4>
                <ul>
                    ${Array.isArray(enhancements.certifications)
                        ? enhancements.certifications.map(cert => `<li>${cert}</li>`).join('')
                        : '<li>No specific certifications suggested</li>'}
                </ul>
            </div>
            
            ${learning_resources ? `
                <div class="learning-section">
                    <h3>Learning Resources</h3>
                    
                    <h4>Online Courses</h4>
                    <ul>
                        ${Array.isArray(learning_resources.online_courses)
                            ? learning_resources.online_courses.map(course => `<li>${course}</li>`).join('')
                            : '<li>No specific courses suggested</li>'}
                    </ul>
                    
                    <h4>YouTube Channels</h4>
                    <ul>
                        ${Array.isArray(learning_resources.youtube_channels)
                            ? learning_resources.youtube_channels.map(channel => `<li>${channel}</li>`).join('')
                            : '<li>No specific channels suggested</li>'}
                    </ul>
                    
                    <h4>Recommended Books</h4>
                    <ul>
                        ${Array.isArray(learning_resources.books)
                            ? learning_resources.books.map(book => `<li>${book}</li>`).join('')
                            : '<li>No specific books suggested</li>'}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

function formatJobResults(data) {
    if (!data.jobs || (Array.isArray(data.jobs) && data.jobs.length === 0)) {
        return '<p class="no-results">No jobs found matching your criteria. Try adjusting your search parameters.</p>';
    }
    
    if (typeof data.jobs === 'string') {
        return `<p class="info-message">${data.jobs}</p>`;
    }

    return `
        <div class="jobs-result">
            <h3>Found ${data.total_results} matching jobs</h3>
            ${data.jobs.map(job => `
                <div class="job-card">
                    <h4>${job.title}</h4>
                    <p class="company">${job.company}</p>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p class="description">${job.description}</p>
                    <p class="posted-date">Posted: ${new Date(job.posted_date).toLocaleDateString()}</p>
                    <a href="${job.apply_link}" target="_blank" class="btn-primary">Apply Now</a>
                </div>
            `).join('')}
        </div>
    `;
}

function showError(outputDiv, message) {
    outputDiv.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <p>Please try again or contact support if the problem persists.</p>
        </div>
    `;
    outputDiv.style.display = "block";
}

// Initialize trends functionality
function initializeTrends() {
    const getTrendsBtn = document.getElementById('getTrendsBtn');
    if (getTrendsBtn) {
        getTrendsBtn.addEventListener('click', async function() {
            const industrySelect = document.getElementById('industrySelect');
            const industry = industrySelect.value;
            
            const loadingDiv = document.getElementById('trendsLoading');
            const outputDiv = document.getElementById('trendsOutput');
            
            loadingDiv.style.display = 'block';
            outputDiv.style.display = 'none';
            
            try {
                // This would be replaced with your actual API endpoint
                const response = await simulateApiCall('career-trends', { industry });
                
                // Update the trends output with the new data
                updateTrendsData(response, industry);
                
                outputDiv.style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                alert(`Error loading trends data: ${error.message}`);
            } finally {
                loadingDiv.style.display = 'none';
            }
        });
    }
}

// Helper function to simulate API calls
async function simulateApiCall(endpoint, data) {
    // This is a placeholder function that would be replaced with actual API calls
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (endpoint) {
                case 'job-recommendations':
                    resolve({
                        recommendations: [
                            {
                                title: 'Senior Software Engineer',
                                company: 'TechCorp Inc.',
                                location: 'San Francisco, CA',
                                salary: '$120,000 - $150,000',
                                match: '92%',
                                description: 'Looking for a senior developer with experience in React, Node.js, and cloud services.'
                            },
                            {
                                title: 'Full Stack Developer',
                                company: 'Innovate Solutions',
                                location: 'Remote',
                                salary: '$100,000 - $130,000',
                                match: '88%',
                                description: 'Seeking a full stack developer proficient in modern JavaScript frameworks and database design.'
                            },
                            {
                                title: 'Front End Engineer',
                                company: 'UX Dynamics',
                                location: 'Austin, TX',
                                salary: '$90,000 - $120,000',
                                match: '85%',
                                description: 'Join our team to build responsive, accessible web applications using React and TypeScript.'
                            }
                        ]
                    });
                    break;
                    
                case 'resume-enhancement':
                    resolve({
                        currentSkills: ['JavaScript', 'React', 'CSS', 'HTML', 'Node.js'],
                        missingSkills: ['TypeScript', 'GraphQL', 'AWS', 'Docker', 'Kubernetes'],
                        recommendedCertifications: [
                            'AWS Certified Developer',
                            'Google Cloud Professional Developer',
                            'Certified Kubernetes Application Developer'
                        ],
                        suggestedImprovements: [
                            'Add quantifiable achievements to your work experience',
                            'Highlight leadership roles or team collaboration examples',
                            'Include relevant personal projects to showcase your skills',
                            'Consider reorganizing your resume to emphasize your strongest skills first'
                        ]
                    });
                    break;
                    
                case 'career-trends':
                    const industries = {
                        tech: {
                            salary: '$105,000',
                            growth: '12%',
                            openings: '15,000+',
                            skills: ['Cloud Computing', 'Machine Learning', 'React.js', 'Python', 'DevOps']
                        },
                        finance: {
                            salary: '$98,000',
                            growth: '8%',
                            openings: '9,500+',
                            skills: ['Financial Analysis', 'Risk Management', 'Python', 'SQL', 'Blockchain']
                        },
                        healthcare: {
                            salary: '$88,000',
                            growth: '15%',
                            openings: '22,000+',
                            skills: ['Electronic Medical Records', 'Healthcare Informatics', 'Patient Care', 'Medical Coding', 'Healthcare Compliance']
                        },
                        marketing: {
                            salary: '$82,000',
                            growth: '10%',
                            openings: '7,800+',
                            skills: ['Digital Marketing', 'Social Media Management', 'SEO/SEM', 'Content Strategy', 'Data Analytics']
                        },
                        education: {
                            salary: '$65,000',
                            growth: '5%',
                            openings: '12,000+',
                            skills: ['Online Learning Platforms', 'Curriculum Development', 'Educational Technology', 'Student Assessment', 'Special Education']
                        }
                    };
                    
                    resolve(industries[data.industry] || industries.tech);
                    break;
                
                default:
                    resolve({
                        message: 'Endpoint not recognized'
                    });
            }
        }, 1500); // Simulate network delay
    });
}

// Helper function to format job recommendations
function formatJobRecommendations(data) {
    if (!data.recommendations || data.recommendations.length === 0) {
        return '<p>No job recommendations found. Try adjusting your resume or location preferences.</p>';
    }
    
    let html = '<h3>Job Recommendations Based on Your Resume</h3>';
    
    data.recommendations.forEach(job => {
        html += `
        <div class="job-card">
            <div class="job-header">
                <h4>${job.title}</h4>
                <span class="job-match">${job.match} Match</span>
            </div>
            <div class="job-details">
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Salary Range:</strong> ${job.salary}</p>
                <p>${job.description}</p>
            </div>
            <a href="#" class="job-apply-btn">Apply Now</a>
        </div>
        `;
    });
    
    return html;
}

// Helper function to format enhancement suggestions
function formatEnhancementSuggestions(data) {
    let html = '<h3>Resume Enhancement Suggestions</h3>';
    
    html += `
    <div class="enhancement-section">
        <h4>Current Skills</h4>
        <div class="skills-list">
            ${data.currentSkills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
        </div>
        
        <h4>Recommended Skills to Add</h4>
        <div class="skills-list">
            ${data.missingSkills.map(skill => `<span class="skill-badge missing">${skill}</span>`).join('')}
        </div>
        
        <h4>Recommended Certifications</h4>
        <ul>
            ${data.recommendedCertifications.map(cert => `<li>${cert}</li>`).join('')}
        </ul>
        
        <h4>Resume Improvement Suggestions</h4>
        <ul>
            ${data.suggestedImprovements.map(imp => `<li>${imp}</li>`).join('')}
        </ul>
    </div>
    `;
    
    return html;
}

// Function to update trends data in the UI
function updateTrendsData(data, industry) {
    const industryNames = {
        tech: 'Technology',
        finance: 'Finance',
        healthcare: 'Healthcare',
        marketing: 'Marketing',
        education: 'Education'
    };
    
    const trendsOutput = document.getElementById('trendsOutput');
    if (!trendsOutput) return;
    
    trendsOutput.innerHTML = `
    <div class="trends-grid">
        <div class="trend-card">
            <div class="trend-header">
                <div class="trend-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <h3 class="trend-title">Average Salary</h3>
            </div>
            <div class="trend-value">${data.salary}</div>
            <p>Annual salary for ${industryNames[industry] || 'Technology'} professionals has increased by ${data.growth} in the past year.</p>
        </div>
        
        <div class="trend-card">
            <div class="trend-header">
                <div class="trend-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <h3 class="trend-title">Job Openings</h3>
            </div>
            <div class="trend-value">${data.openings}</div>
            <p>New positions in the ${industryNames[industry] || 'technology'} sector in the last quarter.</p>
        </div>
        
        <div class="trend-card">
            <div class="trend-header">
                <div class="trend-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3 class="trend-title">Top Skills</h3>
            </div>
            ${data.skills.map((skill, index) => `<p class="trend-skills">${index + 1}. ${skill}</p>`).join('')}
        </div>
    </div>
    `;
}

// Add this function to initialize forms in the current page context
function initializeCurrentPageForms() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('analysis.html')) {
        initializeAnalysisForm();
    } else if (currentPage.includes('enhancement.html')) {
        initializeEnhancementForm();
    } else if (currentPage.includes('search.html')) {
        initializeJobSearchForm();
    } else if (currentPage.includes('trends.html')) {
        initializeTrends();
    }
}

// Add individual form initialization functions
function initializeAnalysisForm() {
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            await handleFormSubmission(
                event,
                API_ENDPOINTS.analyze,
                "loading",
                "output",
                formatAnalysisResult
            );
        });
    }
}

function initializeEnhancementForm() {
    const enhanceForm = document.getElementById("enhanceForm");
    if (enhanceForm) {
        enhanceForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            
            const fileInput = document.getElementById("fileInput");
            const positionInput = document.getElementById("positionInput");
            const loadingDiv = document.getElementById("enhanceLoading");
            const outputDiv = document.getElementById("enhanceOutput");
            
            if (!fileInput.files[0] || !positionInput.value) {
                alert("Please select a file and enter the target position");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", fileInput.files[0]);
                formData.append("position", positionInput.value);

                loadingDiv.style.display = "block";
                outputDiv.style.display = "none";

                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.enhance}`, {
                    method: "POST",
                    body: formData,
                    mode: 'cors',
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.detail?.[0]?.msg || data.error || 'Enhancement request failed');
                }

                outputDiv.innerHTML = formatEnhancementResult(data);
                outputDiv.style.display = "block";

            } catch (error) {
                console.error('Enhancement error:', error);
                showError(outputDiv, error.message);
            } finally {
                loadingDiv.style.display = "none";
            }
        });
    }
}

// Update formatEnhancementResult to handle the actual API response structure
function formatEnhancementResult(data) {
    if (!data || data.error) {
        return `<div class="error-message">${data.error || 'Failed to process enhancement request'}</div>`;
    }

    return `
        <div class="enhancement-result">
            <div class="enhancements-section">
                <h3>Resume Enhancements</h3>
                
                <h4>Overall Improvements</h4>
                <ul>
                    ${data.enhancements?.overall_improvements?.map(imp => `<li>${imp}</li>`).join('') || '<li>No improvements suggested</li>'}
                </ul>
                
                <h4>Skills to Add</h4>
                <div class="skills-list">
                    ${data.enhancements?.skills_to_add?.map(skill => 
                        `<span class="skill-badge missing">${skill}</span>`).join('') || 'No skills suggested'}
                </div>
                
                <h4>Recommended Certifications</h4>
                <ul>
                    ${data.enhancements?.certifications?.map(cert => `<li>${cert}</li>`).join('') || '<li>No certifications suggested</li>'}
                </ul>
            </div>
            
            ${data.learning_resources ? `
                <div class="learning-section">
                    <h3>Learning Resources</h3>
                    
                    <h4>Online Courses</h4>
                    <ul>
                        ${data.learning_resources.online_courses?.map(course => `<li>${course}</li>`).join('') || '<li>No courses suggested</li>'}
                    </ul>
                    
                    <h4>YouTube Channels</h4>
                    <ul>
                        ${data.learning_resources.youtube_channels?.map(channel => `<li>${channel}</li>`).join('') || '<li>No channels suggested</li>'}
                    </ul>
                    
                    <h4>Recommended Books</h4>
                    <ul>
                        ${data.learning_resources.books?.map(book => `<li>${book}</li>`).join('') || '<li>No books suggested</li>'}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

function initializeJobSearchForm() {
    const jobSearchForm = document.getElementById("jobSearchForm");
    if (jobSearchForm) {
        jobSearchForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            // ...existing job search form handling code...
        });
    }
}

// Add this at the end of the file
document.addEventListener('DOMContentLoaded', function() {
    initializeCurrentPageForms();
});