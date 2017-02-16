// ==UserScript==
// @id             intel-to-ifttt
// @name           intel-to-ifttt
// @category       Misc
// @version        0.10
// @namespace      intel-to-ifttt
// @updateURL      https://github.com/soend/IntelToIFTTT/raw/master/IntelToIFTTT.user.js
// @downloadURL    https://github.com/soend/IntelToIFTTT/raw/master/IntelToIFTTT.user.js
// @description    Sends field color from location to IFTTT service
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
//END PLUGIN AUTHORS NOTE


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
plugin.intelToIFTTT = {};

plugin.intelToIFTTT.CHECK_POINT = JSON.parse(localStorage.getItem("intelToIFTTT.CHECK_POINT"));
plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY = localStorage.getItem("intelToIFTTT.IFTTT_MAKER_SERVICE_KEY");

plugin.intelToIFTTT.lastFieldGuid = "";
window.plugin.intelToIFTTT.pointCircle;

/*
pnpoly Copyright (c) 1970-2003, Wm. Randolph Franklin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
     disclaimers.
  2. Redistributions in binary form must reproduce the above copyright notice in the documentation and/or other
     materials provided with the distribution.
  3. The name of W. Randolph Franklin may not be used to endorse or promote products derived from this Software without
     specific prior written permission.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
plugin.intelToIFTTT.pnpoly = function(latlngs, point) {
	var length = latlngs.length, c = false;

	for(var i = 0, j = length - 1; i < length; j = i++) {
		if(((latlngs[i].lat > point.lat) != (latlngs[j].lat > point.lat)) &&
		  (point.lng < latlngs[i].lng
		  + (latlngs[j].lng - latlngs[i].lng) * (point.lat - latlngs[i].lat)
		  / (latlngs[j].lat - latlngs[i].lat))) {
			c = !c;
		}
	}

	return c;
};

plugin.intelToIFTTT.distance = function(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;    // Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p)/2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p))/2;

	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

plugin.intelToIFTTT.checkFieldColor = function() {
    if (!plugin.intelToIFTTT.CHECK_POINT)
        return;

    var fields = window.fields;
    var layers = [];
    for(var guid in fields) {
		var field = fields[guid];

		if (plugin.intelToIFTTT.pnpoly(field._latlngs, plugin.intelToIFTTT.CHECK_POINT)) {
            layers.push(field);
		}
	}
    //console.log(layers);
    if (Object.keys(layers).length > 0) {
        for (var l in layers) {
            var one = plugin.intelToIFTTT.distance(layers[l].options.data.points[0].latE6 / 1E6, layers[l].options.data.points[0].lngE6 / 1E6, layers[l].options.data.points[1].latE6 / 1E6, layers[l].options.data.points[1].lngE6 / 1E6);
            var two = plugin.intelToIFTTT.distance(layers[l].options.data.points[1].latE6 / 1E6, layers[l].options.data.points[1].lngE6 / 1E6, layers[l].options.data.points[2].latE6 / 1E6, layers[l].options.data.points[2].lngE6 / 1E6);
            var three = plugin.intelToIFTTT.distance(layers[l].options.data.points[2].latE6 / 1E6, layers[l].options.data.points[2].lngE6 / 1E6, layers[l].options.data.points[0].latE6 / 1E6, layers[l].options.data.points[0].lngE6 / 1E6);
            var lenght = one + two + three;
            layers[l].d = lenght;
        }
        layers.sort(function(a, b) {
            return parseFloat(a.d) - parseFloat(b.d);
        });

        var topLayer = layers[layers.length - 1];

        if (plugin.intelToIFTTT.lastFieldGuid !== topLayer.options.guid) {
            if(topLayer.options.team == TEAM_ENL)
                plugin.intelToIFTTT.sendMessage("ENL");
            else if(topLayer.options.team == TEAM_RES)
                plugin.intelToIFTTT.sendMessage("RES");

            plugin.intelToIFTTT.lastFieldGuid = topLayer.options.guid;
            localStorage.setItem("intelToIFTTT.LastFieldGUID", topLayer.options.guid);
        }
    }
    else
    {
        if (plugin.intelToIFTTT.lastFieldGuid !== 'NEU') {
            plugin.intelToIFTTT.lastFieldGuid = 'NEU';
            localStorage.setItem("intelToIFTTT.LastFieldGUID", 'NEU');
            plugin.intelToIFTTT.sendMessage("NEU");
        }
    }
};

plugin.intelToIFTTT.sendMessage = function(team) {
    var url = "//maker.ifttt.com/trigger/" + team + "/with/key/" + plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY;
    var win = window.open(url);
        var timer = setInterval(function() {
        win.close();
    }, 1800);
};

window.plugin.intelToIFTTT.onBtnClick = function(ev) {
	if ($('#EintelToIFTTTSetPoint').hasClass("active")) {
		map.off("click", window.plugin.intelToIFTTT.setPoint);
        $('#EintelToIFTTTSetPoint').text("Set YeeLight point");
		$('#EintelToIFTTTSetPoint').removeClass("active");
	} else {
		console.log("inactive");
		map.on("click", window.plugin.intelToIFTTT.setPoint);
		$('#EintelToIFTTTSetPoint').addClass("active");
		setTimeout(function(){
			$('#EintelToIFTTTSetPoint').text("Click on map");
		}, 10);
	}
};

window.plugin.intelToIFTTT.drawCircle = function(point) {
    if (window.plugin.intelToIFTTT.pointCircle !== undefined) {
      map.removeLayer(window.plugin.intelToIFTTT.pointCircle);
    }
    window.plugin.intelToIFTTT.pointCircle = L.circle(point, 7, {
        color: '#FF0000',
        fillOpacity: 1,
        opacity: 1
    }).addTo(map);
};

window.plugin.intelToIFTTT.setPoint = function(ev) {
    window.plugin.intelToIFTTT.drawCircle(ev.latlng);
    localStorage.setItem("intelToIFTTT.CHECK_POINT", JSON.stringify(ev.latlng));
    plugin.intelToIFTTT.CHECK_POINT = ev.latlng;
    $('#EintelToIFTTTSetPoint').text("Set YeeLight point");
    $('#EintelToIFTTTSetPoint').removeClass("active");
    map.off("click", window.plugin.intelToIFTTT.setPoint);
    plugin.intelToIFTTT.checkFieldColor();
};

window.plugin.intelToIFTTT.setIFTTTKey = function() {
	var promt = prompt('Please enter IFTTT MAKER SERVICE KEY:', (plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY ? plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY : ""));
	if (null !== promt) {
		plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY = promt;
		localStorage.setItem("intelToIFTTT.IFTTT_MAKER_SERVICE_KEY", plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY);
	}
};

var setup = function() {

    $('#toolbox').append('<a id="EintelToIFTTTSetPoint" class="inactive" onclick="window.plugin.intelToIFTTT.onBtnClick()" title="Set YeeLight point">Set YeeLight point</a>');

    if (!plugin.intelToIFTTT.IFTTT_MAKER_SERVICE_KEY)
        window.plugin.intelToIFTTT.setIFTTTKey();
    if (plugin.intelToIFTTT.CHECK_POINT)
        window.plugin.intelToIFTTT.drawCircle(plugin.intelToIFTTT.CHECK_POINT);

    plugin.intelToIFTTT.lastFieldGuid = localStorage.getItem("intelToIFTTT.LastFieldGUID");
    window.addHook('mapDataRefreshEnd', plugin.intelToIFTTT.checkFieldColor);
};

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
