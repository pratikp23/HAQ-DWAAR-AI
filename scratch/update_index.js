import fs from 'fs';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏛️</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>हकद्वार • HaqDwaar AI - Scheme se Application Tak</title>
    <meta name="description" content="National Citizen Welfare & Entitlement Gateway. Empowering citizens to discover, prepare, and reach official government benefits." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#f7f5fa] text-[#0f172a] antialiased selection:bg-[#591d8f] selection:text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

fs.writeFileSync('client/index.html', htmlContent, 'utf8');
console.log('client/index.html successfully updated');
