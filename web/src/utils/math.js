export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function lerpVector(start, end, t) {
  return start.map((v, i) => lerp(v, end[i], t));
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function normalize(vector) {
  const length = Math.sqrt(
    vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2
  );
  if (length < 1e-6) return [0, 0, 0];
  return vector.map(v => v / length);
}
