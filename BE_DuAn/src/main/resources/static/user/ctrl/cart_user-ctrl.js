app.controller('cart_user-ctrl', function ($rootScope, $scope, $http, $window, $timeout,$routeParams) {
    var apiUrlProduct = "http://localhost:8080/api/product";

    var apiUrlAccout = "http://localhost:8080/rest/user";

    var urlOrder = "http://localhost:8080/rest/guest/order";

    var urlOrderDetail = "http://localhost:8080/rest/guest/order/detail";

    var urlShippingOder = "http://localhost:8080/rest/user/address/getShipping-order";

    var urlPaymentVNP = 'http://localhost:8080/api/vnpay/send';

    $scope.accountActive = {};
    $scope.item = {};
    $rootScope.qtyCart = 0;
    $rootScope.name = "";
    $scope.checkDesign = 0;
    $scope.checkMaterial = 0;
    $scope.checkSize = 0;
    $scope.checkColor = 0;
    $scope.index = 0;
    $scope.addressAccount = {};
    $scope.to_district_id = "";
    $scope.to_ward_code = ""
    $scope.ship = "";
    $scope.checkBuy = null;
    $scope.bills = {};
    $scope.PrD = {};


    $scope.getAcountActive = function () {
        $http.get(apiUrlAccout + `/getAccountActive`).then(function (respon) {
            $scope.accountActive = respon.data;
            $rootScope.name = $scope.accountActive.username;
            console.log($scope.accountActive.username)
        }).catch(err => {
            $scope.accountActive = null;
            $rootScope.account = null;
        })

    }
    $scope.checkBuyPaypal = function () {
        $scope.checkBuy = true;
    }
    $scope.checkBuyCOD = function () {
        $scope.checkBuy = false;
    }
    $scope.ThanhToanBillvabilldetail = async function () {
        try {
            $scope.bills.personTake = $scope.addressAccount.personTake;
            $scope.bills.phoneTake = $scope.addressAccount.phoneTake;
            $scope.bills.address = $scope.addressAccount.addressDetail + ", " + $scope.addressAccount.addressTake;
            $scope.bills.totalMoney = $scope.calculateTotalAmount();
            $scope.bills.status = 1;
            $scope.bills.description = "Không có ghi chú";
            $scope.bills.statusBuy = 1;
            $scope.bills.moneyShip = $scope.ship;
            $scope.bills.typePayment = false;

            const addOrderResponse = await $http.post(urlOrder + '/add', $scope.bills);

            if (addOrderResponse.data) {
                const addOrderDetailResponse = await $http.post(urlOrderDetail + '/add', $scope.cartItems);
                $scope.clearCart();
                console.log("orderDetail", addOrderDetailResponse.data);
            } else {
                Swal.fire('Thanh toán thất bại!', '', 'error');
            }
        } catch (error) {
            Swal.fire('Thanh toán thất bại!', '', 'error');
        }
    };



    $scope.buyCart =  function () {
        $scope.messageQuantity = '';
        if (!$rootScope.account) {
            Swal.fire({
                title: 'Bạn chưa đăng nhập',
                text: "quay lại đăng nhập !",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận!'
            }).then((result) => {
                $window.location.href = '/login';
            });
        } else {
            Swal.fire({
                title: 'Xác nhận thanh toán?',
                text: "Xác nhận thanh toán để mua hàng!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    var cartItems = JSON.parse(localStorage.getItem('cartItems'));
                    if (cartItems === null || cartItems.length === 0) {
                        Swal.fire('Giỏ hàng trống!', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.', 'warning');
                        return;
                    }

                    if ($scope.checkBuy) {
                        var vnp_OrderInfo = 'thanh toan hoa don';
                        var orderType = 'other';
                        var amount = $scope.calculateTotalAmount();
                        var bankcode = ''; // Optional
                        var language = 'vn';
                        var personTake = encodeURIComponent($scope.addressAccount.personTake);
                        var phoneTake = $scope.addressAccount.phoneTake;
                        var addressDetail = encodeURIComponent($scope.addressAccount.addressDetail + ", " + $scope.addressAccount.addressTake);
                        var status = 1;
                        var statusBuy = 0;
                        var moneyShip = $scope.ship;
                        var typePayment = false;
                        var cartItems = JSON.parse(localStorage.getItem('cartItems'));
                            $http.post(`${urlPaymentVNP}?vnp_OrderInfo=${vnp_OrderInfo}&ordertype=${orderType}&amount=${amount}&bankcode=&language=${language}&personTake=${personTake}&phoneTake=${phoneTake}&address=${addressDetail}&typePayment=${typePayment}&moneyShip=${moneyShip}`).then( function (res){
                                window.location.href = res.data.value;
                            })
                    } else {
                        $scope.bills.personTake = $scope.addressAccount.personTake;
                        $scope.bills.phoneTake = $scope.addressAccount.phoneTake;
                        $scope.bills.address = $scope.addressAccount.addressDetail + ", " + $scope.addressAccount.addressTake;
                        $scope.bills.totalMoney = $scope.calculateTotalAmount();
                        $scope.bills.status = 1;
                        $scope.bills.description = "Không có ghi chú";
                        $scope.bills.statusBuy = 0;
                        $scope.bills.moneyShip = $scope.ship;
                        $scope.bills.typePayment = true;

                        let timerInterval;
                        Swal.fire({
                            title: 'Đang thanh toán vui lòng chờ!',
                            html: 'Vui lòng chờ <b></b> milliseconds.',
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const b = Swal.getHtmlContainer().querySelector('b');
                                timerInterval = setInterval(() => {
                                    b.textContent = Swal.getTimerLeft();
                                }, 100);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        });

                        try {
                            const addOrderResponse = await $http.post(urlOrder + '/add', $scope.bills);
                            if (addOrderResponse.data) {
                                const addOrderDetailResponse = await $http.post(urlOrderDetail + '/add', $scope.cartItems);
                                $scope.clearCart();
                                $window.location.href = '/user/cart/buy-cod-success.html';
                            }
                        } catch (err) {
                            Swal.fire('Thanh toán thất bại!', '', 'error');
                            if (err.status == 401) {
                                $scope.isLoading = false;
                                setTimeout(() => {
                                    document.location = '/admin#!/login';
                                }, 2000);
                                sweetError('Mời bạn đăng nhập !');
                            }
                            console.log("err order", err);
                            alert(err + "lỗi");
                        }
                    }
                }
            });
        }
    };

    $scope.clearCart = function () {
        localStorage.removeItem('cartItems');
        $rootScope.qtyCart = 0;
    };

    $scope.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    $rootScope.loadQtyCart = function () {
        $rootScope.qtyCart = 0;
        if ($rootScope.cartItems) {
            $rootScope.cartItems.forEach(item => {
                $rootScope.qtyCart += item.quantity;
            });
        }
    }
    $scope.calculateSubtotal = function () {
        var subtotal = 0;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            var item = $scope.cartItems[i];
            subtotal += item.product.price * item.quantity;
        }
        return subtotal;
    };
    $scope.calculateTotalAmount = function () {
        var subtotal = $scope.calculateSubtotal();
        return subtotal + $scope.ship;
    };
    // Hàm để xóa một mục khỏi giỏ hàng
    $scope.removeItem = function (index) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa Sản phẩm này khỏi giỏ hàng?',
            text: "Xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval;
                Swal.fire({
                    title: 'Đang xóa!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector('b');
                    },
                    willClose: () => {
                        $scope.cartItems.splice(index, 1);
                        localStorage.setItem('cartItems', JSON.stringify($scope.cartItems));
                        location.reload(true);
                        $scope.message('Đã xóa sản phẩm thành công');
                    }
                });
            }
        });
    };

    $scope.loadFromLocalStorage = function () {
        var json = localStorage.getItem("cartItems");
        this.cartItems = json ? JSON.parse(json) : [];
    }
    $scope.calculateTotal = function (item) {
        if (!item || !item.product || !item.quantity) {
            return 0;
        }
        return item.product.price * item.quantity;
    };
    $scope.checkCartItemQuantity = function (item) {
        var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        var itemsWithSameProduct = cartItems.filter(function (cartItem) {
            return (
                cartItem.product.id === item.product.id &&
                cartItem.design === item.design &&
                cartItem.size === item.size &&
                cartItem.color === item.color &&
                cartItem.material === item.material
            );
        });

        var totalQuantityInCart = itemsWithSameProduct.reduce(function (total, cartItem) {
            return total + cartItem.quantity;
        }, 0);
        item.totalQuantityInCart = totalQuantityInCart;
        var apiUrlProduct = `http://localhost:8080/api/product/${item.product.id}`;
        $http.get(apiUrlProduct).then(function (response) {
            var dbProductQuantity = response.data.quantity;
            item.messageQuantity = ""; // Reset thông báo lỗi
            if (item.quantity == 0 || item.quantity === null) {
                item.messageQuantity = "Số lượng không trống";
            } else if (item.quantity < 0) {
                item.messageQuantity = "Số lượng phải là số và lớn hơn 0";
            } else if (item.quantity > dbProductQuantity) {
                item.messageQuantity = "Số lượng này vượt quá số lượng hiện có.";
            } else if (item.quantity + item.totalQuantityInCart > dbProductQuantity) {
                item.messageQuantity = "Số lượng này vượt quá số lượng hiện có .";
            }
        }).catch(function (error) {
            console.log("Lỗi khi truy vấn số lượng sản phẩm từ cơ sở dữ liệu: ", error);
        });
    };

    $scope.getAddressAcountActive = function () {
        if ($rootScope.account != null) {
            $http.get(apiUrlAccout + "/getAddress").then(function (respon) {
                $scope.addressAccount = respon.data;
                $scope.to_district_id = $scope.addressAccount.districtId;
                $scope.getShippingOder();
                $scope.to_ward_code = $scope.addressAccount.wardId;
                console.log($scope.to_district_id, $scope.to_ward_code)
                console.log($scope.addressDefault)

            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    text: 'Vui lòng thêm địa chỉ!!!',
                })
                // alert("bên cart")
                console.log(err)
                $window.location.href = '#!address';
            })
        }
    }
    $scope.getShippingOder = function () {
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53320&to_district_id="
            + $scope.to_district_id + "&to_ward_code=" + $scope.to_ward_code
            + "&weight=200&insurance_value=" + $scope.calculateTotalAmount()).then(function (respon) {
            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53321&to_district_id="
            + $scope.to_district_id + "&to_ward_code=360204"
            + "&weight=200&insurance_value=" + $scope.calculateTotalAmount()).then(function (respon) {
            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53322&to_district_id="
            + $scope.to_district_id + "&to_ward_code=360204"
            + "&weight=200&insurance_value=" + $scope.calculateTotalAmount()).then(function (respon) {
            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
    }
    $scope.loadMoneyShip = function () {
        $timeout(function () {
            $scope.getShippingOder();
        }, 2000);
    }

    $scope.getAddressAcountActive();

});