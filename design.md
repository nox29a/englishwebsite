# AxonAI Design Guidelines

## Cel dokumentu
Ten dokument opisuje podstawowe zasady wizualne aplikacji AxonAI. Wytyczne koncentrują się na stworzeniu nowoczesnego, ciemnego interfejsu opartego na granatach (navy), czerni oraz półprzezroczystych warstwach.

## Paleta kolorów
| Rola | Kolor | HEX | Zastosowanie |
| --- | --- | --- | --- |
| Tło bazowe | Midnight Black | `#030712` | Gradienty tła, sekcje pełnoekranowe. |
| Tło akcentowe | Deep Navy | `#05143A` | Wypełnienia sekcji, przyciski typu ghost, duże CTA. |
| Akcent jasny | Royal Navy | `#1D4ED8` | Główne CTA, linki i wyróżnienia. |
| Akcent wtórny | Steel Blue | `#1E3A8A` | Stany hover CTA, gradienty kart. |
| Kontrastowy | Arctic Glow | `#E2E8F0` | Tekst nagłówków na ciemnym tle, delikatne elementy dekoracyjne. |
| Tekst pomocniczy | Mist Grey | `#94A3B8` | Opisy i tekst drugiego planu. |

### Przezroczystości
- `rgba(255, 255, 255, 0.06)` – powierzchnie kart i paneli.
- `rgba(255, 255, 255, 0.12)` – obramowania i stany hover.
- `rgba(3, 7, 18, 0.7)` – gradienty nakładkowe dla sekcji.
- `rgba(29, 78, 216, 0.15)` – subtelne poświaty i akcenty tła.

## Gradienty i tła
- **Tło strony**: `bg-gradient-to-br from-[#030712] via-[#050b1f] to-black`.
- **Akcent CTA**: `bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A]`, z hoverem `hover:from-[#1E40AF] hover:to-[#172554]`.
- **Karty / powierzchnie**: wykorzystuj `bg-white/5` z obramowaniem `border-white/10` oraz efektem `hover:bg-white/10`.
- **Poświata sekcji**: delikatne gradienty radialne z `rgba(29, 78, 216, 0.2)` i `rgba(15, 23, 42, 0)`.

## Typografia
- Nagłówki: jasny tekst (`text-slate-100`) na ciemnym tle, szerokie odstępy liter.
- Tekst pomocniczy: `text-slate-400` lub `text-slate-300` w zależności od kontrastu.
- Linki i CTA: `text-[#1D4ED8]` z animowanymi podkreśleniami lub ikonami.

## Komponenty
### Przyciski
- Dominujący przycisk: gradient Royal Navy (`from-[#1D4ED8] to-[#1E3A8A]`), zaokrąglone narożniki (`rounded-xl`), cienie `shadow-[0_10px_30px_rgba(29,78,216,0.35)]`.
- Przyciski drugorzędne: `bg-white/5`, `border border-white/10`, tekst `text-slate-200`.

### Karty i sekcje
- Używaj `backdrop-blur-md` dla nadania głębi.
- Ikony umieszczaj na tle `bg-gradient-to-br from-[#1D4ED8]/80 to-[#1E3A8A]/80` lub `bg-white/10`.
- Stany hover: zwiększenie skali do `hover:scale-[1.02]` i zmiana krycia tła na `hover:bg-white/10`.

### Stopka i paski informacyjne
- Tło: `bg-black/60` z `backdrop-blur-md`.
- Tekst: `text-slate-400`, nagłówki `text-slate-100`.

## Ikonografia
- Ikony liniowe w odcieniach `text-slate-100` lub `text-[#1D4ED8]`.
- Dla ważnych ikon używaj półprzezroczystych kapsuł `bg-[#1D4ED8]/20`.

## Animacje i efekty
- Delikatne `animate-pulse` lub `animate-[wiggle_3s_ease-in-out_infinite]` na dużych tłach.
- Subtelne rozmyte plamy światła w tle tworzone przez pseudo-elementy `before`/`after` lub absolutnie pozycjonowane divy z gradientami.

## Zastosowanie na stronie głównej
- Hero sekcja: pełnoekranowy gradient z półprzezroczystą poświatą Royal Navy oraz CTA z gradientem.
- Karty narzędzi: `bg-white/5` z `border-white/10`, nagłówki `text-slate-100`, opisy `text-slate-400`.
- Stopka: `bg-black/70`, `border-t border-white/10`, linki `hover:text-[#1D4ED8]`.

## Dostępność
- Zachowuj kontrast WCAG AA dla tekstu (np. `text-slate-100` na `bg-[#030712]`).
- Używaj wyraźnych stanów fokus (`ring-2 ring-[#1D4ED8]/50`).
- Unikaj nadmiernych efektów animacji; zachowaj możliwość łatwego odczytu treści.
