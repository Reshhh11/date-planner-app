function isSupabaseConfigured() {
  return (
    typeof SUPABASE_URL !== 'undefined' &&
    typeof SUPABASE_ANON_KEY !== 'undefined' &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    !SUPABASE_ANON_KEY.includes('YOUR_')
  );
}

const choices = {};
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('linkId') || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

let supabase = null;
if (isSupabaseConfigured()) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function selectOption(key, val) {
  choices[key] = val;
}

function renderShareLink() {
  const shareLink = `https://wannadate.site/?linkId=${linkId}`;
  const shareLinkEl = document.getElementById('share-link');
  if (shareLinkEl) shareLinkEl.textContent = shareLink;
}

function copyToClipboard() {
  const shareLink = `https://wannadate.site/?linkId=${linkId}`;
  navigator.clipboard.writeText(shareLink).then(() => {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = 'Link copied to clipboard! 💖';
      statusEl.classList.add('success');
      statusEl.classList.remove('error');
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.classList.remove('success');
      }, 2000);
    }
  });
}

function nextStep(step) {
  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.remove('hidden');

  if (step === 6) {
    const rideIcon = document.getElementById('ride-icon');
    const rideText = document.getElementById('ride-text');

    if (choices.ride && choices.ride.includes('Metro')) {
      rideIcon.textContent = '🚇👯‍♀️';
      rideText.textContent = 'Anime besties cruising together in the Metro!';
    } else if (choices.ride && choices.ride.includes('Bus')) {
      rideIcon.textContent = '🚌👯‍♀️';
      rideText.textContent = 'Anime besties enjoying the window seats on the Bus!';
    } else {
      rideIcon.textContent = '🛵💨👧👧';
      rideText.textContent = 'Anime besties zooming together on the Scooter!';
    }
  }

  if (step === 12) {
    const summary = document.getElementById('final-summary');
    summary.innerHTML = `
      <li><b>📅 Date:</b> ${choices.date || 'Selected Day'}</li>
      <li><b>🎈 Main Vibe:</b> ${choices.activity || 'Surprise'}</li>
      <li><b>🚀 Travel:</b> ${choices.ride || 'Metro/Scooter'}</li>
      <li><b>🍳 Breakfast:</b> ${choices.breakfast || 'Yummy food'}</li>
      <li><b>🍱 Lunch:</b> ${choices.lunch || 'Princess Choice'}</li>
      <li><b>🍰 Evening Snacks:</b> ${choices.snacks || 'Tea & Treats'}</li>
    `;
    renderShareLink();
  }
}

const calendar = document.getElementById('calendar');
if (calendar) {
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;
    day.onclick = () => {
      selectOption('date', `Day ${i} of this month 🗓️`);
      nextStep(3);
    };
    calendar.appendChild(day);
  }
}

async function saveResponse() {
  const statusEl = document.getElementById('status');
  const personName = document.getElementById('personName')?.value || 'Guest';

  if (!choices.date || !choices.activity || !choices.ride || !choices.breakfast || !choices.lunch || !choices.snacks) {
    statusEl.textContent = 'Please complete all the date choices first.';
    statusEl.classList.add('error');
    return;
  }

  try {
    const payload = {
      link_id: linkId,
      person_name: personName,
      date: choices.date,
      activity: choices.activity,
      ride: choices.ride,
      breakfast: choices.breakfast,
      lunch: choices.lunch,
      snacks: choices.snacks,
      created_at: new Date().toISOString(),
      reply_summary: JSON.stringify({
        date: choices.date,
        activity: choices.activity,
        ride: choices.ride,
        breakfast: choices.breakfast,
        lunch: choices.lunch,
        snacks: choices.snacks
      })
    };

    localStorage.setItem(`response-${linkId}`, JSON.stringify(payload));

    if (supabase) {
      const { error } = await supabase.from('responses').upsert(payload, { onConflict: 'link_id' });
      if (error) throw error;
      statusEl.textContent = 'Your reply has been saved to the live database! 💖';
    } else {
      statusEl.textContent = 'Your reply has been saved locally for now. Add Supabase credentials to enable live tracking.';
    }

    statusEl.classList.remove('error');
    statusEl.classList.add('success');
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Something went wrong while saving the reply.';
    statusEl.classList.add('error');
    statusEl.classList.remove('success');
  }
}

document.getElementById('save-response-btn')?.addEventListener('click', saveResponse);
renderShareLink();
































