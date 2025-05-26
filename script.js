window.addEventListener('load', () => {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  setTimeout(() => {
    loaderWrapper.classList.add('fade-out');
    setTimeout(() => {
      loaderWrapper.style.display = 'none';
    }, 500);
  }, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove('active');
    }
  });

  function loadResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight + 100) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  loadResponsiveImages();
  window.addEventListener('scroll', loadResponsiveImages);

  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }

  const categoryButtons = document.querySelectorAll(".category-btn");
  const blogCards = document.querySelectorAll(".blog-card");

  const initTiltEffect = () => {
    if (!('ontouchstart' in window)) {
      blogCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateY = ((x - centerX) / centerX) * 15;
          const rotateX = -((y - centerY) / centerY) * 15;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
      });
    }
  };

  initTiltEffect();
  blogCards.forEach((card) => card.classList.add("show"));

  let filterTimeout;
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const category = button.dataset.category;
      if (filterTimeout) clearTimeout(filterTimeout);

      filterTimeout = setTimeout(() => {
        blogCards.forEach((card) => {
          card.classList.remove("show");
          if (category === "all" || card.dataset.category === category) {
            requestAnimationFrame(() => {
              card.classList.add("show");
            });
          }
        });
        setTimeout(initTiltEffect, 200);
      }, 100);
    });
  });

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-item, .stat-box, .blog-card').forEach(el => {
    animateOnScroll.observe(el);
  });

  const parallaxSections = document.querySelectorAll('.parallax-section');
  window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
      const distance = window.pageYOffset - section.offsetTop;
      const parallaxBg = section.querySelector('.parallax-bg');
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${distance * 0.5}px)`;
      }
    });
  });

  document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    wrap.addEventListener('mousemove', (e) => {
      const bound = wrap.getBoundingClientRect();
      const mouseX = e.clientX - bound.left - bound.width / 2;
      const mouseY = e.clientY - bound.top - bound.height / 2;
      const magneticArea = wrap.querySelector('.magnetic-area');
      if (magneticArea) {
        magneticArea.style.transform = `translate3d(${mouseX * 0.3}px, ${mouseY * 0.3}px, 0)`;
      }
    });
    wrap.addEventListener('mouseleave', () => {
      const magneticArea = wrap.querySelector('.magnetic-area');
      if (magneticArea) magneticArea.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  function animateStats() {
    const stats = document.querySelectorAll('.stat-box h3');
    stats.forEach(stat => {
      const value = stat.innerText;
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      let current = 0;
      const increment = numericValue / 50;
      const duration = 2000;
      const stepTime = duration / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          current = numericValue;
          clearInterval(counter);
        }
        stat.innerText = Math.floor(current) + suffix;
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) observer.observe(statsSection);

  document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-effect');
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    });
  });

  document.querySelectorAll('.cube-container, .feature-item').forEach(el => {
    el.classList.add('floating');
  });

  document.querySelectorAll('.logo-text').forEach(el => {
    el.classList.add('animated-gradient-text');
  });

  const statsBoxes = document.querySelectorAll('.stat-box');
  statsBoxes.forEach(box => {
    const value = box.querySelector('h3').textContent;
    box.querySelector('h3').innerHTML = `<span class="stat-value" data-value="${parseInt(value)}">${value}</span>`;
  });

  document.querySelectorAll('.btn-primary').forEach(btn => {
    const wrap = document.createElement('div');
    wrap.className = 'magnetic-wrap';
    btn.parentNode.insertBefore(wrap, btn);
    wrap.appendChild(btn);
    btn.classList.add('magnetic-area', 'ripple');
  });

  document.querySelectorAll('.hero, .integration-section, .blog-section').forEach(section => {
    section.classList.add('parallax-section');
    const bg = document.createElement('div');
    bg.className = 'parallax-bg';
    section.insertBefore(bg, section.firstChild);
  });

  function showModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';
  }

  function hideModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Additional logic for auth, post creation, and membership is in original code block
});


// Auth State
let currentUser = null;

// Show/Hide Modals
function showModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'flex';
}

function hideModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'none';
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  const container = document.querySelector('.toast-container');
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Auth Event Listeners
document.getElementById('loginBtn').addEventListener('click', () => showModal('loginForm'));
document.getElementById('registerBtn').addEventListener('click', () => showModal('registerForm'));
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

// Close modals when clicking outside
document.querySelectorAll('.auth-container').forEach(container => {
  container.addEventListener('click', (e) => {
    if (e.target === container) {
      hideModal(container.id);
    }
  });
});

// Auth Form Submissions
document.querySelector('#loginForm form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    showToast('Connecting to server...');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem('token', data.token);

      // Check if user is admin
      if (data.user.isAdmin) {
        showToast('Welcome admin! Redirecting to admin dashboard...', 'success');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
        return;
      }

      // Check if user has a community profile
      try {
        const profileResponse = await fetch(`/api/community/profile/${email}`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Accept': 'application/json'
          }
        });

        if (profileResponse.ok) {
          localStorage.setItem('memberEmail', email);
          showToast('Welcome back! Redirecting to your profile...', 'success');
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 1500);
        } else {
          showToast('Successfully logged in!', 'success');
        }
      } catch (profileError) {
        console.error('Error checking profile:', profileError);
        showToast('Successfully logged in!', 'success');
      }

      updateAuthUI();
      hideModal('loginForm');
    } else {
      showToast(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Server connection failed. Please check if the backend server is running on port 5000');
  }
});

document.querySelector('#registerForm form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    showToast('Creating account...');
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      hideModal('registerForm');
      showToast('Registration successful! Please login.');
    } else {
      showToast(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToast('Server connection failed. Please check if the backend server is running on port 5000');
  }
});

// Update UI based on auth state
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileBtn = document.getElementById('profileBtn');
  const memberEmail = localStorage.getItem('memberEmail');

  if (currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    profileBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    profileBtn.style.display = 'none';
  }
}

// Handle Logout
async function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('memberEmail');
  currentUser = null;
  updateAuthUI();
  if (window.location.pathname.includes('profile.html')) {
    window.location.href = 'index123.html';
  }
  showToast('Successfully logged out!');
}

// Check for existing auth token on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Verify token and set current user
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          currentUser = data.user;
          // Check for community profile
          fetch(`/api/community/profile/${data.user.email}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
            .then(res => {
              if (res.ok) {
                localStorage.setItem('memberEmail', data.user.email);
              }
              updateAuthUI();
            })
            .catch(error => {
              console.error('Error checking profile:', error);
              updateAuthUI();
            });
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('memberEmail');
          if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'index123.html';
          }
          updateAuthUI();
        }
      })
      .catch((error) => {
        console.error('Token verification error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('memberEmail');
        if (window.location.pathname.includes('profile.html')) {
          window.location.href = 'index123.html';
        }
        updateAuthUI();
      });
  } else {
    // No token, ensure profile is hidden
    updateAuthUI();
    if (window.location.pathname.includes('profile.html')) {
      window.location.href = 'index123.html';
    }
  }
});

