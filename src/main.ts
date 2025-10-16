import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

// Select the app div from index.html and fill it with our homepage layout
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <!-- Header Section -->
  <header class="header">
    <!-- Website Logo / Name -->
    <div class="logo">Afford a House</div>

    <!-- Navigation Menu -->
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">Find Housing</a>
      <a href="#">Programs</a>
      <a href="#">Contact</a>
      <a href="#">Login</a>
    </nav>
  </header>

  <!-- Hero Section (Main Banner)-->
  <section class="hero">
    <h1>Find Affordable Housing Near You</h1>
    <p>Connecting families to safe, affordable homes and assistance programs.</p>

    <!-- Search Bar -->
    <div class="search-bar">
      <input type="text" placeholder="Enter city, state, or ZIP code" />
      <button type="button">Search</button>
    </div>
  </section>

  <!-- Programs Section -->
  <section class="programs">
    <h2>Explore Assitance Programs</h2>

    <!-- Program Cards (displayed in a grid)-->
    <div class="program-cards">
      <div class="card">
        <h3>Rental Assistance</h3>
        <p>Support for families needing help with rent payments.</p>
      </div>
      <div class="card">
        <h3>First-Time Buyer Help</h3>
        <p>Resources and grants for first-time homebuyers.</p>
      </div>
      <div class="card">
        <h3>Emergency Housing</h3>
        <p>Immediate assistance for families in urgent need.</p>
      </div>
      <div class="card">
        <h3>Senior Housing</h3>
        <p>Affordable living options for seniors and retirees.</p>
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="how-it-works">
    <h2>How It Works</h2>

    <!-- 3 Steps (Search, Check, Apply) -->
    <div class="steps">
      <div class="step">
        <h3>1. Search For Homes</h3>
        <p>Use our search tool to find affordable housing options in your area.</p>
      </div>
      <div class="step">
        <h3>2. Check Eligibility</h3>
        <p>Review program requirements to see if you qualify for assistance.</p>
      </div>
      <div class="step">
        <h3>3. Apply for Online</h3>
        <p>Submit your application directly through our platform.</p>
      </div>
    </div>
  </section>

  <!-- Footer Section -->
  <footer class="footer">
    <p>Helping families find homes since 2025.</p>

    <!-- Footer Links -->
    <div class="footer-links">
      <a href="#">About</a>
      <a href="#">Contact</a>
      <a href="#">Privacy Policy</a>
    </div>
  </footer>
`