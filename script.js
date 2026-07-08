document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');

    // 1. Generate Tool Cards dynamically
    function renderTools(toolsToRender) {
        toolsGrid.innerHTML = ''; // Clear current grid
        
        if (toolsToRender.length === 0) {
            toolsGrid.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">No tools found matching your search.</p>';
            return;
        }

        toolsToRender.forEach(tool => {
            // Create Tool Card
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.dataset.toolId = tool.id;
            card.innerHTML = `
                <div class="tool-icon"><i class="${tool.icon}"></i></div>
                <h3>${tool.name}</h3>
                <p>${tool.desc}</p>
            `;
            
            // Add click listener to navigate to new page
            card.addEventListener('click', () => {
                window.location.href = `tools/${tool.id}/index.html`;
            });

            toolsGrid.appendChild(card);
        });
    }

    // Initial render
    renderTools(TOOLS_LIST);

    // 2. Search Logic
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredTools = TOOLS_LIST.filter(tool => {
            return tool.name.toLowerCase().includes(searchTerm) || 
                   tool.desc.toLowerCase().includes(searchTerm);
        });
        
        renderTools(filteredTools);
    });
});
