import axios from 'axios';

const clientId = 'Qe7xHRYFZ00Y7XpC8InL9Ffu0R6915MivLGckFh94wQ'
export const imagesService = {
	getImages,
	getRandomImages
}

async function getImages(keyword, count = 12) {
	const url = `https://api.unsplash.com/search/photos?query=${keyword}&per_page=${count}&client_id=${clientId}`;
	const res = await axios.get(url);
	let { results } = res.data;
	results = results.map(res => {
		return {
			_id: res.id,
			full: res.urls.full,
			thumb: res.urls.thumb,
			sm: res.urls.small

		};
	});
	return results;
}


async function getRandomImages(count = 12) {
	const url = `https://api.unsplash.com/photos/random/?client_id=${clientId}&count=${count}`
	const res = await axios.get(url);
	let results = res.data;
	results = results.map(result => {
		return {
			_id: result.id,
			full: result.urls.full,
			thumb: result.urls.thumb,
			sm: result.urls.small
		};
	});
	return results;
}