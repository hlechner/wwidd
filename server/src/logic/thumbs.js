////////////////////////////////////////////////////////////////////////////////
// Thumbnails
//
// Manages cached thumbnails
////////////////////////////////////////////////////////////////////////////////
/*global require, exports, console */
var	$crypto = require('crypto'),
		entity = require('../db/media').media,
		processes = require('../logic/processes').processes,
		queue = require('../utils/queue').queue,
		
thumbs = function () {	
	var media = entity(),
	
	self = {
		// generates thumbnails for video files
		// identified by their mediaid's
		// - mediaids: array of media ids to generate thumbnail for
		generate: function (mediaids, handler) {
			media.multiGet(mediaids, function (data) {
				var elems = [],
						i, entry,
						shasum;

				// generating hashes and collecting process input
				for (i = 0; i < data.length; i++) {
					entry = data[i];
					if (!entry.hash.length) {
						shasum = $crypto.createHash('md5');
						shasum.update(entry.path);
						entry.hash = shasum.digest('hex');
						elems.push(entry.mediaid + '|' + entry.root + '|' + entry.path + '|' + entry.hash);
					}
				}
				
				// ending request
				if (handler) {
					handler();
				}

				// passing elems to thumbnail extraction process
				processes.thumbnails
					.bump(elems)
					.start(true);
			});
		}
	};
	
	return self;
}();

// exports
exports.thumbs = thumbs;

