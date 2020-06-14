// September 30, 2019, by: Tom Liao
// based on:
// Azzalini, A. (1985). A class of distributions which inclues the normal ones. Scand. J. Statist.
// Azzalini, A. & Dalla Valle, A. (1996). The multivariate skew-normal distribution. Biometrika.

function randomNormals() {
  let u1 = 0,
    u2 = 0;

  //Convert [0,1) to (0,1)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const R = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  return [R * Math.cos(theta), R * Math.sin(theta)];
}

export function randomSkewNormal(loc, scale, shape = 0) {
  const [u0, v] = randomNormals();
  if (shape === 0) {
    return loc + scale * u0;
  }
  const corr = shape / Math.sqrt(1 + shape * shape);
  const u1 = corr * u0 + Math.sqrt(1 - corr * corr) * v;
  const z = u0 >= 0 ? u1 : -u1;
  return loc + scale * z;
}
