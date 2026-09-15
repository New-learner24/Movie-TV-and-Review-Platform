const movieApiUrl = 'https://api.themoviedb.org/3';
const apiKey = '8eb90d8236be46bee4ac2852412fa73c'; 
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';


const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const moviesGrid = document.getElementById('movies-grid');
const contactFormPopup = document.getElementById('contact-form-popup');
const cancelContactBtn = document.getElementById('cancel-contact-btn');
const categoriesSection = document.getElementById('categories-section');
const categoriesGrid = document.getElementById('categories-grid');
const categoryButton = document.getElementById('category-btn');
const topRatedButton = document.getElementById('top-rated-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');


document.getElementById('contact-us-btn').addEventListener('click', () => {
  contactFormPopup.classList.remove('hidden');
  contactFormPopup.classList.add('show');
});


cancelContactBtn.addEventListener('click', () => {
  contactFormPopup.classList.add('hidden');
  contactFormPopup.classList.remove('show');
});


document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  if (name && email && message) {
    alert(`Thank you for your message, ${name}! We will get back to you soon.`);
    document.getElementById('contact-form').reset();
    contactFormPopup.classList.add('hidden');
  } else {
    alert('Please fill in all fields.');
  }
});


async function fetchMovies(query = '') {
  const encodedQuery = encodeURIComponent(query.trim()); 
  const url = encodedQuery ? 
    `${movieApiUrl}/search/movie?api_key=${apiKey}&query=${encodedQuery}` : 
    `${movieApiUrl}/movie/popular?api_key=${apiKey}`;
    
  const response = await fetch(url);
  const data = await response.json();
  
  
  if (data.results && data.results.length > 0) {
    return data.results;
  } else {
    alert(`No results found for "${query}". Please check the title and try again.`);
    return [];
  }
}


async function fetchTopRatedMovies() {
  const response = await fetch(`${movieApiUrl}/movie/top_rated?api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
}


async function getGenreName(id) {
  const response = await fetch(`${movieApiUrl}/genre/movie/list?api_key=${apiKey}`);
  const data = await response.json();
  const genre = data.genres.find(genre => genre.id === id);
  return genre ? genre.name : 'Unknown';
}


async function getCast(movieId) {
  const response = await fetch(`${movieApiUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
  const data = await response.json();
  return data.cast.slice(0, 5).map(actor => actor.name);
}

async function displayMovies(movies) {
  if (!movies || movies.length === 0) {
    moviesGrid.innerHTML = '<p>No movies found.</p>';
    return;
  }

  const movieCards = await Promise.all(movies.map(async (movie) => {
    const genres = await Promise.all(movie.genre_ids.map(id => getGenreName(id)));
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';
    const cast = await getCast(movie.id);

    return `
      <div class="movie-card">
        <img src="${imageBaseUrl}${movie.poster_path || 'fallback-image.jpg'}" alt="${movie.title}">
        
        <div class="movie-hover-details">
          <h2>${movie.title}</h2>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Genres:</strong> ${genres.join(', ')}</p>
          <p><strong>Cast:</strong> ${cast.join(', ')}</p>
          <p><strong>Description:</strong> ${movie.overview}</p>
        </div>

        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Description:</strong> ${movie.overview}</p>
          <p><strong>Cast:</strong> ${cast.join(', ')}</p>
        </div>
      </div>
    `;
  }));

  moviesGrid.innerHTML = movieCards.join('');
}


searchButton.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (query) {
    const movies = await fetchMovies(query); 
    displayMovies(movies);
  } else {
    alert('Please enter a search term.');
  }
});


topRatedButton.addEventListener('click', async () => {
  const movies = await fetchTopRatedMovies();
  displayMovies(movies);
});


categoryButton.addEventListener('click', async () => {
  categoriesSection.classList.toggle('hidden');
  if (!categoriesSection.classList.contains('hidden')) {
    const genres = await fetchGenres();
    displayGenres(genres);
  }
});


async function fetchGenres() {
  const response = await fetch(`${movieApiUrl}/genre/movie/list?api_key=${apiKey}`);
  const data = await response.json();
  return data.genres;
}

function displayGenres(genres) {
  categoriesGrid.innerHTML = genres.map(genre => `
    <div class="category-card" data-genre-id="${genre.id}">
      ${genre.name}
    </div>
  `).join('');
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', async () => {
      const genreId = card.getAttribute('data-genre-id');
      const movies = await fetchMoviesByCategory(genreId);
      displayMovies(movies);
      categoriesSection.classList.add('hidden');
    });
  });
}


async function fetchMoviesByCategory(genreId) {
  const response = await fetch(`${movieApiUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
  const data = await response.json();
  return data.results;
}

window.onload = async () => {
  const movies = await fetchMovies();
  displayMovies(movies);
};


cancelCategoryBtn.addEventListener('click', () => {
  categoriesSection.classList.add('hidden');
});
