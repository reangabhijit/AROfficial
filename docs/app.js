// Main Application Logic

// Sample Data
const tutorials = [
    {
        id: 1,
        title: "Introduction to Bioinformatics",
        description: "Learn the fundamentals of bioinformatics and its applications in molecular biology.",
        videoUrl: "https://www.youtube.com/embed/example1",
        views: 1250,
        date: "2026-01-15"
    },
    {
        id: 2,
        title: "DNA Sequence Alignment",
        description: "Understanding BLAST and sequence alignment algorithms.",
        videoUrl: "https://www.youtube.com/embed/example2",
        views: 890,
        date: "2026-01-20"
    },
    {
        id: 3,
        title: "Protein Structure Prediction",
        description: "Deep dive into AlphaFold and protein structure prediction methods.",
        videoUrl: "https://www.youtube.com/embed/example3",
        views: 2150,
        date: "2026-02-01"
    },
    {
        id: 4,
        title: "NGS Data Analysis",
        description: "Next Generation Sequencing data processing and analysis techniques.",
        videoUrl: "https://www.youtube.com/embed/example4",
        views: 1890,
        date: "2026-02-10"
    },
    {
        id: 5,
        title: "Python for Bioinformatics",
        description: "Practical Python programming for bioinformatics research.",
        videoUrl: "https://www.youtube.com/embed/example5",
        views: 3200,
        date: "2026-02-15"
    },
    {
        id: 6,
        title: "UNIX for Researchers",
        description: "Essential UNIX and Linux commands for bioinformatics work.",
        videoUrl: "https://www.youtube.com/embed/example6",
        views: 1560,
        date: "2026-02-20"
    },
    {
        id: 7,
        title: "Phylogenetic Analysis",
        description: "Building and interpreting phylogenetic trees using MEGA and RAxML.",
        videoUrl: "https://www.youtube.com/embed/example7",
        views: 920,
        date: "2026-02-25"
    },
    {
        id: 8,
        title: "Gene Expression Analysis",
        description: "RNA-seq analysis and gene expression profiling techniques.",
        videoUrl: "https://www.youtube.com/embed/example8",
        views: 1450,
        date: "2026-03-01"
    },
    {
        id: 9,
        title: "Metabolomics Introduction",
        description: "Introduction to metabolomics and metabolic pathway analysis.",
        videoUrl: "https://www.youtube.com/embed/example9",
        views: 780,
        date: "2026-03-05"
    },
    {
        id: 10,
        title: "Machine Learning for Biology",
        description: "Applying machine learning algorithms to biological data.",
        videoUrl: "https://www.youtube.com/embed/example10",
        views: 2890,
        date: "2026-03-10"
    },
    {
        id: 11,
        title: "Database Management",
        description: "Working with biological databases: GenBank, UniProt, and PDB.",
        videoUrl: "https://www.youtube.com/embed/example11",
        views: 1120,
        date: "2026-03-15"
    },
    {
        id: 12,
        title: "Research Publication Guide",
        description: "Tips and strategies for publishing research in top-tier journals.",
        videoUrl: "https://www.youtube.com/embed/example12",
        views: 1680,
        date: "2026-03-20"
    }
];

const resources = [
    {
        id: 1,
        name: "BLAST",
        description: "Basic Local Alignment Search Tool for DNA and protein sequence searching.",
        link: "https://blast.ncbi.nlm.nih.gov/",
        icon: "fas fa-dna"
    },
    {
        id: 2,
        name: "UniProt",
        description: "Universal Protein Resource with comprehensive protein sequence and functional information.",
        link: "https://www.uniprot.org/",
        icon: "fas fa-protein"
    },
    {
        id: 3,
        name: "GenBank",
        description: "NCBI's genetic sequence database with millions of sequences.",
        link: "https://www.ncbi.nlm.nih.gov/genbank/",
        icon: "fas fa-book"
    },
    {
        id: 4,
        name: "PDB",
        description: "Protein Data Bank - repository of 3D structure data.",
        link: "https://www.rcsb.org/",
        icon: "fas fa-cube"
    },
    {
        id: 5,
        name: "MEGA",
        description: "Molecular Evolutionary Genetics Analysis software.",
        link: "https://www.megasoftware.net/",
        icon: "fas fa-chart-bar"
    },
    {
        id: 6,
        name: "AlphaFold",
        description: "DeepMind's protein structure prediction tool.",
        link: "https://alphafold.ebi.ac.uk/",
        icon: "fas fa-layer-group"
    },
    {
        id: 7,
        name: "Cytoscape",
        description: "Open source software for complex network analysis and visualization.",
        link: "https://cytoscape.org/",
        icon: "fas fa-sitemap"
    },
    {
        id: 8,
        name: "PyMOL",
        description: "Molecular visualization system for viewing 3D protein structures.",
        link: "https://pymol.org/",
        icon: "fas fa-microscope"
    }
];

