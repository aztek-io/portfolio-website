# AGENTS.md

Instructions for AI agents working with this codebase.

## Code Style Guidelines

### Emoji
- **Do not use emoji characters in scripts, source code, or test output**
- Use proper logging libraries (Winston) with ANSI color codes for log levels
- Emoji may be used sparingly in documentation (README, AGENTS.md) for visual clarity

### Logging
- Use Winston for structured logging with ANSI colors
- Test output uses `tests/logger.ts` wrapper for consistent formatting
- Log levels: `error` (red), `warn` (yellow), `info` (green), `debug` (blue)

### Linting Exceptions
- All linting warnings must be resolved before committing
- If a linting issue cannot be fixed due to a valid functional reason, the human operator may approve ignoring it
- Once approved by the human operator, AI agents should add the appropriate ignore comment with an explanation:
  - **shellcheck**: `# shellcheck disable=SCXXXX # Reason for ignoring`
  - **ESLint**: `// eslint-disable-next-line rule-name -- Reason for ignoring`
  - **hadolint**: `# hadolint ignore=DLXXXX`
  - **TypeScript**: `// @ts-expect-error Reason for ignoring`
- Never add ignore comments without explicit human approval

## Project Overview

This is a SvelteKit 5 static portfolio site deployed to AWS S3 + CloudFront at `cdn.aztek.io`. The apex domain `aztek.io` redirects here.

## Tech Stack

- **Framework**: SvelteKit 5 with TypeScript
- **Styling**: Custom CSS (no framework) - see `src/lib/styles/design-system.css`
- **Build**: Vite with `@sveltejs/adapter-static`
- **Deployment**: S3 bucket `cdn.aztek.io` + CloudFront distribution `E6X0JGRX63W96`
- **Local Dev**: `docker compose up --build -d` or `npm run dev`

## Key Files

| File | Purpose |
|------|---------|
| `src/routes/+layout.ts` | Global config - `prerender: true`, `trailingSlash: 'always'` |
| `src/lib/data/certs.ts` | Certification data (dates, titles, PDF paths) |
| `svelte.config.js` | Adapter config - outputs to `build/` |
| `nginx.conf` | Local nginx config mimicking S3 behavior |

## Important Patterns

### Routing
- Uses `trailingSlash: 'always'` so `/certs` becomes `/certs/index.html`
- This is required for S3 static hosting to resolve paths correctly
- All routes have `prerender = true` for static generation

### Error Handling
- CloudFront custom error response serves `/certs/index.html` for 404s (temporary hack)
- S3 bucket website config also points errors to `certs/index.html`
- Catch-all route at `src/routes/[...catchall]/+page.ts` handles client-side 404s

### Static Assets
- Certificate PDFs go in `static/certs/` (copied to `build/certs/`)
- Favicons and manifest in `static/`

### Social Media Icons
- Located in `src/lib/assets/` as `.svg` files
- Icons use hardcoded fill color `#cbd5e1` matching `--color-footer-text-muted`
- If brand colors change, update both:
  - `--color-footer-text-muted` in `src/lib/styles/design-system.css`
  - `fill` attribute in all `src/lib/assets/*.svg` icon files

## AWS Resources

| Resource | ID/Name |
|----------|---------|
| S3 Bucket (site) | `cdn.aztek.io` |
| S3 Bucket (redirect) | `aztek.io` |
| CloudFront (cdn) | `E6X0JGRX63W96` |
| CloudFront (apex redirect) | `E342KA6NUOJVTZ` |
| Route53 Zone | `Z1ITL1EF2GOI1` |
| ACM Cert (cdn) | `55e0dc07-aaa1-4958-af23-1fe95768141e` |
| ACM Cert (apex) | `5fcb4c05-3fde-4509-b6ae-072210f304b5` |
| AWS Profile | `aztek-org` |

### Apex Domain Redirect (aztek.io → cdn.aztek.io)
- **S3 Bucket**: `aztek.io` configured with `RedirectAllRequestsTo` pointing to `cdn.aztek.io` over HTTPS
- **CloudFront**: `E342KA6NUOJVTZ` (`d3q01u8w6pp2do.cloudfront.net`) serves the redirect with TLS
- **Route53**: A record alias for `aztek.io` pointing to the CloudFront distribution
- **Origin**: Uses S3 website endpoint `aztek.io.s3-website-us-west-2.amazonaws.com` with HTTP-only origin protocol

## Common Tasks

**CRITICAL: Always build first, then sync `build/` directory - NEVER sync `static/` with `--delete`!**

The build process copies files from `static/` into `build/` and generates all HTML/JS/CSS. Syncing `static/` to S3 would delete all the generated site content.

