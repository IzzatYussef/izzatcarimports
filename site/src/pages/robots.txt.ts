export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /dados/\n\nSitemap: https://izzatcarimports.com.br/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
