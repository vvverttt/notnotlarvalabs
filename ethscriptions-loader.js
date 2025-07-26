// Ethscriptions API v2 Image Loader
// This script loads images from the Ethscriptions API for Missing Phunks and DystoPhunks

class EthscriptionsImageLoader {
    constructor() {
        this.baseUrl = 'https://api.ethscriptions.com/v2';
        this.cache = new Map();
    }

    // Fetch ethscriptions by creator address
    async fetchEthscriptionsByCreator(creatorAddress, maxResults = 50) {
        try {
            const url = `${this.baseUrl}/ethscriptions?creator=${creatorAddress}&max_results=${maxResults}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.result || [];
        } catch (error) {
            console.error('Error fetching ethscriptions:', error);
            return [];
        }
    }

    // Fetch ethscriptions by content SHA
    async fetchEthscriptionBySHA(sha) {
        try {
            const url = `${this.baseUrl}/ethscriptions/exists/${sha}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error fetching ethscription by SHA:', error);
            return null;
        }
    }

    // Get image data from ethscription
    async getImageData(ethscriptionNumber) {
        try {
            const url = `${this.baseUrl}/ethscriptions/${ethscriptionNumber}/data`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error fetching image data:', error);
            return null;
        }
    }

    // Load and display images in a container
    async loadImagesToContainer(containerId, creatorAddress, imageType = 'all') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        // Show loading state
        container.innerHTML = '<div class="loading">Loading images from Ethscriptions...</div>';

        try {
            const ethscriptions = await this.fetchEthscriptionsByCreator(creatorAddress);
            
            if (ethscriptions.length === 0) {
                container.innerHTML = '<div class="no-images">No images found for this creator</div>';
                return;
            }

            // Filter by image type if specified
            let filteredEthscriptions = ethscriptions;
            if (imageType === 'missing-phunks') {
                // Filter for Missing Phunks (you may need to adjust this filter)
                filteredEthscriptions = ethscriptions.filter(eth => 
                    eth.mimetype && eth.mimetype.startsWith('image/')
                );
            } else if (imageType === 'dystophunks') {
                // Filter for DystoPhunks (you may need to adjust this filter)
                filteredEthscriptions = ethscriptions.filter(eth => 
                    eth.mimetype && eth.mimetype.startsWith('image/')
                );
            }

            // Clear loading state
            container.innerHTML = '';

            // Load images
            for (const ethscription of filteredEthscriptions.slice(0, 20)) { // Limit to 20 images
                await this.loadSingleImage(container, ethscription);
            }

        } catch (error) {
            console.error('Error loading images:', error);
            container.innerHTML = '<div class="error">Error loading images from Ethscriptions</div>';
        }
    }

    // Load a single image
    async loadSingleImage(container, ethscription) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'ethscription-image-wrapper';
        imageWrapper.style.cssText = `
            display: inline-block;
            margin: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: #f9f9f9;
        `;

        const image = document.createElement('img');
        image.style.cssText = `
            width: 200px;
            height: 200px;
            object-fit: cover;
            display: block;
        `;
        image.alt = `Ethscription #${ethscription.ethscription_number}`;

        // Add loading state
        image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';

        const info = document.createElement('div');
        info.style.cssText = `
            padding: 8px;
            font-size: 12px;
            color: #666;
            text-align: center;
        `;
        info.textContent = `#${ethscription.ethscription_number}`;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(info);
        container.appendChild(imageWrapper);

        // Load actual image data
        try {
            const imageUrl = await this.getImageData(ethscription.ethscription_number);
            if (imageUrl) {
                image.src = imageUrl;
                image.onerror = () => {
                    image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9ImlkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
                };
            }
        } catch (error) {
            console.error('Error loading image:', error);
            image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9ImlkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
        }
    }

    // Search for specific ethscriptions by content
    async searchEthscriptions(query, maxResults = 50) {
        try {
            // This is a simplified search - you might need to implement more sophisticated filtering
            const url = `${this.baseUrl}/ethscriptions?max_results=${maxResults}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const ethscriptions = data.result || [];
            
            // Filter by content (this is a basic implementation)
            return ethscriptions.filter(eth => 
                eth.content_uri && eth.content_uri.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching ethscriptions:', error);
            return [];
        }
    }
}

// Initialize the loader
const ethscriptionsLoader = new EthscriptionsImageLoader();

// Example usage functions
function loadMissingPhunks() {
    // You'll need to replace this with the actual creator address for Missing Phunks
    const creatorAddress = '0x0000000000000000000000000000000000000000'; // Replace with actual address
    ethscriptionsLoader.loadImagesToContainer('missing-phunks-container', creatorAddress, 'missing-phunks');
}

function loadDystoPhunks() {
    // You'll need to replace this with the actual creator address for DystoPhunks
    const creatorAddress = '0x0000000000000000000000000000000000000000'; // Replace with actual address
    ethscriptionsLoader.loadImagesToContainer('dystophunks-container', creatorAddress, 'dystophunks');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthscriptionsImageLoader;
} 