+# Raport końcowy — modernizacja PRYM

Data audytu: 13 października 2026  
Gałąź: `codex/prym-kompleksowy-audyt-seo`

## A. Stan początkowy

- `main` wskazywał na merge PR #5 (`1b81691`). Końcowy commit gałęzi PR #5 był drugim rodzicem merge, więc poprawki z tej gałęzi znajdowały się już na `main`.
- Pozostałe zdalne gałęzie były starsze i nie zawierały późniejszych poprawek wymagających przeniesienia.
- Strona łączyła ukryte widoki sterowane hashem z osobnymi podstronami usług, co powodowało duplikację treści i niespójną nawigację.
- Menu strony głównej nie zawierało bezpośredniego linku do strony „Ocieplenia”, a galeria prowadziła do starych widoków hash.
- JavaScript nadpisywał tytuł dokumentu i dodawał tekst „Projekt do akceptacji”.
- Publicznie widoczne były komunikaty wykonawcze i demonstracyjne.
- Formularz jedynie kopiował tekst, ale komunikacja o jego ograniczeniach i prywatności była niespójna.
- Podstrony usług nie miały pełnych metadanych Open Graph.
- Galeria zawierała prawidłowe miniatury WebP, lecz część deklarowanych wymiarów HTML nie odpowiadała wymiarom plików.

## B. Wprowadzone poprawki

- `index.html`: uproszczono stronę do jednej indeksowalnej strony głównej z sekcjami; usunięto powielone widoki usług; przebudowano ofertę, kontakt i linkowanie.
- `elewacje-rzeszow.html`, `ocieplenia-rzeszow.html`, `druk-scienny.html`: ujednolicono strukturę, nawigację, treść, CTA, metadane i dostępność.
- `realizacje.html`: usunięto komunikaty demonstracyjne, naprawiono menu i linki, uzupełniono metadane i rzeczywiste wymiary obrazów.
- `assets/styles.css`: wspólny responsywny system wizualny, menu mobilne, widoczne stany fokusu, skip link, ograniczenie animacji.
- `assets/site.js`: menu mobilne; walidowany formularz z honeypotem i minimalnym czasem wypełnienia; jawny brak wysyłki; obsługa galerii.
- `DO_POTWIERDZENIA.md`: lista brakujących danych właściciela i blokad aktywacji pełnego kontaktu.
- `tests/audit.mjs`, `tests/browser.mjs`, `package.json`: powtarzalne testy statyczne i przeglądarkowe.

## C. SEO

Każda z 5 indeksowalnych stron ma unikalny `title`, opis, canonical, jedno H1, `lang="pl"`, `index,follow,max-image-preview:large` i zestaw Open Graph. Strona główna zawiera zgodny składniowo JSON-LD typu `GeneralContractor`, bez niepotwierdzonego telefonu, adresu, ocen, godzin i współrzędnych. Sitemap obejmuje dokładnie 5 docelowych adresów. Nie zmieniono DNS ani Search Console.

Sprawdzenie produkcji wykazało: HTTP i obie wersje `www` przekierowują 301 do `https://prym-rzeszow.pl/`; pięć docelowych adresów zwraca 200; próbny nieistniejący adres zwraca 404.

Aktualne wyniki wyszukiwania wskazują, że konkurenci eksponują szeroki zakres usług, rozbudowane realizacje, dane kontaktowe, proces wyceny, opinie i marki materiałów. PRYM nie powinien kopiować niepotwierdzonych deklaracji. Przewagą po zmianach jest lekka architektura, czytelna galeria, konkretne dane potrzebne do wyceny oraz uczciwe oznaczenie brakującego kanału kontaktu. Przykłady sprawdzonych wyników: [DADEX](https://www.dadex.pl/), [Techno-term](https://techno-term.pl/), [Malpol](https://www.malpol.eu/), [PionDruk](https://pionowydrukscienny.pl/) i [Lukfer](https://lukfer.pl/).

## D. Galeria

- 34 fotografie pełne + 34 miniatury = 68 plików WebP.
- 0 identycznych duplikatów SHA-256.
- 0 błędnych odwołań i 0 nieużywanych plików.
- Miniatury: 1,07 MiB łącznie; obrazy pełne: 5,60 MiB łącznie.
- Miniatury są ładowane leniwie i asynchronicznie; pełne obrazy dopiero po otwarciu.
- Atrybuty `width` i `height` dopasowano do faktycznych wymiarów plików.
- Nie pogrupowano zdjęć według inwestycji, ponieważ repozytorium nie zawiera wiarygodnego mapowania.

## E. Testy

- `npm test`: metadane, canonical, H1, komunikaty demo, zasoby, sitemap, JSON-LD, SHA-256 i wymiary WebP — zaliczone.
- `npm run test:browser`: Chrome/Playwright przy 375, 768 i 1440 px dla wszystkich 5 stron — 15/15 odpowiedzi 200, brak poziomego przewijania i błędów konsoli.
- Test interakcji: menu mobilne, link do Ociepleń, walidacja i komunikat formularza, otwarcie/zamknięcie galerii — zaliczone.
- `git diff --check` — zaliczone.
- Lighthouse/PageSpeed nie został uruchomiony: Lighthouse nie jest zainstalowany w środowisku, a zmian nie opublikowano. Nie podano fikcyjnych wyników ani terenowego INP.

## F. Problemy nierozwiązane

Pełna wysyłka formularza pozostaje zablokowana do czasu podania zatwierdzonego adresu odbiorczego i wyboru usługi formularzowej. Wymagają potwierdzenia także: publiczny telefon/e-mail/adres, materiały i technologie, gwarancje, terminy, prawa do zdjęć, grupowanie zdjęć według inwestycji oraz parametry druku ściennego. Szczegóły są w `DO_POTWIERDZENIA.md`.

## G. Publikacja

Zmiany przygotowano na osobnej gałęzi. Pull Request #6: https://github.com/operio777/prym-website/pull/6. PR jest skierowany do `main` i nie został zmergowany. Należy sprawdzić kartę Files changed, wyniki testów oraz preview, a następnie wykonać merge dopiero po akceptacji właściciela.

## H. Następne działania po wdrożeniu

1. Uzupełnić zatwierdzone dane kontaktowe i aktywować wysyłkę formularza wraz z właściwą informacją RODO.
2. Potwierdzić dane biznesowe z `DO_POTWIERDZENIA.md`.
3. Po wdrożeniu uruchomić Lighthouse/PageSpeed dla wszystkich typów stron.
4. W Search Console sprawdzić odczyt sitemap, indeksowanie pięciu adresów, canonical i ewentualne błędy.
5. Przetestować rzeczywistą dostawę formularza oraz zabezpieczenia antyspamowe.
6. Zebrać od właściciela mapowanie fotografii do inwestycji i dodać wiarygodne grupy/opisy.


