// Theme Toggle
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

// Check for saved theme preference or respect OS preference
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', function() {
    if (this.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Hero Carousel
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let currentSlide = 0;

function showSlide(n) {
    carouselSlides.forEach(slide => slide.classList.remove('active'));
    carouselDots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + carouselSlides.length) % carouselSlides.length;
    
    carouselSlides[currentSlide].classList.add('active');
    carouselDots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto advance carousel
let carouselInterval = setInterval(nextSlide, 5000);

// Pause carousel on hover
const heroCarousel = document.querySelector('.hero-carousel');
heroCarousel.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

heroCarousel.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 5000);
});

// Penalty Table Data
const penaltyData = [
    { name: 'Aritro Das', id: '242-35-260', violation: 'Minor', date: '2025-10-15', amount: '25tk', status: 'unpaid' },
    { name: 'Sakib Hasan', id: '242-35-259', violation: 'Major', date: '2025-10-14', amount: '250tk', status: 'paid' },
    { name: 'Shams Kabir', id: '242-35-154', violation: 'Minor', date: '2025-10-13', amount: '50tk', status: 'unpaid' },
    { name: 'Moumita Das', id: '242-35-834', violation: 'Minor', date: '2025-10-12', amount: '30tk', status: 'paid' },
    { name: 'Ratul Hasan', id: '242-35-349', violation: 'Major', date: '2025-10-11', amount: '170tk', status: 'unpaid' },
    { name: 'Prottoy Kumar Pramanik', id: '242-35-336', violation: 'Minor', date: '2025-10-10', amount: '20tk', status: 'paid' },
    { name: 'Ridwan Siddique', id: '242-35-045', violation: 'Major', date: '2025-10-09', amount: '285tk', status: 'unpaid' },
    { name: 'Khairun Nazmin Khushi', id: '242-35-745', violation: 'Minor', date: '2025-10-08', amount: '50tk', status: 'paid' }
];

// Populate Penalty Table
const tableBody = document.querySelector('.penalty-table tbody');

function populateTable(data) {
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.id}</td>
            <td>${item.violation}</td>
            <td>${item.date}</td>
            <td>${item.amount}</td>
            <td><span class="status-badge status-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

populateTable(penaltyData);

// Search Functionality
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredData = penaltyData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.id.toLowerCase().includes(searchTerm)
    );
    populateTable(filteredData);
});

// Filter Functionality
const statusFilter = document.getElementById('status-filter');
const violationFilter = document.getElementById('violation-filter');

function applyFilters() {
    const statusValue = statusFilter.value;
    const violationValue = violationFilter.value;
    
    let filteredData = penaltyData;
    
    if (statusValue !== 'all') {
        filteredData = filteredData.filter(item => item.status === statusValue);
    }
    
    if (violationValue !== 'all') {
        filteredData = filteredData.filter(item => item.violation.toLowerCase() === violationValue);
    }
    
    populateTable(filteredData);
}

statusFilter.addEventListener('change', applyFilters);
violationFilter.addEventListener('change', applyFilters);

// Table Sorting
const tableHeaders = document.querySelectorAll('.penalty-table th[data-sort]');

tableHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const sortBy = this.getAttribute('data-sort');
        const isAscending = this.classList.contains('asc');
        
        // Remove sorting classes from all headers
        tableHeaders.forEach(h => {
            h.classList.remove('asc', 'desc');
        });
        
        // Sort data
        penaltyData.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Handle date sorting
            if (sortBy === 'date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            // Handle amount sorting (remove $ and convert to number)
            if (sortBy === 'amount') {
                aValue = parseFloat(aValue.replace('$', ''));
                bValue = parseFloat(bValue.replace('$', ''));
            }
            
            if (aValue < bValue) return isAscending ? 1 : -1;
            if (aValue > bValue) return isAscending ? -1 : 1;
            return 0;
        });
        
        // Add appropriate class to header
        this.classList.toggle('asc', !isAscending);
        this.classList.toggle('desc', isAscending);
        
        populateTable(penaltyData);
    });
});

