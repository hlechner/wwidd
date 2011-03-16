////////////////////////////////////////////////////////////////////////////////
// Kind Selector Control
//
// Lets the user control what kind of tags are visible
////////////////////////////////////////////////////////////////////////////////
var controls = function (controls, $, data) {
	controls.kinds = function () {
		var self = Object.create(controls.base()),
				onChecked = function () {},
				hidden = {};

		//////////////////////////////
		// Utility functions

		function handler(kind, state) {
			if (state) {
				delete hidden[kind];
			} else {
				hidden[kind] = true;
			}
			onChecked();
			return self;
		}

		// re-creates children controls according to kinds data
		self.load = function () {
			var flat = data.kinds.table ? data.kinds.table.flat() : [],
					i;
			self.clear();
			for (i = 0; i < flat.length; i++) {
				self.append(controls.kind(flat[i], handler));
			}
			return self;
		};

		//////////////////////////////
		// Getters / setters

		// event handler setter
		self.onChecked = function (handler) {
			onChecked = handler;
			return self;
		};
		
		// gets the hidden property of a kind
		self.hidden = function (kind) {
			return hidden[kind];
		};
			
		//////////////////////////////
		// Overrides

		self.html = function () {
			var result = ['<span id="', self.id, '">'],
					i;
			for (i = 0; i < self.children.length; i++) {
				result.push(self.children[i].html());
			}
			result.push('</span>');
			return result.join('');
		};

		return self;
	}();
	
	return controls;
}(controls || {},
	jQuery,
	data);
