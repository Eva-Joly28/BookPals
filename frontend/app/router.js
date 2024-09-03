import EmberRouter from '@embroider/router';

import config from 'ember-boilerplate/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
  src = config.src;
}

Router.map(function () {
  this.route('404', {path:'/*path'});
  this.route('search', {path: 'resultats/:search'});
  this.route('book-details', {path: 'livres/:book_id'});
  this.route('users', {path:'utilisateurs'});
  
  this.route('profile',{path: 'profil/:username'}, function () {
    this.route('index', {path: '/'});
    this.route('reviews', {path: '/commentaires'});
    this.route('ratings', {path: '/livres-notes'});
    this.route('followers', {path: '/abonnes'});
    this.route('following', {path: '/suivis'});
    this.route('messages', {path: '/conversations'}, function () {
      this.route('index', {path:'/'});
      this.route('conv', {path:'/:id'});
      this.route('new',{path:'/new/:receiver'})
    });
    this.route('blocked',{path: '/bloques'})
    this.route('wishlist');
    this.route('lists',{path:'/listes'});
    this.route('to-read', {path:'/pile-a-lire'});
    this.route('read', {path: '/lus'});
    this.route('in-progress', {path: '/en-cours'});
    this.route('liked',{path:'/aimes'});

  })
  this.route('lists', {path: '/listes'}, function () {
    this.route('list', {path: '/:list_name'})
  });
  this.route('authors', {path:'/author/:author'});
  this.route('genres', {path: 'genre/:genre'});
  this.route('forgot-password');
  this.route('reset-password', {path: '/reset-password/:token'});
});
