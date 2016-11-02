//TESTING - need to define this to test script
var PluginManager = PluginManager || {};
PluginManager.parameters = function() {};

var Game_Event = Game_Event || {};
Game_Event.prototype = Game_Event.prototype || {};
Game_Event.prototype.initialize = function(mapId, eventId) {
    this.x = 0;
    this.y = 0;
    this._direction = 0;
    this.visible = 0;
    this.visible_set = new Set();
    
    $gameMap.setEvent(eventId, this);
};
Game_Event.prototype.moveto = function(x, y) {
    this.x = x;
    this.y = y;
}
Game_Event.prototype.direction = function() {
    return this._direction;
}

var Game_System = Game_System || {};
Game_System.prototype = Game_System.prototype || {};
Game_System.prototype.initialize = function() {};

function Game_Player() {
    this.initialize.apply(this, arguments);
}
Game_Player.prototype = Object.create(Game_Event.prototype);
Game_Player.constructor = Game_Player;
Game_Player.prototype.initialize = function() {
    Game_Event.prototype.initialize.call(this);
};

var Scene_Map = Scene_Map || {};

var SceneManager = SceneManager || {};
SceneManager._scene = Scene_Map;
SceneManager.onSceneStart = function() {};
SceneManager.changeScene = function() {};

var Game_Interpreter = Game_Interpreter || {};
Game_Interpreter.prototype = Game_Interpreter.prototyp || {};
Game_Interpreter.prototype.pluginCommand = function(command, args) {};

function GameMap(w, l) {
    this.sizeX = w;
    this.sizeY = l;
    this._regionId = new Array(this.sizeX);
    for (var i = 0; i < this.sizeX; i++) {
        this._regionId[i] = new Array(this.sizeY);
        for (var j = 0; j < this.sizeY; j++) {
            if (Math.floor(Math.random() * 2) == 0)
                this._regionId[i][j] = Math.floor(Math.random() * 4);
            else   
                this._regionId[i][j] = 0;
        }
    }
    
    this._events = new Array();
    this.events = function() { return this._events;};
    this.event = function(event_id) { return this._events[event_id]};
    this.setEvent = function(event_id, e) { this._events[event_id] =  e};
    
    this.regionId = function(x, y)
    {
        return this._regionId[x][y];
    }
}
var $gameMap = new GameMap(11, 11);
function dataMap() {
    this.meta = new Map();
    this.meta['fow_enabled'] = true;
    this.meta['fow_player_range'] = 5;
    /*
    this.meta['fow_type'] = 3;
    this.meta['fow_strict_diagonals'] = true;
    */
}
$dataMap = new dataMap();

function Bitmap(width, height) {
    this.fillAll = function(b) {};
}

function Sprite(image) {
    this.x = 0;
    this.y = 0;
    this.anchor = {};
    this.anchor.x = 0;
    this.anchor.y = 0;
    this.opacity = 0;
    this.visible = false;
}

