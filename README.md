# rmmv_fow
Fog of War System for RPG Maker MV
Author: CityShrimp
Version: 0.1

**Important**: Have not been tested with RMMV

Features
========
1. Player Vision - Player can have vision (to clear fog)
2. Player Vision Range - Player vision range can be adjusted
3. Event Vision - Events can have vision.  These events will be referred to as **origins**
4. Event Vision Range - Each event has it's own vision range.
5. Vision Type - Different vision shapes - diamond, square, circle, directional. Each origin can have it's own type
6. Map Hidden - Entire map is initially blacked out, and visino 

Instructions
============
- Download CityShrimp_Fow.js
- Place it into your project's Plugin list
- Check description in file for latest Parameter, Notetag, and Plugin Commands

To-do List
===========
1. Map discovery (save set of points, not array of entire map)
2. Flying origin (no obstruction in view)
3. Circle shape vision
4. Each origin has their own vision type
5. Add origin with default range and vision type
6. Map option - Gradient vision.  Idea is to have an map in each sprite (extend it so it won't be in all sprites) that stores event-opacity pairs.  Each new origin that lights up the tile will add a new pair, then opacity is calculated and applied.  When an origin leaves, remove the pair and apply.  When an origin moves, it will override the pair and apply.  Replace sight count with this new method 
