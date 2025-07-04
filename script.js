let timer = 600;
let email = '';
let token = '';

// Fetch new email
async function getEmail() {
  const res = await fetch('https://api.mail.tm/domains');
  const domains = await res.json();
  const randomPrefix = Math.random().toString(36).substring(7);
  email = `${randomPrefix}@${domains['hydra:member'][0].domain}`;

  const accountRes = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password: 'pass1234' })
  });
  const accountData = await accountRes.json();

  const tokenRes = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password: 'pass1234' })
  });
  const tokenData = await tokenRes.json();
  token = tokenData.token;

  document.getElementById('emailDisplay').innerText = email;
  pollInbox();
}

// Inbox polling
function pollInbox() {
  setInterval(async () => {
    const inboxRes = await fetch('https://api.mail.tm/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const inboxData = await inboxRes.json();
    const inboxHTML = inboxData['hydra:member'].map(msg =>
      `<div><strong>${msg.from.address}</strong><p>${msg.intro}</p></div>`
    ).join('');
    document.getElementById('inbox').innerHTML = inboxHTML;
  }, 3000);
}

// Countdown
function startTimer() {
  const timerEl = document.getElementById('timer');
  setInterval(() => {
    if (timer > 0) {
      timer--;
      const min = Math.floor(timer / 60);
      const sec = timer % 60;
      timerEl.innerText = `Expires in: ${min}:${sec.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// Button actions
document.getElementById('copyEmail').onclick = () =>
  navigator.clipboard.writeText(email);

document.getElementById('extendTimer').onclick = () => timer += 600;

document.getElementById('buyPremium').onclick = () => {
  // Stripe Checkout logic
  alert("Premium checkout coming soon!");
};

// Initialize
getEmail();
startTimer();
