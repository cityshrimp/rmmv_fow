# rmmv_fow
Fog of War System for RPG Maker MV
Author: CityShrimp
Version: 1.0

Features
========
1. Player Vision - Player can have vision (to clear fog)
2. Event Vision - Events can have vision.  These events will be referred to as **origins**
3. Vision Range - Each origin has it's own vision range.
4. Vision Type - Different vision shapes - diamond, square, circle, directional. Each origin can have it's own type
5. Flying Vision - An origin can have flying vision (see through mountains, forest, etc). 
6. Vision Brightness - Each origin has it's own vision brightness
7. Map Hidden - Entire map is initially blacked out, and map is revealed by origins
8. Strict Diagonals - Can configure whether origins can see past two diagonally-placed blocked tiles
9. Tile Type by RegionId:
  - Plain: Can always see through
  - Forest: Cannot see through unless on a hill, mountain, watchtower, or have flying vision
  - Hill: Cannot see through unless on a hill, mountain, watchtower, or have flying vision
  - Mountain/Wall: Cannot see through unless have flying vision
  - Dark: Can always see through, but can never be revealed
  - Blocked: Cannot see through unless have flying vision. Can never be revealed.
  - Watchtower: Can always see through. Have elevated height (can be configured)
10. Multiple ways to configure: Plugin Parameters, Map/Event notetags, Plugin Commands

Instructions
============
- Download CS_FogOfWar.js
- Place it into your project's Plugin list
- Check description in file for latest Parameter, Notetag, and Plugin Commands

Notes and Limitations
=====================
- Does not work with loop maps.
- Directional vision should work with most 8-direction movement plugins.
- Targets may not show/hide correctly if they are bigger than 1 tile
- Performance may become an issue if 1) map is too large, 2) too many origins, or 3) vision is too large
