var app = angular.module("Myapp",["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
        .when("/home/main",{
            templateUrl:"/admin/Product/ListProduct.html",
            controller:"main"
        })
        .when("/designs",{
            templateUrl:"/admin/Product/Designs.html",
            controller:"design"
        })
        .when("/createproduct",{
            templateUrl:"/admin/Product/CreateProduct.html",
            controller:"productController"
        })
        .when("/Pageupdateproduct",{
            templateUrl:"/admin/Product/UpdateProduct.html",
            controller:"productController"
        })
        .when("/listproduct",{
            templateUrl:"/admin/Product/ListProduct.html",
            controller:"productController"
        })
        .when("/color",{
            templateUrl:"/admin/Product/color.html",
            controller:"color"
        })
        .when("/material",{
            templateUrl:"/admin/Product/material.html",
            controller:"material"
        })
        .when("/size",{
            templateUrl:"/admin/Product/size.html",
            controller:"size-ctrl"
        })
        .when("/category",{
            templateUrl:"/admin/Product/Category.html",
            controller:"category-ctrl"
        })
        .when("/cart",{
            templateUrl:"/admin/Cart/List_Cart.html",
            controller:"cart-ctrl"
        })
        .when("/cartdetail",{
            templateUrl:"/admin/Cart/CartDetails.html",
            controller:"cart-ctrl"
        })
        .when("/bill",{
            templateUrl:"/admin/Bill/List_Bill.html",
            controller:"bill-ctrl"
        })
        .when("/billDetail",{
            templateUrl:"/admin/Bill/List_BillDetail.html",
            controller:"billDetails-ctrl"
        })
        .when("/payment",{
            templateUrl:"/admin/Payment/Payment.html",
            controller:"cart_admin-ctrl"
        })
        .when("/statistical",{
            templateUrl:"/admin/Statistical/statistical.html",
            controller:"chart-ctrl"
        })
        .when("/productReturn",{
            templateUrl:"/admin/Bill/Product_Return.html",
            controller:"product-change"
        })
        .when("/Account",{
             templateUrl:"/admin/Account/Account.html",
            controller:"account-ctrl"
        })
        .when("/CreateAccount",{
             templateUrl:"/admin/Account/CreateAccount.html",
            controller:"account-ctrl"
        })
        .when("/UpdateAccount",{
             templateUrl:"/admin/Account/UpdateAccount.html",
            controller:"account-ctrl"
        })
})

app.controller("mainAdmin", function($scope,$http,$window) {

    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }
    $scope.lang = sessionStorage.getItem('lang');
    if ($scope.lang == null) {
        sessionStorage.setItem('lang', 'vi');
    }
    const API_LANGUAGE_NAV_ADMIN = 'http://localhost:8080/rest/language/nav/admin';
    $http.get(`${API_LANGUAGE_NAV_ADMIN}?lang=${$scope.lang}`)
        .then(resp => {
            $scope.languageNav = resp.data;
            $scope.isLoading = false;
        })
        .catch(error => {
            console.log(error);
            $scope.isLoading = false;
        })
    $scope.languages = [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Tiếng Việt' }

    ];

    $scope.currentLanguage = sessionStorage.getItem('lang') || $scope.languages[0].code;

    $scope.showDropdown = false;

    $scope.changeLanguage = function(languageCode) {
        $scope.currentLanguage = languageCode;
        $scope.showDropdown = false;
    };

    $scope.getCurrentLanguageName = function() {
        for (var i = 0; i < $scope.languages.length; i++) {
            if ($scope.languages[i].code === $scope.currentLanguage) {
                return $scope.languages[i].name;
            }
        }
        return '';
    };
    $scope.isLoading = true;
    $scope.languageVN = function() {
        $scope.isLoading = true;
        sessionStorage.setItem('lang', 'vi');
        location.reload();
    };

    $scope.languageUS = function() {
        $scope.isLoading = true;
        sessionStorage.setItem('lang', 'en');
        location.reload();
    };
    $scope.getAcount = function () {
        $http.get(`http://localhost:8080/rest/user/getAccount`).then(function (respon) {
            $scope.accountHome = respon.data;
        }).catch(err => {
            $scope.accountHome = null;
        })
    }
    $scope.getAcount();
    $scope.sumSts=0;
    const apiUrlProductChange = "http://localhost:8080/rest/user/productchange";
    $scope.sumStatus=function (){
        for (let i = 1; i < 6; i++) {
            $http.get(apiUrlProductChange+'/sumStatus'+'/'+i)
                .then(function (response) {
                    if (i==1){
                        $scope.sumSts=response.data;
                    }

                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    $scope.sumStatus();
    $scope.sumSts1=0;
    const apiUrlBill = "http://localhost:8080/api/bill";
    $scope.sumStatus1=function (){
        for (let i = 1; i < 4; i++) {
            $http.get(apiUrlBill+'/sumStatus'+'/'+i)
                .then(function (response) {
                    if (i==1){
                        $scope.sumSts1=response.data;
                    }
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    $scope.checkLogin = function () {
        if (jwtToken == null){
            $scope.logOut();
        }else {
            $http.get("http://localhost:8080/api/auth/getRole",token).then(respon =>{
                if (respon.data.role.name === "ROLE_USER"){
                    $scope.logOut();
                }else if (respon.data.role.name === "ROLE_ADMIN"){
                    $rootScope.check = null;
                }else {
                    $rootScope.check = "OK";
                }
            })
        }
    }
    $scope.logOut = function (){
        $window.location.href = "http://localhost:8080/user/index.html#!/login"
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng đăng nhập lại!!',
            text: 'Tài khoản của bạn không có quyền truy cập!!',
        })
    }
    $scope.checkLogin();
    $scope.sumStatus1();
});