// Initialize the application
class App {
    constructor() {
        this.init();
    }

    init() {
        this.renderTutorials();
        this.renderResources();
        this.setupScrollListeners();
        this.loadProfileData();
    }

    renderTutorials() {
        const tutorialsGrid = document.getElementById('tutorials-grid');
        tutorialsGrid.innerHTML = tutorials.map(tutorial => `
            <div class="tutorial-card">
                <div class="tutorial-thumbnail">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="tutorial-content">
                    <h3>${tutorial.title}</h3>
                    <p>${tutorial.description}</p>
                    <div class="tutorial-meta">
                        <span class="tutorial-views">👁️ ${tutorial.views.toLocaleString()} views</span>
                        <a href="${tutorial.videoUrl}" target="_blank" class="tutorial-link">Watch →</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderResources() {
        const resourcesGrid = document.getElementById('resources-grid');
        resourcesGrid.innerHTML = resources.map(resource => `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="${resource.icon}"></i>
                </div>
                <h3>${resource.name}</h3>
                <p>${resource.description}</p>
                <a href="${resource.link}" target="_blank" class="resource-link">
                    Explore <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `).join('');
    }

    setupScrollListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth scrolling for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    loadProfileData() {
        // Load and display profile information
        const profileData = JSON.parse(localStorage.getItem('profileData')) || {
            name: "Dr. Abhijit Reang",
            bio: "Research Scholar at Tripura University",
            avatar: "profile-avatar.jpg"
        };

        // Update page with profile data
        document.querySelectorAll('.nav-brand h1')[0].textContent = profileData.name || "AR Official";
    }
}

// Setup form handlers for admin
if (authManager && authManager.currentUser && authManager.currentUser.isAdmin) {
    setupAdminFunctions();
}

function setupAdminFunctions() {
    const uploadTutorialForm = document.getElementById('uploadTutorialForm');
    const addResourceForm = document.getElementById('addResourceForm');
    const profileForm = document.getElementById('profileForm');

    if (uploadTutorialForm) {
        uploadTutorialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = uploadTutorialForm.elements[0].value;
            const description = uploadTutorialForm.elements[1].value;
            const videoUrl = uploadTutorialForm.elements[2].value;

            const newTutorial = {
                id: tutorials.length + 1,
                title,
                description,
                videoUrl,
                views: 0,
                date: new Date().toISOString().split('T')[0]
            };

            tutorials.unshift(newTutorial);
            const app = new App();
            app.renderTutorials();
            uploadTutorialForm.reset();
            alert('Tutorial uploaded successfully!');
        });
    }

    if (addResourceForm) {
        addResourceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = addResourceForm.elements[0].value;
            const description = addResourceForm.elements[1].value;
            const link = addResourceForm.elements[2].value;

            const newResource = {
                id: resources.length + 1,
                name,
                description,
                link,
                icon: "fas fa-link"
            };

            resources.unshift(newResource);
            const app = new App();
            app.renderResources();
            addResourceForm.reset();
            alert('Resource added successfully!');
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('profileName').value;
            const bio = document.getElementById('profileBio').value;

            const profileData = {
                name: name || "Dr. Abhijit Reang",
                bio: bio || "Research Scholar at Tripura University",
                avatar: "profile-avatar.jpg"
            };

            localStorage.setItem('profileData', JSON.stringify(profileData));
            alert('Profile updated successfully!');
            window.location.reload();
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Update statistics
    document.getElementById('tutorialCount').textContent = tutorials.length;
    document.getElementById('memberCount').textContent = authManager.users.length;
});

// Add smooth animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tutorial-card, .resource-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