/*
 * ===Parameter List===
 *
 * @param Enabled
 * @desc Enable fog by default in any map.
 * @default false
 *
 * @param Fog Opacity
 * @desc Default opacity of the fog sprites, between 0 to 1
 * @default 0.5
 *
 * @param Map Hidden
 * @desc Whether the map is hidden and needs to be discovered.  If set to true, then map starts out blacked out (think Starcraft)
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
 * @desc Default vision type for Player. 1 - Diamond, 2 - Square, 3 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Player Flying Vision
 * @desc Whether Player has unobstructed vision or not.
 * @default false
 *
 * @param Origin Vision Range
 * @desc This is the default vision range for origin events.
 * @default 3
 *
 * @param Origin Vision Type
 * @desc Default vision type for origin events (except Player). 1 - Diamond, 2 - Square, 3 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Origin Flying Vision
 * @desc Whether origin events will have unobstructed vision by default or not
 * @default false
 *
 * @param Plain RegionId
 * @desc RegionId for plain tiles
 * @default 1
 *
 * @param Forest RegionId
 * @desc RegionId for forest tiles
 * @default 1
 *
 * @param Hill RegionId
 * @desc RegionId for hill tiles
 * @default 2
 *
 * @param Mountain / Wall RegionId
 * @desc RegionId for mountain / wall tiles
 * @default 3
 *
 * @param Watchtower RegionId
 * @desc RegionId for watchtower tiles
 * @default 4
 *
 * @param Watchtower Modifier
 * @desc Vision range modifier for watchtower tiles.  It will increase the range by n
 * @default 1
 *
 * ===Map Notetag===
 *
 * <fow_enabled>
 * desc: Eanbles fog of war for this map
 *
 * <fow_type: (value)>
 * desc: Sets the fog type for this map.  (value): 1 - Diamond, 2 - Square, 3 - Directional 
 *
 * <fow_opacity: (value)>
 * desc: Sets the fog sprite opacity for this map.  (value): between 0 to 1
 *
 * <fow_map_hidden>
 * desc: Eanbles hidden map fog of war
 *
 * <fow_strict_diagonals>
 * desc: Eanbles strict diagonals visibility detection
 *
 * <fow_flying_origins>
 * desc: Origins will have unobstructed vision.
 *
 * <fow_player_vision>
 * desc: Player has vision for this map
 *
 * <fow_player_range: (value)>
 * desc: Player's range for this map
 *
 * ===Event Notetag===
 *
 * <fow_origin>
 * desc: Event will be able to reveal fog. (range) is the vision range of the event.
 *
 * <fow_origin_range: (range)>
 * desc: Set the origin event's vision range.
 *
 * <fow_origin_type: (type)>
 * desc: Set the origin event's vision type.
 *
 * <fow_origin_flying: (bool)>
 * desc: Set the origin's flying (unobstructed vision) attribute
 *
 * <fow_target>
 * desc: Event will be hidden unless on a revealed tile.
 *
 * ===Plugin Commands===
 *
 * cs_fow enable
 * desc: Enable fog of war.
 *
 * cs_fow disable
 * desc: Disable fog of war. Note: does not reveal target events hidden by fog
 *
 * cs_fow enable_player
 * desc: Enable player vision.
 *
 * cs_fow disable_player
 * desc: if put in the map note tags then scrolling will be back to normal instead of grid scrolling.
 *
 * cs_fow set_player_range <integer>
 * desc: Set the player's vision range.
 *
 * cs_fow set_player_type <event id> <type>
 * desc: Set the player's vision type.
 *
 * cs_fow set_player_flying <event id> <bool>
 * desc: Set the player's flying (unobstructed vision) attribute.
 *
 * cs_fow add_origin <event id>
 * desc: Event will be able to reveal fog.
 *
 * cs_fow set_origin_range <event id> <range>
 * desc: Set the origin's vision range.
 *
 * cs_fow set_origin_type <event id> <type>
 * desc: Set the origin's vision type.
 *
 * cs_fow set_origin_flying <event id> <bool>
 * desc: Set the origin's flying (unobstructed vision) attribute.
 *
 * cs_fow remove_origin <event id>
 * desc: Remove event from origin list. Does not work on events with <fow_origin> or<fow_flying_origin> notetag. 
 *
 * cs_fow remove_all_origins
 * desc: Removes all origins, excluding player and events with <fow_origin> notetag.
 *
 * cs_fow add_target <event id>
 * desc: 
 *
 * cs_fow remove_target <event id>
 * desc: Remove event from target list. Does not work on events with <fow_target> notetag. 
 *
 * cs_fow remove_all_targets
 * desc: Remove all targets, excluding events with <fow_target> notetag.
 *
 * ===Limitation===
 * - Cannot save "discovered tiles" between maps.  Too expensive to do
 * - Targets will not show/hide correctly if they are bigger than 1 tile
 *
*/

var Imported = Imported || {};
Imported.CityShrimp = true;

var CityShrimp = CityShrimp || {};
CityShrimp.Fow = CityShrimp.Fow || {};

