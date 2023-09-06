var app = angular.module("Myapp",["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl:"/user/product/viewProduct.html",
            controller:"UserController"
        })
        .when("/product",{
            templateUrl:"/user/product/Product.html",
            controller:"product-sort"
        })
        .when("/cart",{
            templateUrl:"/user/cart/Cart.html",
            controller:"cart_user-ctrl",
        })
        .when("/product_detail",{
            templateUrl:"/user/product/ProductDetail.html",
            controller:"UserController"
        })
        .when("/address", {
            templateUrl:"/user/address/addressTable.html",
            controller:"address-form-ctrl"
        })
        .when("/purchase", {
            templateUrl:"/user/purchase/purchase.html",
            controller:"order-ctrl"
        })
        .when("/purchaseDetail", {
            templateUrl:"/user/purchase/purchaseDetail.html",
            controller:"order-detail-ctrl"
        })
        .when("/contact", {
            templateUrl:"/user/product/contact.html",
        })
        .when("/register", {
            templateUrl:"/user/account/register-form.html",
            controller:"register-ctrl"
        })
        .when("/login", {
            templateUrl:"/user/account/login.html",
            controller:"login-ctrl"
        })
        .when("/info", {
            templateUrl:"/user/Profile/AccountInfo.html",
            controller:"profile-ctl"
        })
        .when("/changePassword", {
            templateUrl:"/user/account/changePassword.html",
            controller:"changePassword-ctrl"
        })

})