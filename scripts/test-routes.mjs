const routes = [
  '/',
  '/onboarding',
  '/dashboard',
  '/analysis?location=Kochi,%20Kerala&area=2&areaUnit=acres&soil=Loamy&water=Moderate&irrigation=Drip&season=Kharif',
  '/compare',
  '/simulator'
];

async function check() {
  console.log('Testing frontend routes...');
  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r);
      console.log(`[${res.status}] ${r}`);
    } catch (err) {
      console.error(`[ERR] ${r}:`, err.message);
    }
  }
}

check();