### Add a new page
1. Create `src/routes/newpage/+page.svelte`
2. Add `+page.ts` with `export const prerender = true`
3. Update nav in `src/routes/+layout.svelte`
4. Test locally with `docker compose up --build -d`
5. Build and deploy

### Update certifications
Edit `src/lib/data/certs.ts` - keep sorted newest to oldest

### Fix routing issues
Ensure `trailingSlash: 'always'` is set in `+layout.ts` and rebuild

### Local testing
```bash
# Start the site locally (builds and runs nginx container on port 8080)
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the site
docker compose down
```

Visit http://localhost:8080 to test the site.

## Security Requirements

**MANDATORY: Security scans MUST be run after every Docker build and after implementing any new feature.**

### Run security and quality scans
```bash
# 1. Dependency audit (fix non-breaking vulnerabilities)
npm audit
npm audit fix

# 2. Linting (ESLint) and type checking (svelte-check)
npm run lint
npm run check

# 3. Shell script linting (shellcheck)
find . -name "*.sh" | while read -r SCRIPT; do shellcheck "$SCRIPT"; done

# 4. Run Selenium E2E tests (MANDATORY - requires local site running)
docker compose up --build -d
npm test
docker compose down

# 5. Dockerfile linting (hadolint)
hadolint Dockerfile

# 6. Trivy filesystem scan (vulnerabilities, secrets, misconfigurations)
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL .

# 7. Build Docker image and scan it
docker build -t cdn-website:latest .
trivy image --severity HIGH,CRITICAL cdn-website:latest

# 8. SonarQube code quality analysis (MANDATORY)
bash scripts/sonarqube-scan.sh
```

**All HIGH/CRITICAL issues must be resolved before deployment.**
**All linting errors and warnings must be resolved before committing.**

### When to run security and quality scans
- **After every Docker build** - Always scan the image before deploying
- **After implementing new features** - Run full security suite before committing
- **Before production deployment** - Final security check as part of deployment workflow
- **When updating dependencies** - Verify no new vulnerabilities introduced
- **All linting warnings must be addressed** - Zero tolerance for code quality warnings
- **Shell scripts must pass shellcheck** - No warnings allowed in scripts/*.sh
- **Selenium E2E tests must pass** - All 20 tests must pass before deployment
- **SonarQube analysis required** - No new code smells, bugs, or vulnerabilities allowed

### Check for code smells with SonarQube (MANDATORY)
Run the SonarQube scan script to check code quality before deploying:

```bash
# Run the automated SonarQube scan
bash scripts/sonarqube-scan.sh

# To stop SonarQube after the scan completes
bash scripts/sonarqube-scan.sh --stop

# View results at http://localhost:9000/dashboard?id=cdn-website
```

The script automatically handles:
- Starting SonarQube container (or using existing one)
- Waiting for SonarQube to be ready
- Setting up authentication and project
- Running the analysis
- Caching tokens for future runs

### Complete build and deployment workflow
```bash
# 0. Copy latest resume from source repo (MANDATORY before builds)
cp -a ../../Documents/resume/Resume.pdf ./static/Resume.pdf

# 1. Run security scans (MANDATORY)
npm audit && npm audit fix
npm run lint
npm run check
hadolint Dockerfile
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL .

# 2. Run Selenium E2E tests (MANDATORY)
docker compose up --build -d
npm test
# All 20 tests must pass before proceeding

# 3. Run SonarQube analysis (MANDATORY)
# Follow steps in "Check for code smells with SonarQube" section
# No new code smells, bugs, or vulnerabilities allowed

# 4. Build the site (only after all tests pass)
npm run build
docker compose down

# 5. Deploy to S3
aws s3 sync build/ s3://cdn.aztek.io --delete --acl public-read --profile aztek-org

# 6. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E6X0JGRX63W96 --paths "/*" --profile aztek-org
```

### Docker build and deployment workflow
```baLint Dockerfile (MANDATORY)
hadolint Dockerfile

# 2. Build Docker image
docker build -t cdn-website:latest .

# 3. Security scan image (MANDATORY)
trivy image --severity HIGH,CRITICAL cdn-website:latest

# 4
# 3. Only proceed if scan shows 0 HIGH/CRITICAL vulnerabilities
# Deploy container as needed
```

## Don't Do

- **NEVER sync `static/` to S3 with `--delete`** - this will delete all generated HTML/JS/CSS and destroy the website
- **ALWAYS sync `build/` directory** after running `npm run build`
- Don't use `cat << EOF` heredocs in terminal - crashes the VS Code terminal
- Don't forget to invalidate CloudFront after S3 deploy
- Don't put files in `/tmp` - use workspace directory and clean up after
