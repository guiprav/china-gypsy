China Gypsy
===

An online [Misfortune Cookie](http://mis.fortunecook.ie) scanner.

If your router is vulnerable to the Misfortune Cookie bug,
you should update its firmware or replace your router.

Some routers may allow you to set custom firewall rules.
You might want to read the manual and see if that's possible.
If it is,
try dropping incoming packets on TCP port 7547,
then re-run the scanner.
The good thing about this approach is that those rules are persisted across router reboots.

My router doesn't have a firewall interface on its web panel,
so I couldn't do that.

If you're desperately worried and
(like me)
you happen to have administrative SSH access to your router,
though,
you can try adding the following iptables rule to it:

	$ iptables -A INPUT -p tcp --dport 7547 -j DROP

If that works,
you might want to block remote access to its port 80 too,
since RomPager might also be listening on that port
(change -i ppp0 to the right interface if ppp0 is not your WAN interface;
do not remove the interface parameter,
otherwise you won't be able to connect to your router's web admin panel even from within your LAN):

	$ iptables -A INPUT -i ppp0 -p tcp --dport 80 -j DROP

Don't forget to re-run the scanner to make sure the problem has been
(temporarily)
taken care of.

Now go do something about that router...
And don't forget those settings will be lost every time it reboots.

Online scanner: [china-gypsy.herokuapp.com](https://china-gypsy.herokuapp.com).

*(The online scanner does not store information associating IP addresses with scan results).*

Software license
---

The MIT License (MIT)

Copyright (c) 2015 Guilherme Prá Vieira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
