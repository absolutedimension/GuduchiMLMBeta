

  'use strict';

  angular.module('addproducts')
    .run(['Menus',


  function (Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Addproducts',
    //   state: 'addproducts',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'addproducts', {
      title: 'List Addproducts',
      state: 'addproducts.list',
      roles:['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'addproducts', {
      title: 'Create Addproduct',
      state: 'addproducts.create',
      roles: ['admin']
    });
  
}]);




// (function () {
//   'use strict';

//   angular
//     .module('addproducts')
//     .run(menuConfig);

//   menuConfig.$inject = ['menuService'];

//   function menuConfig(menuService) {
//     // Set top bar menu items
//     menuService.addMenuItem('topbar', {
//       title: 'Addproducts',
//       state: 'addproducts',
//       type: 'dropdown',
//       roles: ['*']
//     });

//     // Add the dropdown list item
//     menuService.addSubMenuItem('topbar', 'addproducts', {
//       title: 'List Addproducts',
//       state: 'addproducts.list'
//     });

//     // Add the dropdown create item
//     menuService.addSubMenuItem('topbar', 'addproducts', {
//       title: 'Create Addproduct',
//       state: 'addproducts.create',
//       roles: ['admin']
//     });
//   }
// }());