// Load parameters
CityShrimp.Fow.parameters = PluginManager.parameters("CityShrimp_Fow") || {};
CityShrimp.Fow.enabled = (CityShrimp.Fow.parameters['Enabled'] === 'true') ? true : false;
CityShrimp.Fow.fog_opacity = Number(CityShrimp.Fow.parameters['Fog Opacity'] || 0.5);
CityShrimp.Fow.map_hidden = (CityShrimp.Fow.parameters['Map Hidden'] === 'true') ? true : false;
CityShrimp.Fow.strict_diagonals = (CityShrimp.Fow.parameters['Strict Diagonals'] === 'true') ? true : false;
CityShrimp.Fow.player_vision = (CityShrimp.Fow.parameters['Player Vision'] === 'false') ? false : true;
CityShrimp.Fow.player_range = Number(CityShrimp.Fow.parameters['Player Vision Range'] || 3);
CityShrimp.Fow.player_type = Number(CityShrimp.Fow.parameters['Player Vision Type'] || 1);
CityShrimp.Fow.player_flying = Number(CityShrimp.Fow.parameters['Player Flying Vision'] === 'true') ? true : false;
CityShrimp.Fow.default_range = Number(CityShrimp.Fow.parameters['Origin Vision Range'] || 3);
CityShrimp.Fow.vision_type = Number(CityShrimp.Fow.parameters['Origin Vision Type'] || 1);
CityShrimp.Fow.flying_origins = (CityShrimp.Fow.parameters['Origin Flying Vision'] === 'true') ? true : false;
CityShrimp.Fow._plain_region_id = Number(CityShrimp.Fow.parameters['Plain RegionId'] || 0);
CityShrimp.Fow._forest_region_id = Number(CityShrimp.Fow.parameters['Forest RegionId'] || 1); 
CityShrimp.Fow._hill_region_id = Number(CityShrimp.Fow.parameters['Hill RegionId'] || 2);
CityShrimp.Fow._mountain_region_id = Number(CityShrimp.Fow.parameters['Mountain RegionId'] || 3);
CityShrimp.Fow._watchtower_region_id = Number(CityShrimp.Fow.parameters['Watchtower RegionId'] || 4);
CityShrimp.Fow._watchtower_modifier = Number(CityShrimp.Fow.parameters['Watchtower Modifier'] || 1);

// Use the same bitmap for all fog
CityShrimp.Fow.bitmap = new Bitmap(32, 32);
CityShrimp.Fow.bitmap.fillAll('black');

// ===SuperOrangeMovementEX's MVCommons Module===

if (Imported['MVCommons'] === undefined) {
  var MVC = MVC || {};

  (function($) {
    $.defaultGetter = function(name) {return function() {return this['_' + name];};};
    $.defaultSetter = function(name) {return function(value) {var prop = '_' + name;if ((!this[prop]) || this[prop] !== value) {this[prop] = value;if (this._refresh) {this._refresh();}}};};
    $.accessor = function(value, name /* , setter, getter */ ) {Object.defineProperty(value, name, {get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name),set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name),configurable: true});};
    $.reader = function(obj, name /*, getter */ ) {Object.defineProperty(obj, name, {get: arguments.length > 2 ? arguments[2] : defaultGetter(name),configurable: true});};
    $.getProp = function(meta, propName) {if (meta === undefined) return undefined;if (meta[propName] !== undefined) return meta[propName];for (var key in meta) {if (key.toLowerCase() == propName.toLowerCase()) {return meta[key];}}return undefined;};
  })(MVC);

  Number.prototype.fix = function() {return (parseFloat(this.toPrecision(12)));};
  Number.prototype.floor = function() {return Math.floor(this.fix());};
  Number.prototype.ceil = function() {return Math.ceil(this.fix());};
  Number.prototype.abs = function() {return Math.abs(this);};
}

// ==========================================

// Draw Fog Sprite
function fog_sprite(){};
fog_sprite.prototype.initialize = function(x, y) {
    return this.createSprite(x, y);
}

fog_sprite.prototype.createSprite = function(x, y) {
    this._sprite = new Sprite(CityShrimp.Fow.bitmap);
    this._sprite.x = x;
    this._sprite.y = y;
    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
    this._sprite.opacity = CityShrimp.Fow.fog_opacity;
    this._sprite.visible = false;
    // !!! this might need to change to a scene or something if nothing appears on screen
    this.addChild(this._sprite);
    
    return this._sprite;
}

fog_sprite.prototype.deleteSprite = function() {
    this.removeChild(this._sprite);
}

// TESTING temporary
fog_sprite.prototype.addChild = function(sprite) {};

// Game_Event prototype
var old_Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    old_Game_Event_initialize.call(this, mapId, eventId);
    
    // Declare parameters for origin events
    this.visible_set = new Set();
    this.vision_range = CityShrimp.Fow.default_range;
    this.vision_type = CityShrimp.Fow.vision_type;
    this.flying_vision = false;
    this.floorX = this.x.floor();
    this.floorY = this.y.floor();
};

