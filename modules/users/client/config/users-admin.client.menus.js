'use strict';


angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Add Member',
      state: 'addmember'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Approve Users',
      state: 'admin.toapproveusers'
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'Schemes',
      state: 'buy'
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'Add Member',
      state: 'addmember'
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'Tree View',
      state: 'treeview'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'View Children',
      state: 'treeview'
    });
   
  }
]);