// Initialize all other features
initializeFeatures();


// Scroll Progress Indicator
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
});

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Create Post
async function createPost(content) {
  if (!currentUser) {
    showToast('Please login to create posts');
    return;
  }

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      showToast('Post created successfully!');
    } else {
      const data = await response.json();
      showToast(data.message || 'Error creating post');
    }
  } catch (error) {
    showToast('Error connecting to server');
  }
}

// Handle Comments
async function handleComment(postId) {
  if (!currentUser) {
    showToast('Please login to comment');
    return;
  }

  const comment = prompt('Enter your comment:');
  if (!comment) return;

  try {
    const response = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: comment })
    });

    if (response.ok) {
      showToast('Comment added successfully!');
    } else {
      const data = await response.json();
      showToast(data.message || 'Error adding comment');
    }
  } catch (error) {
    showToast('Error connecting to server');
  }
}

// Initialize Features
function initializeFeatures() {
  // Existing initialization code...

  // Add create post button event listener
  const createPostBtn = document.getElementById('createPostBtn');
  if (createPostBtn) {
    createPostBtn.addEventListener('click', () => {
      if (!currentUser) {
        showToast('Please login to create posts');
        return;
      }

      const content = prompt('What\'s on your mind?');
      if (content) {
        createPost(content);
      }
    });
  }
}

// Function to redirect to profile page
function redirectToProfile(email) {
  localStorage.setItem('memberEmail', email);
  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1500);
}

// Handle membership form submission
document.getElementById('membershipForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    year: document.getElementById('year').value,
    interests: document.getElementById('interests').value,
    message: document.getElementById('message').value
  };

  try {
    showToast('Submitting your application...');

    const response = await fetch('/api/community/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit application');
    }

    showToast(data.message, 'success');
    document.getElementById('membershipForm').reset();
    redirectToProfile(formData.email);
  } catch (error) {
    console.error('Application submission error:', error);
    showToast(error.message || 'Error connecting to server. Please try again later.', 'error');
  }
});
