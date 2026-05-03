import { navbar } from "../components/navbar.js";
import { card } from "../components/card.js";
import { bindNavbarActions, getSession } from "./auth.js";
const session = getSession();
document.body.insertAdjacentHTML("afterbegin", navbar("index", false, session));
bindNavbarActions(session, false);
const app = document.getElementById("app");
app.className = "app-shell";
if (!session) {
  app.innerHTML = `
  <section class="hero-landing card">
    <div>
      <p class="hero-kicker">Neurosense Care</p>
      <h1>AI-Powered Healthcare Made Simple</h1>
      <p class="muted">Book appointments, track mood, review medical timelines, and chat with doctors in one calm and reliable healthcare workspace.</p>
      <div class="hero-actions">
        <a class="btn" href="pages/login.html">Get Started</a>
        <a class="btn btn-secondary" href="#doctors-section">Browse Doctors</a>
      </div>
    </div>
    <div class="hero-illustration" aria-hidden="true">
      <svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="180" cy="130" r="120" fill="rgba(20,184,166,0.12)"/>
        <rect x="100" y="55" width="95" height="150" rx="28" fill="#E5E7EB"/>
        <rect x="132" y="80" width="30" height="40" rx="15" fill="#F3F4F6"/>
        <rect x="120" y="120" width="54" height="54" rx="12" fill="#0F172A"/>
        <rect x="210" y="98" width="85" height="95" rx="18" fill="#1F2937"/>
        <circle cx="248" cy="85" r="22" fill="#F9D7C1"/>
        <circle cx="146" cy="58" r="24" fill="#F9D7C1"/>
        <path d="M126 46C130 30 150 28 164 40C166 44 166 50 164 54H126V46Z" fill="#0B1220"/>
        <rect x="130" y="140" width="34" height="8" rx="4" fill="#14B8A6"/>
        <rect x="224" y="128" width="44" height="10" rx="5" fill="#14B8A6"/>
        <circle cx="305" cy="62" r="16" fill="rgba(34,197,94,0.2)"/>
        <path d="M305 53V71M296 62H314" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
        <rect x="54" y="146" width="30" height="40" rx="10" fill="rgba(34,197,94,0.18)"/>
        <path d="M64 168H74M69 163V173" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  </section>
  <section class="section-block">
    <h2>Features</h2>
    <div class="grid grid-2 homepage-features">
      ${card("<h3>AI Prediction</h3><p class='muted'>Get local risk insights for diabetes, heart, and liver conditions using profile data.</p>")}
      ${card("<h3>Appointment Booking</h3><p class='muted'>Book and track appointments with clear status updates and virtual meeting links.</p>")}
      ${card("<h3>Mood Tracking</h3><p class='muted'>Log daily mood and monitor emotional trends with a clean monthly view.</p>")}
      ${card("<h3>Doctor Chat</h3><p class='muted'>Securely communicate with your doctor based on your active care relationships.</p>")}
    </div>
  </section>
  <section id="doctors-section" class="section-block">
    <h2>Our Doctors</h2>
    <div class="grid grid-3">
      <article class="card doctor-card-home">
        <img src="https://i.pravatar.cc/120?img=47" alt="Dr. Kavya Mehta" class="doctor-avatar-home" />
        <h3>Dr. Kavya Mehta</h3>
        <p class="muted">Neurologist • 11 years experience</p>
        <p>Qualification: MD, DM (Neurology)</p>
        <p><strong>Rating:</strong> 4.8/5</p>
        <a class="btn btn-secondary doctor-action-btn" href="pages/login.html">View Profile</a>
      </article>
      <article class="card doctor-card-home">
        <img src="https://i.pravatar.cc/120?img=13" alt="Dr. Arjun Rao" class="doctor-avatar-home" />
        <h3>Dr. Arjun Rao</h3>
        <p class="muted">Cardiologist • 9 years experience</p>
        <p>Qualification: MBBS, MD (Cardiology)</p>
        <p><strong>Rating:</strong> 4.7/5</p>
        <a class="btn btn-secondary doctor-action-btn" href="pages/login.html">View Profile</a>
      </article>
      <article class="card doctor-card-home">
        <img src="https://i.pravatar.cc/120?img=32" alt="Dr. Naina Verma" class="doctor-avatar-home" />
        <h3>Dr. Naina Verma</h3>
        <p class="muted">Hepatologist • 8 years experience</p>
        <p>Qualification: MD, Fellowship in Liver Care</p>
        <p><strong>Rating:</strong> 4.9/5</p>
        <a class="btn btn-secondary doctor-action-btn" href="pages/login.html">View Profile</a>
      </article>
    </div>
  </section>
  <section class="section-block">
    <h2>What our users say</h2>
    <div class="grid grid-3 testimonials-home">
      ${card("<h3>Patient Experience</h3><p class='muted'>\"Dr. Kavya explained my reports clearly and helped me improve my sleep and stress routine.\"</p><p><strong>- Riya S.</strong></p>")}
      ${card("<h3>Doctor Experience</h3><p class='muted'>\"The dashboard gives me a quick view of appointments, timelines, and patient updates in one place.\"</p><p><strong>- Dr. Arjun Rao</strong></p>")}
      ${card("<h3>Website Experience</h3><p class='muted'>\"Easy to use, clean design, and everything I need is available without confusion.\"</p><p><strong>- Kunal P.</strong></p>")}
    </div>
  </section>
  <section class="section-block">
    <div class="card homepage-cta">
      <h2>Take control of your health today</h2>
      <p class="muted">Create your care flow in minutes and access intelligent healthcare support with confidence.</p>
      <a class="btn" href="pages/login.html">Get Started</a>
    </div>
  </section>
  `;
} else {
  app.innerHTML = `
  <section class="hero card">
    <div class="muted">AI-powered healthcare assistance</div>
    <h1>Neurosense Care</h1>
    <p class="muted">Calm, trustworthy, role-based healthcare workflow.</p>
    <div style="margin-top:16px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
      <a class="btn" href="${session.role === "doctor" ? "pages/doctor-dashboard.html" : "pages/patient-dashboard.html"}">Go to Dashboard</a>
    </div>
  </section>
  <section class="grid grid-3" style="margin-top:18px;">
    ${card("<h3>Personalized Care</h3><p class='muted'>Patient and doctor experiences tailored by role.</p>")}
    ${card("<h3>Clinical Tracking</h3><p class='muted'>Track mood, timeline events, and appointments in one place.</p>")}
    ${card("<h3>Predictive Insights</h3><p class='muted'>Local disease risk prediction using profile-driven data.</p>")}
  </section>
  <section class="grid grid-3" style="margin-top:18px;">
    ${card("<h3>How It Works</h3><p class='muted'>Login, update profile, run predictions, and connect with your doctor.</p>")}
    ${card("<h3>Why Trust Us</h3><p class='muted'>Minimal, medically themed UX with structured and transparent records.</p>")}
    ${card("<h3>Quick Stats</h3><p class='muted'>3 active specialists • 3 sample patient profiles • 3 local ML models.</p>")}
  </section>
  `;
}
