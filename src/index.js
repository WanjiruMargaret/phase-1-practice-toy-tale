let addToy = false

document.addEventListener("DOMContentLoaded", () => {
  const toyCollectionDiv = document.getElementById("toy-collection");
  const toyForm = document.querySelector("form");

  // Fetch and display all toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });

  // Function to render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCollectionDiv.appendChild(card);

    // Add like button event listener
    const likeBtn = card.querySelector("button");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then(res => res.json())
        .then(updatedToy => {
          card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
          toy.likes = updatedToy.likes; // update local state
        });
    });
  }

  // Add toy submission form event
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then(res => res.json())
      .then(newToy => {
        renderToy(newToy); // add the new toy to the DOM
        toyForm.reset(); // optional: clear form after submission
      });
  });
});
