/*=============================================================================
 * CityShrimp's Cover Tiles
 * CS_CoverTiles.js
 * Version: 1.0.0
 * Free for commercial and non commercial use.
 *=============================================================================*/

 /*:
 * @plugindesc This plugin provides a way to create "covers".
 *             
 * @author CityShrimp
 *
 * ===Parameter List===
 *
 * @param Cover RegionID
 * @desc This region ID will cause tile to become a cover (passable + higher than events).
 * @default 19
 *
 * @param Block RegionID
 * @desc This region ID will cause tile to become impassible.
 * @default 20
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
Imported['CS_CoverTiles'] = "1.0.0";

var CS_CoverTiles = CS_CoverTiles || {};

(function($) {
    "use strict";
    
    // Load parameters
    $.parameters = PluginManager.parameters("CS_CoverTiles") || {};
    $._cover_region_id = Number($.parameters['Cover RegionId'] || 19);
    $._block_region_id = Number($.parameters['Block RegionId'] || 20);
    
    // ===Alias Game_Map===
    var old_Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        old_Game_Map_setup.call(this, mapId);
        this.initSetup();
    };
    
    Game_Map.prototype.initSetup = function() {
        var width = this.width();
        var height = this.height();
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var id = this.regionId(x, y);
                if (id == $._cover_region_id) {
                    this.addTileId((2 * height + y) * width + x, id);
                    $dataMap.data[(2 * height + y) * width + x] = $dataMap.data[(0 * height + y) * width + x];
                    $dataMap.data[(0 * height + y) * width + x] = 0;
                }
            }
        }
    }
    
    Game_Map.prototype.addTileId = function(tileId, regionId) {
        if ($.tile_flag_set == undefined)
            $.tile_flag_set = {};
        
        $.tile_flag_set[tileId] = regionId;
    }
    
    var old_Game_Map_checkPassage = Game_Map.prototype.checkPassage;
    Game_Map.prototype.checkPassage = function(x, y, bit) {
        if ($.tile_flag_set == undefined)
            $.tile_flag_set = {};
        var rid = this.regionId(x, y);
        if (rid == $._block_region_id)
            return false;
        if (rid == $._cover_region_id)
            return true;
        return old_Game_Map_checkPassage.call(this, x, y, bit);
    }
    
    ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y) {
        var mx = startX + x;
        var my = startY + y;
        var dx = x * this._tileWidth, dy = y * this._tileHeight;
        var tileId0 = this._readMapData(mx, my, 0);
        var tileId1 = this._readMapData(mx, my, 1);
        var tileId2 = this._readMapData(mx, my, 2);
        var tileId3 = this._readMapData(mx, my, 3);
        var shadowBits = this._readMapData(mx, my, 4);
        var upperTileId1 = this._readMapData(mx, my - 1, 1);
        var lowerLayer = this.lowerLayer.children[0];
        var upperLayer = this.upperLayer.children[0];
        
        var rtileId0 = (0 * $dataMap.height + my) * $dataMap.width + mx;
        var rtileId1 = (1 * $dataMap.height + my) * $dataMap.width + mx;
        var rtileId2 = (2 * $dataMap.height + my) * $dataMap.width + mx;
        var rtileId3 = (3 * $dataMap.height + my) * $dataMap.width + mx;

        if (this._isHigherTile(tileId0)) {
            this._drawTile(upperLayer, tileId0, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId0, dx, dy);
        }
        if (this._isHigherTile(tileId1)) {
            this._drawTile(upperLayer, tileId1, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId1, dx, dy);
        }

        this._drawShadow(lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
            }
        }

        if (this._isOverpassPosition(mx, my)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            if ((rtileId2 in $.tile_flag_set) && ($.tile_flag_set[rtileId2] == $._cover_region_id)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            } else if (this._isHigherTile(tileId2)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId2, dx, dy);
            }
            if (this._isHigherTile(tileId3)) {
                this._drawTile(upperLayer, tileId3, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId3, dx, dy);
            }
        }
    };
    
    // ===End Alias Game_Map===
})(CS_CoverTiles);
