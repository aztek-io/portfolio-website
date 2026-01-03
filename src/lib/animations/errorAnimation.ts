/**
 * Error Page Ball Animation
 *
 * Displays an animated representation of HTTP status codes using bouncing balls.
 * Balls form digit patterns and respond to mouse interaction.
 */

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  origX: number;
  origY: number;
  radius: number;
}

// Digit font definitions - each digit is a 5x7 grid
// '#' = ball present, '.' = empty (visual representation)
const DIGIT_FONT: Record<string, string[]> = {
  '0': [
    '.###.',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '#...#',
    '.###.'
  ],
  '1': [
    '..#..',
    '.##..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '.###.'
  ],
  '2': [
    '.###.',
    '#...#',
    '....#',
    '..##.',
    '.#...',
    '#....',
    '#####'
  ],
  '3': [
    '.###.',
    '#...#',
    '....#',
    '..##.',
    '....#',
    '#...#',
    '.###.'
  ],
  '4': [
    '#...#',
    '#...#',
    '#...#',
    '#####',
    '....#',
    '....#',
    '....#'
  ],
  '5': [
    '#####',
    '#....',
    '####.',
    '....#',
    '....#',
    '#...#',
    '.###.'
  ],
  '6': [
    '.###.',
    '#....',
    '#....',
    '####.',
    '#...#',
    '#...#',
    '.###.'
  ],
  '7': [
    '#####',
    '....#',
    '...#.',
    '..#..',
    '..#..',
    '..#..',
    '..#..'
  ],
  '8': [
    '.###.',
    '#...#',
    '#...#',
    '.###.',
    '#...#',
    '#...#',
    '.###.'
  ],
  '9': [
    '.###.',
    '#...#',
    '#...#',
    '.####',
    '....#',
    '....#',
    '.###.'
  ]
};

/**
 * Reads animation colors from CSS custom properties
 */
function getAnimationColors(): string[] {
  const styles = getComputedStyle(document.documentElement);
  return [
    styles.getPropertyValue('--color-anim-blue').trim() || '#3b82f6',
    styles.getPropertyValue('--color-anim-yellow').trim() || '#f59e0b',
    styles.getPropertyValue('--color-anim-green').trim() || '#10b981',
    styles.getPropertyValue('--color-anim-pink').trim() || '#ec4899',
    styles.getPropertyValue('--color-anim-purple').trim() || '#8b5cf6'
  ];
}

function createBall(
  x: number,
  y: number,
  vx: number,
  vy: number,
  color: string,
  radius: number = 10
): Ball {
  return { x, y, vx, vy, color, origX: x, origY: y, radius };
}

function generateDigitPositions(
  digit: string,
  offsetX: number,
  offsetY: number,
  cellSize: number
): [number, number][] {
  const pattern = DIGIT_FONT[digit];
  if (!pattern) return [];

  return pattern.flatMap((row, rowIdx) =>
    [...row].flatMap((char, colIdx) =>
      char === '#'
        ? ([[offsetX + colIdx * cellSize, offsetY + rowIdx * cellSize]] as [number, number][])
        : []
    )
  );
}