var old_Game_Event_moveto = Game_Event.prototype.moveto;
Game_Event.prototype.moveto = function(x, y) {
    old_Game_Event_moveto.call(this, x, y);
    
    this.updateFloor();
    // Apply vision after move if fog is enabled and event is an origin
    if ($gameSystem.fow_enabled)
        for (let e of $gameSystem.fow_origins)
            if (e == this) {
                // Remove vision if event is moved outside of map
                if (e.x >= $gameMap.sizeX || e.x < 0
                   || e.y >= $gameMap.sizeY || e.y < 0)
                    CityShrimp.Fow.removeVision(e);
                else    
                    CityShrimp.Fow.applyVision(this);
            }
};

Game_Event.prototype.updateFloor = function() {
    this.floorX = this.x.floor();
    this.floorY = this.y.floor();
}

// Game_Player prototype
var old_Game_Player_initialize = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function() {
    old_Game_Player_initialize.call(this);
    this.vision_range = CityShrimp.Fow.player_range;
};

// Game_System prototype
// Declare variables that needs to be stored when game is saved
var old_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    old_Game_System_initialize.call(this);
    
    // Save Fog of War parameters, so it is retained upon loading
    this.fow_enabled = CityShrimp.Fow.enabled;
    this.fow_origins = new Set();
    this.fow_targets = new Set();
    this.fow_discovered_map = new Map();
    
    return this;
};

// TESTING Temporary
var $gameSystem = Game_System.prototype.initialize();

var $gamePlayer = new Game_Player();
$gamePlayer.x = 5;
$gamePlayer.y = 5;
$gamePlayer.updateFloor();

//==============================================================================
// ** SceneManager
//==============================================================================
var old_SceneManager_onSceneStart = SceneManager.onSceneStart;
SceneManager.onSceneStart = function() {
    old_SceneManager_onSceneStart();
    // Update $gameSystem variables based on tags for this map
    if (MVC.getProp($dataMap.meta, 'fow_enabled') != undefined)
        $gameSystem.fow_enabled = MVC.getProp($dataMap.meta, 'fow_enabled');
    if (MVC.getProp($dataMap.meta, 'fow_type') != undefined)
        CityShrimp.Fow.vision_type = MVC.getProp($dataMap.meta, 'fow_type');
    if (MVC.getProp($dataMap.meta, 'fow_opacity') != undefined
       && MVC.getProp($dataMap.meta, 'fow_opacity') >= 0
       && MVC.getProp($dataMap.meta, 'fow_opacity') <= 1)
        CityShrimp.Fow.fog_opacity = MVC.getProp($dataMap.meta, 'fow_opacity');
    if (MVC.getProp($dataMap.meta, 'fow_strict_diagonals') != undefined)
        CityShrimp.Fow.strict_diagonals = MVC.getProp($dataMap.meta, 'fow_strict_diagonals');
    if (MVC.getProp($dataMap.meta, 'fow_map_hidden') != undefined)
        CityShrimp.Fow.map_hidden = MVC.getProp($dataMap.meta, 'fow_map_hidden');
    if (MVC.getProp($dataMap.meta, 'fow_player_vision') != undefined)
        CityShrimp.Fow.player_vision = MVC.getProp($dataMap.meta, 'fow_player_vision');
    if (MVC.getProp($dataMap.meta, 'fow_player_range') && MVC.getProp($dataMap.meta, 'fow_player_range') >= 0)
        CityShrimp.Fow.player_range = MVC.getProp($dataMap.meta, 'fow_player_range');
    if (MVC.getProp($dataMap.meta, 'fow_flying_origins') != undefined)
        CityShrimp.Fow.flying_origins = MVC.getProp($dataMap.meta, 'fow_flying_origins');
    
    // Initialize fog if enabled
    //if(this._scene instanceof Scene_Map && fow_enabled) {
    // TESTING - couldn't get instanceof to work without RMMV
    if($gameSystem.fow_enabled) {
        CityShrimp.Fow.init();  
    }
};

// !!! Need to figure out how to erase data when moving to another scene, but preserve it when loading a game
var old_SceneManager_changeScene = SceneManager.changeScene;
SceneManager.changeScene = function() {
    old_SceneManager_changeScene();
    
    // Need to clear origins, targets, and discovered tiles set when changing maps
    //if(this._scene instanceof Scene_Map && $gameSystem.fow_enabled) {
    // TESTING - couldn't get instanceof to work without RMMV
    if($gameSystem.fow_enabled) {        
        // Free up memory
        CityShrimp.Fow.erase();
    }
};

