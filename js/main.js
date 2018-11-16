const pageBuilder = {
    
    currentUser: 0,
    users: [],
    createElements: function () {
        //create DOM elemnts
        this.modal = document.createElement(`div`),
        this.modal.buttons = document.createElement(`div`);
        const form = document.createElement(`form`);
        //add classes
        this.modal.className = `modal-container`;
        this.modal.buttons.className = `modal-btn-container`;
        //insert content in the elements
        this.modal.innerHTML = 
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
</div>`;
        this.modal.buttons.innerHTML = 
`<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
<button type="button" id="modal-next" class="modal-next btn">Next</button>`;
        form.innerHTML = 
`<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">`;
        //give the form method a method and action
        form.action = `#`;
        form.method = `get`;
        //event listeners
        this.modal.addEventListener(`click`, e => {
            if(e.eventPhase === 2 || e.target.tagName === `STRONG`)
                this.modal.style.display = `none`;
        });
        this.modal.buttons.addEventListener(`click`, e => {
            if (e.target.id === `modal-next` && this.currentUser < this.users.length - 1){
                this.currentUser++;
                this.displayUser();
            } else if (e.target.id === `modal-prev` && this.currentUser > 0) {
                this.currentUser--;
                this.displayUser();
            }
        });
        form.querySelector(`#search-input`).addEventListener(`search`, e => {
            e.preventDefault();
            const input = new RegExp(form.children[0].value, `i`);
            document.querySelectorAll(`.card #name`).forEach(user => {
                const userParent = user.parentElement.parentElement;
                if (input.test(user.textContent)){
                    userParent.style.display = `flex`;
                } else {
                    userParent.style.display = `none`;
                }
            });
        });
        //append the elements to the DOM
        document.querySelector(`body`).appendChild(this.modal);
        this.modal.appendChild(this.modal.buttons);
        document.querySelector(`.search-container`).appendChild(form);
    },
    ajax: function () {
        const gallery =  document.querySelector(`#gallery`);
        const createUsers = () => {
            this.users.forEach((user, index) =>{
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
                    this.currentUser = index;
                    this.displayUser();
                });
                gallery.appendChild(card);
            });
        };
        fetch(`https://randomuser.me/api/?results=12&nat=us&noinfo`)
            .then(data => data.json())
            .then(users => {
                this.users = users.results;
                createUsers();
            })
            .catch(() => console.log(`it seems there was an error`));
    },
    displayUser: function (){
        const user = this.users[this.currentUser];
        this.modal.style.display = `block`;
        this.modal.querySelector(`.modal-img`).src = user.picture.large;
        this.modal.querySelector(`.modal-name`).textContent = `${user.name.first} ${user.name.last}`;
        this.modal.querySelector(`#modal-email`).textContent = user.email;
        this.modal.querySelector(`#modal-city`).textContent = user.location.city;
        this.modal.querySelector(`#modal-cell`).textContent = user.cell;
        this.modal.querySelector(`#modal-address`).textContent = `${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`;
        this.modal.querySelector(`#modal-birthday`).textContent = user.dob.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, `Birthday: $2/$3/$1`);
    }
};

pageBuilder.createElements();
pageBuilder.ajax();