// Charts
const violationsCtx = document.getElementById('violations-chart').getContext('2d');
const violationTypesCtx = document.getElementById('violation-types-chart').getContext('2d');

// Violations Over Time Chart
const violationsChart = new Chart(violationsCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Violations',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75],
            borderColor: '#4a6cf7',
            backgroundColor: 'rgba(74, 108, 247, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Violations Over Time'
            }
        }
    }
});

// Violation Types Chart
const violationTypesChart = new Chart(violationTypesCtx, {
    type: 'doughnut',
    data: {
        labels: ['Minor Violations', 'Major Violations'],
        datasets: [{
            data: [65, 35],
            backgroundColor: [
                'rgba(74, 108, 247, 0.7)',
                'rgba(220, 53, 69, 0.7)'
            ],
            borderColor: [
                'rgba(74, 108, 247, 1)',
                'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Violation Types Distribution'
            }
        }
    }
});

// Demo Section Functionality
const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const resetBtn = document.getElementById('reset-btn');
const detectionCanvas = document.getElementById('detection-canvas');
const placeholderImage = document.querySelector('.placeholder-image');
const trashCount = document.getElementById('trash-count');
const violationLevel = document.getElementById('violation-level');
const penaltyPoints = document.getElementById('penalty-points');
const studentId = document.getElementById('student-id');

// Sample detection data for demo
const sampleDetections = [
    { trashCount: 2, violation: 'Minor', points: 25, student: 'S12345' },
    { trashCount: 5, violation: 'Major', points: 50, student: 'S12346' },
    { trashCount: 1, violation: 'Minor', points: 25, student: 'S12347' },
    { trashCount: 0, violation: 'None', points: 0, student: 'N/A' }
];

let currentDetectionIndex = 0;

uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Show canvas and hide placeholder
                detectionCanvas.style.display = 'block';
                placeholderImage.style.display = 'none';
                
                // Set canvas dimensions
                detectionCanvas.width = img.width;
                detectionCanvas.height = img.height;
                
                const ctx = detectionCanvas.getContext('2d');
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, detectionCanvas.width, detectionCanvas.height);
                
                // Simulate AI detection with random sample
                currentDetectionIndex = Math.floor(Math.random() * sampleDetections.length);
                const detection = sampleDetections[currentDetectionIndex];
                
                // Draw detection boxes (simulated)
                if (detection.trashCount > 0) {
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 3;
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    
                    // Draw random boxes for demo
                    for (let i = 0; i < detection.trashCount; i++) {
                        const x = Math.random() * (detectionCanvas.width - 100);
                        const y = Math.random() * (detectionCanvas.height - 100);
                        const width = 50 + Math.random() * 100;
                        const height = 50 + Math.random() * 100;
                        
                        ctx.strokeRect(x, y, width, height);
                        ctx.fillRect(x, y, width, height);
                        
                        // Add label
                        ctx.fillStyle = '#ff0000';
                        ctx.font = '16px Arial';
                        ctx.fillText('Trash', x, y - 5);
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    }
                }
                
                // Update results
                trashCount.textContent = detection.trashCount;
                violationLevel.textContent = detection.violation;
                penaltyPoints.textContent = detection.points;
                studentId.textContent = detection.student;
                
                // Add animation to results
                const resultItems = document.querySelectorAll('.result-item');
                resultItems.forEach(item => {
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                });
            };
            img.src = event.target.result;
        };
        
        reader.readAsDataURL(this.files[0]);
    }
});

resetBtn.addEventListener('click', () => {
    // Reset demo
    detectionCanvas.style.display = 'none';
    placeholderImage.style.display = 'flex';
    imageUpload.value = '';
    
    // Reset results
    trashCount.textContent = '0';
    violationLevel.textContent = 'None';
    penaltyPoints.textContent = '0';
    studentId.textContent = 'N/A';
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    this.reset();
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .stat-card, .testimonial-card, .chart-container').forEach(el => {
    observer.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .feature-card, .stat-card, .testimonial-card, .chart-container {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code that needs to run after DOM is fully loaded

});
