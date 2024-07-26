document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Hard-coded credentials
    const validUsername = 'admin';
    const validPassword = 'password123';
  
    if (username === validUsername && password === validPassword) {
      // Redirect to the main page
      window.location.href = 'main.html';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  });
  //I hate it