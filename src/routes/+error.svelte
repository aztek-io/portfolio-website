<script lang="ts">
  import { onMount } from 'svelte';

  export let error: { message?: string };
  export let status: number;

  onMount(() => {
    // Always show animation for error pages
    const canvas = document.getElementById('errorCanvas') as HTMLCanvasElement;
    if (canvas) {
        // Animation functions
        const requestAnimFrame = (function() {
          return window.requestAnimationFrame ||
                 (window as Window & {
                   webkitRequestAnimationFrame?: typeof window.requestAnimationFrame;
                   mozRequestAnimationFrame?: typeof window.requestAnimationFrame;
                   oRequestAnimationFrame?: typeof window.requestAnimationFrame;
                   msRequestAnimationFrame?: typeof window.requestAnimationFrame;
                 }).webkitRequestAnimationFrame ||
                 (window as Window & {
                   mozRequestAnimationFrame?: typeof window.requestAnimationFrame;
                 }).mozRequestAnimationFrame ||
                 (window as Window & {
                   oRequestAnimationFrame?: typeof window.requestAnimationFrame;
                 }).oRequestAnimationFrame ||
                 (window as Window & {
                   msRequestAnimationFrame?: typeof window.requestAnimationFrame;
                 }).msRequestAnimationFrame ||
          function(callback: FrameRequestCallback) {
            window.setTimeout(callback, 1000 / 60);
          };
        })();

        interface Ball {
          x: number;
          y: number;
          vx: number;
          vy: number;
          color: string;
          origX: number;
          origY: number;
          radius: number;
        }

        function createBall(x: number, y: number, vx: number, vy: number, color: string, radius: number = 10): Ball {
          return {
            x,
            y,
            vx,
            vy,
            color,
            origX: x,
            origY: y,
            radius
          };
        }

        function initBalls(canvasWidth: number, canvasHeight: number): Ball[] {
          const balls: Ball[] = [];
          const blue = '#3A5BCD';
          const yellow = '#EABF04';
          const green = '#009900';

          // Scale factor to fit the design (originally designed for 600px width)
          const scaleX = canvasWidth / 600;
          const scaleY = canvasHeight / 200;
          const scaledRadius = Math.max(4, 10 * Math.min(scaleX, scaleY)); // Minimum radius of 4px

          // First "4"
          const positions4_1 = [
            [183, 52], [183, 61], [183, 70], [183, 79], [183, 88], [183, 97], [183, 106], [183, 115], [183, 124], [183, 132],
            [192, 97], [174, 97], [165, 97], [156, 97], [147, 97], [147, 88], [147, 79], [147, 70], [147, 61], [147, 52]
          ];
          positions4_1.forEach(pos => balls.push(createBall(pos[0] * scaleX, pos[1] * scaleY, 0, 0, blue, scaledRadius)));

          // "0"
          const positions0 = [
            [250, 52], [243, 54], [257, 54], [236, 60], [264, 60], [229, 70], [271, 70], [229, 80], [271, 80],
            [229, 92], [271, 92], [271, 104], [229, 104], [271, 114], [229, 114], [264, 124], [236, 124], [257, 130], [243, 130], [250, 132]
          ];
          positions0.forEach(pos => balls.push(createBall(pos[0] * scaleX, pos[1] * scaleY, 0, 0, yellow, scaledRadius)));

          // Second "4"
          const offset = 160;
          const positions4_2 = [
            [183, 52], [183, 61], [183, 70], [183, 79], [183, 88], [183, 97], [183, 106], [183, 115], [183, 124], [183, 132],
            [192, 97], [174, 97], [165, 97], [156, 97], [147, 97], [147, 88], [147, 79], [147, 70], [147, 61], [147, 52]
          ];
          positions4_2.forEach(pos => balls.push(createBall((offset + pos[0]) * scaleX, pos[1] * scaleY, 0, 0, green, scaledRadius)));

          return balls;
        }

        function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
          const rect = canvas.getBoundingClientRect();
          return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
          };
        }

        function updateBalls(canvas: HTMLCanvasElement, balls: Ball[], timeDiff: number, mousePos: {x: number, y: number}) {
          const collisionDamper = 0.3;
          const floorFriction = 0.0005 * timeDiff;
          const mouseForceMultiplier = 1 * timeDiff;
          const restoreForce = 0.002 * timeDiff;

          for(let n = 0; n < balls.length; n++) {
            const ball = balls[n];

            // Set ball position based on velocity
            ball.y += ball.vy;
            ball.x += ball.vx;

            // Restore forces
            if(ball.x > ball.origX) {
              ball.vx -= restoreForce;
            } else {
              ball.vx += restoreForce;
            }
            if(ball.y > ball.origY) {
              ball.vy -= restoreForce;
            } else {
              ball.vy += restoreForce;
            }

            // Mouse forces
            const distX = ball.x - mousePos.x;
            const distY = ball.y - mousePos.y;
            const radius = Math.sqrt(distX * distX + distY * distY);
            const totalDist = Math.abs(distX) + Math.abs(distY);

            if (totalDist > 0 && radius > 0) {
              const forceX = (Math.abs(distX) / totalDist) * (1 / radius) * mouseForceMultiplier;
              const forceY = (Math.abs(distY) / totalDist) * (1 / radius) * mouseForceMultiplier;

              if(distX > 0) {
                ball.vx += forceX;
              } else {
                ball.vx -= forceX;
              }
              if(distY > 0) {
                ball.vy += forceY;
              } else {
                ball.vy -= forceY;
              }
            }

            // Floor friction
            if(ball.vx > 0) {
              ball.vx -= floorFriction;
            } else if(ball.vx < 0) {
              ball.vx += floorFriction;
            }
            if(ball.vy > 0) {
              ball.vy -= floorFriction;
            } else if(ball.vy < 0) {
              ball.vy += floorFriction;
            }

            // Collision detection
            if(ball.y > (canvas.height - ball.radius)) {
              ball.y = canvas.height - ball.radius - 2;
              ball.vy *= -1 * (1 - collisionDamper);
            }
            if(ball.y < ball.radius) {
              ball.y = ball.radius + 2;
              ball.vy *= -1 * (1 - collisionDamper);
            }
            if(ball.x > (canvas.width - ball.radius)) {
              ball.x = canvas.width - ball.radius - 2;
              ball.vx *= -1 * (1 - collisionDamper);
            }
            if(ball.x < ball.radius) {
              ball.x = ball.radius + 2;
              ball.vx *= -1 * (1 - collisionDamper);
            }
          }
        }

        function animate(canvas: HTMLCanvasElement, balls: Ball[], lastTime: number, mousePos: {x: number, y: number}) {
          const context = canvas.getContext('2d');
          if (!context) return;

          // Update
          const time = Date.now();
          const timeDiff = time - lastTime;
          updateBalls(canvas, balls, timeDiff, mousePos);
          lastTime = time;

          // Clear and render
          context.clearRect(0, 0, canvas.width, canvas.height);

          for(let n = 0; n < balls.length; n++) {
            const ball = balls[n];
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
            context.fillStyle = ball.color;
            context.fill();
          }

          // Request new frame
          requestAnimFrame(() => animate(canvas, balls, lastTime, mousePos));
        }

        // Initialize animation
        const containerWidth = Math.min(600, window.innerWidth - 40);
        canvas.width = containerWidth;
        canvas.height = 200;

        const balls = initBalls(containerWidth, 200);
        const mousePos = { x: 9999, y: 9999 };

        canvas.addEventListener('mousemove', (evt: MouseEvent) => {
          const pos = getMousePos(canvas, evt);
          mousePos.x = pos.x;
          mousePos.y = pos.y;
        });

        canvas.addEventListener('mouseout', () => {
          mousePos.x = 9999;
          mousePos.y = 9999;
        });

        animate(canvas, balls, Date.now(), mousePos);
      }
  });
