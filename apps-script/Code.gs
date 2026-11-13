/**
 * PRYM – obsługa formularza „Ocieplenia poddaszy”.
 * Wdrożenie: Google Apps Script > Wdróż > Nowe wdrożenie > Aplikacja internetowa.
 * Uruchom jako: ja; dostęp: każdy. URL /exec wklej w action formularza HTML.
 * Uwaga: dostęp „każdy” umożliwia publiczne zgłoszenia; używaj walidacji,
 * honeypota i monitoruj limity wysyłania wiadomości.
 */
const CONFIG = {
  recipient: 'Michnaszymon30@gmail.com',
  site: 'https://prym-rzeszow.pl',
  maxLength: 2000
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  try {
    // Pole-pułapka na proste boty (nigdy nie powinno być wypełnione).
    if (String(p._honey || '').trim()) return resultPage_('Dziękujemy', 'Zgłoszenie zostało przyjęte.');
    const name = clean_(p.name, 100);
    const phone = clean_(p.telefon, 30);
    const email = clean_(p.email, 120);
    const city = clean_(p.miejscowosc, 100);
    const type = clean_(p.rodzaj_prac, 100);
    const area = clean_(p.powierzchnia_m2, 12);
    const message = clean_(p.message, CONFIG.maxLength);
    if (!name || !phone || !city || !type || message.length < 15) {
      return resultPage_('Brakuje danych', 'Wróć do formularza i uzupełnij wymagane pola.');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return resultPage_('Nieprawidłowy e-mail', 'Popraw adres e-mail w formularzu.');
    }
    const allowedTypes = [
      'Ocieplenie nowego poddasza',
      'Docieplenie istniejącego poddasza',
      'Nie wiem – potrzebuję konsultacji'
    ];
    if (!allowedTypes.includes(type)) return resultPage_('Nieprawidłowe dane', 'Wybierz rodzaj prac ponownie.');
    if (area && (!/^\d+$/.test(area) || Number(area) < 1 || Number(area) > 10000)) {
      return resultPage_('Nieprawidłowa powierzchnia', 'Podaj powierzchnię w m².');
    }
    const lines = [
      'Nowe zapytanie z formularza PRYM – ocieplenia poddaszy',
      '',
      'Imię i nazwisko: ' + name,
      'Telefon: ' + phone,
      'E-mail: ' + (email || 'nie podano'),
      'Miejscowość: ' + city,
      'Rodzaj prac: ' + type,
      'Powierzchnia: ' + (area ? area + ' m²' : 'nie podano'),
      '',
      'Opis:',
      message
    ];
    MailApp.sendEmail({
      to: CONFIG.recipient,
      subject: 'PRYM: zapytanie o ocieplenie poddasza – ' + city,
      body: lines.join('\n'),
      name: 'Formularz PRYM',
      replyTo: email || CONFIG.recipient
    });
    return resultPage_('Dziękujemy za zapytanie!', 'Wiadomość została wysłana. Skontaktujemy się po zapoznaniu się z zakresem prac.');
  } catch (error) {
    console.error(error);
    return resultPage_('Nie udało się wysłać', 'Spróbuj ponownie lub zadzwoń: 723 290 565.');
  }
}

function clean_(value, max) {
  return String(value == null ? '' : value).trim().replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, max);
}
function resultPage_(title, message) {
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="pl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex,nofollow">' +
    '<title>' + safe(title) + ' | PRYM</title>' +
    '<style>body{font-family:Arial,sans-serif;margin:0;background:#f7f5f0;color:#202726}' +
    'main{max-width:720px;margin:12vh auto;padding:28px}h1{font-size:clamp(2rem,6vw,4rem)}' +
    'p{font-size:1.2rem;line-height:1.6}a{display:inline-block;background:#202726;color:white;' +
    'border-radius:40px;padding:14px 22px;text-decoration:none}</style></head><body><main>' +
    '<p>PRYM / RZESZÓW</p><h1>' + safe(title) + '</h1><p>' + safe(message) +
    '</p><a href="' + CONFIG.site + '/ocieplenia-poddaszy-rzeszow.html">Wróć na stronę PRYM</a>' +
    '</main></body></html>'
  ).setTitle(title + ' | PRYM');
}
