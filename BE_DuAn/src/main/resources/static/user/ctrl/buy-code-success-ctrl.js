const app = angular.module('app-buy', ['ngRoute']);
app.controller('buy-cod-success-ctrl',function($scope,$window,$timeout,$http){
    var urlOrder = "http://localhost:8080/rest/guest/order";

    var urlOrderDetail = "http://localhost:8080/rest/guest/order/detail";
    var urlAccount = `http://localhost:8080/rest/user`;
    var urlShippingOder = "http://localhost:8080/rest/user/address/getShipping-order";
    var queryParams = new URLSearchParams(window.location.search);
    var vnpResponseCode = queryParams.get('vnp_ResponseCode');
    var amoutParam = queryParams.get('amoutParam');
    var personTake = decodeURIComponent(queryParams.get('personTake'));
    var phoneTake = queryParams.get('phoneTake');
    var address = decodeURIComponent(queryParams.get('address'));
    var moneyShip = queryParams.get('moneyShip');
    var typePayment = queryParams.get('typePayment');
    $scope.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    $scope.bills = {};
    $scope.ThanhToanBillvabilldetail = async function () {
        try {
            $scope.bills.personTake = personTake;
            $scope.bills.phoneTake = phoneTake;
            $scope.bills.address = address;
            $scope.bills.totalMoney = amoutParam;
            $scope.bills.status = 1;
            $scope.bills.description = "Không có ghi chú";
            $scope.bills.statusBuy = 1;
            $scope.bills.moneyShip = moneyShip;
            $scope.bills.typePayment = typePayment;
            const addOrderResponse = await $http.post(urlOrder + '/add', $scope.bills);
            if (addOrderResponse.data) {
                const addOrderDetailResponse = await $http.post(urlOrderDetail + '/add', $scope.cartItems);
                $scope.clearCart();
                console.log("orderDetail", addOrderDetailResponse.data);
            } else {
                Swal.fire('Thanh toán thất bại!', '', 'error');
            }
        }catch (error) {
            Swal.fire('Thanh toán thất bại!', '', 'error');
        }

    };
    $scope.ThanhToanBillvabilldetailCHuathanhtoan = async function () {
        try {
            $scope.bills.personTake = personTake;
            $scope.bills.phoneTake = phoneTake;
            $scope.bills.address = address;
            $scope.bills.totalMoney = amoutParam;
            $scope.bills.status = 1;
            $scope.bills.description = "Không có ghi chú";
            $scope.bills.statusBuy = 0;
            $scope.bills.moneyShip = moneyShip;
            $scope.bills.typePayment = typePayment;
            const addOrderResponse = await $http.post(urlOrder + '/add', $scope.bills);
            if (addOrderResponse.data) {
                const addOrderDetailResponse = await $http.post(urlOrderDetail + '/add', $scope.cartItems);
                $scope.clearCart();
                console.log("orderDetail", addOrderDetailResponse.data);
            } else {
                Swal.fire('Thanh toán thất bại!', '', 'error');
            }
        }catch (error) {
            Swal.fire('Thanh toán thất bại!', '', 'error');
        }

    };
    $scope.clearCart = function () {
        localStorage.removeItem('cartItems');
        $rootScope.qtyCart = 0;
    };
    $scope.show = function () {
        Swal.fire({
            title: 'Đặt hàng thành công!',
            text: 'Quý khách sẽ được chuyển đến trang chủ sau giây lát',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            backdrop: `
            rgba(0,0,123,0.4)
            url("/images/accommodation/1.jpg")
            left top
            no-repeat
         `
        });

        $timeout(function () {
            $window.location.href = 'http://localhost:8080/user/index.html#!';
        }, 4000);
    };

    $scope.ThanhToan = async function () {
        if (vnpResponseCode == '00') {
            await   $scope.ThanhToanBillvabilldetail().then(r => $window.location.href = '/login');
            $scope.show();
        } else {
            $scope.ThanhToanBillvabilldetailCHuathanhtoan();
            alert("lỗi");
        }
    };

    $scope.ThanhToan();

    $scope.calculateTotalAmount = function () {
        var subtotal = $scope.calculateSubtotal();
        return subtotal + $scope.ship;
    };
    $scope.calculateSubtotal = function () {
        var subtotal = 0;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            var item = $scope.cartItems[i];
            subtotal += item.product.price * item.quantity;
        }
        return subtotal;
    };
})