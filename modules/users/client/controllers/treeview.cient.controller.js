'use strict';

angular.module('users').controller('TreeViewController', ['$scope', '$timeout', '$window','$http', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window,$http, Authentication, FileUploader) {

  $scope.delete = function (data) {
      data.nodes = [];
    };
    var nodes = [];
    $scope.add = function (data) {
      var post = data.nodes.length + 1;
      var newName = data.name + '-' + post;
    //  $scope.getTreeNodes(Authentication.user.username);
      data.nodes.push({ name: newName, nodes: [] });
    };
  $scope.viewChildren = function(username){
      getTreeNodes(username);
  }
   // $scope.tree = [{ name: "Add Gudichi Member", nodes: [] }];
  getTreeNodes(Authentication.user.username);
function getTreeNodes(username){
     $http.post('api/auth/getChild',{"username":username}).then(function(response){
       console.log("Response :"+JSON.stringify(response));
      // var mlmTree = new Tree();

       for(var i= 0;i<response.data.length;i++){
        //  var leftRight ={
        //     left:(response.data[i].side == 'L') ? 'left':'right',
        //     right:(response.data[i].side == 'R') ? 'right':'left'
        //  };
        // mlmTree.add(leftRight);
         nodes.push({ name: response.data[i].username, nodes: [] ,side:response.data[i].side});
       }
       $scope.tree = nodes;
      // $scope.tree = mlmTree;
       
      //$scope.tree = [{ name: "Add Gudichi Member", nodes: response.data }];
     }).catch(function(error){
        alert("error :"+JSON.stringify(error));
     });
   }


  


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
  }
]);





