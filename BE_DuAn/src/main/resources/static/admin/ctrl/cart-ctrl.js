// app.controller('cart-ctrl', function ($rootScope,$scope, $http) {
//     const apiUrlCart = "http://localhost:8080/api/cart";
//
//     $scope.carts = [];
//     $scope.formCart = {};
//
//     $scope.getCart = function () {
//         $http.get(apiUrlCart)
//             .then(function (response) {
//                 $scope.carts = response.data;
//                 console.log(response);
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     };
//     $scope.getCart();
//
// });