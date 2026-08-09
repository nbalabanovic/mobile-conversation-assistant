# EE Mobile Call Assistant

Internal cold call assistant for EE business mobile. A stepwise decision tree built from the EE Business Competitor Battle Cards (BT Local Business London West, FY26/27).

The companion broadband and connectivity assistant lives in [Sales-Conversation-Assistant](https://github.com/nbalabanovic/Sales-Conversation-Assistant), and each site links to the other.

## Run it locally

```
npm start
```

Then open http://localhost:3000. No dependencies to install, it only needs Node.

## Hosted version

The app is static and served by GitHub Pages from the `docs/` folder on `main`
(Settings, then Pages, then Deploy from a branch, `main` / `docs`), at
https://nbalabanovic.github.io/mobile-conversation-assistant/.

## The flow

Core Four, then The Pain, then Battle Card, then Close.

- **Core Four**, asked in order on every call: the network, the estate, the contract, the pain. The network answer picks the battle card and the estate answer sets corporate or SME. Both persist as chips at the top of every later step.
- **The pain** branches into the matching PIC (Problem, Root Cause, Business Impact), with the attack line and a word-for-word response.
- **Battle cards** for Vodafone, O2, Three and MVNOs. Each shows the red "don't discuss" side with its pivot lines, the green "do discuss" side, and three killer questions.
- **The alignment question adapts to segment**: co-terminus for corporate, Anytime Upgrades for SME, because co-terminus is a corporate offer and must never be promised to an SME.

## Panels

The left rail jumps to the reference pages without losing your place in the call:
Battle Cards, Objections, Fact-Find, PIC Library, Why EE, ESN Proof, Do / Don't.

## Shortcuts

- Number keys `1` to `9` pick a response option
- `Backspace` goes back one step
- `Esc` closes a panel
- Your position persists across refreshes; Restart clears it
