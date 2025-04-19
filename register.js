const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.elements[0].value.trim();
  const email = form.elements[1].value.trim();
  const password = form.elements[2].value;
  const mobile = form.elements[3].value.trim();

  try {
    const response = await fetch('http://localhost:5000/auth/register', {  // ✅ Fixed URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, mobile }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful!');
      localStorage.setItem('token', data.token);
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Something went wrong!');
  }
});
