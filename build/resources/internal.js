if(typeof Object.create!=='function'){Object.create=function(o){function F(){}
F.prototype=o;return new F();};}
$.plugin=function(name,object){$.fn[name]=function(options){var args=Array.prototype.slice.call(arguments,1);return this.each(function(){var instance=$.data(this,name);if(instance){instance[options].apply(instance,args);}else{instance=$.data(this,name,Object.create(object).init(options,this));}});};};;var GardenMap={epsg4326:new OpenLayers.Projection("EPSG:4326"),epsg900913:new OpenLayers.Projection("EPSG:900913"),init:function(options,elem){var t=this;this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.olMap=new OpenLayers.Map(this.$elem.attr('id'),{controls:[new OpenLayers.Control.Navigation(),new OpenLayers.Control.Attribution(),new OpenLayers.Control.LoadingPanel(),new OpenLayers.Control.ZoomPanel()],restrictedExtent:this.createBBox(-75.066,41.526,-72.746,39.953),zoomToMaxExtent:function(){this.setCenter(t.options.center,t.options.initialZoom);}});var mapbox=new OpenLayers.Layer.XYZ('mapbox',['https://api.mapbox.com/styles/v1/ebrelsford/ckb3s9rri1zs81itct2splns9/tiles/256/${z}/${x}/${y}@2x?access_token=pk.eyJ1IjoiZWJyZWxzZm9yZCIsImEiOiI2VFFWT21ZIn0.qhtAhoVTOPzFwWAi7YHr_Q',],{attribution:"Tiles &copy; <a href='http://mapbox.com/'>MapBox</a>",sphericalMercator:true,wrapDateLine:true});this.olMap.addLayer(mapbox);this.olMap.zoomToMaxExtent();this.surveyedGardensLayer=this.addSurveyedGardens();this.unsurveyedGardensLayer=this.addUnsurveyedGardens();this.addControls([this.surveyedGardensLayer,this.unsurveyedGardensLayer]);return this;},options:{center:new OpenLayers.LonLat(-8230729.8555054,4970948.0494563),initialZoom:10,addContentToPopup:function(popup,feature){;},},createBBox:function(lon1,lat1,lon2,lat2){var b=new OpenLayers.Bounds();b.extend(this.getTransformedLonLat(lon1,lat1));b.extend(this.getTransformedLonLat(lon2,lat2));return b;},defaultStyle:{pointRadius:'5',fillColor:'#3f9438',fillOpacity:'0.4',strokeOpacity:'0.8',strokeWidth:0,},styles:[{pointRadius:'6',fillColor:'#f9ff51',fillOpacity:'0.6'},{pointRadius:'6',fillColor:'#f90000',fillOpacity:'0.4'},{pointRadius:'8',fillColor:'#E8C051',fillOpacity:'0.8'},],unsurveyedStyle:{pointRadius:'2',fillColor:'#0000FF',fillOpacity:'0.5',strokeWidth:0},getStyles:function(style){return new OpenLayers.StyleMap({'default':style,'select':{pointRadius:15},'temporary':{pointRadius:10}});},getLayer:function(name,style){var layer=new OpenLayers.Layer.Vector(name,{projection:this.olMap.displayProjection,strategies:[new OpenLayers.Strategy.Fixed()],styleMap:this.getStyles(style),protocol:new OpenLayers.Protocol.HTTP({url:"resources/kml/"+name+".kml",format:new OpenLayers.Format.KML()})});this.olMap.addLayer(layer);return layer;},addSurveyedGardens:function(){var layer=this.getLayer('surveyed_gardens',this.defaultStyle);this.addStyles(layer);return layer;},addUnsurveyedGardens:function(){return this.getLayer('unsurveyed_gardens',this.unsurveyedStyle);},addStyles:function(layer){var filter1=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"picked0",value:true});var filter2=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"picked1",value:true});var rulePicked=[];rulePicked[0]=new OpenLayers.Rule({filter:filter1,symbolizer:this.styles[0]});rulePicked[1]=new OpenLayers.Rule({filter:filter2,symbolizer:this.styles[1]});rulePicked[2]=new OpenLayers.Rule({filter:new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.AND,filters:[filter1,filter2]}),symbolizer:this.styles[2]});rulePicked[3]=new OpenLayers.Rule({elseFilter:true});layer.styleMap.styles['default'].addRules(rulePicked);},addControls:function(layers){this.getControlHoverFeature(layers);this.selectControl=this.getControlSelectFeature(layers);},getControlSelectFeature:function(layers){var selectControl=new OpenLayers.Control.SelectFeature(layers);var t=this;$.each(layers,function(i,layer){layer.events.on({"featureselected":function(event){var feature=event.feature;var popup=t.createAndOpenPopup(feature);t.options.addContentToPopup(popup,feature);},"featureunselected":function(event){var feature=event.feature;if(feature.popup){t.olMap.removePopup(feature.popup);feature.popup.destroy();delete feature.popup;}},});});this.olMap.addControl(selectControl);selectControl.activate();return selectControl;},createAndOpenPopup:function(feature){var content="<div style=\"min-width: 450px; min-height: 250px;\"></div>";var t=this;var popup=new OpenLayers.Popup.Anchored("chicken",feature.geometry.getBounds().getCenterLonLat(),new OpenLayers.Size(450,300),content,null,true,function(event){t.selectControl.unselectAll();});popup.panMapIfOutOfView=true;feature.popup=popup;this.olMap.addPopup(popup);var new_width=$('.olPopupContent').width()+$('.olPopupCloseBox').width();$('.olPopupContent').width(new_width);return $('#chicken_contentDiv');},getControlHoverFeature:function(layers){var selectControl=new OpenLayers.Control.SelectFeature(layers,{hover:true,highlightOnly:true,renderIntent:'temporary'});this.olMap.addControl(selectControl);selectControl.activate();return selectControl;},clearPicked:function(index){var attr="picked"+index;$.each(this.surveyedGardensLayer.features,function(i,feature){feature.attributes[attr]=false;});this.surveyedGardensLayer.redraw();},addGardenIdsToPicked:function(gardenIds,index){this.clearPicked(index);var attr="picked"+index;$.each(this.surveyedGardensLayer.features,function(i,feature){if($.inArray(parseInt(feature.fid),gardenIds)>=0){feature.attributes[attr]=true;}});this.surveyedGardensLayer.redraw();},hideLayer:function(name){var layers=this.olMap.getLayersByName(name);if(layers.length==0)return;layers[0].setVisibility(false);},showLayer:function(name){var layers=this.olMap.getLayersByName(name);if(layers.length==0){this.loadLayer(name);}
else{layers[0].setVisibility(true);}},layerUrls:{'City Councils':"resources/geojson/nycc.geojson",'City Council Labels':"resources/geojson/nycc_centroids.geojson",'Community Districts':"resources/geojson/nycd.geojson",'Community District Labels':"resources/geojson/nycd_centroids.geojson",'Boroughs':"resources/geojson/boroughs.geojson",'Borough Labels':"resources/geojson/borough_centroids.geojson",},loadLayer:function(name){var layer=new OpenLayers.Layer.Vector(name,{projection:this.olMap.displayProjection,strategies:[new OpenLayers.Strategy.Fixed()],protocol:new OpenLayers.Protocol.HTTP({url:this.layerUrls[name],format:new OpenLayers.Format.GeoJSON(),}),styleMap:new OpenLayers.StyleMap({'default':{'strokeWidth':1,'strokeColor':'#000','fillOpacity':0,},}),});this.olMap.addLayer(layer);},hideLabelLayer:function(name){var layers=this.olMap.getLayersByName(name);if(layers.length==0)return;layers[0].setVisibility(false);},showLabelLayer:function(name){var layers=this.olMap.getLayersByName(name);if(layers.length==0){this.loadLabelLayer(name);}
else{layers[0].setVisibility(true);}},loadLabelLayer:function(name){var layer=new OpenLayers.Layer.Vector(name,{projection:this.olMap.displayProjection,strategies:[new OpenLayers.Strategy.Fixed()],protocol:new OpenLayers.Protocol.HTTP({url:this.layerUrls[name],format:new OpenLayers.Format.GeoJSON(),}),styleMap:new OpenLayers.StyleMap({'default':{'label':'${label}',},}),});this.olMap.addLayer(layer);},selectAndCenterOnGarden:function(fid){var feature=this.surveyedGardensLayer.getFeatureByFid(fid);if(!feature)feature=this.unsurveyedGardensLayer.getFeatureByFid(fid);if(!feature)return;var l=new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y);this.olMap.setCenter(l,15);this.selectControl.unselectAll();this.selectControl.select(feature);},getTransformedLonLat:function(longitude,latitude){return new OpenLayers.LonLat(longitude,latitude).transform(this.epsg4326,this.epsg900913);},};$.plugin('gardenmap',GardenMap);;var Legend={init:function(options,elem){this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.map=this.options.map;this.mapSelectedAttributes=this.options.mapSelectedAttributes;var map=this.map;var $elem=this.$elem;$elem.find('.selector_indicator.active .reset').click(function(){var index=$(this).index('.selector_indicator .reset');map.clearPicked(index);var indicator=$(this).parent('.selector_indicator');indicator.find('.label').text('');indicator.find('.details').hide();indicator.data('attributeDisplayName','');indicator.removeClass('picked');$elem.find('#intersection_indicator').hide().find('label').eq(index).text('');});return this;},options:{map:null,mapSelectedAttributes:['picked0','picked1'],},selectAttribute:function(garden_ids,attribute_display_name){if(this.isAlreadySelected(attribute_display_name))return;var index=this.getAvailableSelectorIndicatorIndex();this.map.addGardenIdsToPicked(garden_ids,index);var total=this.map.surveyedGardensLayer.features.length;this.$elem.find('.total_gardens').text(total);this.populateIndicator(this.$elem.find('.selector_indicator').eq(index),index,garden_ids,total,attribute_display_name);this.populateIntersectionIndicator();},populateIntersectionIndicator:function(){if(this.$elem.find('.selector_indicator.active .label:empty').length!=0){this.$elem.find('#intersection_indicator').hide();return;}
var attr=this.mapSelectedAttributes;var intersect=$.grep(this.map.surveyedGardensLayer.features,function(feature){return feature.attributes[attr[0]]&&feature.attributes[attr[1]];}).length;var total=this.map.surveyedGardensLayer.features.length;var intersect_percentage=(intersect/total*100).toPrecision(3);var intersectionIndicator=this.$elem.find('#intersection_indicator');intersectionIndicator.find('.details .selected_gardens').text(intersect);intersectionIndicator.find('.details .percentage').text(intersect_percentage);intersectionIndicator.find('.details').show();intersectionIndicator.show();},populateIndicator:function(indicator,index,selectedIds,totalGardens,attributeDisplayName){var selected=selectedIds.length;var percentage=(selected/totalGardens*100).toPrecision(3);indicator.find('.selected_gardens').text(selected);indicator.find('.percentage').text(percentage);indicator.find('.label').text(attributeDisplayName);indicator.find('.details').show();indicator.data('attributeDisplayName',attributeDisplayName);this.$elem.find('#intersection_indicator .label').eq(index).text(attributeDisplayName);},isAlreadySelected:function(attributeDisplayName){var matches=this.$elem.find('.selector_indicator').filter(function(i){return $(this).data('attributeDisplayName')==attributeDisplayName;});return matches.length>0;},getAvailableSelectorIndicatorIndex:function(){var index=this.$elem.find('.selector_indicator.active.picked').index();if(index>=0)return index;index=0;var max_index=this.$elem.find('.selector_indicator.active').size()-1;while(index<=max_index){if(this.$elem.find('.selector_indicator.active .label').eq(index).text()=='')break;index++;}
return index>max_index?max_index:index;},};$.plugin('legend',Legend);;var MapMenu={init:function(options,elem){this.options=$.extend({},this.options,options);this.legend=this.options.legend;this.elem=elem;this.$elem=$(elem);var t=this;$.getJSON(this.options.source,function(menuJSON){t.generateMenu(menuJSON);});},options:{source:null,legend:null,},generateMenu:function(menuJSON){var t=this;var menuDom=t.makeNestedListFromJSON(menuJSON);t.$elem.find('.menu-container').append(menuDom).find('ul:first').attr('id','feature_menu').flyoutmenu();t.$elem.find('a').click(function(e){t.selectAttribute($(this));});},selectAttribute:function(selected){var t=this;var name=selected.data('selectedLabel');if(!name)return;var id=escape(selected.data('filename'));$.getJSON('resources/json/'+id+'.json',function(gardenIds){t.legend.selectAttribute(gardenIds,name);});},makeNestedListFromJSON:function(items){var t=this;var list=$('<ul/>');$.each(items,function(index,item){var a=$('<a/>');if(item.id!==undefined){a.attr('id',item.id);a.data('filename',item.id);}
if(item.label!==undefined)a.text(item.label);if(item.selectedLabel!==undefined)a.data('selectedLabel',item.selectedLabel);a.attr('href','#');var li=$('<li/>').append(a);if(!(item.items===undefined))li.append(t.makeNestedListFromJSON(item.items));list.append(li);});return list;},};$.plugin('mapmenu',MapMenu);;var Help={init:function(options,elem){this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.parent_div=this.options.parent_div;var z=this.$elem.css('z-index');this.modal=this.$elem.before('<div/>').prev().css({'z-index':z-1}).addClass('helpmodal');this.positioned=false;return this;},options:{parent_div:null,},hide_help:function(){this.$elem.hide();this.modal.hide();},position:function(){if(this.positioned)return;this.positioned=true;var pWidth=this.parent_div.width();var pHeight=this.parent_div.height();this.modal.width(pWidth).height(pHeight).position({my:'left top',at:'left top',of:this.parent_div});this.$elem.width(pWidth-100).height(pHeight-100).position({my:'left top',at:'left top',of:this.parent_div,offset:'30',});},show_help:function(){this.position();this.modal.fadeTo('fast',.5);this.$elem.fadeTo('fast',.7);},};$.plugin('help',Help);;(function($,sr){var debounce=function(func,threshold,execAsap){var timeout;return function debounced(){var obj=this,args=arguments;function delayed(){if(!execAsap)
func.apply(obj,args);timeout=null;};if(timeout)
clearTimeout(timeout);else if(execAsap)
func.apply(obj,args);timeout=setTimeout(delayed,threshold||100);};}
jQuery.fn[sr]=function(fn){return fn?this.bind('resize',debounce(fn)):this.trigger(sr);};})(jQuery,'smartresize');;var MapButtons={init:function(options,elem){var t=this;this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.$map=this.options.$map;this.map=this.$map.data('gardenmap');this.help=this.options.help;t.$elem.hide();$(window).load(function(){t.$elem.show();t.$elem.position({my:'right top',at:'right top',of:t.$map,offset:'-10 10',});});$(window).smartresize(function(){t.$elem.position({my:'right top',at:'right top',of:t.$map,offset:'-10 10',});});this.$elem.find("#show_help").click(function(){t.help.show_help();});this.$elem.find('#political_borders').hover(function(){$(this).addClass('expanded').find('#political_borders_selector').show();},function(){$(this).removeClass('expanded').find('#political_borders_selector').hide();});this.$elem.find('#political_borders_selector input[type=radio]').change(function(){t.layerChanged($(this));});this.$elem.find('#political_borders_selector #labels input').change(function(){t.labelsChanged($(this).is(':checked'));});},options:{$map:null,help:null,},idsToLayerNames:{'boroughs':'Boroughs','city_councils':'City Councils','community_districts':'Community Districts',},idsToLabelLayerNames:{'boroughs':'Borough Labels','city_councils':'City Council Labels','community_districts':'Community District Labels',},layerChanged:function(radio){var id=radio.parent().attr('id');if(radio.is(':checked')){this.layerSelected(id);}
else{this.layerDeselected(id);}},layerSelected:function(id){this.$elem.find('#political_borders_selector input[type=radio]:not(:checked)').change();if(id!=='none'){this.map.showLayer(this.idsToLayerNames[id]);if(this.$elem.find('#political_borders_selector #labels input').is(':checked')){this.map.showLabelLayer(this.idsToLabelLayerNames[id]);}}},layerDeselected:function(id){if(id!=='none'){this.map.hideLayer(this.idsToLayerNames[id]);if(this.$elem.find('#political_borders_selector #labels input').is(':checked')){this.map.hideLabelLayer(this.idsToLabelLayerNames[id]);}}},labelsChanged:function(show){var selected_borders_id=this.$elem.find('#political_borders_selector input[type=radio]:checked').parent().attr('id');if(show){if(selected_borders_id!=='none')this.map.showLabelLayer(this.idsToLabelLayerNames[selected_borders_id]);}
else{if(selected_borders_id!=='none')this.map.hideLabelLayer(this.idsToLabelLayerNames[selected_borders_id]);}},};$.plugin('mapbuttons',MapButtons);;var Search={init:function(options,elem){var t=this;this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.map=this.options.map;var t=this;this.$elem.find('#search input[type=text]').example('address or garden name');this.$elem.find('#search').keypress(function(e){if(e.keyCode=='13'){e.preventDefault();}});$.getJSON('resources/json/autocomplete.json',function(l){t.$elem.find('#address').autocomplete({minLength:0,source:l,focus:function(event,ui){t.$elem.find('#address').val(ui.item.label);return false;},select:function(event,ui){t.map.selectAndCenterOnGarden(ui.item.fid);return false;},})});},options:{map:null,},};$.plugin('gardensearch',Search);;var Callouts={init:function(options,elem){var t=this;this.options=$.extend({},this.options,options);this.elem=elem;this.$elem=$(elem);this.legend=this.options.legend;this.interval=this.options.interval;this.$elem.data('num_callouts',2);this.$elem.find('.content').click(this.highlightCalloutGardens);this.$elem.find('#actions #show').click(this.highlightCalloutGardens);this.$elem.find('#actions #previous').click(this.previousCallout);this.$elem.find('#actions #next').click(this.nextCallout);this.$elem.find('#actions #minimize').click(this.hideCallout);this.$elem.find('#minimized #maximize').click(this.showCallout);},options:{legend:null,interval:0,},getCallout:function(index){var t=this;$.getJSON('resources/json/callout_'+index+'.json',function(callout){t.$elem.find('.content').text(callout.text);t.$elem.data('current_callout_index',index).data('ids',callout.ids).data('name',callout.name);t.showCallout(t.interval);});},previousCallout:function(){var index=(this.$elem.data('current_callout_index')-1)%this.$elem.data('num_callouts');this.getCallout(index);},nextCallout:function(){var index=(this.$elem.data('current_callout_index')+1)%this.$elem.data('num_callouts');this.getCallout(index);},randomCallout:function(){var index=Math.floor(Math.random()*this.$elem.data('num_callouts'));this.getCallout(index);},showCallout:function(ms){this.$elem.removeClass('minimized');if(ms>0)window.setTimeout(this.hideCallout,ms);},hideCallout:function(ms){this.$elem.addClass('minimized');if(ms>0)window.setTimeout(this.randomCallout,ms);},highlightCalloutGardens:function(){legend.selectAttribute(this.$elem.data('ids'),this.$elem.data('name'));},};$.plugin('callouts',Callouts);;$(document).ready(function(){var map=$('#map').gardenmap({addContentToPopup:function(popup,feature){popup.setTemplateURL("garden_details_template.html");$.getJSON("resources/json/"+feature.fid+".json",function(g){popup.processTemplate(g);});},}).data('gardenmap');var legend=$('#selectors').legend({'map':map,}).data('legend');$('#attribute_picker_container').mapmenu({source:'resources/json/menu.json',legend:legend,});var help=$('#help').help({parent_div:$('#map'),}).data('help');if(window.location.href.search('help=no')<0){$(window).load(function(){help.show_help();});}
$('#close_help_button').button().click(function(){help.hide_help();});$('#map_buttons').mapbuttons({$map:$('#map'),help:help,});$('#searchbar').gardensearch({map:map,});});