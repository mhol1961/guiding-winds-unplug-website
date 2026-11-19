// Pause/play button for background videos (WCAG 2.2.2). Markup lives in
// src/components/shared/VideoToggle.astro; each page decides what pausing does.
// Returns a setter so the page can sync the button to the video's real state.
export function wireToggle(btn: HTMLButtonElement, onChange: (paused: boolean) => void) {
  const label = btn.querySelector('[data-label]');
  const set = (paused: boolean) => {
    btn.dataset.paused = String(paused);
    btn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    if (label) label.textContent = paused ? 'Play' : 'Pause';
  };
  btn.addEventListener('click', () => {
    const paused = btn.dataset.paused !== 'true';
    set(paused);
    onChange(paused);
  });
  set(false);
  btn.hidden = false;
  return set;
}
