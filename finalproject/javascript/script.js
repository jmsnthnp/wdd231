
// Navigation wayfinding functionality
document.addEventListener('DOMContentLoaded', ()=>{
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop();
    
    // Set active state for navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const href = link.getAttribute('href').split('/').pop();
        item.classList.toggle('active', currentPath === href);
    });

    // Burger menu toggle
    const menuContainer = document.querySelector('.menu-container');
    const burgerButton = document.querySelector('#burger-button');

    burgerButton.addEventListener('click', ()=>{
        menuContainer.classList.toggle('open');
        burgerButton.textContent = menuContainer.classList.contains('open') ? '✖' : '☰';
    });
});

const currentYear = new Date().getFullYear();
const copyrightYear = document.getElementById('copyrightYear');
copyrightYear.textContent = `©${currentYear} FilmStacks Project`

const lastModifiedDate = new Date(document.lastModified);
const lastModified = document.getElementById('lastModified');
lastModified.textContent = `Last Modification: ${lastModifiedDate.toLocaleDateString()}`;




const API_KEY = "api_key=912d87e2800a27f86642f1feab042fa9";
const BASE_URL = "https://api.themoviedb.org/3";
// const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`;

const genres = [
	{
		id: 28,
		name: "Action",
	},
	{
		id: 12,
		name: "Adventure",
	},
	{
		id: 16,
		name: "Animation",
	},
	{
		id: 35,
		name: "Comedy",
	},
	{
		id: 80,
		name: "Crime",
	},
	{
		id: 99,
		name: "Documentary",
	},
	{
		id: 18,
		name: "Drama",
	},
	{
		id: 10751,
		name: "Family",
	},
	{
		id: 14,
		name: "Fantasy",
	},
	{
		id: 36,
		name: "History",
	},
	{
		id: 27,
		name: "Horror",
	},
	{
		id: 10402,
		name: "Music",
	},
	{
		id: 9648,
		name: "Mystery",
	}
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

let selectedGenre = [];
setGenre();
function setGenre() {
	tagsEl.innerHTML = "";
	genres.forEach((genre) => {
		const t = document.createElement("div");
		t.classList.add("tag");
		t.id = genre.id;
		t.innerText = genre.name;
		t.addEventListener("click", () => {
			if (selectedGenre.length == 0) {
				selectedGenre.push(genre.id);
			} else {
				if (selectedGenre.includes(genre.id)) {
					selectedGenre.forEach((id, idx) => {
						if (id == genre.id) {
							selectedGenre.splice(idx, 1);
						}
					});
				} else {
					selectedGenre.push(genre.id);
				}
			}
			console.log(selectedGenre);
			getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
			highlightSelection();
		});
		tagsEl.append(t);
	});
}

function highlightSelection() {
	const tags = document.querySelectorAll(".tag");
	tags.forEach((tag) => {
		tag.classList.remove("highlight");
	});
	clearBtn();
	if (selectedGenre.length != 0) {
		selectedGenre.forEach((id) => {
			const hightlightedTag = document.getElementById(id);
			hightlightedTag.classList.add("highlight");
		});
	}
}

function clearBtn() {
	let clearBtn = document.getElementById("clear");
	if (clearBtn) {
		clearBtn.classList.add("highlight");
	} else {
		let clear = document.createElement("div");
		clear.classList.add("tag", "highlight");
		clear.id = "clear";
		clear.innerText = "Clear ❌";
		clear.addEventListener("click", () => {
			selectedGenre = [];
			setGenre();
			getMovies(API_URL);
		});
		tagsEl.append(clear);
	}
}

getMovies(API_URL);

async function getMovies(url) {
	lastUrl = url;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		console.log(data.results);
		if (data.results.length !== 0) {
			showMovies(data.results);
			currentPage = data.page;
			nextPage = currentPage + 1;
			prevPage = currentPage - 1;
			totalPages = data.total_pages;

			current.innerText = currentPage;

			if (currentPage <= 1) {
				prev.classList.add("disabled");
				next.classList.remove("disabled");
			} else if (currentPage >= totalPages) {
				prev.classList.remove("disabled");
				next.classList.add("disabled");
			} else {
				prev.classList.remove("disabled");
				next.classList.remove("disabled");
			}

			// tagsEl.scrollIntoView({ behavior: "smooth" });
		} else {
			main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
		}
	} catch (error) {
		console.error('Fetch error:', error);
		main.innerHTML = `<h1 class="no-results">Failed to fetch data</h1>`;
	}
}