// Create fog sprites and sight count map
CityShrimp.Fow.init = function() {    
    // Map has "Map Hidden" enabled, need to save a copy of discovered tiles
    if (CityShrimp.Fow.map_hidden) {
        this._discovered_tiles = new Array($gameMap.sizeX);
        // !!! datamap.id might not be right
        // $gameSystem.fow_discovered_map.set($dataMap.id, this._discovered_tiles);
    }
    
    // Check if tiles have already been generated previously
    if (! this._fog_tiles)
        this._fog_tiles = new Array($gameMap.sizeX);
    
    this._sight_count = new Array($gameMap.sizeX);
    for (var i = 0; i < $gameMap.sizeX; i++) {
        this._fog_tiles[i] = new Array($gameMap.sizeY);
        this._sight_count[i] = new Array($gameMap.sizeY);
        for (var j = 0; j < $gameMap.sizeY; j++) {
            this._sight_count[i][j] = 0;
            this._fog_tiles[i][j] = fog_sprite.prototype.initialize(i, j);
        }
    }
    
    // Add player to origins if enabled
    if (CityShrimp.Fow.player_vision) {
        $gamePlayer.vision_range = CityShrimp.Fow.player_range;
        $gameSystem.fow_origins.add($gamePlayer);
    }
        
    for (let e of $gameMap.events()) {
        // Add events with <fow_origin> tag and update it's range
        if (MVC.getProp(e.meta, 'fow_origin')) {
            if (Number.isInteger(MVC.getProp(e.meta, 'fow_origin_range')))
                e.vision_range = MVC.getProp(e.meta, 'fow_origin_range');
            else
                e.vision_range = CityShrimp.Fow.default_range;
            
            if (Number.isInteger(MVC.getProp(e.meta, 'fow_origin_type')))
                e.vision_type = MVC.getProp(e.meta, 'fow_origin_type');
            else
                e.vision_type = CityShrimp.Fow.default_range;
            
            if (MVC.getProp(e.meta, 'fow_origin_flying') == 'true')
                e.vision_range = true;
            else if (MVC.getProp(e.meta, 'fow_origin_flying') == 'false')
                e.flying_vision = false;
            else
                e.flying_vision = CityShrimp.Fow.flying_vision;
            
            
            $gameSystem.fow_origins.add(e);
        }
        
        // Add events with <for_target> tag
        else if (MVC.getProp(e.meta, 'fow_target'))
            $gameSystem.fow_targets.add(e);
    }
       
    // Hide all targets
    for (let e of $gameSystem.fow_targets) {
        e.visible = false;
    }
    
    // Apply initial vision when map loads
    for (let e of $gameSystem.fow_origins) {
        this.applyVision(e);
    }
}

// Make all fog sprites invisible
CityShrimp.Fow.clear = function() {
    for (var i = 0; i < $gameMap.sizeX; i++) {
        for (var j = 0; j < $gameMap.sizeY; j++) {
            this._sight_count[i][j] = 0;
            this._fog_tiles[i][j].visible = false;
        }
    }
    
    // Clear origin events' old visible set
    for (let e of $gameSystem.fow_origins)
        e.visible_set = new Set();
}

// Delete all fog sprites
CityShrimp.Fow.erase = function() {
    if (this._fog_tiles)
        for (var i = 0; i < $gameMap.sizeX; i++) {
            for (var j = 0; j < $gameMap.sizeY; j++) {
                this._fog_tiles[i][j].deleteSprite();
            }
        }
}

CityShrimp.Fow.applyVision = function(e) {    
    // Don't do anything if event is outside of map
    if (e.x >= $gameMap.sizeX || e.x < 0
        || e.y >= $gameMap.sizeY || e.y < 0)
        return;
    
    // Check edge points
    var range = this._getRange(e);
    var points = this._getPoints(e, range);
    new_set = new Set();
    
    this._getVisibleSet(e, points, new_set);
    
    // For diamond shaped, need to check edge-1 points (for diagonals) for range >= 3
    if (e.vision_type == 1)
        if (range >= 3) {
            points = this._getPoints(e, range - 1);
            this._getVisibleSet(e, points, new_set);   
        }
    
    this._resolveVisibility(e, new_set);
}

