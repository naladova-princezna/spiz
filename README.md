# Spíž – inventář a spotřeba

Samostatná offline PWA pro inventář potravin s hlídáním data spotřeby, skenováním
čárových kódů (kamera i z fotky), ručním zadáním a synchronizací přes web.
Funguje na PC, iOS i Androidu. Není nijak propojená s LactoSTOP.

## Soubory
- `index.html` – celá aplikace
- `sw.js` – service worker (offline režim)
- `manifest.json` – PWA manifest
- `html5-qrcode.min.js` – knihovna na čtení kódů (uložená lokálně → čte i offline)
- `data.json` – sdílená data na webu (výchozí je prázdné)
- `icon-*.png`, `apple-touch-icon.png`, `favicon-32.png` – ikony

## Nasazení na GitHub Pages
1. Vytvoř repozitář (např. `spiz`) a nahraj do něj **všechny** soubory z této složky (do kořene).
2. V repozitáři: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   větev `main`, složka `/ (root)`, ulož.
3. Aplikace poběží na `https://<uživatel>.github.io/spiz/`.
4. Na telefonu otevři adresu v prohlížeči a přidej na plochu:
   - **iOS (Safari):** Sdílet → *Přidat na plochu*
   - **Android (Chrome):** menu ⋮ → *Přidat na plochu / Nainstalovat aplikaci*

> HTTPS má GitHub Pages automaticky – kamera i notifikace ho vyžadují, takže je vše připravené.

## Jak funguje přenos dat na web
- **Stáhnout z webu** (záložka *Web*) načte `data.json` uložený vedle aplikace.
  Můžeš zvolit *Sloučit* (doplní/aktualizuje) nebo *Nahradit*.
- **Nahrát na web** má dvě cesty:
  - **Ručně:** *Exportovat data.json* → soubor v repozitáři přepíšeš / commitneš.
  - **Automaticky (GitHub):** vyplň v *Nastavení* přístup a klikni *Nahrát na web* –
    aplikace zapíše `data.json` přímo do repozitáře přes GitHub API.

### GitHub token (pro automatické nahrávání)
1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** jen tvůj repozitář `spiz`.
3. **Permissions → Repository permissions → Contents: Read and write**.
4. Vygenerovaný token vlož v aplikaci do *Nastavení → Web (GitHub) synchronizace*
   spolu s uživatelem, názvem repozitáře, větví (`main`) a cestou (`data.json`).

> Token se ukládá **jen v tomto prohlížeči** (localStorage). Nedávej ho na sdílené zařízení.

## Poznámky k notifikacím
- Spolehlivě se zkontrolují **při otevření** aplikace (a tlačítkem *Zkontrolovat spotřebu teď*).
- Systémová oznámení „na pozadí“ statický web nezaručuje; na iPhonu navíc fungují jen
  po *Přidat na plochu* a v iOS 16.4+.

## Aktualizace aplikace
Když upravíš soubory, zvyš verzi cache v `sw.js` (`const CACHE = 'spiz-v2'` …),
aby si prohlížeč stáhl novou verzi.
