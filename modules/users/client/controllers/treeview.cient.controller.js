'use strict';

angular.module('users').controller('TreeViewController', ['$scope', '$timeout', '$window','$http', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window,$http, Authentication, FileUploader) {

  $scope.delete = function (data) {
      data.nodes = [];
    };

     

      $scope.activated = false;
     
  
    var nodes = [];
    var usernamesForChildPopulated =[];
    $scope.add = function (data) {
      var post = data.nodes.length + 1;
      var newName = data.name + '-' + post;
    //  $scope.getTreeNodes(Authentication.user.username);
      data.nodes.push({ name: newName, nodes: [] });
    };
    $scope.viewChildren = function(username){
      $scope.treeData;
      $scope.tree;
      nodes = [];
      usernamesForChildPopulated = [];
      getTreeNodes(username);
    }
  //angular.element('tree').treeview({data: getTreeNodes()});
   // $scope.tree = [{ name: "Add Gudichi Member", nodes: [] }];
  getTreeNodes(Authentication.user.username);
function getTreeNodes(username){
     $http.post('api/auth/getChild',{"username":username}).then(function(response){
       console.log("Response :"+JSON.stringify(response));
      // var mlmTree = new Tree();
      

       for(var i= 0;i<response.data.length;i++){
          nodes.push({ name: response.data[i].username,side:response.data[i].side, displayName:response.data[i].displayName,sponsor_id:response.data[i].sponsor_id,nodes: [{child1:response.data[i].childs[0]},{child2:response.data[i].childs[1]}] });
       }
       $scope.treeData = new kendo.data.HierarchicalDataSource({data:nodes});
       $scope.activated = true;
      // $scope.tree = mlmTree;
       
      //$scope.tree = [{ name: "Add Gudichi Member", nodes: response.data }];
     }).catch(function(error){
        alert("error :"+JSON.stringify(error));
     });
   }

   function getChildById(username,array,index){
    $http.post('api/auth/getChild',{"username":username}).then(function(response){
      console.log("Response child............ :"+JSON.stringify(response).data,response.data);
      for(var i= 0 ; i < response.data.length; i++) {
        $scope.tree.append({name:response.data[i].username,displayName:response.data[i].displayName,side:response.data[i].side
        ,sponsor_id:response.data[i].sponsor_id}, $scope.tree.select());
      }
      usernamesForChildPopulated.push(username);
      $scope.activated = true;
    }).catch(function(error){
       alert("error :"+JSON.stringify(error));
    });
  }



  //  $scope.treeData = new kendo.data.HierarchicalDataSource({ data: [
  //   { text: "Item 1" },
  //   { text: "Item 2", items: [
  //     { text: "SubItem 2.1" },
  //     { text: "SubItem 2.2" }
  //   ] },
  //   { text: "Item 3" }
  // ]});

  $scope.click = function(dataItem) {
    alert(dataItem.name);
  };

  function makeItem() {

   // var txt = kendo.toString(new Date(), "HH:mm:ss");
    return { text: txt };
  };

  $scope.addAfter = function(item) {
    alert(item);
    var array = item.parent();
    var index = array.indexOf(item);
    var newItem = getChildById(item.nodes[0].child1,array,index);
   // getChildById(item.nodes[0].child1);
    console.log("newItem :"+newItem);
   // var newItem = makeItem();
   // array.splice(index + 1, 0, newItem);
  };
  var child_populated = false;
  $scope.addBelow = function(item,selectedItem,id) { 
    var found = false;
    $scope.activated = false;
    for(var i = 0; i < usernamesForChildPopulated.length; i++) {
    if (usernamesForChildPopulated[i]== item.name) {
    found = true;
    break;
    }
    }
    var array = item.parent();
    var index = array.indexOf(item);
    console.log("item.username.......... :"+JSON.stringify(item ));
    //if(item.name == selectedItem.name && !child_populated) {
    if(!found){
    var newItem = getChildById(item.name,array,index);
    } else {
      $scope.activated = true;
    alert("All childs for "+item.name+" populated");
    }
  };

  $scope.remove = function(item) {
    var array = item.parent();
    var index = array.indexOf(item);
    array.splice(index, 1);

    $scope.selectedItem = undefined;
  };


  


///////Binary Tree Starts Here/////////////

class Tree {
  constructor() {
    this.root = null;
  }
  //Adding Node
  add(value) {
    if (this.root === null) {
      this.root = new Node(value);
    }
    else {
      let current = this.root;
      while(true) {
        if (current.value > value) {
          // go left
          
          if (current.left) {
            current = current.left;
          }
          else {
            current.left = new Node(value);
            break;
          }
        }
        else {
          // go right
          if (current.right) {
            current = current.right;
          }
          else {
            current.right = new Node(value);
            break;
          }    
        }
      }
    }
    return this;
  }
  toJSON() {
    return JSON.stringify(this.root.serialize(), null, 4);
  }
  toObject() {
    return this.root.serialize();
  }
}

class Node {
  constructor(value=null, left=null, right=null) {
    this.left = left;
    this.right = right;
    this.value = value;
  }
  serialize() {
    const ans = { value: this.value };
    ans.left = this.left === null ? null : this.left.serialize();
    ans.right = this.right === null ? null : this.right.serialize();
    return ans;
  }
}

//populateDataToTree();

function populateDataToTree(){
  // it('creates a correct tree', () => {
     const nums = [3,7,4,6,5,1,10,2,9,8];
     const tree = new Tree();
     nums.map( num => tree.add(num));
     const objs = tree.toObject();
     console.log("objs  "+JSON.stringify(objs));
    //  render(objs, nums);
 
    //  expect(objs.value).toEqual(3);
     
    //  expect(objs.left.value).toEqual(1);
    //  expect(objs.left.left).toBeNull();
     
    //  expect(objs.left.right.value).toEqual(2);
    //  expect(objs.left.right.left).toBeNull();
    //  expect(objs.left.right.right).toBeNull();
     
    //  expect(objs.right.value).toEqual(7);
     
    //  expect(objs.right.left.value).toEqual(4);
    //  expect(objs.right.left.left).toBeNull();
     
    //  expect(objs.right.left.right.value).toEqual(6);
    //  expect(objs.right.left.right.left.value).toEqual(5);
    //  expect(objs.right.left.right.left.right).toBeNull();
    //  expect(objs.right.left.right.left.left).toBeNull();
     
    //  expect(objs.right.right.value).toEqual(10);
    //  expect(objs.right.right.right).toBeNull();
     
    //  expect(objs.right.right.left.value).toEqual(9);
    //  expect(objs.right.right.left.right).toBeNull();
     
    //  expect(objs.right.right.left.left.value).toEqual(8);
    //  expect(objs.right.right.left.left.right).toBeNull();
    //  expect(objs.right.right.left.left.left).toBeNull();
  // });
 }   
 


///////Binary Tree Ends Here/////////////

///Kendo Starts Here????
//$scope.treeData = new kendo.data.HierarchicalDataSource({ data: [
  // { text: "Item 1" },
  // { text: "Item 2", items: [
  //   { text: "SubItem 2.1" },
  //   { text: "SubItem 2.2" }
  // ] },
  // { text: "Item 3" }
// ]});

// $scope.click = function(dataItem) {
//   alert(dataItem.text);
// };

// function makeItem() {
//   var txt = kendo.toString(new Date(), "HH:mm:ss");
//   return { text: txt };
// };

// $scope.addAfter = function(item) {
//   var array = item.parent();
//   var index = array.indexOf(item);
//   var newItem = makeItem();
//   array.splice(index + 1, 0, newItem);
// };

// $scope.addBelow = function() {
//   // can't get this to work by just modifying the data source
//   // therefore we're using tree.append instead.
//   var newItem = makeItem();
//   $scope.tree.append(newItem, $scope.tree.select());
// };

// $scope.remove = function(item) {
//   var array = item.parent();
//   var index = array.indexOf(item);
//   array.splice(index, 1);

//   $scope.selectedItem = undefined;
// };
////Kendo Stps

  }
]);





