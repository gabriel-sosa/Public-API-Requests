const gallery =  document.querySelector(`#gallery`);

const modal = document.createElement(`div`);
modal.className = `modal-container`;
modal.innerHTML = 
`<div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
        <h3 id="name" class="modal-name cap">name</h3>
        <p id="modal-email" class="modal-text">email</p>
        <p id="modal-city" class="modal-text cap">city</p>
        <hr>
        <p id="modal-cell" class="modal-text">(555) 555-5555</p>
        <p id="modal-address" class="modal-text">123 Portland Ave., Portland, OR 97204</p>
        <p id="modal-birthday" class="modal-text">Birthday: 10/21/2015</p>
    </div>
</div>
<div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
</div>`;
modal.addEventListener(`click`, e => {
    if(e.eventPhase === 2 || e.target.tagName === `STRONG`)
        modal.style.display = `none`;
});
document.querySelector(`body`).appendChild(modal);

const createUsers = users => {
    users.results.forEach(user =>{
        const card = document.createElement(`div`);
        card.className = `card`;
        card.innerHTML = 
`<div class="card-img-container">
    <img class="card-img" src="${user.picture.medium}" alt="profile picture">
</div>
<div class="card-info-container">
    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
    <p class="card-text">${user.email}</p>
    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
</div>`;
        card.addEventListener(`click`, e => {
            modal.style.display = `block`;
            modal.querySelector(`.modal-img`).src = user.picture.large;
            modal.querySelector(`.modal-name`).textContent = `${user.name.first} ${user.name.last}`;
            modal.querySelector(`#modal-email`).textContent = user.email;
            modal.querySelector(`#modal-city`).textContent = user.location.city;
            modal.querySelector(`#modal-cell`).textContent = user.cell;
            modal.querySelector(`#modal-address`).textContent = `${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`;
            modal.querySelector(`#modal-birthday`).textContent = user.dob.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, `Birthday: $2/$3/$1`);
        });
        gallery.appendChild(card);
    });
}

fetch(`https://randomuser.me/api/?results=12&nat=us&noinfo`)
    .then(data => data.json())
    .then(users => createUsers(users))
    .catch(() => console.log(`it seems there was an error`));