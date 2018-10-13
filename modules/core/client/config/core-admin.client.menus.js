'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
    Menus.addMenuItem('topbar', {
      title: 'User',
      state: 'user',
      type: 'dropdown',
      roles: ['user']
    });
  }
]);
