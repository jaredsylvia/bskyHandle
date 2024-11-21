# DID Resolver Service

This project implements a lightweight DID (Decentralized Identifier) resolver service using Node.js, Express, and SQLite. It provides endpoints to retrieve and update DIDs associated with subdomains.

## Endpoints

### `GET /.well-known/atproto-did`

Retrieve the DID associated with the current subdomain.

- **Request**: 
  - Uses the `hostname` to determine the subdomain.
- **Response**:
  - If a DID exists, returns the DID.
  - If no DID is found, responds with `No DID set`.

### `GET /set/:did`

Set or update the DID for the current subdomain.

- **Parameters**:
  - `:did` - The DID to associate with the subdomain.
- **Request**:
  - Uses the `hostname` to determine the subdomain.
- **Response**:
  - On success, responds with `Well-known endpoint served`.
  - On error, responds with a `500 Internal Server Error`.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/did-resolver-service.git
    cd did-resolver-service
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    node index.js
    ```

---

## Configuration

- **Port**: The service runs on port `3783` by default. Modify the `port` variable in the script to change it.
- **Database**: The SQLite database file is `database.db` and is automatically created in the project directory.

---

## Project Structure

- **Database**: 
  - Table `didCache`:
    - `subdomain`: Primary key representing the subdomain.
    - `did`: The Decentralized Identifier.
    - `timestamp`: The time when the DID was set.

- **Endpoints**:
  - `/.well-known/atproto-did`: Retrieve the DID.
  - `/set/:did`: Set or update the DID.

---

## Notes

- Subdomain detection is based on the `req.hostname`. Ensure your application is deployed in a domain/subdomain structure.
- Use a reverse proxy like NGINX if additional routing is required.
- Modify or extend the codebase as needed for custom use cases.

---

## Had to do a manual thing on certbot

sudo certbot certonly --manual --preferred-challenges=dns --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d *.example.com

## Example NGINX conf
````
server {
    server_name ~^(.*)\.example\.com$ ;
    location / {
        proxy_pass http://127.0.0.1:3783;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.ecom/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    listen 80;
    server_name ~^(.*)\.example\.com$ ;
    return 301 https://$host$request_uri;
}
````
