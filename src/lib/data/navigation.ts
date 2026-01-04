/**
 * Navigation Configuration
 *
 * Central source for all navigation links used in header and footer.
 */

export interface NavLink {
	label: string;
	url: string;
	external?: boolean;
}

export const navLinks: NavLink[] = [
	{ label: 'Home', url: '/' },
	{ label: 'About', url: '/about' },
	{ label: 'CI/CD', url: '/cicd' },
	{ label: 'Certifications', url: '/certs' },
	{ label: 'Error Demo', url: '/error-demo' },
	{ label: 'Resume', url: '/Resume.pdf', external: true }
];