function initBalls(canvasWidth: number, canvasHeight: number, statusCode: number): Ball[] {
  const balls: Ball[] = [];
  const digits = statusCode.toString().split('');
  const colors = getAnimationColors();

  // Layout configuration
  const cellSize = 12;
  const digitWidth = 5 * cellSize;
  const digitSpacing = 15;
  const totalWidth = digits.length * digitWidth + (digits.length - 1) * digitSpacing;

  // Center the digits on the canvas
  const startX = (canvasWidth - totalWidth) / 2;
  const startY = (canvasHeight - 7 * cellSize) / 2;

  // Scale factor for responsive sizing
  const scale = Math.min(1, canvasWidth / 400);
  const scaledRadius = Math.max(4, 8 * scale);

  digits.forEach((digit, index) => {
    const offsetX = startX + index * (digitWidth + digitSpacing);
    const color = colors[index % colors.length];
    const positions = generateDigitPositions(digit, offsetX, startY, cellSize);

    positions.forEach(([x, y]) => {
      balls.push(createBall(x, y, 0, 0, color, scaledRadius));
    });
  });

  return balls;
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function updateBalls(
  canvas: HTMLCanvasElement,
  balls: Ball[],
  timeDiff: number,
  mousePos: { x: number; y: number }
): void {
  const collisionDamper = 0.3;
  const floorFriction = 0.0005 * timeDiff;
  const mouseForceMultiplier = 1 * timeDiff;
  const restoreForce = 0.002 * timeDiff;

  for (const ball of balls) {
    // Set ball position based on velocity
    ball.y += ball.vy;
    ball.x += ball.vx;

    // Restore forces (pull back to original position)
    ball.vx += ball.x > ball.origX ? -restoreForce : restoreForce;
    ball.vy += ball.y > ball.origY ? -restoreForce : restoreForce;

    // Mouse forces (repel from cursor)
    const distX = ball.x - mousePos.x;
    const distY = ball.y - mousePos.y;
    const radius = Math.sqrt(distX * distX + distY * distY);
    const totalDist = Math.abs(distX) + Math.abs(distY);

    if (totalDist > 0 && radius > 0) {
      const forceX = (Math.abs(distX) / totalDist) * (1 / radius) * mouseForceMultiplier;
      const forceY = (Math.abs(distY) / totalDist) * (1 / radius) * mouseForceMultiplier;

      ball.vx += distX > 0 ? forceX : -forceX;
      ball.vy += distY > 0 ? forceY : -forceY;
    }

    // Floor friction
    if (ball.vx > 0) ball.vx -= floorFriction;
    else if (ball.vx < 0) ball.vx += floorFriction;
    if (ball.vy > 0) ball.vy -= floorFriction;
    else if (ball.vy < 0) ball.vy += floorFriction;

    // Collision detection with walls
    if (ball.y > canvas.height - ball.radius) {
      ball.y = canvas.height - ball.radius - 2;
      ball.vy *= -1 * (1 - collisionDamper);
    }
    if (ball.y < ball.radius) {
      ball.y = ball.radius + 2;
      ball.vy *= -1 * (1 - collisionDamper);
    }
    if (ball.x > canvas.width - ball.radius) {
      ball.x = canvas.width - ball.radius - 2;
      ball.vx *= -1 * (1 - collisionDamper);
    }
    if (ball.x < ball.radius) {
      ball.x = ball.radius + 2;
      ball.vx *= -1 * (1 - collisionDamper);
    }
  }
}

function render(context: CanvasRenderingContext2D, balls: Ball[]): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for (const ball of balls) {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
  }
}

/**
 * Sets up and starts the error page animation
 * @param canvas - The canvas element to render to
 * @param statusCode - The HTTP status code to display
 * @returns Cleanup function to stop the animation
 */
export function setupErrorAnimation(
  canvas: HTMLCanvasElement,
  statusCode: number
): () => void {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  // Size canvas to container
  const containerWidth = Math.min(600, window.innerWidth - 40);
  canvas.width = containerWidth;
  canvas.height = 200;

  // Initialize state
  const balls = initBalls(containerWidth, 200, statusCode);
  const mousePos = { x: 9999, y: 9999 };
  let lastTime = Date.now();
  let animationId: number;

  // Animation loop
  function animate(): void {
    const time = Date.now();
    const timeDiff = time - lastTime;
    lastTime = time;

    updateBalls(canvas, balls, timeDiff, mousePos);
    render(context!, balls);

    animationId = requestAnimationFrame(animate);
  }

  // Event handlers
  const handleMouseMove = (evt: MouseEvent): void => {
    const pos = getMousePos(canvas, evt);
    mousePos.x = pos.x;
    mousePos.y = pos.y;
  };

  const handleMouseOut = (): void => {
    mousePos.x = 9999;
    mousePos.y = 9999;
  };

  // Setup
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseout', handleMouseOut);
  animate();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseout', handleMouseOut);
  };
}
