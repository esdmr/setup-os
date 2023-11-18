#!/usr/bin/env node
import fs from 'node:fs/promises';
import childProcess from 'node:child_process';
import {createWriteStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import send from 'koa-send';
import Koa from 'koa';

const pathApiStat = '/api/stat';
const pathApiView = '/api/view';
const pathApiOpen = '/api/open';
const pathData = '/data';
const port = 5999;

const codes = {
	EACCES: 403,
	EBADF: 500,
	EFAULT: 500,
	ELOOP: 508,
	ENAMETOOLONG: 414,
	ENOENT: 404,
	ENOMEM: 500,
	ENOTDIR: 409,
	EOVERFLOW: 500,
	EINVAL: 500,
};

new Koa()
	.use(async (ctx, next) => {
		ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
		ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
		return next();
	})
	.use(async (ctx, next) => {
		if (!ctx.path.startsWith(pathApiStat)) {
			return next();
		}

		const realpath = decodeURI(ctx.path.slice(pathApiStat.length));

		try {
			const stats = await fs.lstat(realpath);
			const dir = stats.isDirectory() ? await fs.readdir(realpath) : null;
			ctx.status = 200;
			ctx.body = JSON.stringify({dir});
		} catch (error) {
			console.error(error);
			ctx.status = codes[error.code] ?? 500;
			ctx.body = JSON.stringify({error: error.code});
		}
	})
	.use(async (ctx, next) => {
		if (!ctx.path.startsWith(pathApiView)) {
			return next();
		}

		const realpath = decodeURI(ctx.path.slice(pathApiView.length));

		childProcess
			.spawn('code', ['-r', realpath], {
				detached: true,
				stdio: 'ignore',
			})
			.unref();

		ctx.status = 204;
		ctx.body = '';
	})
	.use(async (ctx, next) => {
		if (!ctx.path.startsWith(pathApiOpen)) {
			return next();
		}

		const realpath = decodeURI(ctx.path.slice(pathApiOpen.length));

		childProcess
			.spawn('xdg-open', [realpath], {
				detached: true,
				stdio: 'ignore',
			})
			.unref();

		ctx.status = 204;
		ctx.body = '';
	})
	.use(async (ctx, next) => {
		if (ctx.path !== pathData || ctx.method !== 'PUT') {
			return next();
		}

		const file = createWriteStream(new URL('data', import.meta.url));

		await new Promise((resolve, reject) => {
			ctx.req.pipe(file);
			ctx.req.on('error', (error) => {
				reject(error);
			});
			ctx.req.on('end', () => {
				resolve(undefined);
			});
		});

		ctx.status = 204;
		ctx.body = '';
	})
	.use(async (ctx) =>
		send(ctx, ctx.path, {
			root: fileURLToPath(new URL('.', import.meta.url)),
			index: 'index.html',
		}),
	)
	.listen(port);

console.log(`Serving at http://localhost:${port}`);
