import './style.css';
import pokemonCards from './modules/cards';
import { addLike, getLikes } from './modules/likes.js';
import openPopup from './modules/popup.js';
import {get } from 'lodash';
import { addComment, getComments } from './modules/comments';
const BASE_API_URL = 'https://pokeapi.co/api/v2';
const itemContainer = document.getElementById('itemContainer');
const itemCounter = document.getElementById('itemCounter');
const updateLikeCount = async(likeButton, pokemonName, initialLikeCount) => {
    try {
        let likeCount = initialLikeCount;
        likeButton.textContent = `${likeCount} ${likeCount === '1' ? 'Like' : 'Likes'}`;
        likeButton.addEventListener('click', async() => {
            likeCount++;
            likeButton.textContent = `${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}`;
            // localStorage.setItem(pokemonName, likeCount);
            await addLike(pokemonName);
        });
    } catch (error) {
        console.error('Error updating like count:', error);
    }
};
const fetchPokemon = async(pokemon) => {
    try {
        const response = await fetch(`${BASE_API_URL}/pokemon/${pokemon.name}`);
        const data = await response.json();
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        const name = document.createElement('h2');
        name.textContent = data.name;
        const img = document.createElement('img');
        img.src = data.sprites.front_default;
        img.alt = data.name;
        const description = document.createElement('p');
        description.textContent = pokemon.description;
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');
        const likeButton = document.createElement('button');
        likeButton.classList.add('like');
        const initialLikeCount = await getLikes(pokemon.name);
        updateLikeCount(likeButton, pokemon.name, initialLikeCount);
        const commentButton = document.createElement('button');
        commentButton.classList.add('comment');
        commentButton.textContent = 'Comment';
        commentButton.addEventListener('click', () => {
            openPopup(pokemon);
        });
        actionsDiv.appendChild(likeButton);
        actionsDiv.appendChild(commentButton);
        itemDiv.appendChild(name);
        itemDiv.appendChild(img);
        itemDiv.appendChild(description);
        itemDiv.appendChild(actionsDiv);
        itemContainer.appendChild(itemDiv);
        itemCounter.textContent = `Total Cards: ${pokemonCards.length}`;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
};
pokemonCards.forEach((card) => {
    fetchPokemon(card);
});