---
name: icons
description: Select and reference icons from WaveMaker-supported icon sets (Streamline, WavIcon, Font Awesome). Use whenever adding an icon to markup to confirm the correct icon name and class format.
---

# Skill: Icons

## Icon Sets Available
WaveMaker supports few icon sets. Always prefer **Streamline** first. Fall back to **WavIcon** or **Font Awesome** only when the required icon does not exist in Streamline.

---

## Core Rules (STRICT)

1. **Single Icon System per Screen**
   - Do NOT mix icon styles (outline + filled + different libraries) within the same screen.
   - Maintain visual consistency across all components.

2. **No Hallucination**
   - NEVER invent icon names.
   - Use ONLY icons from the provided lists.

3. **Fallback Order is Mandatory**
   - Always follow the defined priority order.
   - Do NOT skip levels unless the icon is unavailable.

4. **Variant Discipline (Streamline only)**
   - Light (`wm-sl-l`) → secondary, subtle, decorative
   - Regular (`wm-sl-r`) → primary actions, navigation, emphasis
   - Do NOT mix Light and Regular randomly.

---

## Icon Priority

```
Need an icon?
│
▼
1. Check Streamline (Primary System)
   → Found? → Use Streamline
   │ Not found
   ▼
2. Check Wavicon (WaveMaker Semantic Icons)
   → Found? → Use Wavicon
   │ Not found
   ▼
3. Use Font Awesome (Fallback Only)
```

---

## 1. Streamline Icons (PRIMARY SYSTEM)

### Class Format
```
iconclass="<prefix> sl-<icon-name>"
```

| Variant | Prefix    | Usage |
|---------|-----------|-------|
| Light   | `wm-sl-l` | Secondary, subtle, low emphasis |
| Regular | `wm-sl-r` | Primary actions, navigation, emphasis |

### Rules
- ALWAYS include both prefix and icon name
- Example:
  ```
  iconclass="wm-sl-l sl-search"
  iconclass="wm-sl-r sl-settings"
  ```
- If icon exists in both variants: choose based on **visual importance**
- If icon exists in only one variant: use only that variant

### Icons Available in Both Variants
Choose the variant based on visual weight:
```
accounting-bill, add, airplane-mode, alarm-bell-off, alarm-bell, alert-triangle,
analytics-bars, analytics-pie, android, announcement, apple, at, attachment, award,
bank, bluetooth, bookmarks,
button-fast-forward, button-next, button-pause, button-play, button-previous, button-rewind, button-stop,
calculator, calendar, camera, check, close,
cloud-add, cloud-data-transfer, cloud-download, cloud-off, cloud-remove, cloud-upload, cloud,
computer-bug, computer-chip, css,
currency-dollar, currency-euro, currency-pound, currency-rupee, currency-yuan,
customer-support, dashboard, data-transfer,
database-add, database-delete, database-remove, database,
discount, download-1, download-2, duplicate,
email-read, email-reply-all, email-reply, email-send-1, email-send-2, email-unread,
expand-1, expand-2, face-id, facebook,
file-add, file-attachment, file-copy, file-delete, file-empty, file-remove, file-zip,
filter, finger-dial, flash-off, flash-on, floppy-disk,
folder-add, folder-delete, folder-duplicate, folder-empty, folder-remove, folder-zip,
font-size, google, graph-ascend, graph-descend,
hamburger-menu, hand-cursor, hashtag, headphones,
hierarchy-1, hierarchy-2, hierarchy-3, hierarchy-4, hierarchy-5, hierarchy-6,
html, hyperlink-broken, hyperlink,
keyboard-arrow-down, keyboard-arrow-left, keyboard-arrow-return, keyboard-arrow-right, keyboard-arrow-up, keyboard,
landscape, laptop,
layout-1, layout-2, layout-3, layout-4, layout-5, layout-6, layout-7,
layout-left, layout-three-columns, layout-top, layout-two-columns,
like, list-bullets, list-numbers, loading-half, loading, lock, login, logout,
medical-bag, medical-ribbon, microsoft, module-1, module-2, monitor,
mouse-cursor, mouse, music-note-1, music-note-2, network,
paragraph-left-align, paragraph-right-align,
paypal, performance-increase, pin, power, printer,
programming-code-script, qr-code, receipt-slip, redo, refresh, remove, rss-feed,
scissors, screen, scroll-horizontal, scroll-vertical, search, server, settings,
share, shop, shopping-basket, shopping-cart, shrink, signal-full, signal-loading,
startup, subscript, subtract, superscript, tags,
text-bold, text-italic, text-strikethrough, text-style, text-underline,
time, twitter, undo, upload-1, upload-2, usb,
view-off, view-on,
volume-decrease, volume-full, volume-increase, volume-low,
widget-add, widget-remove, wifi, wireless-mouse,
youtube, zoom-in, zoom-out
```

