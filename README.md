# familiar_aura
Dynamic DNS IP address monitor that works without a publicly-known domain.  Uses your own VPS
server to store the last-remembered IP address, which is continually being sent from a computer
on your local network.

Aura listens for GET requests from computers on your local network, to a secret URL.
When it gets a request, it remembers the IP address.  When you want to know the public IP address
of your local network, from another machine across the Internet, you do a GET request to another
secret URL on the service, and it responds back with the last-remembered IP address.