CityShrimp.Fow.removeVision = function(e) {
    for (let s of e.visible_set) {
        this._sight_count[s.x][s.y]--;
        
        if (this._sight_count[s.x][s.y] == 0) {
            s.visible = false;
            
            // Hide target events on this square
            for (let target of $gameSystem.fow_targets) {
                if (target.floorX == s.x && target.floorY == s.y)
                    target.visible = false;
            }
        }
    }
    
    // remove event's visible set afterwards
    e.visible_set = new Set();
}

CityShrimp.Fow.isVisible = function(x, y) {
    return this._sight_count[x][y];
}

CityShrimp.Fow._getPoints = function(e, range) {
    var points = new Set();
    e.updateFloor();
    
    switch(e.vision_type) {
        case 1:        
            points.add([e.floorX, e.floorY + range]);
            points.add([e.floorX, e.floorY - range]);
            points.add([e.floorX + range, e.floorY]);
            points.add([e.floorX - range, e.floorY]);
            for (var i = 1; i < range; i++)
            {
                points.add([e.floorX + i, e.floorY + (range - i)]);
                points.add([e.floorX - i, e.floorY + (range - i)]);
                points.add([e.floorX + i, (e.floorY - (range - i))]);
                points.add([e.floorX - i, (e.floorY - (range - i))]);
            }
            break;
        case 2:
            for (var i = -range; i < range; i++) {
                points.add([e.floorX + range, e.floorY + i]);
                points.add([e.floorX - range, e.floorY - i]);
                points.add([e.floorX - i, e.floorY + range]);
                points.add([e.floorX + i, e.floorY - range]);
            }
            break;
        case 3:
            // !!! Need to change case to match the actual game direction.  Right now just random assigned
            switch (e.direction()) {
                // Down
                case 0: 
                    for (var i = -range; i <= range; i++)
                        points.add([e.floorX + i, e.floorY + range]);
                    break;
                // Left
                case 1:
                    for (var i = -range; i <= range; i++)
                        points.add([e.floorX - range, e.floorY + i]);
                    break;
                // Right
                case 2:
                    for (var i = -range; i <= range; i++)
                        points.add([e.floorX + range, e.floorY + i]);
                    break;
                // Up
                case 3:
                    for (var i = -range; i <= range; i++)
                        points.add([e.floorX + i, e.floorY - range]);
                    break;
            }
            break;
    }

    return points;
}

