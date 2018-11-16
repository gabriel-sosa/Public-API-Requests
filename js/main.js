const pageBuilder = {
    currentUserIndex: 0,//the user that the modal will display
    users: [],//the users array, is filled in the ajax function
    createElements: function () {//creates every item that needs js to work
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
        //give the form element a method and action
        form.action = `#`;
        form.method = `get`;
        //event listeners
        this.modal.addEventListener(`click`, e => {//EL to close the modal
            if(e.eventPhase === 2 || e.target.tagName === `STRONG`)
                this.modal.style.display = `none`;
        });
        this.modal.buttons.addEventListener(`click`, e => {//EL to toggle back and forth between the employees
            const show = (move, index) => {//uses a recursive function to find the next or previous displayed user
                if (move === `prev` && index >= 0){
                    if (this.users[index].displayed)
                        return index;
                    else
                        return show(move, index - 1);
                } else if (move === `next` && index < this.users.length){
                    if (this.users[index].displayed)
                        return index;
                    else
                        return show(move, index + 1);
                }
            };
            if (e.target.id === `modal-prev`){
                const previous = show(`prev`, this.currentUserIndex - 1);
                if (previous != undefined){
                    this.currentUserIndex = previous;
                    this.displayUser();
                }
            } else if (e.target.id === `modal-next`){
                const next = show(`next`, this.currentUserIndex + 1);
                if (next != undefined){
                    this.currentUserIndex = next;
                    this.displayUser();
                }
            }
        });
        const search = () => {
            const input = new RegExp(form.children[0].value, `i`);
            document.querySelectorAll(`.card #name`).forEach((user, index) => {
                const userParent = user.parentElement.parentElement;
                if (input.test(user.textContent)){
                    userParent.style.display = `flex`;
                    this.users[index].displayed = true;
                } else {
                    userParent.style.display = `none`;
                    this.users[index].displayed = false;
                }
            });
        };
        form.children[0].addEventListener(`search`, search);
        form.children[1].addEventListener(`click`, search);
        form.addEventListener(`submit`, e => e.preventDefault());
        //append the elements to the DOM
        document.querySelector(`body`).appendChild(this.modal);
        this.modal.appendChild(this.modal.buttons);
        document.querySelector(`.search-container`).appendChild(form);
    },
    ajax: function () {//takes care of the ajax call and create the user cars
        const createUsers = () => {//creates the ueser card elements
            this.users.forEach((user, index) =>{
                //creates, gives a class, fills with the current user info, gives an event listener and appends each user card
                user.displayed = true;
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
                card.addEventListener(`click`, () => {//when clicked displays the selected user info
                    this.currentUserIndex = index;
                    this.displayUser();
                });
                document.querySelector(`#gallery`).appendChild(card);
            });
        };
        fetch(`https://randomuser.me/api/?results=12&nat=us&noinfo`)//the ajax call
            .then(data => data.json())
            .then(users => {
                this.users = users.results;
                createUsers();
            })
            .catch(() => alert(`it seems there was an error`));
    },
    displayUser: function (){//uses the currentUserIndex property as  the index to display the current user in the users array
        const user = this.users[this.currentUserIndex];
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