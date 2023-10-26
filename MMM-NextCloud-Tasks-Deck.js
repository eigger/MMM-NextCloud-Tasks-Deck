/* global Module */

/* Magic Mirror
 * Module: MMM-NextCloud-Tasks-Deck
 *
 */

Module.register("MMM-NextCloud-Tasks-Deck", {
	defaults: {
		updateInterval: 60000,
		sortMethod: "priority",
		colorize: false,
		showListPrefix: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	toDoList: null,
	error: null,

	start: function () {
		var self = this;

		//Flag for check if module is loaded
		self.loaded = false;

		if(self.verifyConfig(self.config)) {
			// Schedule update timer.
			self.getData();
			setInterval(function() {
				self.getData();
				self.updateDom();
			}, self.config.updateInterval);
		} else {
			Log.info("config invalid");
			self.error = "config invalid";
			self.updateDom();
		}
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		this.sendSocketNotification(
			"MMM-NextCloud-Tasks-Deck-UPDATE",
			{
				id: this.identifier,
				config: this.config
			}
		);
	},

	getDom: function () {
		let self = this;
		// create element wrapper for show into the module
		let wrapper = document.createElement("div");
		wrapper.className = "MMM-NextCloud-Tasks-Deck-wrapper";
		if (self.toDoList) {
			wrapper.appendChild(self.renderList(self.toDoList));
			self.error = null;
		} else {
			wrapper.innerHTML= "<div>Loading...</div>";
		}
		if (self.error) {
			wrapper.innerHTML= "<div>" + self.error + "</div>";
		}
		return wrapper;
	},

	renderList: function (children) {
		let self = this;
		let summaryIcon = "<span class=\"fa fa-fw fa-caret-down\"></span>";
		let subSummaryIcon = "<span class=\"fa fa-fw fa-caret-right\"></span>";
		let dateIcon = "<span class=\"fa fa-fw fa-calendar-o\"></span>";
		let tagsIcon = "<span class=\"fa fa-fw fa-tags\"></span>";
		let descriptionIcon = "<span class=\"fa fa-fw fa-edit\"></span>";
		let ul = document.createElement("ul");
		for (const element of children) {
			let li = document.createElement("li");
			
			let span_summary_icon = document.createElement("span");
			let span_summary = document.createElement("span");
			span_summary_icon.id = "summary_icon";
			if (typeof element.children === "undefined") {
				span_summary_icon.innerHTML = subSummaryIcon;
				span_summary.id = "summary";
			}
			else {
				span_summary_icon.innerHTML = summaryIcon;
				span_summary.id = "sub_summary";
			}
			li.appendChild(span_summary_icon);

			span_summary.innerHTML += " " + element.summary;
			li.appendChild(span_summary);

			if (typeof element.due !== "undefined") {
				let date = element.due;
				let yy = date.slice(2, 4);
				let mm = date.slice(4, 6);
				let dd = date.slice(6, 8);
				let span_due = document.createElement("span");
				span_due.id = "date";
				span_due.innerHTML = " " + dateIcon + yy + "-" + mm + "-"+ dd;
				li.appendChild(span_due);
			}

			if (typeof element.description !== "undefined" && element.description.length > 0) {
				let span_description = document.createElement("span");
				span_description.id = "description";
				const split = element.description.split("\n");
				span_description.innerHTML = " " + descriptionIcon + split[0];
				li.appendChild(span_description);
			}

			if (typeof element.categories !== "undefined") {
				let span_tags = document.createElement("span");
				span_tags.id = "tags";
				span_tags.innerHTML = " " + tagsIcon + element.categories.join(", ");
				li.appendChild(span_tags);
			}

			if (typeof element.children !== "undefined") {
				let childList = self.renderList(element.children);
				li.appendChild(childList);
			}
			ul.appendChild(li);
		}
		return ul;
	},

	getStyles: function () {
		return [
			"MMM-NextCloud-Tasks-Deck.css",
		];
	},

	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-NextCloud-Tasks-Deck-Helper-TODOS#" + this.identifier) {
			this.toDoList = payload;
			this.updateDom();
		}
		if(notification === "MMM-NextCloud-Tasks-Deck-Helper-LOG#" + this.identifier) {
			Log.log("LOG: ", payload);
		}
		if(notification === "MMM-NextCloud-Tasks-Deck-Helper-ERROR#" + this.identifier) {
			Log.error("ERROR: ", payload);
			this.error = payload + "<br>";
			this.updateDom();
		}
	},

	verifyConfig: function (config) {
		if (typeof config.listUrl === "undefined" ||
			typeof config.webDavAuth === "undefined" ||
			typeof config.webDavAuth.username === "undefined" ||
			typeof config.webDavAuth.password === "undefined")
		{
			this.error = "Config variable missing";
			Log.error("Config variable missing");
			return false;
		}
		return true;
	}
});
