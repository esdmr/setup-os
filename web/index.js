/* eslint-disable complexity, no-alert, no-await-in-loop */
/* eslint-env browser */
import {
	getPath,
	setPath,
	deletePath,
	listPath,
	fetchData,
	h,
	assert,
} from './lib.js';

export function createPath(path, data) {
	return h(
		'div',
		{
			class:
				'subgrid' + (data.dir && data.dir.length === 0 ? ' empty' : ''),
			'data-path': path,
			'data-done': data.done,
		},
		h('button', {name: 'done'}, data.done ? 'Undone' : 'Done'),
		!data.done && h('button', {name: 'search'}, 'Search'),
		!data.dir && !data.done && h('button', {name: 'view'}, 'View'),
		data.dir && !data.done && h('button', {name: 'open'}, 'Open'),
		data.dir &&
			!data.done &&
			h(
				'button',
				{name: 'expanded'},
				data.expanded ? 'Shrink' : 'Expand',
				data.dir.length > 0 && ' (',
				data.dir.length,
				data.dir.length > 0 && ')',
			),
		h(
			'span',
			{class: 'path' + (data.done && !data.comment ? ' full-width' : '')},
			path,
		),
		!data.done &&
			h(
				'label',
				{class: 'comment'},
				'Comment: ',
				h('input', {value: data.comment, name: 'comment'}),
			),
		data.done &&
			data.comment &&
			h('span', {class: 'comment'}, 'Comment: ', data.comment),
	);
}

if (!getPath('/')) {
	await fetchData('/');
}

for (const [path, data] of listPath()) {
	document.body.append(createPath(path, data));
}

document.body.addEventListener('click', async (event) => {
	if (!(event.target instanceof HTMLButtonElement)) {
		return;
	}

	const root = event.target.closest('[data-path]');
	assert(root instanceof HTMLElement);

	const path = root.dataset.path ?? '';

	switch (event.target.name) {
		case 'export': {
			await fetch('/data', {
				method: 'PUT',
				body: JSON.stringify(Object.fromEntries(listPath())),
			});
			break;
		}

		case 'import': {
			const request = await fetch('/data');
			const json = await request.json();
			console.log(json);
			break;
		}

		case 'search': {
			open(
				'https://google.com/search?' +
					new URLSearchParams({q: path}).toString(),
				'_black',
			);
			break;
		}

		case 'view': {
			fetch(`/api/view${path}`);
			break;
		}

		case 'open': {
			fetch(`/api/open${path}`);
			break;
		}

		case 'done': {
			const data = getPath(path);
			data.done = !data.done;
			setPath(path, data);

			if (event.shiftKey) {
				for (const [path_, data_] of listPath()) {
					if (path_.startsWith(path === '/' ? path : path + '/')) {
						data_.done = data.done;
						setPath(path_, data_);
						document
							.querySelector(
								'[data-path="' + CSS.escape(path_) + '"]',
							)
							?.replaceWith(createPath(path_, data_));
					}
				}
			}

			const newRoot = createPath(path, data);
			root.replaceWith(newRoot);

			if (newRoot.nextSibling instanceof HTMLElement) {
				const nextDoneButton =
					newRoot.nextSibling.querySelector('[name=done]');
				assert(nextDoneButton instanceof HTMLButtonElement);
				nextDoneButton.focus();
			}

			break;
		}

		case 'expanded': {
			const data = getPath(path);
			data.expanded = !data.expanded;

			const pathsToDelete = [];

			for (const [path_, data] of listPath()) {
				if (
					path_.startsWith(path === '/' ? path : path + '/') &&
					path_ !== path
				) {
					if (
						data.comment &&
						!confirm(
							`${path_} contains some comments. Are you sure you want to continue?`,
						)
					) {
						return;
					}

					pathsToDelete.push(path_);
				}
			}

			for (const path of pathsToDelete) {
				deletePath(path);
				document
					.querySelector('[data-path="' + CSS.escape(path) + '"]')
					?.remove();
			}

			if (data.expanded && data.dir) {
				delete root.dataset.path;
				event.target.textContent = '…';
				for (const item of data.dir) {
					try {
						const path_ = (path === '/' ? path : path + '/') + item;
						root.after(createPath(path_, await fetchData(path_)));
					} catch {}
				}
			}

			setPath(path, data);

			const newRoot = createPath(path, data);
			root.replaceWith(newRoot);

			const nextExpandedButton = newRoot.querySelector('[name=expanded]');
			assert(nextExpandedButton instanceof HTMLButtonElement);
			nextExpandedButton.focus();

			break;
		}

		default: {
			throw new Error('Invalid event target: ' + event.target.name);
		}
	}
});

document.body.addEventListener('change', (event) => {
	if (!(event.target instanceof HTMLInputElement)) {
		return;
	}

	const root = event.target.closest('[data-path]');
	assert(root instanceof HTMLElement);

	const path = root.dataset.path ?? '';

	switch (event.target.name) {
		case 'comment': {
			const data = getPath(path);
			data.comment = event.target.value;
			data.done = true;
			setPath(path, data);

			const newRoot = createPath(path, data);
			root.replaceWith(newRoot);

			if (newRoot.nextSibling instanceof HTMLElement) {
				const nextDoneButton =
					newRoot.nextSibling.querySelector('[name=done]');
				assert(nextDoneButton instanceof HTMLButtonElement);
				nextDoneButton.focus();
			}

			break;
		}

		default: {
			throw new Error('Invalid event target: ' + event.target.name);
		}
	}
});

export {};
