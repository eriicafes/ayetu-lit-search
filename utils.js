export function debounce(fn, duration) {
  let timer = null;

  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), duration);
  };
}
