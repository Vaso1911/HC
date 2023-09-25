const body = document.querySelector('body')
const heroesContainer = document.getElementById('heroes-container')
const modal = document.getElementById('modal')
const modalContent = modal.querySelector('.modal-content')
const closeModal = modal.querySelector('.close')
const acterNameModal =  modalContent.querySelector('.hero-card__name')
const realNameModal = modalContent.querySelector('.realName')
const speciesModal = modalContent.querySelector('.species')
const statusModal = modalContent.querySelector('.status')
const labelFilter = document.querySelector('.label-filter')
const movieFilter = document.getElementById('movie-filter')
let cards = '';

const createHeroCard = (hero) => {
  cards += `
  <button class="hero-card" data-actor="${hero.actors}">
    <picture class="hero-card__picture">
      <img class="hero-card__img" src="${hero.photo}" alt="${hero.name}">
    </picture>
    <h2 class="hero-card__name">${hero.name}</h2>
    <ul class="list list-reset">
      <li class="list__item">
        <h3 class="hero-card__name hero-card__name--acter">
          <span class="hero-card__acter ">Acter:</span> ${hero.actors}
        </h3>
      </li>
        <li class="list__item list__item--style">
          <span>Citizenship:</span>
            <span>${hero.citizenship}</span>
        </li>
        <li class="list__item list__item--style">
            <span>Gender:</span>
            <span>${hero.gender}</span>
        </li>
      </ul>
</button>`;
}

const fillMovieFilter = (data) => {
  const allMovies = new Set(); // Создаем множество для уникальных фильмов

  data.forEach(heroData => {
    if (heroData.movies) {
      heroData.movies.forEach(movie => {
        allMovies.add(movie); // Добавляем фильм в множество
      });
    }
  });

  // Преобразуем множество в массив и сортируем его
  const sortedMovies = Array.from(allMovies).sort();

  // Создаем опции для выпадающего списка
  sortedMovies.forEach(movie => {
    const option = document.createElement('option');
    option.value = movie;
    option.textContent = movie;
    movieFilter.appendChild(option);
  });
}

const openModal = (hero) => {
  modal.classList.add('modal--active')
  body.classList.add('overflow-hidden')

  acterNameModal.textContent = hero.actors;
  realNameModal.textContent = hero.realName || 'N/A';
  speciesModal.textContent = hero.species || 'N/A';
  statusModal.textContent = hero.status;
  
  const moviesList = modalContent.querySelector('.movies');
  moviesList.innerHTML = '';
  if (hero.movies && hero.movies.length > 0) {
    hero.movies.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.classList.add('movies__item')
      movieItem.textContent = movie;
      moviesList.append(movieItem);
    });
  } else {
    const movieItem = document.createElement('li');
    movieItem.textContent = 'N/A';
    moviesList.append(movieItem);
  }
}

const closeHeroModal = () => {
  modal.classList.remove('modal--active')
  body.classList.remove('overflow-hidden')
}

modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
    closeHeroModal();
  }
});

const loadHeroes = async () => {
  try {
    const response = await fetch('dbHeroes.json');
    const data = await response.json();

    data.forEach(heroData => {
      createHeroCard(heroData);
    });

    heroesContainer.innerHTML = cards;


    
    const heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(heroCard => {
      heroCard.addEventListener('click', () => {
        const actor = heroCard.getAttribute('data-actor');
        const selectedHero = data.find(hero => hero.actors === actor);
        if (selectedHero) {
          openModal(selectedHero);
        }
      });
    });

    movieFilter.addEventListener('change', () => {
      const selectedMovie = movieFilter.value; 
      const heroCards = document.querySelectorAll('.hero-card');
      heroCards.forEach(heroCard => {
        const actor = heroCard.getAttribute('data-actor');
        const selectedHero = data.find(hero => hero.actors === actor);
    
        if (selectedHero) {
          if (selectedMovie === 'All' || (selectedHero.movies && selectedHero.movies.includes(selectedMovie))) {
            heroCard.style.display = 'block'; // Показываем карточку, если фильм соответствует
          } else {
            heroCard.style.display = 'none'; // Скрываем карточку, если фильм не соответствует
          }
        }
      });
    });

    fillMovieFilter(data)

    const heroCardAnim = document.querySelectorAll('.hero-card');
    let rAF = null;
    
    const animCardRotate = (ev) => {
      cancelAnimationFrame(rAF);
      const target = ev.currentTarget;
      rAF = requestAnimationFrame(() => {
    
        const rotateY = (ev.offsetX - target.offsetWidth / 2) / 24;
        const rotateX = ((ev.offsetY - target.offsetHeight / 2) / 24) * -1;
    
        target.style.transition = 'transform 0.1s ease-in-out';
        target.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    }
    
    const animCardDefault = (ev) => {
      cancelAnimationFrame(rAF);
      const target = ev.currentTarget;
      rAF = requestAnimationFrame(() => {
        target.style.transition = 'transform 0.1s ease-in-out';
        target.style.transform = '';
      });
    }


    heroCardAnim.forEach(e => {
      if(e.classList.contains('hero-card')) {

      e.addEventListener('mousemove', animCardRotate)
      e.addEventListener('mouseout', animCardDefault)
      }
    })

  } catch (error) {
    console.error('Произошла ошибка при загрузке данных:', error);
  }
}

loadHeroes();



