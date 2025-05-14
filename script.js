console.log("Website loaded successfully!");

<script>
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Check for saved mode in localStorage
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
</script>
