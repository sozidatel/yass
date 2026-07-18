import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumentsList = process.argv.slice(2);
const portArgument = argumentsList.indexOf('--port');
const port = Number.parseInt(portArgument === -1 ? '4173' : argumentsList[portArgument + 1], 10);
const hostArgument = argumentsList.indexOf('--host');
const host = hostArgument === -1 ? '127.0.0.1' : argumentsList[hostArgument + 1];
const contentTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.mjs', 'text/javascript; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
]);

const server = createServer((request, response) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    } catch {
        response.writeHead(400).end('Bad request');
        return;
    }

    if (pathname === '/') {
        pathname = '/demo/index.html';
    }

    let requestedPath = path.resolve(projectDirectory, `.${pathname}`);
    if (requestedPath !== projectDirectory && !requestedPath.startsWith(`${projectDirectory}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    try {
        if (statSync(requestedPath).isDirectory()) {
            requestedPath = path.join(requestedPath, 'index.html');
        }
        const details = statSync(requestedPath);
        if (!details.isFile()) {
            throw new Error('Not a file');
        }

        response.writeHead(200, {
            'Content-Type': contentTypes.get(path.extname(requestedPath)) || 'application/octet-stream',
            'Cache-Control': 'no-store',
            'Content-Length': details.size,
        });
        if (request.method === 'HEAD') {
            response.end();
        } else {
            createReadStream(requestedPath).pipe(response);
        }
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
});

server.listen(port, host, () => {
    console.log(`Yass demo: http://${host}:${port}/`);
});
