document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const titleInput = document.getElementById('title-input');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const descriptionText = document.getElementById('description-text');
    const analyzeAnotherBtn = document.getElementById('analyze-another-btn');
    
    // Create preview thumbnail element
    const previewThumb = document.createElement('img');
    previewThumb.className = 'preview-thumbnail';
    dropArea.appendChild(previewThumb);
    
    // Prevent defaults for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        
        if (files.length > 0) {
            showImagePreview(files[0]);
        }
    }
    
    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            showImagePreview(fileInput.files[0]);
        }
    });
    
    // Show image preview
    function showImagePreview(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file!');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Set background image and show preview thumbnail
            dropArea.style.backgroundImage = `url(${e.target.result})`;
            dropArea.classList.add('has-image');
            
            // Set and show thumbnail
            previewThumb.src = e.target.result;
            previewThumb.style.display = 'block';
            
            // Add bouncing animation to the upload button
            uploadBtn.classList.add('animate__animated', 'animate__pulse');
            
            // Change text in drop area
            const dropText = dropArea.querySelector('p');
            if (dropText) {
                dropText.textContent = 'Image ready! Click "Analyze Image" to proceed';
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    // Handle file upload
    uploadBtn.addEventListener('click', function() {
        if (fileInput.files.length === 0) {
            alert('Please select an image first!');
            return;
        }
        
        const file = fileInput.files[0];
        if (!file.type.match('image.*')) {
            alert('Please select an image file!');
            return;
        }
        
        uploadImage(file);
    });
    
    // Upload and analyze image
    function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', titleInput.value || 'Untitled');
        
        // Show loader with animation
        loader.style.display = 'block';
        document.querySelector('.upload-container').style.display = 'none';
        resultContainer.style.display = 'none';
        
        // Create loading animation 
        const loaderIcon = document.createElement('div');
        loaderIcon.className = 'loader-icon';
        loader.prepend(loaderIcon);
        
        // Add random loading messages
        const loadingMessages = [
            "AI is analyzing your image...",
            "Examining visual details...",
            "Identifying elements in your image...",
            "Crafting a detailed description...",
            "Almost there, finalizing analysis..."
        ];
        
        const loadingText = document.createElement('p');
        loadingText.className = 'mt-3';
        loader.appendChild(loadingText);
        
        let messageIndex = 0;
        loadingText.textContent = loadingMessages[messageIndex];
        
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            loadingText.textContent = loadingMessages[messageIndex];
        }, 2500);
        
        // Send request to server
        fetch('/analyze/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Server error occurred');
                });
            }
            return response.json();
        })
        .then(data => {
            clearInterval(messageInterval);
            loader.innerHTML = ''; // Clear loader content
            loader.style.display = 'none';
            
            if (data.success) {
                resultImage.src = data.image_url;
                descriptionText.innerHTML = data.description.replace(/\n/g, '<br>');
                resultContainer.style.display = 'block';
                
                // Update gallery link to point directly to this image's entry
                if (data.image_id) {
                    const viewInGalleryBtn = document.getElementById('view-in-gallery-btn');
                    if (viewInGalleryBtn) {
                        // Update href to jump to the specific image in the gallery
                        const galleryUrl = viewInGalleryBtn.getAttribute('href');
                        // Ensure we're using the proper base URL path
                        const baseUrl = galleryUrl.split('#')[0]; // Get base URL without hash
                        viewInGalleryBtn.href = baseUrl + '#image-' + data.image_id;
                    }
                }
                
                // Animate description text typing effect
                typeWriter(data.description, descriptionText);
            } else {
                throw new Error(data.error || 'Failed to analyze image');
            }
        })
        .catch(error => {
            clearInterval(messageInterval);
            loader.innerHTML = ''; // Clear loader content
            loader.style.display = 'none';
            document.querySelector('.upload-container').style.display = 'block';
            alert('Error: ' + error.message);
        });
    }
    
    // Typewriter effect for description
    function typeWriter(text, element, speed = 30) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Reset everything when analyzing another image
    analyzeAnotherBtn.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        document.querySelector('.upload-container').style.display = 'block';
        fileInput.value = '';
        titleInput.value = '';
        
        // Reset drop area
        dropArea.style.backgroundImage = '';
        dropArea.classList.remove('has-image');
        previewThumb.style.display = 'none';
        
        // Reset dropArea text
        const dropText = dropArea.querySelector('p');
        if (dropText) {
            dropText.textContent = 'Drag & Drop your image here or click to browse';
        }
    });
}); 