// Checks tiles around origin and mark them as visible or blocked
CityShrimp.Fow._getVisibleSet = function(e, points, new_visible_set) {
    var origin_height = this._getHeight(e);
    
    var my_x = e.floorX + 0.5;
    var my_y = e.floorY + 0.5;
    
    new_visible_set.add(this._fog_tiles[e.floorX][e.floorY]);
    
    for (let point of points) {
        var target_x = point[0] + 0.5;
        var target_y = point[1] + 0.5;
        
        var cur_range = (target_x - my_x).abs() + (target_y - my_y).abs();
        
        var step_x = (target_x - my_x) / cur_range;
        var step_y = (target_y - my_y) / cur_range;
        
        var cur_x = my_x;
        var cur_y = my_y;
        
        var left_blocked = false;
        var right_blocked = false;
        
        for (var i = 1; i <= cur_range; i++)
        {   
            cur_x += step_x;
            cur_y += step_y;
            
            // Stop if reach outside of map
            if (cur_x >= $gameMap.sizeX || cur_x < 0
                || cur_y >= $gameMap.sizeY || cur_y < 0)
                break;
            
            var floor_x = cur_x.floor();
            var floor_y = cur_y.floor();
            
            // Only need to check if unit isn't flying
            if (! e.flying_vision) {
            
                // If Strict Diagonals is enabled, need to check left and right tiles if landed in between 4 tiles
                var deltaX = cur_x - cur_x.floor();
                var deltaY = cur_y - cur_y.floor();
                if (CityShrimp.Fow.strict_diagonals) {
                    if (deltaX <= 0.01 && deltaY <= 0.01) {
                        // !!! Need to implement check left and right
                        if ((step_x > 0 && step_y > 0) || (step_x < 0 && step_y < 0)) {
                            var left_region_id = $gameMap.regionId(floor_x - 1, floor_y);
                            var right_region_id = $gameMap.regionId(floor_x, floor_y - 1);
                        } else {
                            var left_region_id = $gameMap.regionId(floor_x - 1, floor_y - 1);
                            var right_region_id = $gameMap.regionId(floor_x, floor_y);
                        }

                        // Unit have limited visibility
                        if (origin_height == 0)
                        {   
                            if (left_region_id == CityShrimp.Fow._hill_region_id ||
                                left_region_id == CityShrimp.Fow._forest_region_id ||
                                left_region_id == CityShrimp.Fow._mountain_region_id) {
                                left_blocked = true;
                            }
                            if (right_region_id == CityShrimp.Fow._hill_region_id ||
                                right_region_id == CityShrimp.Fow._forest_region_id ||
                                right_region_id == CityShrimp.Fow._mountain_region_id) {
                                right_blocked = true;
                            }
                        }
                        // Unit have high visibility (can see through everythign except mountain)
                        else
                        {
                            if (left_region_id == CityShrimp.Fow._mountain_region_id) {
                                left_blocked = true;
                            }
                            if (right_region_id == CityShrimp.Fow._mountain_region_id) {
                                right_blocked = true;
                            }
                        }   

                        // Blocked if both left and right are blocked
                        if (left_blocked && right_blocked)
                            break;
                    }
                }
            }
            
            // Skip if point lands between two tiles
            if (deltaX <= 0.01 || deltaY <= 0.01) {
                continue;
            }
            
            new_visible_set.add(this._fog_tiles[floor_x][floor_y]);
            
            // Only need to check if unit isn't flying
            if (! e.flying_vision) {
                var point_region_id = $gameMap.regionId(floor_x, floor_y);

                // Unit have limited visibility
                if (origin_height == 0)
                {
                    if (point_region_id == CityShrimp.Fow._hill_region_id ||
                        point_region_id == CityShrimp.Fow._forest_region_id ||
                        point_region_id == CityShrimp.Fow._mountain_region_id) {
                        break;
                    }
                }
                // Unit have high visibility (can see through everythign except mountain)
                else
                {
                    if (point_region_id == CityShrimp.Fow._mountain_region_id) {
                        break;
                    }
                }   
            }
        }
    }
}

// Update sight map with new visibility info
CityShrimp.Fow._resolveVisibility = function(origin, new_set) {
    // New set
    for (let s of new_set) {
        // If it wasn't visible before, add sight counter
        if (! origin.visible_set.has(s)) {
            this._sight_count[s.x][s.y]++;
            
            // Tile was blacked out before, display it
            if (this._sight_count[s.x][s.y] == 1) {
                s.visible = true;
                
                // Show target events on this square
                for (let target of $gameSystem.fow_targets)
                    if (target.floorX == s.x && target.floorY == s.y)
                        target.visible = true;
            }
        } else {
            // Tile was visible before, so delete from old set
            origin.visible_set.delete(s);
        }
    }
    
    // Old set
    for (let s of origin.visible_set) {
        this._sight_count[s.x][s.y]--;
        
        if (this._sight_count[s.x][s.y] == 0) {
            s.visible = false;
            
            // Hide target events on this square
            for (let target of $gameSystem.fow_targets) {
                if (target.floorX == s.x && target.floorY == s.y)
                    target.visible = false;
            }
        }
    }
    
    origin.visible_set = new_set;
}

// Get the object's "height"
CityShrimp.Fow._getHeight = function(e) {
    // Unit on a hill or mountain / wall
    if (this._inRegion(e, this._hill_region_id) || this._inRegion(e, this._mountain_region_id))
        return 1;
    
    // Unit on Watch Tower
    // should return 1;
    
    return 0;
}

// Get the object's "range"
CityShrimp.Fow._getRange = function(e) {
    // Unit on a hill
    if (this._inRegion(e, this._watchtower_region_id))
        return e.vision_range + this._watchtower_modifier;
    else
        return e.vision_range;
}

// Check if the event is in specified region
CityShrimp.Fow._inRegion = function(e, regionId) {
    e.updateFloor();
    return ($gameMap.regionId(e.floorX, e.floorY) == regionId);
}

