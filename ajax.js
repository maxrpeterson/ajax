var Ajax = (function() {
	'use strict';
	
	function ajax(url, method, options) {
		method = (!method || typeof method !== 'string') ? 'GET' : method;
		options = options || {};

		var promise = new Promise(function(resolve, reject) {
			var ajaxReq = new XMLHttpRequest(),
				bodyData,
				key,
				strData; // key and strData used in for..in loop below
			if (options.data) {
				if (method === 'GET') {
					for (key in options.data) {
						if (options.data.hasOwnProperty(key)) {
							strData += key + '=' + options.data[key] + '&';
						}
					}
					url += '?' + strData;
				} else {
					bodyData = options.data;
				}
			}

			ajaxReq.responseType = options.responseType || '';

			ajaxReq.open(method, url, true);
			ajaxReq.timeout = options.timeout || 120000;
			ajaxReq.onTimeout = function() {
				reject({error: 'Timed out'});
			};
			ajaxReq.onreadystatechange = function() {
				if (ajaxReq.readyState === 4 && ajaxReq.status === 200) {
					resolve(ajaxReq.response);
				} else if(ajaxReq.readyState === 4) {
					reject(ajaxReq.response);
				}
			};
			ajaxReq.send(bodyData);
		});
		return promise;
	}

	['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(function(method) {
		ajax[method.toLowerCase()] = function(url, options) {
			return ajax(url, method, options);
		}
	});

	return ajax;

})();