function showMovies(data) {
	main.innerHTML = "";

	data.forEach((movie) => {
		const { title, poster_path, vote_average, overview, id } = movie;
		const movieContainer = document.createElement("div");
		movieContainer.classList.add("movie");
		movieContainer.innerHTML = `
             <img src="${poster_path ? IMAGE_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt=${title} loading="lazy">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `;

		main.appendChild(movieContainer);

		document.getElementById(id).addEventListener("click", () => {
			console.log(id);
			openNav(movie);
		});
	});
}

const overlayContent = document.getElementById("overlay-content");
/* Open when someone clicks on the span element */
function openNav(movie) {
	let id = movie.id;
	fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
		.then((response) => response.json())
		.then((videoData) => {
			console.log(videoData);
			if (videoData) {
				document.getElementById("myNav").style.width = "100%";
				if (videoData.results.length > 0) {
					let embed = [];
					let dots = [];
					videoData.results.forEach((video, idx) => {
						let { name, key, site } = video;

						if (site == "YouTube") {
							embed.push(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
							dots.push(`<span class="dot">${idx + 1}</span>`);
						}
					});

					let content = `
						<h1 class="no-results">${movie.original_title}</h1>
						<br>
						${embed.join("")}
						<br>
						<div class="dots">${dots.join("")}</div>
					`;
					overlayContent.innerHTML = content;
					activeSlide = 0;
					showVideos();
				} else {
					overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
				}
			}
		});
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
}

let activeSlide = 0;
let totalVideos = 0;

function showVideos() {
	let embedClasses = document.querySelectorAll(".embed");
	let dots = document.querySelectorAll(".dot");

	totalVideos = embedClasses.length;
	embedClasses.forEach((embedTag, idx) => {
		if (activeSlide == idx) {
			embedTag.classList.add("show");
			embedTag.classList.remove("hide");
		} else {
			embedTag.classList.add("hide");
			embedTag.classList.remove("show");
		}
	});

	dots.forEach((dot, indx) => {
		if (activeSlide == indx) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
	if (activeSlide > 0) {
		activeSlide--;
	} else {
		activeSlide = totalVideos - 1;
	}

	showVideos();
});

rightArrow.addEventListener("click", () => {
	if (activeSlide < totalVideos - 1) {
		activeSlide++;
	} else {
		activeSlide = 0;
	}
	showVideos();
});

function getColor(vote) {
	if (vote >= 8) {
		return "green";
	} else if (vote >= 5) {
		return "orange";
	} else {
		return "red";
	}
}

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const searchTerm = search.value;
	selectedGenre = [];
	setGenre();
	if (searchTerm) {
		getMovies(SEARCH_URL + "&query=" + searchTerm);
	} else {
		getMovies(API_URL);
	}
});

prev.addEventListener("click", () => {
	if (prevPage > 0) {
		pageCall(prevPage);
	}
});

next.addEventListener("click", () => {
	if (nextPage <= totalPages) {
		pageCall(nextPage);
	}
});

function pageCall(page) {
	let urlSplit = lastUrl.split("?");
	let queryParams = urlSplit[1].split("&");
	let key = queryParams[queryParams.length - 1].split("=");
	if (key[0] != "page") {
		let API_URL = lastUrl + "&page=" + page;
		getMovies(API_URL);
	} else {
		key[1] = page.toString();
		let a = key.join("=");
		queryParams[queryParams.length - 1] = a;
		let b = queryParams.join("&");
		let API_URL = urlSplit[0] + "?" + b;
		getMovies(API_URL);
	}
}
