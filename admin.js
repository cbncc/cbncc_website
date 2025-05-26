// Check if user is admin
async function checkAdminAccess() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index123.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!data.user.isAdmin) {
            window.location.href = 'index123.html';
        } else {
            document.getElementById('adminName').textContent = data.user.name;
            document.getElementById('adminProfileImage').src = data.user.profileImage;
        }
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = 'index123.html';
    }
}

// Navigation
document.querySelectorAll('.admin-menu li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.admin-menu li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));

        item.classList.add('active');
        document.getElementById(item.dataset.section).classList.add('active');

        if (item.dataset.section === 'dashboard') {
            loadDashboardStats();
        } else if (item.dataset.section === 'users') {
            loadUsers();
        } else if (item.dataset.section === 'posts') {
            loadPosts();
        } else if (item.dataset.section === 'stats') {
            loadStatistics();
        }
    });
});

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('totalPosts').textContent = data.totalPosts;

        // Recent Activity
        const activityList = document.getElementById('recentActivity');
        activityList.innerHTML = '';

        data.recentUsers.forEach(user => {
            activityList.innerHTML += `
                <div class="activity-item">
                    <span>New User: ${user.name}</span>
                    <span>${new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            `;
        });

        data.recentPosts.forEach(post => {
            activityList.innerHTML += `
                <div class="activity-item">
                    <span>New Post by ${post.author.name}</span>
                    <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error('Stats error:', error);
        showToast('Error loading dashboard stats', 'error');
    }
}

// Users Management
let currentUserPage = 1;
async function loadUsers(page = 1, search = '') {
    try {
        const response = await fetch(`/api/admin/users?page=${page}&search=${search}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        data.users.forEach(user => {
            usersList.innerHTML += `
                <div class="user-item">
                    <img src="${user.profileImage}" alt="${user.name}" class="user-avatar">
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                    </div>
                    <div class="user-actions">
                        <button onclick="toggleAdminRole('${user._id}')">${user.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>
                        <button onclick="deleteUser('${user._id}')" class="delete">Delete</button>
                    </div>
                </div>
            `;
        });

        // Update pagination
        updatePagination(data.currentPage, data.totalPages, 'usersPagination', loadUsers);
    } catch (error) {
        console.error('Users load error:', error);
        showToast('Error loading users', 'error');
    }
}

// Posts Management
let currentPostPage = 1;
async function loadPosts(page = 1, search = '', category = '') {
    try {
        const response = await fetch(`/api/admin/posts?page=${page}&search=${search}&category=${category}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        const postsList = document.getElementById('postsList');
        postsList.innerHTML = '';

        data.posts.forEach(post => {
            postsList.innerHTML += `
                <div class="post-item">
                    <div class="post-header">
                        <h4>${post.author.name}</h4>
                        <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                        ${post.images.map(img => `<img src="${img}" alt="Post image">`).join('')}
                    </div>
                    <div class="post-footer">
                        <span>Category: ${post.category}</span>
                        <span>Tags: ${post.tags.join(', ')}</span>
                        <button onclick="deletePost('${post._id}')" class="delete">Delete</button>
                    </div>
                </div>
            `;
        });

        // Update pagination
        updatePagination(data.currentPage, data.totalPages, 'postsPagination', loadPosts);
    } catch (error) {
        console.error('Posts load error:', error);
        showToast('Error loading posts', 'error');
    }
}

// Statistics Charts
async function loadStatistics() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        // User Growth Chart
        const userCtx = document.getElementById('userGrowthChart').getContext('2d');
        new Chart(userCtx, {
            type: 'line',
            data: {
                labels: data.userStats.map(stat => stat._id),
                datasets: [{
                    label: 'New Users',
                    data: data.userStats.map(stat => stat.count),
                    borderColor: '#007bff',
                    tension: 0.1
                }]
            }
        });

        // Categories Chart
        const categoryCtx = document.getElementById('categoriesChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: data.categoryStats.map(stat => stat._id),
                datasets: [{
                    data: data.categoryStats.map(stat => stat.count),
                    backgroundColor: [
                        '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6c757d'
                    ]
                }]
            }
        });
    } catch (error) {
        console.error('Statistics error:', error);
        showToast('Error loading statistics', 'error');
    }
}

// Utility Functions
function updatePagination(currentPage, totalPages, containerId, loadFunction) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (currentPage > 1) {
        container.innerHTML += `<button onclick="${loadFunction.name}(${currentPage - 1})">Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `
            <button class="${i === currentPage ? 'active' : ''}" 
                    onclick="${loadFunction.name}(${i})">${i}</button>
        `;
    }

    if (currentPage < totalPages) {
        container.innerHTML += `<button onclick="${loadFunction.name}(${currentPage + 1})">Next</button>`;
    }
}

async function toggleAdminRole(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}/role`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        showToast(data.message);
        loadUsers(currentUserPage);
    } catch (error) {
        console.error('Role update error:', error);
        showToast('Error updating user role', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        showToast(data.message);
        loadUsers(currentUserPage);
    } catch (error) {
        console.error('User deletion error:', error);
        showToast('Error deleting user', 'error');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        showToast(data.message);
        loadPosts(currentPostPage);
    } catch (error) {
        console.error('Post deletion error:', error);
        showToast('Error deleting post', 'error');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize
checkAdminAccess();
loadDashboardStats(); 