### Icons Only in Light
These do not exist in regular — use `wm-sl-l` only:
```
bin-1, bin-2, credit-card, disabilty-wheelchair, home-1, home-2, layout-right,
likedin, more-menu-horizontal, more-menu-vertical, otp, paragraph-centre-align,
performace-decrease, phone-ringing, phone, settigs-horizontal, settigs-vertical,
smiley-neutral, smiley-sad, smiley-smile, text-box-1, text-box-2, text-box-typing,
thumbs-down, thumbs-up, unlock, user-add, user-delete, user-multiple, user-remove, user,
video-off, video, volume-medium, wallet, write-1, write-2
```

### Icons Only in Regular
These do not exist in light — use `wm-sl-r` only:
```
bin, home, linkedin, more-horizontal, more-vertical,
paragraph-center-align, performance-decrease, settings-horizontal, settings-vertical
```

---

## 2. Wavicon Icons (SECONDARY — SEMANTIC USE)

### When to Use
- WaveMaker-specific concepts: variables, services, navigation actions, platform features
- Only when Streamline does not provide a meaningful equivalent
- Do NOT replace generic UI icons with Wavicon unnecessarily

### Class Format
```
iconclass="wi wi-<icon-name>"
```

### Available Icons
```
3d-rotation, ac-unit, access-alarm, access-alarms, access-time, accessibility, accessible,
account-balance, account-balance-wallet, account-box, account-circle, adb,
add, add-a-photo, add-alarm, add-alert, add-box, add-circle, add-circle-outline,
add-location, add-shopping-cart, add-to-photos, add-to-queue, adjust,
airline-seat-flat, airline-seat-flat-angled, airline-seat-individual-suite,
airline-seat-legroom-extra, airline-seat-legroom-normal, airline-seat-legroom-reduced,
airline-seat-recline-extra, airline-seat-recline-normal,
airplanemode-active, airplanemode-inactive, airplay, airport-shuttle,
alarm, alarm-add, alarm-off, alarm-on, album,
align-center, align-justify, align-left, align-right,
all-inclusive, all-out, analytics, analytics-circle, android,
angle-double-down, angle-double-left, angle-double-right, angle-double-up,
announcement, apps, archive,
arrow-back, arrow-down, arrow-down-circle, arrow-downward, arrow-drop-down,
arrow-drop-down-circle, arrow-drop-up, arrow-forward, arrow-left, arrow-left-circle,
arrow-right, arrow-right-circle, arrow-up, arrow-up-circle, arrow-upward,
art-track, aspect-ratio, assessment, assignment, assignment-ind, assignment-late,
assignment-return, assignment-returned, assignment-turned-in,
assistant, assistant-photo, at, attach-file, attach-money, attachment,
audiotrack, autorenew, av-timer, award,
back, backspace, backup, backward, badge, bar-chart, bar-graph, bars,
battery, battery-20, battery-30, battery-50, battery-60, battery-80, battery-90,
battery-alert, battery-empty, battery-full, battery-half, battery-std, battery-unknown,
beach-access, beenhere, bell, bell-slash, block,
bluetooth, bluetooth-audio, bluetooth-connected, bluetooth-disabled, bluetooth-searching,
blur-circular, blur-linear, blur-off, blur-on,
bold, bolt, book, book-binder, book-open, bookmark, bookmark-border,
border-all, border-bottom, border-clear, border-color, border-horizontal, border-inner,
border-left, border-outer, border-right, border-style, border-top, border-vertical,
branding-watermark, briefcase,
brightness-auto, brightness-high, brightness-low, brightness-medium,
broken-image, brush, bubble-chart, bug-report, build, building, bullhorn, burst-mode,
business, business-center,
cached, cake, calculator, calendar,
call, call-end, call-incoming, call-made, call-merge, call-missed, call-missed-outgoing,
call-outgoing, call-received, call-split, call-to-action,
camera, camera-alt, camera-enhance, camera-front, camera-rear, camera-roll, cancel,
card-giftcard, card-membership, card-travel,
caret-down, caret-left, caret-right, caret-up, cart, casino, cast, cast-connected,
cc, cd, center-focus-strong, center-focus-weak, change-history,
chat, chat-bubble, chat-bubble-outline,
check, check-box, check-box-outline-blank, check-circle, check-square,
chevron-down, chevron-left, chevron-right, chevron-up,
child-care, child-friendly, chip, chrome-reader-mode, circle, class,
clear, clear-all, clear-formatting, clickable,
clock, clock-circle, clock-square, clone, close, closed-caption,
cloud, cloud-circle, cloud-done, cloud-download, cloud-off, cloud-queue, cloud-upload,
code, collections, collections-bookmark, color-lens, colorize, comment, comments,
compare, compare-arrows, compass, computer, confirmation-number,
contact-mail, contact-phone, contacts,
content-copy, content-cut, content-paste,
control-point, control-point-duplicate, copyright, cpu,
create, create-new-folder, credit-card,
crop, crop-din, crop-free, crop-landscape, crop-original, crop-portrait, crop-rotate, crop-square,
crown, cut,
dashboard, data-usage, database, date-range, dehaze,
delete, delete-forever, delete-sweep, description,
desktop, desktop-mac, desktop-windows, details,
developer-board, developer-mode, device-hub, devices, devices-other,
dialer-sip, dialpad, diamond,
directions, directions-bike, directions-boat, directions-bus, directions-car,
directions-railway, directions-run, directions-subway, directions-transit, directions-walk,
directory, disabled, disc-full, dns,
do-not-disturb, do-not-disturb-alt, do-not-disturb-off, do-not-disturb-on,
dock, domain, done, done-all, donut-large, donut-small, dot-circle, download, drafts,
drag-handle, drive-eta, dvr,
edit, edit-location, eject, ellipsis-h, ellipsis-v, email,
enhanced-encryption, entertainment, envelope, equalizer,
error, error-outline, error-triangle, eur, euro-symbol, ev-station,
event, event-available, event-busy, event-note, event-seat,
exclamation-circle, exclamation-triangle, exit, exit-to-app,
expand-less, expand-more, explicit, explore,
exposure, exposure-neg, exposure-plus, exposure-zero, extension, external-link, eye,
face, fast-backward, fast-forward, fast-play-forward, fast-play-rewind,
favorite, favorite-border, featured-play-list, featured-video, feedback, female,
fiber-dvr, fiber-manual-record, fiber-new, fiber-pin, fiber-smart-record,
file, file-download, file-text, file-upload, film,
filter, filter-b-and-w, filter-center-focus, filter-drama, filter-frames, filter-hdr,
filter-list, filter-none, filter-tilt-shift, filter-vintage,
find-in-page, find-replace, fingerprint, fire, first-page, fitness-center, flag, flare,
flash-auto, flash-off, flash-on, flask, flight, flight-land, flight-takeoff,
flip, flip-to-back, flip-to-front,
folder, folder-open, folder-shared, folder-special,
font-download, font-size, font-underline,
format-align-center, format-align-justify, format-align-left, format-align-right,
format-bold, format-clear, format-color-fill, format-color-reset, format-color-text,
format-indent-decrease, format-indent-increase, format-italic, format-line-spacing,
format-list-bulleted, format-list-numbered, format-paint, format-quote, format-shapes,
format-size, format-strikethrough, format-textdirection-l-to-r, format-textdirection-r-to-l,
format-underlined, forum,
forward, forward-10, forward-30, forward-5, free-breakfast,
full-screen, fullscreen, fullscreen-exit, functions,
g-translate, gamepad, games, gavel, gear, gesture, get-app, gif, gift, glass, globe,
golf-course, gps-fixed, gps-not-fixed, gps-off, grade, gradient, graduation-cap,
grain, graphic-eq, grid-off, grid-on,
group, group-add, group-work,
hammer, hand-pointer, hard-drive, hd, hdd,
hdr-off, hdr-on, hdr-strong, hdr-weak,
headphones, headset, headset-mic, healing, hearing, heart,
help, help-outline, hexagon, high-quality, highlight, highlight-off, history,
home, home-tall, hot-tub, hotel, hourglass-empty, hourglass-full, http, https,
image, image-aspect-ratio, import-contacts, import-export, important-devices,
inbox, indent, indeterminate-check-box, industry, info, info-outline, input,
insert-chart, insert-comment, insert-drive-file, insert-emoticon,
insert-invitation, insert-link, insert-photo, internet,
invert-colors, invert-colors-off, iso, italic,
key, keyboard,
keyboard-arrow-down, keyboard-arrow-left, keyboard-arrow-right, keyboard-arrow-up,
keyboard-backspace, keyboard-capslock, keyboard-hide, keyboard-return,
keyboard-tab, keyboard-voice, kitchen,
label, label-outline, landscape, language, laptop,
laptop-chromebook, laptop-mac, laptop-windows, last, last-page, launch,
layers, layers-clear, layout, leak-add, leak-remove, lens,
library-add, library-books, library-music, life-ring, lightbulb, lightbulb-outline,
line-chart, line-style, line-weight, linear-scale, link, linked-camera,
list, list-ol, live-help, live-tv,
local-activity, local-airport, local-atm, local-bar, local-cafe, local-car-wash,
local-convenience-store, local-dining, local-drink, local-florist, local-gas-station,
local-grocery-store, local-hospital, local-hotel, local-laundry-service, local-library,
local-mall, local-movies, local-offer, local-parking, local-pharmacy, local-phone,
local-pizza, local-play, local-post-office, local-printshop, local-see,
local-shipping, local-taxi,
location-arrow, location-city, location-disabled, location-off, location-on,
location-pin, location-searching,
lock, lock-open, lock-outline,
long-arrow-down, long-arrow-left, long-arrow-right, long-arrow-up,
looks, looks-one, looks-two, loop, loupe, low-priority, loyalty,
magic, magnet, mail, mail-outline, map, map-marker, map-pin,
markunread, markunread-mailbox, memory, menu, merge, merge-type, message,
mic, mic-none, mic-off, microphone, minimise,
minus, minus-circle, minus-square, mms, mode-comment, mode-edit,
monetization-on, money-off, monochrome-photos, mood, mood-bad,
more, more-horiz, more-vert, motorcycle, mouse, move-to-inbox,
movie, movie-creation, movie-filter, mug, multiline-chart,
music, music-note, music-video, my-location,
nature, nature-people, navigate-before, navigate-next, navigation, near-me,
network-cell, network-check, network-locked, network-wifi,
new-releases, next-week, nfc, no-encryption, no-sim, not-interested,
note, note-add, notepad,
notifications, notifications-active, notifications-none, notifications-off, notifications-paused,
octagon, offline-pin, ondemand-video, opacity,
open-envelope, open-in-browser, open-in-new, open-with, outdent,
pages, pageview, palette, pan-tool,
panorama, panorama-fish-eye, panorama-horizontal, panorama-vertical, panorama-wide-angle,
paper-plane, paperclip, party-mode, paste,
pause, pause-circle-filled, pause-circle-outline, payment,
pen, pencil, pencil-up, people, people-outline,
perm-camera-mic, perm-contact-calendar, perm-data-setting, perm-device-information,
perm-identity, perm-media, perm-phone-msg, perm-scan-wifi,
person, person-add, person-outline, person-pin, person-pin-circle, personal-video, pets,
phone, phone-android, phone-bluetooth-speaker, phone-book, phone-forwarded, phone-in-talk,
phone-iphone, phone-locked, phone-missed, phone-paused,
phonelink, phonelink-erase, phonelink-lock, phonelink-off, phonelink-ring, phonelink-setup,
photo, photo-album, photo-camera, photo-filter, photo-library,
photo-size-select-actual, photo-size-select-large, photo-size-select-small,
picture, picture-as-pdf, picture-in-picture, picture-in-picture-alt,
pie-chart, pie-chart-outlined, pin-drop, place,
play, play-arrow, play-circle, play-circle-filled, play-circle-outline, play-for-work,
playlist-add, playlist-add-check, playlist-play,
plus, plus-circle, plus-one, plus-square, poll, polymer, pool,
portable-wifi-off, portrait, power, power-input, power-off, power-settings-new,
pregnant-woman, present-to-all, print, print-output, printer,
priority-high, priority-high-12px, public, publish,
query-builder, question, question-answer, queue, queue-music, queue-play-next,
quote-left, quote-right,
radio, radio-button-checked, radio-button-unchecked, random, rate-review, receipt,
recent-actors, record, record-voice-over, redeem, redo, refresh,
remove, remove-circle, remove-circle-outline, remove-from-queue,
remove-red-eye, remove-shopping-cart, reorder, repeat, repeat-one,
replay, replay-10, replay-30, replay-5, reply, reply-all,
report, report-problem, restaurant, restaurant-menu, restore, restore-page,
revert, rewind, ring-volume, rocket, room, room-service,
rotate-90-degrees-ccw, rotate-left, rotate-right, rounded-corner, router, rowing,
rss-feed, rule, rv-hookup,
satellite, save, scale, scanner, schedule, school, scissors,
screen-lock-landscape, screen-lock-portrait, screen-lock-rotation, screen-rotation, screen-share,
sd-card, sd-storage, search, search-minus, search-plus, security, select-all, selector, send,
sentiment-dissatisfied, sentiment-neutral, sentiment-satisfied,
sentiment-very-dissatisfied, sentiment-very-satisfied,
settings, settings-applications, settings-backup-restore, settings-bluetooth,
settings-brightness, settings-cell, settings-ethernet,
settings-input-antenna, settings-input-component, settings-input-composite,
settings-input-hdmi, settings-input-svideo, settings-overscan, settings-phone,
settings-power, settings-remote, settings-system-daydream, settings-voice,
share, share-alt, shield, shop, shop-two, shopping-basket, shopping-cart,
short-text, show-chart, shuffle, sign-in, sign-out, signal,
signal-cellular-0-bar, signal-cellular-1-bar, signal-cellular-2-bar,
signal-cellular-3-bar, signal-cellular-4-bar, signal-cellular-no-sim,
signal-cellular-null, signal-cellular-off,
signal-wifi-0-bar, signal-wifi-1-bar, signal-wifi-1-bar-lock,
signal-wifi-2-bar, signal-wifi-2-bar-lock, signal-wifi-3-bar, signal-wifi-3-bar-lock,
signal-wifi-4-bar, signal-wifi-4-bar-lock, signal-wifi-off,
sim-card, sim-card-alert, sitemap, skip-next, skip-previous,
slideshow, slow-motion-video, smartphone, smiley, smiley-happy, smiley-sad,
smoke-free, smoking-rooms, sms, sms-failed, snooze, snowflake,
sort, sort-by-alpha, spa, space-bar, spanner,
speaker, speaker-group, speaker-notes, speaker-notes-off, speaker-phone,
spellcheck, spinner, split, square,
star, star-border, star-half, stars,
stay-current-landscape, stay-current-portrait, stay-primary-landscape, stay-primary-portrait,
steering-wheel, step-backward, step-forward, stop, stop-screen-share, storage,
store, store-mall-directory, straighten, streetview, strikethrough-s, style,
subdirectory-arrow-left, subdirectory-arrow-right, subject, subscript, subscriptions,
subtitles, subway, suitcase, sun, sun-o, superscript, supervisor-account,
surround-sound, swap-calls, swap-horiz, swap-vert, swap-vertical-circle,
switch-camera, switch-video, sync, sync-disabled, sync-problem,
system-update, system-update-alt,
tab, tab-unselected, tablet, tablet-android, tablet-mac, tachometer, tag, tag-faces,
tap, tap-and-play, telephone, television, terrain,
text-fields, text-format, text-transform, textsms, texture,
th, th-large, theaters, thumb-down, thumb-tack, thumb-up,
thumbs-down, thumbs-up, thumbs-up-down, time-to-leave, timelapse, timeline,
timer, timer-10, timer-3, timer-off, tint, title, toc, today, toll, tonality,
touch-app, touch-id, toys, track-changes, traffic, train, tram,
transfer, transfer-within-a-station, transform, translate, trash, trash-covered,
trending-down, trending-flat, trending-up, tune, turned-in, turned-in-not, tv, twitch,
umbrella, unarchive, underline, undo, unfold-less, unfold-more, unlock, unread-message,
update, upload, usb, usd, user,
verified-user, vertical-align-bottom, vertical-align-center, vertical-align-top, vibration,
video, video-call, video-camera, video-label, video-library,
videocam, videocam-off, videogame-asset,
view-agenda, view-array, view-carousel, view-column, view-comfy, view-compact,
view-day, view-headline, view-list, view-module, view-quilt, view-stream, view-week,
vignette, visibility, visibility-off, voice-chat, voicemail,
volume-down, volume-mute, volume-off, volume-up, volume-zero,
vpn-key, vpn-lock,
wallet, wallpaper, wand, warning, watch, watch-later,
wb-auto, wb-cloudy, wb-incandescent, wb-iridescent, wb-sunny, wc,
weather-rain, weather-snowfall, weather-sun, weather-thunder,
web, web-asset, weekend, whatshot, widgets, wifi, wifi-lock, wifi-tethering,
window, windows, work, wrap-text, wrench,
youtube-searched-for, zoom-in, zoom-out, zoom-out-map
```

---

## 3. Font Awesome (FALLBACK ONLY)

### When to Use
- Icon not available in Streamline or Wavicon
- Brand icons (Google, Facebook, etc.)
- Highly common universal symbols missing elsewhere

### Class Format
```
iconclass="fa fa-<icon-name>"
```

### Rules
- Use ONLY as last resort
- Do NOT mix with Streamline in the same UI section unless unavoidable

---

## Platform Exception (STRICTLY LIMITED)

Platform differences are allowed ONLY when:
- The selected icon is NOT supported in the target platform
- OR rendering breaks (e.g., React Native incompatibility)

In such cases: Streamline → fallback to Font Awesome

This is a **technical fallback**, NOT a design choice.

---

## Usage Guidelines

### Default Choice
- Use **Streamline Light (`wm-sl-l`)** for most UI

### Use Regular When
- Navigation (sidebar, header actions)
- Primary buttons (Save, Submit, Delete)
- High emphasis actions

### Avoid
- Mixing Light + Regular randomly
- Mixing Streamline + Font Awesome without reason
- Using heavy icons in data-dense screens

---
