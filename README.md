# Portfolio Website

A modern, responsive portfolio website built with SvelteKit 5, featuring a clean design, dark mode support, and mobile-friendly navigation. The site showcases professional experience, certifications, and includes robust 404 handling.

See the result here: [https://cdn.aztek.io](https://cdn.aztek.io)

## 🚀 Features

- **Modern Tech Stack**: SvelteKit 5 with TypeScript
- **Responsive Design**: Mobile-first approach with collapsible navigation
- **Dark Mode**: Toggle between light and dark themes
- **Static Site Generation**: Pre-rendered for optimal performance
- **Docker Deployment**: Containerized with nginx for production
- **SEO Optimized**: Proper meta tags, robots.txt, and sitemap-ready
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Professional Portfolio**: Dedicated sections for about, certifications, and resume

## 🏗️ Architecture

- **Frontend**: SvelteKit 5 with TypeScript
- **Styling**: Custom CSS with design system
- **Build**: Vite with static adapter
- **Deployment**: S3 + Cloudfront
- **Error Handling**: Server-side 404 handling with catch-all routes

## 📁 Project Structure

```
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          # Root layout with header/footer
│   │   ├── +layout.ts              # Global layout configuration
│   │   ├── +error.svelte           # Error page with animated background
│   │   ├── +page.svelte            # Home page
│   │   ├── about/+page.svelte      # About page
│   │   ├── certs/+page.svelte      # Certifications page
│   │   └── [...catchall]/+page.ts  # 404 handler for unknown routes
│   ├── lib/
│   │   ├── data/certs.ts           # Certification data
│   │   └── styles/design-system.css # Global styles and design tokens
│   ├── app.html                    # HTML template
│   └── app.d.ts                    # TypeScript declarations
├── static/
│   ├── certs/                      # Certificate PDFs
│   ├── favicon.svg                 # Site favicon (multiple sizes)
│   ├── robots.txt                  # SEO crawling rules
│   └── manifest.json               # PWA manifest
├── docker-compose.yml              # Development/production setup
├── Dockerfile                      # Production container
└── nginx.conf                      # nginx configuration to mimic s3 locally
```

## 🛠️ Development

### Prerequisites

- Node.js 22+ and npm
- Docker and Docker Compose (for containerized development)

### Setup

#### Docker Compose (Recommended)

``` bash
docker compose up --build
```

#### Node.js

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cdn-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start server**
   ```bash
   npm run dev
   ```

   Or open in browser automatically:
   ```bash
   npm run dev -- --open
   ```

4. **View the site**
   - Local development: http://localhost:5173
   - Docker development: http://localhost:8080

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run TypeScript and Svelte checks
- `npm run check:watch` - Run checks in watch mode

## 🐳 Docker Development

For a production-like environment:

### Build and start the container
``` bash
docker compose up --build
```

### Start in detached mode
``` bash
docker compose up -d
```

### View logs
``` bash
docker compose logs -f
```

### Stop containers
``` bash
docker compose down
```

## 🚀 Deployment

### Building for Production

``` bash
npm run build
```

``` bash
aws s3 sync build/ s3://cdn.aztek.io --delete --acl public-read --profile aztek-org
```

## 🎨 Customization

### Adding New Pages

1. Create a new directory in `src/routes/`
2. Add `+page.svelte` for the page component
3. Optionally add `+page.ts` for page-specific logic
4. Update navigation in `src/routes/+layout.svelte`

### Updating Certifications

Edit `src/lib/data/certs.ts` to add or modify certifications:

```typescript
export const certs: CertMeta[] = [
  {
    title: "New Certification",
    issuer: "Issuing Organization",
    date: "2024",
    filename: "new-cert.pdf"
  }
];
```

Add the PDF file to `static/certs/`.

### Styling

The design system is centralized in `src/lib/styles/design-system.css`:
- CSS custom properties for colors, spacing, typography
- Dark mode support via CSS custom properties
- Responsive breakpoints and utilities

### SEO and Meta Tags

Update meta tags in `src/app.html` and ensure proper OpenGraph tags are set for social sharing.

## 🔧 Configuration

### nginx Configuration

The `nginx.conf` file handles:
- Static file serving with proper caching headers
- SPA routing with fallback to `index.html`
- Security headers
- Gzip compression

### SvelteKit Configuration

`svelte.config.js` includes:
- Static adapter for pre-rendering
- Error handling for 404 pages during build
- Custom fallback handling

## 🐛 Error Handling

The site includes comprehensive error handling:

- **404 Pages**: Catch-all route (`[...catchall]/+page.ts`) handles unknown URLs
- **Error Page**: Custom error page (`+error.svelte`) with animated background
- **Build-time**: Proper handling of 404s during static generation

## 🔒 Security

- Security headers configured in nginx
- robots.txt configured to allow search engines but block AI crawlers
- No sensitive data in client-side code
- Static site eliminates server-side vulnerabilities

## 📈 Performance

- **Static Generation**: Pre-rendered at build time
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Images and assets optimized by Vite
- **Caching**: Proper cache headers for static assets
- **Bundle Analysis**: Use `npm run build` to see bundle sizes

## 🧪 Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

To test Docker build:

```bash
docker-compose up --build
```

## 📝 Recent Updates

See `CLEANUP_SUMMARY.md` for details on recent optimizations and cleanup performed on the codebase.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and for portfolio purposes.
