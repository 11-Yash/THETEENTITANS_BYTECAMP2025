const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/api/ngo/login', {
      email,
      password
    });

    // Store NGO ID in localStorage
    localStorage.setItem('ngoId', response.data.id);
    localStorage.setItem('ngoName', response.data.name);
    localStorage.setItem('ngoEmail', response.data.email);
    
    console.log('NGO logged in successfully:', response.data);
    // Navigate to dashboard
    navigate('/ngo-dashboard');
  } catch (error) {
    console.error('Login error:', error);
    setError(error.response?.data?.error || 'Login failed');
  }
}; 