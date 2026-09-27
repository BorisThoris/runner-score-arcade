export default function arcadeShell(scene) {
  const host = document.getElementById('arcade-shell');
  const arena = document.getElementById('phaser-example');
  host.innerHTML = `<header class="arcade-header"><div><p class="eyebrow">DODGE • COLLECT • SURVIVE</p><h1>Dodg’Em Up <em>Bro.</em></h1></div><button id="sound" class="quiet">Sound off</button></header>
    <div class="run-dashboard"><div><span>YOUR SCORE</span><strong id="score">0000</strong></div><div><span>HEARTS</span><strong id="lives">♥ ♥ ♥</strong></div><div><span>PERSONAL BEST</span><strong id="best">—</strong></div><div class="run-phase"><span id="wave">READY WHEN YOU ARE</span><strong id="effect">Read the warning. Find your gap.</strong></div><button id="pause" class="quiet" disabled>Pause <kbd>P</kbd></button></div>
    <div class="arena-wrap"><div id="phaser-example"></div><section id="run-panel" class="run-panel" aria-labelledby="panel-title"><p class="eyebrow" id="panel-eyebrow">READY TO PLAY</p><h2 id="panel-title">Dodge the falling spikes.</h2><p id="panel-copy">Dodge the falling spike balls. Watch the amber drop markers, collect stars, and keep moving as each wave gets faster.</p><div class="rules" id="rules"><span><b>← →</b> Move</span><span><b>↑</b> Jump</span><span><b>↓</b> Duck</span></div><button id="primary" class="primary" disabled>Loading the arena…</button><p id="panel-note">Stars restore a heart. Speed and reverse pickups last 6 seconds.</p><ol id="records" class="records"></ol></section></div>
    <footer class="arcade-footer"><p id="message" role="status">Your records stay on this device. No account required.</p><div class="touch-controls" aria-label="Movement controls"><button aria-label="Move left" data-control="left">←</button><button aria-label="Move right" data-control="right">→</button><button aria-label="Jump" data-control="up">↑</button><button aria-label="Duck" data-control="down">↓</button></div><span class="keyboard-note">Arrows to move · P / Esc pause</span></footer>`;
  host.querySelector('#phaser-example').replaceWith(arena);
  const ui = {};
  ['score','lives','best','wave','effect','pause','sound','run-panel','panel-title','panel-copy','panel-eyebrow','panel-note','primary','records','rules','message'].forEach(id => { ui[id] = document.getElementById(id); });
  const start = () => scene.state === 'paused' ? scene.togglePause() : scene.startRun();
  ui.primary.addEventListener('click', start);
  ui.pause.addEventListener('click', () => scene.togglePause());
  ui.sound.addEventListener('click', () => { scene.sound.mute = !scene.sound.mute; ui.sound.textContent = scene.sound.mute ? 'Sound off' : 'Sound on'; ui.sound.setAttribute('aria-pressed', String(!scene.sound.mute)); });
  host.querySelectorAll('[data-control]').forEach(button => {
    const release = () => { const key = scene.cursors[button.dataset.control]; key.isDown = false; key.isUp = true; button.classList.remove('held'); };
    button.addEventListener('pointerdown', event => { if(scene.state !== 'running')return; event.preventDefault(); button.setPointerCapture(event.pointerId); const key=scene.cursors[button.dataset.control]; key.isDown=true;key.isUp=false;button.classList.add('held'); });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,release));
  });
  return ui;
}
