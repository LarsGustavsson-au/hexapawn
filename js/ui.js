// HexaPawn — UI updates, start screen, status messages

// ── Start Screen ────────────────────────────────────────────────

export function showStartScreen(container, onChoiceSelected) {
  const overlay = document.createElement('div');
  overlay.id = 'start-screen';
  overlay.className = 'start-overlay';

  overlay.innerHTML = `
    <div class="start-card bg-white rounded-xl shadow-lg pt-4 px-5 pb-6 max-w-sm mx-auto border border-zinc-100 text-left">
      <h1 class="text-2xl font-bold text-zinc-800 mb-3">HexaPawn</h1>
      <hr class="-mx-5 border-zinc-300 mb-4">
      <p class="text-base text-zinc-800 mb-6">Who goes first?</p>
      <div class="flex flex-col gap-3">
        <button id="btn-human-first"
          class="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg border-none transition-colors duration-150 cursor-pointer shadow">
          I'll go first
        </button>
        <button id="btn-computer-first"
          class="bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-6 py-2.5 rounded-lg border-2 border-emerald-700 transition-colors duration-150 cursor-pointer shadow">
          Computer goes first
        </button>
      </div>
    </div>
  `;

  container.appendChild(overlay);

  overlay.querySelector('#btn-human-first').addEventListener('click', () => {
    overlay.remove();
    onChoiceSelected('human');
  });

  overlay.querySelector('#btn-computer-first').addEventListener('click', () => {
    overlay.remove();
    onChoiceSelected('computer');
  });
}

// ── Game Over Screen ────────────────────────────────────────────

export function showGameOverScreen(container, message, reason, onPlayAgain) {
  const overlay = document.createElement('div');
  overlay.id = 'game-over-screen';
  overlay.className = 'start-overlay';

  overlay.innerHTML = `
    <div class="start-card bg-white rounded-xl shadow-lg pt-4 px-5 pb-6 max-w-sm mx-auto border border-zinc-100 text-left">
      <h2 class="text-lg font-bold text-zinc-800 mb-3">${message}</h2>
      <hr class="-mx-5 border-zinc-300 mb-4">
      <p class="text-base text-zinc-800 mb-6">${reason}</p>
      <div class="flex flex-col gap-3">
        <button id="btn-play-again"
          class="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg border-none transition-colors duration-150 cursor-pointer shadow">
          Play again
        </button>
        <button id="btn-dismiss"
          class="bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-6 py-2.5 rounded-lg border-2 border-emerald-700 transition-colors duration-150 cursor-pointer shadow">
          View board
        </button>
      </div>
    </div>
  `;

  container.appendChild(overlay);

  overlay.querySelector('#btn-play-again').addEventListener('click', () => {
    overlay.remove();
    onPlayAgain();
  });

  overlay.querySelector('#btn-dismiss').addEventListener('click', () => {
    overlay.remove();
  });
}

// ── Status Message ──────────────────────────────────────────────

export function showStatusMessage(container, text) {
  let statusEl = container.querySelector('#status-message');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'status-message';
    statusEl.className = 'text-base font-medium text-zinc-800 mt-4 h-6';
    container.appendChild(statusEl);
  }
  statusEl.textContent = text;
}

export function clearStatusMessage(container) {
  const statusEl = container.querySelector('#status-message');
  if (statusEl) statusEl.textContent = '';
}

// ── Stats Display ───────────────────────────────────────────────

export function renderStats(container, stats) {
  let statsEl = container.querySelector('#game-stats');
  if (!statsEl) {
    statsEl = document.createElement('div');
    statsEl.id = 'game-stats';
    statsEl.className = 'stats-bar';
    container.appendChild(statsEl);
  }

  statsEl.innerHTML = `
    <div class="stat-item">
      <span class="text-sm font-medium text-zinc-800">Games played</span>
      <span class="text-lg font-bold text-emerald-700">${stats.gamesPlayed}</span>
    </div>
    <div class="stat-item">
      <span class="text-sm font-medium text-zinc-800">Your wins</span>
      <span class="text-lg font-bold text-emerald-700">${stats.humanWins}</span>
    </div>
    <div class="stat-item">
      <span class="text-sm font-medium text-zinc-800">Computer wins</span>
      <span class="text-lg font-bold text-emerald-700">${stats.computerWins}</span>
    </div>
  `;
}
