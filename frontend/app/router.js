import EmberRouter from '@embroider/router';

import config from 'ember-boilerplate/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('books', {path: '/livres'}, function () {
    this.route('book', {path: '/:book_title'});
  });
  this.route('users', {path:'utilisateurs'}, function () {
    this.route('user', {path:'/:username'});
  });
  this.route('profile',{path: 'profil/:username'}, function () {
    this.route('reviews', {path: '/commentaires'});
    this.route('ratings', {path: '/notes'});
    this.route('friends', {path: '/réseau'});
    this.route('wishlist');
    this.route('lists');
    this.route('toread', {path:'/à_lire'});
    this.route('read', {path: 'lus'});
    this.route('favorites');

  })
  this.route('lists', {path: '/listes'}, function () {
    this.route('list', {path: '/:list_name'})
  });
  this.route('authors', {path:'/author/:author'});
  this.route('genres', {path: 'genres/:genre'});
  this.route('forgot-password');
  this.route('reset-password', {path: '/reset-password/:token'});
});
