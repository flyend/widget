/*!
* TabPanel Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Wed Oct 2012
*/
/*
* new _$.TabPanel({
	"xtype": "tabpanel",
	"id" : "tab",
	"width": 500,
	"height": 300,
	"items": [{"title": "tab 1"}],
	"activeTab": 1,
	"listener": {"tabchange": function(tabPanel,tab){
		
	}}
});
*/
(function(window,document){
	var d = document, that = window;
	if(!_$.hasOwnProperty("TabPanel")){
		_$["TabPanel"] = TabPanel;
	}
	function TabPanel(opt){
		this.tabpanel = null;
		
		this.create = function(){
			this.tabpanel = d.createElement("div");
			this.tabpanel.className = "tab-panel";
			return this.tabpanel;	
		};
		this.id = function(id){
			this.tabpanel.setAttribute("id",id);
			return this;
		};
		this.getContext = function(){
			return this.tabpanel || this.create();
		};
		if(!this.tabpanel){
			this.tabpanel = this.create();
		}
		this.init(opt);
		return this;
	}
	TabPanel.prototype.addTab = function(){};
	TabPanel.prototype.setTab = function(){};
	TabPanel.prototype.getTab = function(){};
	TabPanel.prototype.getActiveTab = function(){};
	TabPanel.prototype.setActiveTab = function(){};
	TabPanel.prototype.getAllTab = function(){};
	TabPanel.prototype.removeTab = function(){};
	TabPanel.prototype.bind = function(){};
	TabPanel.prototype.dnd = function(){};
	TabPanel.prototype.appendTo = function(){};
	TabPanel.prototype.toString = function(){};
	TabPanel.settings = {
		"nav": {"name": "", "content": {}},
		"player": {
			"timer": 100	
		},
		"activeTab": 1
	};
})(this,document);