/*=============================================================================
 * CityShrimp's Fog of War System
 * CS_FogOfWar.js
 * Version: 1.1.4
 * Free for commercial and non commercial use.
 *=============================================================================*/

 /*:
 * @plugindesc This plugin provides a complete fog of war system.
 *             
 * @author CityShrimp
 *
 * ===Parameter List===
 *
 * @param Enabled
 * @desc Enable fog by default in any map.
 * @default false
 *
 * @param Fog Opacity
 * @desc Default opacity of the fog sprites, between 0 to 1
 * @default 0.6
 *
 * @param Fade Speed
 * @desc Amount of opacity that changes with each update, between 0 to 1
 * @default 0.1
 *
 * @param Map Hidden
 * @desc Whether the map is hidden and needs to be discovered.  If set to true, then map starts out blacked out (think Starcraft)
 * @default false
 *
 * @param Gradient Vision
 * @desc Vision is gradient (as opposed to completely clear)
 * @default false
 *
 * @param Strict Diagonals
 * @desc If diagonals can be seen more easily or not.  For example, with Strict Diagonals enabled, if a player has blocked vision on top and to the right, then the top-right tile is not visible.  The top-right tile will be visible if Strict Diagonals is disabled.
 * @default false
 *
 * @param Player Vision
 * @desc Player has vision. Can be toggled with plugin command.
 * @default true
 *
 * @param Player Vision Range
 * @desc Player's vision range. Can be modified with plugin command.
 * @default 3
 *
 * @param Player Vision Type
 * @desc Default vision type for Player. 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Player Flying Vision
 * @desc Whether Player has unobstructed vision or not.
 * @default false
 *
 * @param Player Vision Brightness
 * @desc Default brightness of the player's vision on fog, between 0 to 1.
 * @default 1
 *
 * @param Origin Vision Range
 * @desc This is the default vision range for origin events.
 * @default 3
 *
 * @param Origin Vision Type
 * @desc Default vision type for origin events (except Player). 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Origin Flying Vision
 * @desc Whether origin events will have unobstructed vision by default or not
 * @default false
 *
 * @param Origin Vision Brightness
 * @desc Default brightness of the origin events' vision on fog, between 0 to 1.
 * @default 1
 *
 * @param Forest RegionId
 * @desc RegionId for forest tiles
 * @default 1
 *
 * @param Hill RegionId
 * @desc RegionId for hill tiles. Origins on Hills can see through everything but Mountain and Blocker tiles
 * @default 2
 *
 * @param Mountain / Wall RegionId
 * @desc RegionId for mountain / wall tiles
 * @default 3
 *
 * @param Blocker RegionId
 * @desc RegionId for blocker tiles (cannot see through or reveal unless origin is flying)
 * @default 4
 *
 * @param Dark RegionId
 * @desc RegionId for dark tiles (can see through, but never revealed)
 * @default 5
 *
 * @param Watchtower RegionId
 * @desc RegionId for watchtower tiles. Origins on Hills can see through everything but Mountain and Blocker tiles
 * @default 6
 *
 * @param Watchtower Modifier
 * @desc Vision range modifier for watchtower tiles.  It will increase the origin's range by n
 * @default 1
 *
 * ===Map Notetag===
 *
 * <fow_enabled>
 * desc: Eanbles fog of war for this map
 *
 * <fow_opacity: (value)>
 * desc: Sets the fog sprite opacity for this map.  (value): between 0 to 1
 *
 * <fow_map_hidden>
 * desc: Eanbles hidden map fog of war
 *
 * <fow_gradient_vision>
 * desc: Eanbles gradient vision
 *
 * <fow_strict_diagonals>
 * desc: Eanbles strict diagonals visibility detection
 *
 * <fow_origin_range: (value)>
 * desc: Origin events' vision range for this map
 *
 * <fow_origin_type: (value)>
 * desc: Sets the fog type for this map.  (value): 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional 
 *
 * <fow_flying_origins>
 * desc: Origins will have unobstructed vision.
 *
 * <fow_origin_brightness: (value)>
 * desc: Origin events' vision brigthness for this map.  (value): between 0 to 1
 *
 * <fow_player_vision>
 * desc: Player has vision for this map
 *
 * <fow_player_range: (value)>
 * desc: Player's vision range for this map
 *
 * <fow_player_type: (value)>
 * desc: Player's vision type for this map
 *
 * <fow_player_flying>
 * desc: Player has flying vision for this map
 *
 * <fow_player_brightness: (value)>
 * desc: Player's vision brigthness for this map
 *
 * ===Event Notetag / Comment===
 * Note: Comments have precedence over Notetags.
 *
 * <fow_origin>
 * desc: Event will be able to reveal fog. (range) is the vision range of the event.
 *
 * <fow_origin_range: (integer)>
 * desc: Set the origin event's vision range.
 *
 * <fow_origin_type: (integer)>
 * desc: Set the origin event's vision type.
 *
 * <fow_origin_flying: (bool)>
 * desc: Set the origin's flying (unobstructed vision) attribute
 *
 * <fow_origin_brightness: (value)>
 * desc: Set the origin event's brightness.  (value): between 0 to 1
 *
 * <fow_target>
 * desc: Event will be hidden unless on a revealed tile.
 *
 * <fow_blocker: (type)>
 * desc: Event will block vision.  1 - Can see through on elevated terrain (hill), 2 - Can reveal, but not see through (mountain), 0 - not blocker
 *
 * ===Plugin Commands===
 *
 * cs_fow enable
 * desc: Enable fog of war.  Does not persist if map changes.
 *
 * cs_fow disable
 * desc: Disable fog of war. Note: does not reveal target events hidden by fog.  Does not persist if map changes.
 *
 * cs_fow enable_player
 * desc: Enable player vision.
 *
 * cs_fow disable_player
 * desc: if put in the map note tags then scrolling will be back to normal instead of grid scrolling.
 *
 * cs_fow set_player_range <integer>
 * desc: Set the player's vision range.  Does not persist if map changes.
 *
 * cs_fow set_player_type <event id> <type>
 * desc: Set the player's vision type.  Does not persist if map changes.
 *
 * cs_fow set_player_flying <bool>
 * desc: Set the player's flying (unobstructed vision) attribute.  Does not persist if map changes.
 *
 * cs_fow add_origin <event id>
 * desc: Event will be able to reveal fog.  Does not persist if map changes.
 *
 * cs_fow set_origin_range <event id> <integer>
 * desc: Set the origin's vision range.  Does not persist if map changes.
 *
 * cs_fow set_origin_type <event id> <integer>
 * desc: Set the origin's vision type.  Does not persist if map changes.
 *
 * cs_fow set_origin_flying <event id> <bool>
 * desc: Set the origin's flying (unobstructed vision) attribute.  Does not persist if map changes.
 *
 * cs_fow set_origin_brightness <event id> <value>
 * desc: Set the origin's brightness, value: between 0 to 1.  Does not persist if map changes.
 *
 * cs_fow remove_origin <event id>
 * desc: Remove event from origin list. Does not work on events with <fow_origin> notetag.  Does not persist if map changes. 
 *
 * cs_fow remove_all_origins
 * desc: Removes all origins, excluding player and events with <fow_origin> notetag.  Does not persist if map changes.
 *
 * cs_fow add_target <event id>
 * desc: Event will be hidden in fog unless tile is revealed.   Does not persist if map changes.
 *
 * cs_fow remove_target <event id>
 * desc: Remove event from target list. Does not work on events with <fow_target> notetag.  Does not persist if map changes.
 *
 * cs_fow remove_all_targets
 * desc: Remove all targets, excluding events with <fow_target> notetag.  Does not persist if map changes.
 *
 * cs_fow add_blocker <event id> <type>
 * desc: Event will block vision. Does not persist if map changes. 1 - Can see through on elevated terrain (hill), 2 - Can reveal, but not see through (mountain), 0 - not blocker
 *
 * cs_fow_remove_blocker <event id>
 * desc: Remove the event from blocker list.  Does not work on events with <fow_blocker> notetag.  Does not persist if map changes.
 *
 * cs_fow remove_all_blockers
 * desc: Remove all blockers, excluding events with <fow_blocker> notetag.  Does not persist if map changes.
 *
 * ===Limitation and Notes===
 * - Does not work with maps with loop
 * - Targets may not show/hide correctly if they are bigger than 1 tile
 * - Performance may become an issue if 1) too many origins, 3) heavy use of circle or directinoal vision type, or 4) origin vision is too large
 * - All calclulations are "tile-based".  E.g., if an blocker event stands between two tiles, it will find which tile it's coordinates are on, and block vision for that tile only.
 * - If a tile is marked as a special region and also contains a blocker event, it will take the more restrictive of the two.  Example, if there's a blocker event (type 2 - mountain) on a hill tile.  It will block vision like a mountain.
 * - If an event initially starts had <fow_blocker> tag in comment, and then move into a page without the tag, it will continue to act as a blocker.  To clear it, make sure to include <fow_blocker: 0> in the new page.  This is done to preserve blockers added via plugin commands.
 * 
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on 
 * https://github.com/cityshrimp/rmmv_fow/blob/master/CS_FogOfWar.js
 * 
 *=============================================================================
*/

