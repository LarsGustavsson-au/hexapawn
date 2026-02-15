// HexaPawn — UI updates, start screen, status messages

// ── Start Screen ────────────────────────────────────────────────

export function showStartScreen(container, onChoiceSelected) {
  const overlay = document.createElement('div');
  overlay.id = 'start-screen';
  overlay.className = 'start-overlay';

  const card = document.createElement('div');
  card.className = 'start-card bg-white rounded-xl shadow-lg pt-4 px-5 pb-6 max-w-sm mx-auto border border-zinc-100 text-left';
  overlay.appendChild(card);
  container.appendChild(overlay);

  function showChoiceView() {
    card.innerHTML = `
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
      <div class="flex gap-4 justify-center mt-4">
        <button id="btn-start-rules" class="text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer bg-transparent border-none font-medium">Rules</button>
        <button id="btn-start-about" class="text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer bg-transparent border-none font-medium">About</button>
      </div>
    `;

    card.querySelector('#btn-human-first').addEventListener('click', () => {
      overlay.remove();
      onChoiceSelected('human');
    });
    card.querySelector('#btn-computer-first').addEventListener('click', () => {
      overlay.remove();
      onChoiceSelected('computer');
    });
    card.querySelector('#btn-start-rules').addEventListener('click', () => {
      showInfoView('Rules', RULES_HTML);
    });
    card.querySelector('#btn-start-about').addEventListener('click', () => {
      showInfoView('About', ABOUT_HTML);
    });
  }

  function showInfoView(title, bodyHtml) {
    card.innerHTML = `
      <h2 class="text-lg font-bold text-zinc-800 mb-3">${title}</h2>
      <hr class="-mx-5 border-zinc-300 mb-4">
      <div class="text-sm text-zinc-700 leading-relaxed mb-6">${bodyHtml}</div>
      <button class="info-back bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg border-none transition-colors duration-150 cursor-pointer shadow w-full">
        Back
      </button>
    `;

    card.querySelector('.info-back').addEventListener('click', showChoiceView);
  }

  showChoiceView();
}

// ── Game Over Screen ────────────────────────────────────────────

export function showGameOverScreen(container, message, reason, quip, onPlayAgain, onDismiss) {
  const overlay = document.createElement('div');
  overlay.id = 'game-over-screen';
  overlay.className = 'start-overlay';

  const quipHtml = quip
    ? `<p class="text-sm italic text-zinc-500 mb-6">"${quip}"</p>`
    : '';

  overlay.innerHTML = `
    <div class="start-card bg-white rounded-xl shadow-lg pt-4 px-5 pb-6 max-w-sm mx-auto border border-zinc-100 text-left">
      <h2 class="text-lg font-bold text-zinc-800 mb-3">${message}</h2>
      <hr class="-mx-5 border-zinc-300 mb-4">
      <p class="text-base text-zinc-800 ${quip ? 'mb-3' : 'mb-6'}">${reason}</p>
      ${quipHtml}
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
    if (onDismiss) onDismiss();
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

export function showPlayAgainButton(container, onPlayAgain) {
  let statusEl = container.querySelector('#status-message');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'status-message';
    statusEl.className = 'text-base font-medium text-zinc-800 mt-4';
    container.appendChild(statusEl);
  }

  statusEl.innerHTML = '';
  statusEl.className = 'text-base font-medium text-zinc-800 mt-4 mb-2';
  const btn = document.createElement('button');
  btn.textContent = 'Play again';
  btn.className = 'bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg border-none transition-colors duration-150 cursor-pointer shadow';
  btn.addEventListener('click', onPlayAgain);
  statusEl.appendChild(btn);
}

// ── Info Modals (Rules & About) ─────────────────────────────────

function showInfoModal(title, bodyHtml) {
  // Append to document.body so renderGameView() can't destroy it
  const overlay = document.createElement('div');
  overlay.className = 'start-overlay';
  overlay.style.zIndex = '20';

  overlay.innerHTML = `
    <div class="start-card bg-white rounded-xl shadow-lg pt-4 px-5 pb-6 max-w-sm mx-auto border border-zinc-100 text-left">
      <h2 class="text-lg font-bold text-zinc-800 mb-3">${title}</h2>
      <hr class="-mx-5 border-zinc-300 mb-4">
      <div class="text-sm text-zinc-700 leading-relaxed mb-6">${bodyHtml}</div>
      <button class="info-modal-close bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg border-none transition-colors duration-150 cursor-pointer shadow w-full">
        Got it
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('.info-modal-close').addEventListener('click', () => {
    overlay.remove();
  });
}

const RULES_HTML = `
  <p class="mb-3">Each player has three pawns on a 3×3 board, lined up on opposite edges. Pawns move one square forward, or one square diagonally to capture. Players alternate turns.</p>
  <p class="mb-2 font-semibold text-zinc-800">You win by:</p>
  <ul class="list-disc pl-5 space-y-1">
    <li>Reaching the far side of the board</li>
    <li>Capturing all opponent pawns</li>
    <li>Leaving your opponent with no legal moves</li>
  </ul>
`;

const ABOUT_HTML = `
  <p class="mb-3">In 1988, two students finishing high school – Lars\u00a0G and Per\u00a0S – accepted their teacher's challenge: build a computer that could play and learn Hexapawn using only an 8-bit processor and some LEDs.</p>
  <p class="mb-3">They didn't quite pull it off. The machine played, but only ever learnt from its first mistake.</p>
  <p class="mb-3">38 years later, here's the completed assignment – though this time Lars used Claude to write the code rather than hand-coding Motorola assembler.</p>
  <p>Hexapawn became famous in 1962 when Martin Gardner described it as a way to demonstrate machine learning using matchboxes and coloured beads. Simple game, surprisingly deep idea.</p>
`;

export function showRulesModal() {
  showInfoModal('Rules', RULES_HTML);
}

export function showAboutModal() {
  showInfoModal('About', ABOUT_HTML);
}

// ── Info Links (reusable pair of text buttons) ──────────────────

export function renderInfoLinks(container, isDisabled = false) {
  let linksEl = container.querySelector('#info-links');
  if (!linksEl) {
    linksEl = document.createElement('div');
    linksEl.id = 'info-links';
    linksEl.className = 'flex gap-4 justify-center mt-3';
    container.appendChild(linksEl);
  }

  const disabledClass = isDisabled ? ' opacity-40 pointer-events-none' : '';

  linksEl.innerHTML = `
    <button class="info-link-rules text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer bg-transparent border-none font-medium${disabledClass}">Rules</button>
    <button class="info-link-about text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer bg-transparent border-none font-medium${disabledClass}">About</button>
  `;

  if (!isDisabled) {
    linksEl.querySelector('.info-link-rules').addEventListener('click', () => {
      showRulesModal();
    });

    linksEl.querySelector('.info-link-about').addEventListener('click', () => {
      showAboutModal();
    });
  }
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
