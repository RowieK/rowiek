// Fetch and display GitHub repositories
async function fetchGitHubProjects() {
    const username = 'RowieK';
    const loadingElement = document.getElementById('loading');
    const projectsContainer = document.getElementById('projects-container');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Hide loading message
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p style="text-align: center; color: #666;">No repositories found.</p>';
            return;
        }

        // Sort repos by stars and last updated
        repos.sort((a, b) => {
            // First by stars
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            // Then by update date
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        // Display repositories
        repos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        if (loadingElement) {
            loadingElement.textContent = 'Failed to load projects. Please try again later.';
            loadingElement.style.color = '#d73a49';
        }
    }
}

// Create a project card element
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const title = document.createElement('h3');
    title.textContent = repo.name;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description available';
    card.appendChild(description);

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    if (repo.language) {
        const language = document.createElement('span');
        language.textContent = `📝 ${repo.language}`;
        meta.appendChild(language);
    }

    const stars = document.createElement('span');
    stars.textContent = `⭐ ${repo.stargazers_count}`;
    meta.appendChild(stars);

    const forks = document.createElement('span');
    forks.textContent = `🔀 ${repo.forks_count}`;
    meta.appendChild(forks);

    card.appendChild(meta);

    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'project-link';
    link.textContent = 'View on GitHub';
    card.appendChild(link);

    return card;
}

// Load projects when the page loads
if (document.getElementById('projects-container')) {
    document.addEventListener('DOMContentLoaded', fetchGitHubProjects);
}