</script>

<svelte:head>
  <title>{status} - Error</title>
</svelte:head>

<div class="error-container">
  <div class="canvas-container">
    <canvas id="errorCanvas" width="600" height="200"></canvas>
  </div>
  <div class="error-content content-container text-center">
    {#if status === 404}
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for seems to have wandered off. Watch the bouncing balls spell out your error!</p>
    {:else}
      <h1>{status}</h1>
      <p>{error?.message || 'An unexpected error occurred'}</p>
    {/if}
    <p>
      <a href="/" class="btn btn-primary">← Back to Home</a>
    </p>
  </div>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: var(--spacing-xl);
    text-align: center;
  }

  .canvas-container {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--border-radius-md);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  #errorCanvas {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-sm);
  }

  .error-content {
    max-width: 600px;
  }

  .error-content h1,
  .error-content h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-3xl);
  }

  .error-content p {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    line-height: var(--line-height-normal);
    margin-bottom: var(--spacing-md);
  }

  /* Dark mode adjustments for canvas */
  :global(.dark .canvas-container) {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark #errorCanvas) {
    background: rgba(30, 41, 59, 0.5);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .error-container {
      padding: var(--spacing-md);
    }

    #errorCanvas {
      width: 100%;
      max-width: 400px;
      height: 150px;
    }

    .error-content h1,
    .error-content h2 {
      font-size: var(--font-size-2xl);
    }

    .error-content p {
      font-size: var(--font-size-base);
    }

    .canvas-container {
      padding: var(--spacing-sm);
    }
  }
</style>
