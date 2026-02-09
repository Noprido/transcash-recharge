function rewriteUrl(url, targetOrigin, proxyUrl) {
  if (!url) return url;
  
  // Ignorer les ancres, javascript:, mailto:, tel:, data:
  if (url.startsWith('#') || 
      url.startsWith('javascript:') || 
      url.startsWith('mailto:') || 
      url.startsWith('tel:') ||
      url.startsWith('data:')) {
    return url;
  }
  
  // 1️⃣ URL absolue pointant vers le site cible
  // https://www.example.com/page → http://localhost:8080/page
  if (url.startsWith(targetOrigin)) {
    return url.replace(targetOrigin, proxyUrl);
  }
  
  // 2️⃣ URL absolue avec protocole (autre domaine)
  // https://google.com → laisser tel quel
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Ne pas proxy les liens externes
  }
  
  // 3️⃣ URL relative commençant par /
  // /about → http://localhost:8080/about
  if (url.startsWith('/')) {
    return proxyUrl + url;
  }
  
  // 4️⃣ URL relative sans /
  // about.html → Ne pas modifier (relatif au path actuel)
  return url;
}


module.exports = rewriteUrl;