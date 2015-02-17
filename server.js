#!/usr/bin/env node
var fs = require('fs');
var restler = require('restler');
var express = require('express');
var marked = require('marked');
var app = express();
var port = process.env.PORT || 3000;
var semver = require('semver');
var front_page_html = marked (
	fs.readFileSync('frontpage.md', { encoding: 'utf8' })
);
function to_html(data) {
	return (
		"Your IP address: " + data.your_ip + "."
		+ "<br>HTTP server on port 7547: " + data.server_string + "."
		+ "<br>Are you vulnerable? " + data.vulnerable + "."
		+ "<br><br><strong>If your router uses RomPager version <4.34</strong> (see above),"
		+ " you should:"
		+ "<ul>"
			+ "<li>Install a better firmware (such as OpenWrt, DD-WRT, or vendor-supplied updates).</li>"
			+ "<li>Replace your router.</li>"
			+ "<li>"
				+ "Optionally follow"
				+ " <a href='https://github.com/n2liquid/china-gypsy/blob/master/README.md'>"
					+ "these instructions"
				+ "</a>"
				+ " while you can't properly fix or replace your router."
			+ "</li>"
		+ "</ul>"
	);
}
app.enable('trust proxy');
app.get (
	'/', function(req, res) {
		res.send(front_page_html);
	}
);
app.get (
	'/scan', function(req, res) {
		var ip = req.ip;
		var json_response = {
			your_ip: ip
			, server_string: "Unknown"
		};
		console.log("Connection from", ip + ".");
		restler
			.get (
				'http://' + ip + ':7547/'
				, {
					timeout: 5000
				}
			)
			.on (
				'complete'
				, function(result, client_res) {
					var server_info;
					if(result instanceof Error) {
						json_response.vulnerable = "Unlikely (Connect-back on port 7547 was rejected)";
						res.send(to_html(json_response));
						return;
					}
					json_response.server_string = client_res.headers.server;
					server_info = /RomPager\/([^ ]+)/.exec(json_response.server_string);
					if(!server_info) {
						json_response.vulnerable = "Unlikely (Not running RomPager)";
					}
					else {
						if(semver.satisfies('>=4.34', server_info[1])) {
							json_response.vulnerable = "Unlikely (Running RomPager >=4.34)";
						}
						else {
							json_response.vulnerable = "Likely (Running RomPager <4.34)";
						}
					}
					res.send(to_html(json_response));
				}
			)
			.on (
				'timeout'
				, function() {
					json_response.vulnerable = "Unlikely (Connect-back on port 7547 has timed out)";
					res.send(to_html(json_response));
				}
			)
		;
	}
);
app.listen(port);
console.log("Listening on", port + ".");
