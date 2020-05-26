'use strict';

const leftMenu = document.querySelector('.left-menu'), 
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

    const apiKey = 'a1ba8d787d83a100beb355d231772515';


const getData = async (url) => {
    const response = await fetch(url);
    if(response.ok && response.status === 200) {
        return await response.json();
    } else {
        throw new Error(`Network error: ${response.status}`);
    }
};


const openCloseMenue = (e) => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');

    const dropdown = leftMenu.querySelectorAll('.dropdown');

    dropdown.forEach(item => {
        item.classList.remove('active');
    });
    
};

const closeClickOut = (e) => {
    if(!e.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
};

const openCloseDropdown = (e) => {
    e.preventDefault();
    
    const dropdown = e.target.closest('.dropdown');

    if(dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');      
    }
};

const createCards = (data) => {

    const { 
        name, 
        overview, 
        original_name, 
        poster_path: posterPath, 
        backdrop_path: backdropPath, 
        vote_average: voteAverage 
    } = data;

    const imageURL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

    const poster = posterPath ? `
    ${imageURL}${posterPath}` : 'img/no-poster.jpg';

    const backdrop = backdropPath ? `
    ${imageURL}${backdropPath}` : 'img/no-poster.jpg';

    const vote = voteAverage > 1 ? `
    <span class="tv-card__vote">${voteAverage}</span>` : '';

    const card = document.createElement('li');
    card.classList.add('tv-shows__item');
    card.insertAdjacentHTML('beforeend', `

        <a href="#" class="tv-card">
            ${vote}
            <img class="tv-card__img"
                src="${poster}"
                data-backdrop="${backdrop}"
                alt="${name}">
            <h4 class="tv-card__head">${name}</h4>
        </a>
    
    `);

    tvShowsList.insertAdjacentElement('beforeend', card);

    let tmp;

    card.addEventListener('mouseover', e => {
        const cardImage = e.target.closest('.tv-card__img');
        if(cardImage) {
            tmp = cardImage.src;
            cardImage.src = cardImage.dataset.backdrop;
        }
    });

    card.addEventListener('mouseout', e => {
        const cardImage = e.target.closest('.tv-card__img');
        if(cardImage) {
            cardImage.src = tmp;
        }
    });
};



hamburger.addEventListener('click', openCloseMenue);

document.addEventListener('click', closeClickOut);

leftMenu.addEventListener('click', openCloseDropdown);

tvShowsList.addEventListener('click', e => {
    if(e.target.closest('.tv-card')) {
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }
});

modal.addEventListener('click', e => {
    if(e.target.closest('.cross') ||
        e.target.classList.contains('modal')) {
        modal.classList.add('hide');
        document.body.style.overflow = '';

    }
});


getData('/test.json')
.then(data => data.results.forEach(item => createCards(item)))
.catch(error => console.log(error));