// Game Interpreter Proto
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
                    CityShrimp.Fow.init();
                }
                break;
            case 'disable':
                if ($gameSystem.fow_enabled) {
                    $gameSystem.fow_enabled = false;
                    CityShrimp.Fow.clear();
                }
                break;
            case 'enable_player':
                if (! CityShrimp.Fow.player_vision) { 
                    CityShrimp.Fow.player_vision = true;
                    $gameSystem.fow_origins.add($gamePlayer);
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.applyVision($gamePlayer);
                }
                break;
            case 'disable_player':
                if (CityShrimp.Fow.player_vision) {
                    CityShrimp.Fow.player_vision = false;
                    $gameSystem.fow_origins.delete($gamePlayer);
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.removeVision($gamePlayer);
                }
                break;
            case 'set_player_range':
                if (args[1] && args[1] >= 0) {
                    $gamePlayer.vision_range = args[1];
                    CityShrimp.Fow.player_range = args[1];
                    if ($gameSystem.fow_enabled && CityShrimp.Fow.player_vision)
                        CityShrimp.Fow.applyVision($gamePlayer);
                }
                break;
            case 'set_player_type':
                if (Number.isInteger(args[1])) {
                    $gamePlayer.vision_type = args[1];
                    CityShrimp.Fow.player_type = args[1];
                    if ($gameSystem.fow_enabled && CityShrimp.Fow.player_vision)
                        CityShrimp.Fow.applyVision($gamePlayer);                    
                }
                break;
            case 'set_player_flying':
                if (typeof args[1] === 'boolean') {
                    $gamePlayer.flying_vision = args[1];
                    CityShrimp.Fow.player_flying = args[1];
                    if ($gameSystem.fow_enabled && CityShrimp.Fow.player_vision)
                        CityShrimp.Fow.applyVision($gamePlayer);                    
                }
                break;
            case 'add_origin':
                if (Number.isInteger(args[1])) {
                    $gameSystem.fow_origins.add($gameMap.event(args[1]));
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.applyVision($gameMap.event(args[1]));                    
                }
                break;
            case 'set_origin_range':
                if (Number.isInteger(args[1]) && Number.isInteger(args[2])) {
                    $gameMap.event(args[1]).vision_range = args[2];
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.applyVision($gameMap.event(args[1]));                    
                }
                break;
            case 'set_origin_type':
                if (Number.isInteger(args[1]) && Number.isInteger(args[2])) {
                    $gameMap.event(args[1]).vision_type = args[2];
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.applyVision($gameMap.event(args[1]));                    
                }
                break;
            case 'set_origin_flying':
                if (Number.isInteger(args[1]) && (typeof args[2] === 'boolean')) {
                    $gameMap.event(args[1]).flying_vision = args[2];
                    if ($gameSystem.fow_enabled)
                        CityShrimp.Fow.applyVision($gameMap.event(args[1]));                    
                }
                break;
            case 'remove_origin':
                if (Number.isInteger(args[1]))
                    if ($gameMap.event(args[1]) != $gamePlayer)
                        if (! MVC.getProp($gameMap.event(args[1]).meta, 'fow_origin')) {
                            $gameSystem.fow_origins.delete($gameMap.event(args[1])); 
                            if ($gameSystem.fow_enabled)
                                CityShrimp.Fow.removeVision($gameMap.event(args[1]));    
                        }
                break;
            case 'remove_all_origins':
                for (let e of $gameSystem.fow_origins) 
                    if ((! MVC.getProp(e.meta, 'fow_origin')) && (e != $gamePlayer)) {
                        $gameSystem.fow_origins.delete(e);
                        if ($gameSystem.fow_enabled)
                            CityShrimp.Fow.removeVision(e);
                    }
                break;
            case 'add_target':
                if (Number.isInteger(args[1])) {
                    var e = $gameMap.event(args[1]);
                    $gameSystem.fow_targets.add(e);
                    e.updateFloor();
                    if ($gameSystem.fow_enabled && CityShrimp.Fow.isVisible(e.floorX, e.floorY))
                        e.visible = true;
                    else
                        e.visible = false;
                }
                break;
            case 'remove_target':
                if (Number.isInteger(args[1])) {
                    if (! MVC.getProp($gameMap.event(args[1]).meta, 'fow_target'))
                        $gameSystem.fow_targets.delete($gameMap.event(args[1]));
                }
                break;
            case 'remove_all_targets':
                for (let e of $gameSystem.fow_targets) 
                    if (! MVC.getProp(e.meta, 'fow_target'))
                        $gameSystem.fow_targets.delete(e);                            
                break;
            default: return false;
        }
    }
};
