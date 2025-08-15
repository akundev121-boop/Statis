// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const uploadForm = document.getElementById('uploadForm');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');

// File size formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show file info
function showFileInfo(file) {
    const fileSize = formatFileSize(file.size);
    const fileType = file.name.split('.').pop().toUpperCase();
    
    fileInfo.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2em;">📄</span>
                <strong>${file.name}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.1em;">📊</span>
                <span>${fileSize}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.1em;">🏷️</span>
                <span class="file-type-badge">${fileType}</span>
            </div>
        </div>
    `;
    fileInfo.style.display = 'block';
    
    // Add style for file type badge
    const badge = fileInfo.querySelector('.file-type-badge');
    if (badge) {
        badge.style.cssText = `
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.9em;
            font-weight: 600;
        `;
    }
}

// Validate file type
function validateFile(file) {
    const allowedTypes = ['rpa', 'rpyc'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        showAlert(`❌ Tipe file tidak didukung! Hanya file .rpa dan .rpyc yang diizinkan.`, 'error');
        return false;
    }
    
    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
        showAlert(`❌ File terlalu besar! Maksimal 500MB.`, 'error');
        return false;
    }
    
    return true;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const alertColor = type === 'error' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(102, 126, 234, 0.1)';
    const borderColor = type === 'error' ? 'rgba(220, 53, 69, 0.3)' : 'rgba(102, 126, 234, 0.3)';
    
    alertDiv.style.cssText = `
        background: ${alertColor};
        border-color: ${borderColor};
        margin-bottom: 20px;
    `;
    
    alertDiv.innerHTML = `
        <span class="alert-icon">${type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="alert-text">${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    const mainCard = document.querySelector('.main-card');
    mainCard.insertBefore(alertDiv, mainCard.firstChild);
}

// Handle file selection
function handleFileSelect(file) {
    if (validateFile(file)) {
        showFileInfo(file);
        uploadArea.style.borderColor = '#28a745';
        uploadArea.style.background = 'rgba(40, 167, 69, 0.1)';
        
        // Update upload icon and text
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        const uploadText = uploadArea.querySelector('.upload-text');
        uploadIcon.textContent = '✅';
        uploadText.textContent = 'File siap diproses!';
    } else {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        resetUploadArea();
    }
}

// Reset upload area
function resetUploadArea() {
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    
    const uploadIcon = uploadArea.querySelector('.upload-icon');
    const uploadText = uploadArea.querySelector('.upload-text');
    uploadIcon.textContent = '📁';
    uploadText.textContent = 'Drag & Drop file di sini';
}

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(files[0]);
    }
});

// File input change handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    } else {
        fileInfo.style.display = 'none';
        resetUploadArea();
    }
});

// Form submit handler
uploadForm.addEventListener('submit', (e) => {
    if (!fileInput.files.length) {
        e.preventDefault();
        showAlert('❌ Pilih file terlebih dahulu!', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    loading.style.display = 'flex';
    
    // Add progress indicator
    showAlert('🔄 Sedang memproses file... Harap tunggu.', 'info');
});

// Click upload area to trigger file input
uploadArea.addEventListener('click', (e) => {
    if (e.target === uploadArea || e.target.closest('.upload-icon, .upload-text, .upload-subtitle')) {
        fileInput.click();
    }
});

// Clear all function
function clearAll() {
    if (confirm('Yakin ingin menghapus semua file dan hasil ekstraksi?')) {
        // Reset form
        fileInput.value = '';
        fileInfo.style.display = 'none';
        resetUploadArea();
        
        // Remove alerts
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
        
        showAlert('🗑️ Semua data telah dihapus!', 'info');
        
        // TODO: Add AJAX call to clear server files
        // fetch('/clear', {method: 'POST'})
        //     .then(response => response.json())
        //     .then(data => console.log('Files cleared:', data));
    }
}

// Auto-hide alerts after 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.style.transition = 'all 0.5s ease';
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 500);
            }
        }, 5000);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + O to open file dialog
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        fileInput.click();
    }
    
    // Escape to clear selection
    if (e.key === 'Escape') {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        resetUploadArea();
    }
});

// Initialize
console.log('🚀 RenPy Extractor loaded successfully!');
console.log('💡 Tips: ');
console.log('  - Drag & drop file langsung ke area upload');
console.log('  - Tekan Ctrl+O untuk buka file dialog');
console.log('  - Tekan Escape untuk clear selection');