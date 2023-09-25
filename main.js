const body = document.querySelector('body')
const heroesContainer = document.getElementById('heroes-container')
const modal = document.getElementById('modal')
const modalContent = modal.querySelector('.modal-content')
const closeModal = modal.querySelector('.close')
const acterNameModal =  modalContent.querySelector('.hero-card__name')
const realNameModal = modalContent.querySelector('.realName')
const speciesModal = modalContent.querySelector('.species')
const statusModal = modalContent.querySelector('.status')

let cards = '';

const createHeroCard = (hero) => {
  cards += `
  <button class="hero-card" data-actor="${hero.actors}">
    <picture><img src="${hero.photo}" alt="${hero.name}"></picture>
    <h2 class="hero-card__name">${hero.name}</h2>
    <ul class="list">
      <li>
        <h3>
          <span>Acter:</span> ${hero.actors}
        </h3>
      </li>
        <li>
          <span>Citizenship:</span>
            <span>${hero.citizenship}</span>
        </li>
        <li>
            <span>Gender:</span>
            <span>${hero.gender}</span>
        </li>
      </ul>
</button>`;
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

  } catch (error) {
    console.error('Произошла ошибка при загрузке данных:', error);
  }
}

loadHeroes();



