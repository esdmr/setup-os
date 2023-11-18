/* eslint-env browser */
const prefix = 'dir_';

/**
 * @typedef {Object} PathData
 * @prop {boolean} PathData.done
 * @prop {boolean} PathData.expanded
 * @prop {string} PathData.comment
 * @prop {string[]} PathData.dir
 */
/**
 * @param {string} path
 * @returns {PathData}
 */
export function getPath(path) {
	return JSON.parse(String(localStorage.getItem(prefix + path)));
}

/**
 * @param {string} path
 * @param {PathData} data
 */
export function setPath(path, data) {
	return localStorage.setItem(prefix + path, JSON.stringify(data));
}

/**
 * @param {string} path
 */
export function deletePath(path) {
	localStorage.removeItem(prefix + path);
}

export function listPath() {
	/** @type {[string, PathData][]} */
	const pairs = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!key?.startsWith(prefix)) {
			continue;
		}

		const path = key.slice(4);
		pairs.push([path, getPath(path)]);
	}

	return pairs.sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * @param {unknown} condition
 * @returns {asserts condition}
 */
export function assert(condition) {
	if (!condition) {
		throw new Error('Assertion error');
	}
}

/**
 * @param {string} path
 */
export async function fetchData(path) {
	const request = await fetch(`/api/stat${path}`);
	/** @type {PathData} */
	const json = await request.json();

	if (!request.ok) {
		throw json;
	}

	json.expanded = !json.dir;
	json.done = false;
	json.comment = '';
	setPath(path, json);
	return json;
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tagName
 * @param {Record<string, unknown>} attrs
 * @param  {...(Node | string | false | null | undefined)} body
 * @returns
 */
export function h(tagName, attrs, ...body) {
	const element = document.createElement(tagName);

	for (const [k, v] of Object.entries(attrs)) {
		element.setAttribute(k, String(v));
	}

	element.append(
		.../** @type {Array<Node | string>} */ (body.filter(Boolean)),
	);
	return element;
}