var Imported = Imported || {};
Imported['CS_FogOfWar'] = "1.1.3";

var CS_FogOfWar = CS_FogOfWar || {};

// ===MVCommons Module (taken from SuperOrangeMovementEX) ===
if (Imported['MVCommons'] === undefined) {
  var MVC = MVC || {};

  (function($) {
    $.getProp = function(meta, propName) {
        if (meta === undefined)
            return undefined;
        if (meta[propName] !== undefined)
            return meta[propName];
        for (var key in meta) {
            if (key.toLowerCase() == propName.toLowerCase()) {
                return meta[key].trim();
            }
        }
        return undefined;
    };
  })(MVC);

  Number.prototype.fix = function() {return (parseFloat(this.toPrecision(12)));};
  Number.prototype.floor = function() {return Math.floor(this.fix());};
  Number.prototype.ceil = function() {return Math.ceil(this.fix());};
  Number.prototype.abs = function() {return Math.abs(this);};
}
// ===End SuperOrangeMovementEX's MVCommons Module===

(function($) {
    "use strict";
    
    // Load parameters
    $.parameters = PluginManager.parameters("CS_FogOfWar") || {};
    $.enabled = ($.parameters['Enabled'] === 'true') ? true : false;
    $.fog_opacity = Number($.parameters['Fog Opacity'] || 0.6);
    $.fade_speed = (Number($.parameters['Fade Speed'] || 0.1)) * 255;
    $.map_hidden = ($.parameters['Map Hidden'] === 'true') ? true : false;
    $.gradient_vision = ($.parameters['Gradient Vision'] === 'true') ? true : false;
    $.strict_diagonals = ($.parameters['Strict Diagonals'] === 'true') ? true : false;
    $.player_vision = ($.parameters['Player Vision'] === 'false') ? false : true;
    $.player_range = Number($.parameters['Player Vision Range'] || 3);
    $.player_type = Number($.parameters['Player Vision Type'] || 1);
    $.player_flying = Number($.parameters['Player Flying Vision'] === 'true') ? true : false;
    $.player_brightness = Number($.parameters['Player Vision Brightness'] || 1);
    $.default_range = Number($.parameters['Origin Vision Range'] || 3);
    $.vision_type = Number($.parameters['Origin Vision Type'] || 1);
    $.flying_origins = ($.parameters['Origin Flying Vision'] === 'true') ? true : false;
    $.vision_brightness = Number($.parameters['Origin Vision Brightness'] || 1);
    $._forest_region_id = Number($.parameters['Forest RegionId'] || 1); 
    $._hill_region_id = Number($.parameters['Hill RegionId'] || 2);
    $._mountain_region_id = Number($.parameters['Mountain RegionId'] || 3);
    $._blocker_region_id = Number($.parameters['Blocker RegionId'] || 4);
    $._dark_region_id = Number($.parameters['Dark RegionId'] || 5);
    $._watchtower_region_id = Number($.parameters['Watchtower RegionId'] || 6);
    $._watchtower_modifier = Number($.parameters['Watchtower Modifier'] || 1);

    // Fog Bitmap
    $.bitmap = new Bitmap(48, 48);
    $.bitmap.fillAll('black');
    $.visible_sets = new Array();
    
    $.first_update = false;
    $.after_load = false;
    
    // Create fog sprites and sight count map
    $.init = function() {
        for (var i = 0; i < $dataMap.width; i++) {
            for (var j = 0; j < $dataMap.height; j++) {
                this._fog_tiles[i][j].visible = true;
                this._fog_tiles[i][j].addGradient(-1, 1 - $gameSystem.fow_fog_opacity);
            }
        }

        // Map has "Map Hidden" enabled, need to save a copy of discovered tiles
        if ($gameSystem.fow_map_hidden) {
            // Check if tiles have already been generated previously
            if (this._discovered_tiles == undefined) {
                this._discovered_tiles = new Array($dataMap.width);
                for (var i = 0; i < $dataMap.width; i++) {
                    this._discovered_tiles[i] = new Array($dataMap.height);

                    for (var j = 0; j < $dataMap.height; j++) {
                        this._discovered_tiles[i][j] = false;
                        this._fog_tiles[i][j].clearGradient();
                    }
                }

                $gameSystem.fow_discovered_map[$gameMap.mapId()] = this._discovered_tiles;
            } else {
                // For all previously hidden tiles, delete base gradient to black out tile
                for (var i = 0; i < $dataMap.width; i++) {
                    for (var j = 0; j < $dataMap.height; j++) {
                        if (! this._discovered_tiles[i][j])
                            this._fog_tiles[i][j].clearGradient();
                    }
                }
            }
        }

        // Hide all targets
        for (let e of $.getTargets()) {
            if (e != null && e != undefined) {
                e._transparent = true;
            }
        }

        // Add origins based on event tag
        for (let e of $.getOrigins()) {
            if (e == null || e == undefined) continue;
            
            $.applyVision(e);
        }
    }

    // Make all fog sprites invisible
    $.clear = function() {
        for (var i = 0; i < $dataMap.width; i++) {
            for (var j = 0; j < $dataMap.height; j++) {
                this._fog_tiles[i][j].clearGradient();
                this._fog_tiles[i][j].visible = false;
            }
        }

        // Clear origin events' old visible set
        for (let e of $.getOrigins()) {
            $.visible_sets[e.eventId()] = new CS_Set();
        }
    }

    // Delete all fog sprites
    $.erase = function() {
        if (this._fog_tiles != undefined)
            for (var i = 0; i < $dataMap.width; i++) {
                for (var j = 0; j < $dataMap.height; j++) {
                    this._fog_tiles[i][j].deleteSprite();
                }
            }
    }

    $.applyVision = function(e) {    
        // Initialize visible set if it doesn't exist
        if ($.visible_sets[e.eventId()] == undefined)
            $.visible_sets[e.eventId()] = new CS_Set();
        
        // Remove vision if it's outside
        if (! $.inMap(e.x, e.y)) {
            $.removeVision(e);
            return;
        }

        // Check edge points
        var range = this._getRange(e);

        // Need to recalculate end points because of different height
        if (range != e.old_range) {
            e.old_range = range;
            e.calculateEndPoints();
        }

        var new_set = new CS_Set();

        this._getVisibleSet(e, new_set);

        this._resolveVisibility(e, new_set);
    }

    $.removeVision = function(e) {
        if ($.visible_sets[e.eventId()] != undefined) {
            for (let s of $.visible_sets[e.eventId()].items()) {
                s.removeGradient(e.eventId());

                if (s.gradient_map.size < 2) {
                    // Hide target events on this square
                    for (let target of $.getTargets()) {
                        if (target != null && target != undefined) {
                            if (target.floorX == s.mapX && target.floorY == s.mapY) {
                                target._transparent = true;
                            }
                        }
                    }
                }
            }

            // remove event's visible set afterwards
            $.visible_sets[e.eventId()] = new CS_Set();
        }
    }

    $.tileVisible = function(event) {
        if (! $.inMap(event.x, event.y))
            return false;
        
        if (this._fog_tiles[event.x][event.y].gradient_map.size >= 2)
            return true;
        else
            return false;
    }
    
    $.inMap = function(x, y) {
        if (x < 0 || x >= $dataMap.width
           || y < 0 || y >= $dataMap.height)
            return false;
        
        return true;
    }

    // Checks tiles around origin and mark them as visible or blocked
    $._getVisibleSet = function(e, new_visible_set) {
        var origin_height = this._getHeight(e);

        new_visible_set.add(this._fog_tiles[e.floorX][e.floorY]);

        // Find direction for directional vision
        if (e.vision_type == 4) {
            var direction = e.direction();

            if (e.oldX > e._x) {
                if (e.oldY > e._y) {
                    // Up-Left
                    direction = 7;
                } else if (e.oldY < e._y) {
                    // Down-Left
                    direction = 1;
                } else {
                    // Left
                    direction = 4;
                }

            } else if (e.oldX < e._x) {
                if (e.oldY > e._y) {
                    // Up-Right
                    direction = 9;
                } else if (e.oldY < e._y) {
                    // Down-Right
                    direction = 3;
                } else {
                    // Right
                    direction = 6;
                }

            } else {
                if (e.oldY > e._y) {
                    // Up
                    direction = 8;
                } else if (e.oldY < e._y) {
                    // Down
                    direction = 2;
                }
            }
        }

        for (let pointArray of e.end_points) {

            var left_blocked = false;
            var right_blocked = false;

            for (var i = 0; i < pointArray.length; i++) {
                var cur_x = pointArray[i][0] + e.floorX;
                var cur_y = pointArray[i][1] + e.floorY;

                // Stop if reach outside of map
                if (! $.inMap(cur_x, cur_y))
                    break;

                // For Directional Vision only.  Need to limit vision based on direction
                if (e.vision_type == 4) {                
                    var deltaX = pointArray[i][0];
                    var deltaY = pointArray[i][1];
                    var stopped = false;

                    switch (direction) {
                        // Down Left
                        case 1:
                            if (pointArray[i][1] < 0 || 
                                pointArray[i][0] > 0)
                                stopped = true;
                            break;
                        // Down
                        case 2: 
                            if (pointArray[i][1] < 0 || 
                               (pointArray[i][1].abs() < pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Down Right
                        case 3:
                            if (pointArray[i][1] < 0 || 
                                pointArray[i][0] < 0)
                                stopped = true;
                            break;
                        // Left
                        case 4:
                            if (pointArray[i][0] > 0 || 
                               (pointArray[i][1].abs() > pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Right
                        case 6:
                            if (pointArray[i][0] < 0 || 
                               (pointArray[i][1].abs() > pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Up Left
                        case 7:
                            if (pointArray[i][1] > 0 || 
                                pointArray[i][0] > 0)
                                stopped = true;
                            break;
                        // Up
                        case 8:
                            if (pointArray[i][1] > 0 || 
                               (pointArray[i][1].abs() < pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Up Right
                        case 9:
                            if (pointArray[i][1] > 0 || 
                                pointArray[i][0] < 0)
                                stopped = true;
                            break;
                    }

                    if (stopped) break;
                }

                // Only need to check if unit isn't flying
                if (! e.flying_vision) {
                    // If Strict Diagonals is enabled, need to check left and right tiles if landed in between 4 tiles
                    if ($gameSystem.fow_strict_diagonals) {
                        if (i > 0) {
                            var first_point = pointArray[i-1];
                            var second_point = pointArray[i];
                        } else {
                            var first_point = [0, 0];
                            var second_point = pointArray[0];
                        }
                        
                        if (first_point[0] != second_point[0] && first_point[1] != second_point[1]) {
                            if (second_point[0] > first_point[0] && second_point[1] > first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y - 1);
                                var right_region_id = $.getRegionType(cur_x - 1, cur_y);
                            } else if (second_point[0] < first_point[0] && second_point[1] < first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y + 1);
                                var right_region_id = $.getRegionType(cur_x + 1, cur_y);
                            } else if (second_point[0] > first_point[0] && second_point[1] < first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y + 1);
                                var right_region_id = $.getRegionType(cur_x - 1, cur_y);
                            } else if (second_point[0] < first_point[0] && second_point[1] > first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y - 1);
                                var right_region_id = $.getRegionType(cur_x + 1, cur_y);
                            }
                            // Unit have limited visibility
                            if (origin_height == 0) {   
                                if (left_region_id == $._hill_region_id ||
                                    left_region_id == $._forest_region_id ||
                                    left_region_id == $._mountain_region_id ||
                                    left_region_id == $._blocker_region_id) {
                                    left_blocked = true;
                                }
                                if (right_region_id == $._hill_region_id ||
                                    right_region_id == $._forest_region_id ||
                                    right_region_id == $._mountain_region_id ||
                                    right_region_id == $._blocker_region_id) {
                                    right_blocked = true;
                                }
                            }
                            // Unit have high visibility (can see through everythign except mountain)
                            else
                            {
                                if (left_region_id == $._mountain_region_id ||
                                    left_region_id == $._blocker_region_id) {
                                    left_blocked = true;
                                }
                                if (right_region_id == $._mountain_region_id  ||
                                    right_region_id == $._blocker_region_id) {
                                    right_blocked = true;
                                }
                            }   

                            // Blocked if both left and right are blocked
                            if (left_blocked && right_blocked)
                                break;
                        }
                    }
                }

                // Only need to check if unit isn't flying
                var point_region_id = $.getRegionType(cur_x, cur_y);
                if (! e.flying_vision) {
                    if (point_region_id == $._blocker_region_id) {
                        break;
                    }   
                }

                if (point_region_id != $._dark_region_id)
                    new_visible_set.add(this._fog_tiles[cur_x][cur_y]);

                // Only need to check if unit isn't flying
                if (! e.flying_vision) {
                    // Unit have limited visibility
                    if (origin_height == 0)
                    {
                        if (point_region_id == $._hill_region_id ||
                            point_region_id == $._forest_region_id ||
                            point_region_id == $._mountain_region_id) {
                            break;
                        }
                    }
                    // Unit have high visibility (can see through everythign except mountain)
                    else
                    {
                        if (point_region_id == $._mountain_region_id) {
                            break;
                        }
                    }   
                }
            }
        }
    }

    // Generate an array of points from center [0, 0] to a given point [x, y]
    $.getPointsInALine = function(point) {
        var points = new Array();
        var my_x = 0.5;
        var my_y = 0.5;

        var target_x = point[0] + 0.5;
        var target_y = point[1] + 0.5;

        var cur_range = (target_x - my_x).abs() + (target_y - my_y).abs();

        var step_x = (target_x - my_x) / cur_range;
        var step_y = (target_y - my_y) / cur_range;

        var cur_x = my_x;
        var cur_y = my_y;

        for (var i = 1; i <= cur_range; i++)
        {   
            cur_x += step_x;
            cur_y += step_y;

            var floor_x = cur_x.floor();
            var floor_y = cur_y.floor();

            var deltaX = cur_x - cur_x.floor();
            var deltaY = cur_y - cur_y.floor();

            // Skip if point lands between two tiles
            if (deltaX <= 0.01 || deltaY <= 0.01) {
                continue;
            }

            points.push([floor_x, floor_y]);
        }

        return points;
    }

    // Update sight map with new visibility info
    $._resolveVisibility = function(origin, new_set) {
        var range = $._getRange(origin);

        // New set
        for (let s of new_set.items()) {
            if ($gameSystem.fow_map_hidden) {
                $._discovered_tiles[s.mapX][s.mapY] = true;
            }
            
            s.addGradient(-1, 1 - $gameSystem.fow_fog_opacity);

            // Calculate gradient
            if ($gameSystem.fow_gradient_vision) {
                // Depends on vision type
                var position = 0;
                switch (parseInt(origin.vision_type)) {
                    case 1: 
                        position = range - ((origin.floorX - s.mapX).abs() + (origin.floorY - s.mapY).abs()) + 1;
                        break;
                    case 2:
                        position = range - Math.max((origin.floorX - s.mapX).abs(), (origin.floorY - s.mapY).abs()) + 1;
                        break;
                    case 3:
                    case 4:
                        position = range - Math.sqrt(Math.pow(origin.floorX - s.mapX, 2) + Math.pow(origin.floorY - s.mapY, 2)) + 1;
                }

                var gradient = $gameSystem.fow_fog_opacity * (position / range) * origin.vision_brightness;
                s.addGradient(origin.eventId(), gradient);
            } else {
                // No gradient, then add enough light to reveal entire tile
                s.addGradient(origin.eventId(), $gameSystem.fow_fog_opacity * origin.vision_brightness);
            }
            
            if ($.visible_sets[origin.eventId()].has(s)) {
                // Tile was visible before, so delete from old set
                $.visible_sets[origin.eventId()].delete(s);
            }
        }

        // Old set    
        for (let s of $.visible_sets[origin.eventId()].items()) {
            s.removeGradient(origin.eventId());
        }

        // Show/Hide targets based on new visibility
        for (let target of $.getTargets()) {
            if (target != null && target != undefined) {
                $gameMap.event(target.eventId()).setTransparent(!$.tileVisible(target));
            }
        }

        $.visible_sets[origin.eventId()] = new_set;
    }

    // Get the object's "height"
    $._getHeight = function(e) {
        // Unit on a hill or mountain / wall
        if (this._inRegion(e, this._hill_region_id)
            || this._inRegion(e, this._mountain_region_id)
            || this._inRegion(e, this._watchtower_region_id))
            return 1;

        return 0;
    }

    // Get the object's "range"
    $._getRange = function(e) {
        // Unit on a watchtower
        if (this._inRegion(e, this._watchtower_region_id))
            return e.vision_range + this._watchtower_modifier;
        else
            return e.vision_range;
    }

    // Check if the event is in specified region
    $._inRegion = function(e, regionId) {
        e.updateFloor();
        return ($gameMap.regionId(e.floorX, e.floorY) == regionId);
    }
    
    $.getRegionType = function(x, y) {
        var region_type = $gameMap.regionId(x, y);
        var blocker_type = $.getBlockerTypeOnTile(x, y);
        if (blocker_type == 1) {
            // Hill type blocker
            if (region_type == undefined || region_type == 0)
                return $._hill_region_id;
            else
                return region_type;
        } else if (blocker_type == 2) {
            // Mountain type blocker
            if (region_type == undefined
                || region_type == 0
                || region_type == $._hill_region_id
                || region_type == $._forest_region_id)
                return $._mountain_region_id;
            else
                return region_type;
        }
        
        return region_type;
    }
    
    $.addOrigin = function(e) {
        e.is_origin = true;
        e.updateFloor();
        e.calculateEndPoints();
        if ($gameSystem.fow_enabled)
            $.applyVision(e);
    };
    
    $.getOrigins = function() {
        var origins = new Array();
        if ($gameSystem.fow_player_vision)
            origins.push($gamePlayer);
        for (let e of $gameMap.events()) {
            if (e.is_origin)
                origins.push(e);
        }
        
        return origins;
    }
    
    $.addTarget = function(e) {
        e.is_target = true;
        e.updateFloor();
        if ($gameSystem.for_enabled) {
            e.setTransparent(!$.tileVisible(e));
        }
    }
    
    $.getTargets = function() {
        var targets = new Array();
        for (let e of $gameMap.events()) {
            if (e.is_target)
                targets.push(e);
        }
        
        return targets;
    }
    
    $.addBlocker = function(e, type) {
        e.blocker_type = type;
        var tile = $._fog_tiles[e.floorX][e.floorY];
        
        for (let key of tile.gradient_map.keys()) {
            var origin = $gameMap.event(key);
            if (origin != undefined && origin.is_origin)
                $.applyVision(origin);
        }
    }
    
    $.removeBlocker = function(e) {
        e.blocker_type = 0;
        var tile = $._fog_tiles[e.floorX][e.floorY];
        
        for (let key of tile.gradient_map.keys()) {
            var origin = $gameMap.event(key);
            if (origin != undefined && origin.is_origin)
                $.applyVision(origin);
        }
    }
    
    $.getBlockers = function() {
        var blockers = new Array();
        for (let e of $gameMap.events()) {
            if (e.blocker_type != 0)
                blockers.push(e);
        }
        
        return blockers;
    }
    
    $.getBlockerTypeOnTile = function(x, y) {
        for (let e of $gameMap.events()) {
            if (e.blocker_type != 0 && e.floorX == x && e.floorY == y) 
                return e.blocker_type;
        }
    
        return 0;
    }

    // ===CS_Set Prototype===
    function CS_Set() {
        this.initialize.apply(this, arguments);
    }
    CS_Set.prototype.constructor = CS_Set;
    CS_Set.prototype.initialize = function() {
        this._array = new Array();
    }

    CS_Set.prototype.items = function() {
        return this._array;
    }

    CS_Set.prototype.has = function(object) {
       for (let o of this._array) {
            if (o == object)
                return true;
        } 

        return false;
    }
    
    CS_Set.prototype.getIndex = function(object) {
       for (var i = 0; i < this._array.length; i++) {
            if (this._array[i] == object)
                return i;
        } 

        return -1;
    }

    CS_Set.prototype.add = function(object) {
        if (! this.has(object)) {
            this._array.push(object);  
            return true;
        }

        return false;
    }

    CS_Set.prototype.delete = function(object) {
        if (this.has(object)) {
            var index = this._array.indexOf(object);
            if (this._array.length == 1 || index == (this._array.length - 1)) {
                this._array.pop();
                return true;
            } else {
                this._array[index] = this._array.pop();
                return true;
            }
        }
        return false;
    }
    // ===End CS_Set Prototype===

    // ===Fog Tile Prototype===
    function FogTile() {
        this.initialize.apply(this, arguments);
    };

    FogTile.prototype = Object.create(Object.prototype);
    FogTile.prototype.constructor = FogTile;

    FogTile.prototype.initialize = function(x, y) {
        this.gradient_map = new Map();
        this.visible = false;
        this.mapX = x;
        this.mapY = y;
        this.targetOpacity = this.opacity = 255;

        return this;
    }

    // event_id = -1 is reserved for map hidden.  When tile is revealed, adds pair (-1, <opacity>)
    FogTile.prototype.addGradient = function(event_id, opacity) {
        this.gradient_map.set(event_id, opacity);
        this.updateOpacity();
    }

    FogTile.prototype.removeGradient = function(event_id) {
        if (this.gradient_map.has(event_id)) {
            this.gradient_map.delete(event_id);
            this.updateOpacity();
        }
    }

    FogTile.prototype.updateOpacity = function() {
        var new_opacity = 1;

        this.gradient_map.forEach(function(value) {
            new_opacity -= value; 
        });

        if (new_opacity < 0) new_opacity = 0;
        this.targetOpacity = new_opacity * 255;
    }

    FogTile.prototype.clearGradient = function () {
        this.gradient_map = new Map();
        this.updateOpacity();
    }

    FogTile.prototype.deleteSprite = function() {
        this.parent.removeChild(this);
    }

    FogTile.prototype.update = function() {
        // Check each tile for change in opacity
        if (this.opacity > this.targetOpacity) {
            var temp = this.opacity - $.fade_speed;
            if (temp < this.targetOpacity)
                this.opacity = this.targetOpacity;
            else
                this.opacity = temp;
        } else if (this.opacity < this.targetOpacity) {
            var temp = this.opacity + $.fade_speed;
            if (temp > this.targetOpacity)
                this.opacity = this.targetOpacity;
            else
                this.opacity = temp;
        }
    }
    // ===Fog Tile Prototype===

    // ===Fog Sprite Prototype===
    function FogSprite() {
        this.initialize.apply(this, arguments);
    };

    FogSprite.prototype = Object.create(Sprite_Base.prototype);
    FogSprite.prototype.constructor = FogSprite;

    FogSprite.prototype.initialize = function(x, y) {
        Sprite_Base.prototype.initialize.call(this);
        this.tileX = x;
        this.tileY = y;
        return this;
    }

    FogSprite.prototype.deleteSprite = function() {
        this.parent.removeChild(this);
    }

    FogSprite.prototype.update = function() {
        Sprite_Base.prototype.update.call(this);

        let displayX = $gameMap.displayX();
        let displayY = $gameMap.displayY();

        var tileX = Math.floor(displayX + this.tileX);
        var tileY = Math.floor(displayY + this.tileY);

        if (0 <= tileX && tileX < $gameMap.width() && 0 <= tileY && tileY < $gameMap.height()) {
            const tile = $._fog_tiles[tileX][tileY];
            tile.update();
            this.visible = tile.visible;
            this.opacity = tile.opacity;
        }

        this.x = (this.tileX - displayX + Math.floor(displayX)) * 48;
        this.y = (this.tileY - displayY + Math.floor(displayY)) * 48;
    }
    // ===Fog Sprite Prototype===

    // ===Alias Spriteset_Map===
    var Old_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        // Create sprites when other sprites are loading to place it in the right "height"
        $._fog_tiles = new Array($dataMap.width);

        for (var i = 0; i < $dataMap.width; i++) {
            $._fog_tiles[i] = new Array($dataMap.height);
            for (var j = 0; j < $dataMap.height; j++) {
                var tile = new FogTile(i, j);
                $._fog_tiles[i][j] = tile;
            }
        }

        let width = Graphics.width / 48 + 1;
        let height = Graphics.height / 48 + 1;

        $._fog_sprites = new Array(width);

        for (var i = 0; i < width; i++) {
            $._fog_sprites[i] = new Array(height);
            for (var j = 0; j < height; j++) {
                var sprite = new FogSprite(i, j);
                $._fog_sprites[i][j] = sprite;
                sprite.bitmap = $.bitmap;
                this.addChild(sprite);
                this.tileX = i;
                this.tileY = j;
                sprite.x = i*48;
                sprite.y = j*48;
            }
        }

        Old_Spriteset_Map_createCharacters.call(this);
    };
    // ===End Alias Spriteset_Map===

    // ===Alias Game_CharacterBase===
    var old_Game_CharacterBase_initialize = Game_CharacterBase.prototype.initialize;
    Game_CharacterBase.prototype.initialize = function() {
        old_Game_CharacterBase_initialize.call(this);
        
        this.floorX = this._x.floor();
        this.floorY = this._y.floor();
        this.oldX = this._x;
        this.oldY = this._y;
        this.oldFloorX = this._x.floor();
        this.oldFloorY = this._y.floor();
        this.oldDirection = this.direction();
    };

    var old_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        old_Game_CharacterBase_update.call(this);

        this.updateFloor();
        
        // Don't need to check if character is outside of map
        if (! $.inMap(this.floorX, this.floorY))
            return;
        
        // Apply vision after move if fog is enabled and event is an origin
        if ($gameSystem.fow_enabled) {
            // Only make an update if there's a change in position or direction.  To speed up performance
            if (this.floorX != this.oldFloorX
                || this.floorY != this.oldFloorY
                || this.direction() != this.oldDirection
                || $.first_update
                || this.page_updated) {
                
                if (this.is_origin)
                    $.applyVision(this);
                
                if (this.is_target)
                    this.setTransparent(($._fog_tiles[this.floorX][this.floorY].gradient_map.size < 2));
                
                if ((this.blocker_type != undefined && this.blocker_type != 0)
                    || this.page_updated) {
                    
                    var event_ids = new Set();
                    var tile = $._fog_tiles[this.floorX][this.floorY];
                    for (let key of tile.gradient_map.keys())
                        event_ids.add(key);
                    tile = $._fog_tiles[this.oldFloorX][this.oldFloorY];
                    for (let key of tile.gradient_map.keys())
                        event_ids.add(key);

                    for (let key of event_ids) {
                        if (key == 0) {
                            if ($gamePlayer.is_origin)
                                $.applyVision($gamePlayer);
                        } else {
                            var origin = $gameMap.event(key);
                            if (origin != undefined && origin.is_origin) {
                                $.applyVision(origin);
                            }
                        }
                    }
                }
                
                this.oldX = this._x;
                this.oldY = this._y;
                this.oldFloorX = this.floorX;
                this.oldFloorY = this.floorY;
                this.oldDirection = this.direction();
                
                this.page_updated = false;
            }
        }
    };

    Game_CharacterBase.prototype.updateFloor = function() {    
        this.floorX = this.x.floor();
        this.floorY = this.y.floor();
    }

    Game_CharacterBase.prototype.calculateEndPoints = function() {    
        this.updateFloor();
        this.end_points = new Array();
        this.end_points.push([[0, 0]]);
        var range = $._getRange(this);

        switch(this.vision_type) {
            case 1:
                this.end_points.push($.getPointsInALine([0, range]));
                this.end_points.push($.getPointsInALine([0, -range]));
                this.end_points.push($.getPointsInALine([range, 0]));
                this.end_points.push($.getPointsInALine([-range, 0]));
                for (var i = 1; i < range; i++)
                {
                    this.end_points.push($.getPointsInALine([i, range - i]))
                    this.end_points.push($.getPointsInALine([-i, range - i]))
                    this.end_points.push($.getPointsInALine([i, - range + i]))
                    this.end_points.push($.getPointsInALine([-i, - range + i]));
                }
                for (var i = 1; i < range-1; i++)
                {
                    this.end_points.push($.getPointsInALine([i, range - 1 - i]))
                    this.end_points.push($.getPointsInALine([-i, range - 1 - i]))
                    this.end_points.push($.getPointsInALine([i, - range + 1 + i]))
                    this.end_points.push($.getPointsInALine([-i, - range + 1 + i]));
                }
                break;
            case 2:
                for (var i = -range; i < range; i++) {
                    this.end_points.push($.getPointsInALine([range, i]));
                    this.end_points.push($.getPointsInALine([-range, -i]));
                    this.end_points.push($.getPointsInALine([-i, range]));
                    this.end_points.push($.getPointsInALine([i, -range]));
                }
                break;
            case 3:
            case 4:
                var step = range - 1;
                var my_x = 0.5;
                var my_y = 0.5;
                this.end_points.push($.getPointsInALine([Math.floor(my_x + range), Math.floor(my_y)]));
                this.end_points.push($.getPointsInALine([Math.floor(my_x), Math.floor(my_y + range)]));
                this.end_points.push($.getPointsInALine([Math.floor(my_x), Math.floor(my_y - range)]));
                this.end_points.push($.getPointsInALine([Math.floor(my_x - range), Math.floor(my_y)]));

                for (var i = 1; i <= step; i++) {
                    var radian = (i / step) * (Math.PI / 4);
                    var deltaX = Math.cos(radian) * range;
                    var deltaY = Math.sin(radian) * range;

                    this.end_points.push($.getPointsInALine([Math.floor(my_x + deltaX), Math.floor(my_y + deltaY)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x + deltaX), Math.floor(my_y - deltaY)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x - deltaY), Math.floor(my_y + deltaX)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x - deltaY), Math.floor(my_y - deltaX)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x - deltaX), Math.floor(my_y - deltaY)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x - deltaX), Math.floor(my_y + deltaY)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x + deltaY), Math.floor(my_y - deltaX)]));
                    this.end_points.push($.getPointsInALine([Math.floor(my_x + deltaY), Math.floor(my_y + deltaX)]));
                }
                break;
        }
    }
    // ===End Alias Game_CharacterBase===
    
    // ===Alias Game_Event===
    var old_Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        old_Game_Event_initialize.call(this, mapId, eventId);
        
        var data_e = $dataMap.events[eventId];
        this.is_origin = (MVC.getProp(data_e.meta, 'fow_origin')) ? true : false;
        this.is_origin = this.searchComment('fow_origin') ? true : this.is_origin;
        this.is_target = (MVC.getProp(data_e.meta, 'fow_target')) ? true : false;
        this.is_target = this.searchComment('fow_target') ? true : this.is_target;
        if (MVC.getProp(data_e.meta, 'fow_blocker') != undefined)
            this.blocker_type = parseInt(MVC.getProp(data_e.meta, 'fow_blocker'));
        else
            this.blocker_type = 0;
        if (this.searchComment('fow_blocker'))
            this.blocker_type = parseInt(this.searchComment('fow_blocker'));
    }
        
    Game_Event.prototype.searchComment = function(term) {
        var comment = "";
        if(!this.page())
            return false;
        var pagelist = this.page().list;
        for (var cmd of pagelist) {
            if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
            if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
        }
        var temp = comment.split("<" + term);
        if (temp.length > 1) {
            temp = temp[1].split(">")[0];
            if (temp.includes(":")) {
                return temp.split(":")[1].trim();
            } else {
                return true;
            }
        } else {
            return false;
        }

        return false;
    }
    
    var Old_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        Old_Game_Event_setupPageSettings.call(this);

        this.is_origin = this.searchComment('fow_origin') ? true : this.is_origin;
        this.is_target = this.searchComment('fow_target') ? true : this.is_target;
        var blocker_type = parseInt(this.searchComment('fow_blocker'));
        this.blocker_type = (Number.isInteger(blocker_type)) ? blocker_type : this.blocker_type;
        var range = parseInt(this.searchComment('fow_origin_range'));
        this.vision_range = (Number.isInteger(range)) ? range : this.vision_range;
        var type = parseInt(this.searchComment('fow_origin_type'));
        this.vision_type = (Number.isInteger(type)) ? type : this.vision_type;
        this.flying_vision = (this.searchComment('fow_origin_flying')) ? true : this.flying_vision;
        var brightness = parseFloat(this.searchComment('fow_origin_brightness'));
        this.vision_brightness = (!Number.isNaN(brightness)) ? brightness : this.vision_brightness;
        
        this.page_updated = true;
    };

    // ===Alias Game_Player===
    var old_Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        old_Game_Player_initialize.call(this);
        this.vision_range = $.player_range;
        this.old_range = this.vision_range;
        this.vision_type = $.player_type;
        this.flying_vision = $.player_flying;
        this.vision_brightness = $.player_brightness;
        this.is_origin = $.player_vision;
    };

    Game_Player.prototype.eventId = function() {
        return 0;
    }
    // ===End Alias Game_Player===

    // ===Alias Game_System===
    // Declare variables that needs to be stored when game is saved
    var old_Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        old_Game_System_initialize.call(this);

        // Save Fog of War parameters, so it is retained upon loading
        this.loadFowDefaults();
        this.fow_discovered_map = new Array();
        this.last_map = null;
    };

    Game_System.prototype.loadFowDefaults = function() {
        this.fow_enabled = $.enabled;
        this.fow_fog_opacity = $.fog_opacity;
        this.fow_fade_speed = $.fade_speed;
        this.fow_map_hidden = $.map_hidden;
        this.fow_gradient_vision = $.gradient_vision;
        this.fow_strict_diagonals = $.strict_diagonals;
        this.fow_player_vision = $.player_vision;
        this.fow_player_range = $.player_range;
        this.fow_player_type = $.player_type;
        this.fow_player_flying = $.player_flying;
        this.fow_player_brightness = $.player_brightness;
        this.fow_default_range = $.default_range;
        this.fow_vision_type = $.vision_type;
        this.fow_flying_origins = $.flying_origins;
        this.fow_vision_brightness = $.vision_brightness;
    }
    // ===End Alias Game_System===

    // ===Alias Scene_Map===
    var old_Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        old_Scene_Map_initialize.call(this);
        this.oldX = $gameMap.displayX();
        this.oldY = $gameMap.displayY();
    }
    
    var old_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {    
        old_Scene_Map_start.call(this);

        if ($gameSystem.last_map != $gameMap.mapId()) {
            // Load defaults
            $gameSystem.loadFowDefaults();
            
            // Update $gameSystem variables based on tags for this map
            if (MVC.getProp($dataMap.meta, 'fow_enabled') != undefined)
                $gameSystem.fow_enabled = MVC.getProp($dataMap.meta, 'fow_enabled');
            if (MVC.getProp($dataMap.meta, 'fow_origin_type') != undefined)
                $gameSystem.fow_vision_type = parseInt(MVC.getProp($dataMap.meta, 'fow_origin_type'));
            if (MVC.getProp($dataMap.meta, 'fow_origin_range') != undefined)
                $gameSystem.fow_default_range = parseInt(MVC.getProp($dataMap.meta, 'fow_origin_range'));
            if (MVC.getProp($dataMap.meta, 'fow_origin_brightness') != undefined)
                $gameSystem.fow_vision_brightness = parseFloat(MVC.getProp($dataMap.meta, 'fow_origin_brightness'));
            if (MVC.getProp($dataMap.meta, 'fow_opacity') != undefined
               && MVC.getProp($dataMap.meta, 'fow_opacity') >= 0
               && MVC.getProp($dataMap.meta, 'fow_opacity') <= 1)
                $gameSystem.fow_fog_opacity = parseFloat(MVC.getProp($dataMap.meta, 'fow_opacity'));
            if (MVC.getProp($dataMap.meta, 'fow_strict_diagonals') != undefined)
                $gameSystem.fow_strict_diagonals = MVC.getProp($dataMap.meta, 'fow_strict_diagonals');
            if (MVC.getProp($dataMap.meta, 'fow_map_hidden') != undefined)
                $gameSystem.fow_map_hidden = MVC.getProp($dataMap.meta, 'fow_map_hidden');
            if (MVC.getProp($dataMap.meta, 'fow_gradient_vision') != undefined)
                $gameSystem.fow_gradient_vision = MVC.getProp($dataMap.meta, 'fow_gradient_vision');
            if (MVC.getProp($dataMap.meta, 'fow_player_vision') != undefined)
                $gameSystem.fow_player_vision = MVC.getProp($dataMap.meta, 'fow_player_vision');
            if (MVC.getProp($dataMap.meta, 'fow_player_range') && MVC.getProp($dataMap.meta, 'fow_player_range') >= 0)
                $gameSystem.fow_player_range = parseInt(MVC.getProp($dataMap.meta, 'fow_player_range'));
            if (MVC.getProp($dataMap.meta, 'fow_flying_origins') != undefined)
                $gameSystem.fow_flying_origins = MVC.getProp($dataMap.meta, 'fow_flying_origins');
            if (MVC.getProp($dataMap.meta, 'fow_player_flying') != undefined)
                $gameSystem.fow_player_flying = MVC.getProp($dataMap.meta, 'fow_player_flying');
            if (MVC.getProp($dataMap.meta, 'fow_player_type') != undefined)
                $gameSystem.fow_player_type = parseInt(MVC.getProp($dataMap.meta, 'fow_player_type'));
            if (MVC.getProp($dataMap.meta, 'fow_player_brightness') != undefined)
                $gameSystem.fow_player_brightness = parseFloat(MVC.getProp($dataMap.meta, 'fow_player_brightness'));

            $gamePlayer.vision_range = $gameSystem.fow_player_range;
            $gamePlayer.vision_type = $gameSystem.fow_player_type;
            $gamePlayer.flying_vision = $gameSystem.fow_player_flying;
            $gamePlayer.vision_brightness = $gameSystem.fow_player_brightness;
            if ($gameSystem.fow_player_vision) {
                $gamePlayer.is_origin = true;
                $gamePlayer.calculateEndPoints();
            } else {
                $gamePlayer.is_origin = false;
            }
            $.visible_sets[0] = new CS_Set();
            for (let e of $gameMap.events()) {        
                $.visible_sets[e.eventId()] = new CS_Set(); 

                // Declare parameters for origin events
                var data_e = $dataMap.events[e.eventId()];
                e.end_points = new Array();
                var range = parseInt(MVC.getProp(data_e.meta, 'fow_origin_range'));
                e.vision_range = (Number.isInteger(range)) ? range : $gameSystem.fow_default_range;
                range = parseInt(e.searchComment('fow_origin_range'));
                e.vision_range = (Number.isInteger(range)) ? range : e.vision_range;
                this.old_range = this.vision_range;
                var type = parseInt(MVC.getProp(data_e.meta, 'fow_origin_type'));
                e.vision_type = (Number.isInteger(type)) ? type : $gameSystem.fow_vision_type;
                type = parseInt(e.searchComment('fow_origin_type'));
                e.vision_type = (Number.isInteger(type)) ? type : e.vision_type;
                var flying = MVC.getProp(data_e.meta, 'fow_origin_flying');
                if (flying != undefined)
                    if (flying.trim() == 'true')
                        e.flying_vision = true;
                    else if (flying.trim() == 'false')
                        e.flying_vision = false;
                    else
                        e.flying_vision = $gameSystem.fow_flying_origins;
                e.flying_vision = (e.searchComment('fow_origin_flying')) ? true : e.flying_vision;
                var brightness = parseFloat(MVC.getProp(data_e.meta, 'fow_origin_brightness'));
                e.vision_brightness = (!Number.isNaN(brightness)) ? brightness : $gameSystem.fow_vision_brightness;
                brightness = parseFloat(e.searchComment('fow_origin_brightness'));
                e.vision_brightness = (!Number.isNaN(brightness)) ? brightness : e.vision_brightness;
                
                if (e.is_origin)
                    e.calculateEndPoints();
            }

            $gameSystem.last_map = $gameMap.mapId();
        } 

        // Initialize fog if enabled
        if($gameSystem.fow_enabled) {
            // Load discovered tiles
            if ($gameSystem.fow_discovered_map[$gameMap.mapId()] != undefined)
                $._discovered_tiles = $gameSystem.fow_discovered_map[$gameMap.mapId()];
            else
                $._discovered_tiles = undefined;
            $.init();  
            $.first_update = true;
        } else {
            $.clear();
        }
    };

    var old_Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {    
        old_Scene_Map_update.call(this);
        
        if (!$gameSystem.fow_enabled && $._fog_tiles[0][0].visible) {
            $.clear();
        }
    }

    // ===End Alias Scene_Map===

    // ===Game Interpreter prototype===
    var old_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        old_Game_Interpreter_pluginCommand.call(this, command, args);

        command = command.toLowerCase();
        if(command === 'cs_fow' && args[0]) {
            var option = args[0].toLowerCase();
            switch (option) {
                case 'enable':
                    // Prevent double loading
                    if (! $gameSystem.fow_enabled) {
                        $gameSystem.fow_enabled = true;
                        $.init();
                        $.first_update = true;
                        for (let e of $.getOrigins()) {
                            $.applyVision(e);
                        }
                    }
                    break;
                case 'disable':
                    if ($gameSystem.fow_enabled) {
                        $gameSystem.fow_enabled = false;
                        $.clear();
                    }
                    break;
                case 'enable_player':
                    if (! $gameSystem.fow_player_vision) { 
                        $gameSystem.fow_player_vision = true;
                        $.addOrigin($gamePlayer);
                    }
                    break;
                case 'disable_player':
                    if ($gameSystem.fow_player_vision) {
                        $gameSystem.fow_player_vision = false;
                        $gamePlayer.is_origin = false;
                        if ($gameSystem.fow_enabled)
                            $.removeVision($gamePlayer);
                    }
                    break;
                case 'set_player_range':
                    if (args[1] && args[1] >= 0) {
                        $gamePlayer.vision_range = parseInt(args[1]);
                        $gameSystem.fow_player_range = parseInt(args[1]);
                        $gamePlayer.calculateEndPoints();
                        if ($gameSystem.fow_enabled && $gameSystem.fow_player_vision)
                            $.applyVision($gamePlayer);
                    }
                    break;
                case 'set_player_type':
                    if (!Number.isNaN(args[1])) {
                        $gamePlayer.vision_type = parseInt(args[1]);
                        $gameSystem.fow_player_type = parseInt(args[1]);
                        $gamePlayer.calculateEndPoints();
                        if ($gameSystem.fow_enabled && $gameSystem.fow_player_vision)
                            $.applyVision($gamePlayer);                    
                    }
                    break;
                case 'set_player_flying':
                    if (args[1] == 'true') {
                        $gamePlayer.flying_vision = true;
                        $gameSystem.fow_player_flying = true;              
                    } else if (args[1] == 'false') {
                        $gamePlayer.flying_vision = false;
                        $gameSystem.fow_player_flying = false;              
                    }
                    $gamePlayer.calculateEndPoints();
                    if ($gameSystem.fow_enabled && $gameSystem.fow_player_vision)
                            $.applyVision($gamePlayer);      
                    break;
                case 'set_player_brightness':
                    if (!Number.isNaN(args[1])) {
                        $gamePlayer.vision_brightness = parseFloat(args[1]);
                        $gameSystem.fow_player_brightness = parseFloat(args[1]);
                        $gamePlayer.calculateEndPoints();
                        if ($gameSystem.fow_enabled && $gameSystem.fow_player_vision)
                            $.applyVision($gamePlayer);                    
                    }
                    break;
                case 'add_origin':
                    if (!Number.isNaN(args[1])) {
                        $.addOrigin($gameMap.event(parseInt(args[1])));
                    }
                    break;
                case 'set_origin_range':
                    if (!Number.isNaN(args[1]) && !Number.isNaN(args[2])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        e.vision_range = parseInt(args[2]);
                        e.calculateEndPoints();
                        if ($gameSystem.fow_enabled && e.is_origin)
                            $.applyVision(e); 
                    }
                    break;
                case 'set_origin_type':
                    if (!Number.isNaN(args[1]) && !Number.isNaN(args[2])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        e.vision_type = parseInt(args[2]);
                        e.calculateEndPoints();
                        if ($gameSystem.fow_enabled && e.is_origin)
                            $.applyVision(e); 
                    }
                    break;
                case 'set_origin_flying':
                    if (!Number.isNaN(args[1])) { 
                        var e = $gameMap.event(parseInt(args[1]));
                        if (args[2] == 'true')
                            e.flying_vision = true;
                        else
                            e.flying_vision = false;
                        e.calculateEndPoints();
                        if ($gameSystem.fow_enabled && e.is_origin)
                            $.applyVision(e); 
                    }
                    break;
                case 'set_origin_brightness':
                    if (!Number.isNaN(args[1]) && !Number.isNaN(args[2])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        e.vision_brightness = parseFloat(args[2]);
                        e.calculateEndPoints();
                        if ($gameSystem.fow_enabled && e.is_origin)
                            $.applyVision(e); 
                    }
                    break;
                case 'remove_origin':
                    if (!Number.isNaN(args[1])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        if (e != $gamePlayer)
                            if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_origin')) {
                                e.is_origin = false;
                                if ($gameSystem.fow_enabled)
                                    $.removeVision(e);    
                            }
                    }
                    break;
                case 'remove_all_origins':
                    for (let e of $.getOrigins()) {
                        if (e != null && e != undefined)
                            if (e != $gamePlayer)
                                if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_origin')) {
                                    e.is_origin = false;
                                    if ($gameSystem.fow_enabled)
                                        $.removeVision(e);
                                }
                    }
                    break;
                case 'add_target':
                    if (!Number.isNaN(args[1])) {
                        $.addTarget($gameMap.event(parseInt(args[1])));
                    }
                    break;
                case 'remove_target':
                    if (!Number.isNaN(args[1])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_target'))
                            e.is_target = false;
                    }
                    break;
                case 'remove_all_targets':
                    for (let e of $.getTargets()) {
                        if (e != null && e != undefined) {
                            if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_target'))
                                e.is_target = false;
                        }
                    }
                    break;
                case 'add_blocker':
                    if (!Number.isNaN(args[1]) && !Number.isNaN(args[2])) {
                        $.addBlocker($gameMap.event(parseInt(args[1])), parseInt(args[2]));
                    }
                    break;
                case 'remove_blocker':
                    if (!Number.isNaN(args[1])) {
                        var e = $gameMap.event(parseInt(args[1]));
                        //if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_blocker'))
                            $.removeBlocker(e);
                    }
                    break;
                case 'remove_all_blockers':
                    for (let e of $.getTargets()) {
                        if (e != null && e != undefined) {
                            //if (! MVC.getProp($dataMap.events[e.eventId()].meta, 'fow_blocker'))
                                $.removeBlocker(e);
                        }
                    }
                    break;
                default: return false;
            }
        }
    }
// ===End Game Interpreter prototype===   

})(CS_FogOfWar);
