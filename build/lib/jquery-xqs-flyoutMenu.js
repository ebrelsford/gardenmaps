/*
 * jQuery UI flyout menu 
 *   - written for jQuery UI 1.9 milestone 2 using the widget factory
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * modified from: http://view.jqueryui.com/menu/tests/visual/menu/nested.html
 * 	by: Michael Lang, http://nexul.com/
 *
 */
(function($) {
$.widget("ui.flyoutmenu", {
	_create: function(){
		var self = this;
		this.active = this.element;
		this.activeItem = this.element.children("li").first();
		// hide submenus and create indicator icons
		this.element.find("ul").addClass("ui-menu-flyout").hide()
			.prev("a").prepend('<span class="ui-icon ui-icon-carat-1-e"></span>');
		
		this.element.find("ul").andSelf().menu({
			// disable built-in key handling
			input: (!this.options.input)? $() : this.options.input,
			select: this.options.select,
			focus: function(event, ui) {
				self.active = ui.item.parent();
				self.activeItem = ui.item;
				ui.item.parent().find("ul").hide();
				var nested = $(">ul", ui.item);
				if (nested.length && /^mouse/.test(event.originalEvent.type)) {
					self._open(nested);
				}
			}
		}).keydown(function(event) {
			if (self.element.is(":hidden"))
				return;
			event.stopPropagation();
			switch (event.keyCode) {
			case $.ui.keyCode.ESCAPE:
				self.hide();
				break;
			default:
				break;
			}
		});
	},
	_open: function(submenu) {
		//only one menu can have items open at a time.
		$(document).find(".ui-menu-flyout").not(submenu.parents()).hide();
		submenu.show().css({
			top: 0,
			left: 0
		}).position({
			my: "left top",
			at: "right top",
			of: this.activeItem,
            collision: "fit",
		});
		$(document).one("click", function() {
            //clicking outside menu flyouts should close all flyouts
            $(document).find(".ui-menu-flyout").hide();
		})
	},
	_select: function(event){
		this.activeItem.parent().data("menu").select(event);
		$(document).find(".ui-menu-flyout").hide();	
		activate(event, self.element.children("li").first());
	},
	activate: function(event, item){
		if (item){
			item.parent().data("menu").widget().show();
			item.parent().data("menu").activate(event, item);
		}
		this.activeItem = item;
		this.active = item.parent("ul");
	},
	show: function() {
		this.active = this.element;
		this.element.show();
		if (this.element.hasClass("ui-menu-flyout")){
			$(document).one("click", function() {
				//clicking outside menu flyouts should close all flyouts
				$(document).find(".ui-menu-flyout").hide();
			})
		}
	},
	hide: function() {
		this.activeItem = this.element.children("li").first();
		this.element.find("ul").andSelf().menu("deactivate").hide();
	}
});
}(jQuery));
