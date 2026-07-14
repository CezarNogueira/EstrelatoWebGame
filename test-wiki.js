const https = require('https');

function getWikiLogo(teamName, lang = 'en') {
  return new Promise((resolve, reject) => {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(teamName)}&prop=pageimages&format=json&pithumbsize=200`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log('Flamengo:', await getWikiLogo('Clube de Regatas do Flamengo', 'pt'));
  console.log('Real Madrid:', await getWikiLogo('Real Madrid CF', 'en'));
  console.log('Arsenal:', await getWikiLogo('Arsenal F.C.', 'en'));
}
run();
