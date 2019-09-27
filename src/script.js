// `https://api.themoviedb.org/3/tv/popular?page=1&language=en-US&api_key=4f77d211170879ad8b833a60483052aa`

// `https://api.themoviedb.org/3/tv/top_rated?api_key=4f77d211170879ad8b833a60483052aa&language=en-US&page=1`

let app = {};
app.Movies = function() {
  this.apikey = "https://api.themoviedb.org/3/";
  this.key = "4f77d211170879ad8b833a60483052aa";
  this.image_size = "/w500/";
  this.parent = document.getElementById("app");
  this.inputValue = document.getElementById("data");
  this.popular = this.apikey + "tv/popular?page=1&language=en-US&api_key=" + this.key;
  this.topRelated = this.apikey + "tv/top_rated?api_key=" + this.key + "&language=en-US&page=1";
};

app.Movies.prototype = {

    createElem: function(tagName, results) {
        let newElem = document.createElement(tagName);
        if (tagName === "img") {
          newElem.setAttribute(
            "src",
            "http://image.tmdb.org/t/p" + this.image_size + results
          );
        } else if (tagName === "a") {
          let title = results.original_title
            ? results.original_title
            : results.original_name;
          title = title ? title : results.name;
          newElem.setAttribute("href", title);
          newElem.setAttribute("id", results.id);
          newElem.addEventListener(
            "click",
            function(evt) {
              evt.preventDefault();
              this.removeElements();
              this.getImage(
                results.backdrop_path ? results.backdrop_path : results.logo_path
              );
              this.createElem("h3", title);
              this.createElem("p", results.overview);
              btn.remove();
              history.replaceState({}, results.id, '#' + results.name);
            }.bind(this),
            false
          );
          newElem.innerHTML = title;
          newElem.setAttribute("title", title);
        } else {
          newElem.innerHTML = results;
        }
        this.parent.appendChild(newElem);
      },

    request: function(url) {
        fetch(url)
          .then(response => {
            if (response.status !== 200) {
              return Promise.reject({
                status: response.status,
                statusText: response.statusText
              });
            }
            return (response = response.json());
          })
          .then(data => {
            if (data.total_results === 0) {
              return Promise.reject({
                statusText: "Not found items."
              });
            } else console.log(data);
            data.results.map(num => {
              this.createElem("a", num);
            });
          })
          .catch(error => {
            console.log("Fetch error: " + error.status, error.statusText);
            this.createElem(
              "p",
              "Looks like there was a problem. <br> Status Code : " +
                error.statusText
            );
          });
      },

    getPopularMovies: function() {
        this.request(this.popular);
      },

    getRelatedMovies: function() {
        this.request(this.topRelated);
      },

    getImage: function(obj) {
        start.createElem("img", obj);
      },
    
    removeElements: function() {
        while (this.parent.firstChild) {
          this.parent.removeChild(this.parent.firstChild);
        }
      }
};

let start = new app.Movies();
start.getPopularMovies();
history.replaceState({}, 'Home', '#Home');

const btn = document.getElementById("btn");

btn.addEventListener("click", function() {
    start.removeElements();
    start.getRelatedMovies();
    history.replaceState({}, 'Related', '#Related')
});








 
