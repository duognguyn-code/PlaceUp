app.controller('UserController', function ($rootScope, $scope, $http, $window, $timeout) {
    var apiUrlProduct = "http://localhost:8080/api/product";

    var apiUrlAccout = "http://localhost:8080/rest/user";

    var urlShippingOder = "http://localhost:8080/rest/user/address/getShipping-order";

    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer ` + jwtToken
        }
    }
    $scope.products = [];
    $scope.formProduct = {};
    $scope.sizes = [];
    $scope.formSize = {};
    $scope.colors = [];
    $scope.formColor = {};
    $scope.materials = [];
    $scope.formMaterial = {};
    $scope.designs = [];
    $scope.formDesign = {};
    $scope.categories = [];
    $scope.accountActive = {};
    $scope.accountHome = {};
    $rootScope.qtyCart = 0;
    $scope.index = 0;
    $rootScope.account = jwtToken;
    $scope.bills = {};
    $rootScope.cartItems = [];
    $scope.formChangePassMail = {
        email: ''
    };
    $scope.logOut = function () {
        $rootScope.account = null;
        localStorage.removeItem('jwtToken');
    }
    $scope.messageSuccess = function (text) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: text
        })
    }

    $scope.validateSelections = function () {
        return (
            !$scope.checkDesign ||
            !$scope.checkSize ||
            !$scope.checkColor ||
            !$scope.checkMaterial
        );
    };
    $scope.message = function (mes) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: mes,
        })
    }
    $scope.changePassword = function (email) {
        $http.get(`/rest/guest/forgetPassword/${email}`)
            .then(function (respon) {
                $scope.message('Mật khẩu đã gửi về email của quý khách vui lòng kiêm tra');
                console.log('sessuce ' + respon.data);
                $window.location.href = '#!login';
            }).catch(error => {
            console.log('lỗi ' + error);
        })
    }

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
            item.messageQuantity = "";
            if (item.quantity == 0) {
                item.messageQuantity = "Số lượng không trống";
            } else if (item.quantity < 0) {
                item.messageQuantity = "Số lượng lớn hơn không.";
            } else if (item.quantity > dbProductQuantity) {
                item.messageQuantity = "Số lượng này vượt quá số lượng hiện có.";
            } else if (item.quantity + item.totalQuantityInCart > dbProductQuantity) {
                item.messageQuantity = "Số lượng này vượt quá số lượng hiện có .";
            }
        }).catch(function (error) {
            console.log("Lỗi khi truy vấn số lượng sản phẩm từ cơ sở dữ liệu: ", error);
        });
    };

    $scope.messageError = function (text) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'error',
            title: text
        })
    }
    $scope.getAcount = function () {
        $http.get(`http://localhost:8080/rest/user/getAccount`).then(function (respon) {
            $scope.accountHome = respon.data;
        }).catch(err => {

            $scope.accountHome = null;

        })
    }
    $scope.getAcount();
    $scope.addCart = function (product, quantity) {
        if ($scope.validateSelections()) {
            $scope.messageError("Bạn phải chọn tất cả thuộc tính");
            return;
        }
        var totalQuantityInCart = 0;
        var selectedDesign = $scope.checkDesign.name;
        var selectedSize = $scope.checkSize.name;
        var selectedColor = $scope.checkColor.name;
        var selectedMaterial = $scope.checkMaterial.name;

        // Create a cart item object
        var cartItem = {
            product: product,
            design: selectedDesign,
            size: selectedSize,
            color: selectedColor,
            material: selectedMaterial,
            quantity: quantity,
            description: "Không có ghi chú"

        };

        var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        var existingItem = cartItems.find(function (item) {
            return (
                item.product.id === cartItem.product.id &&
                item.design === cartItem.design &&
                item.size === cartItem.size &&
                item.color === cartItem.color &&
                item.material === cartItem.material
            );
        });

        if (existingItem) {
            totalQuantityInCart = existingItem.quantity;
            if (totalQuantityInCart + quantity > product.quantity) {
                $scope.messageError("Sản phẩm này chỉ còn " + (product.quantity - totalQuantityInCart) + " sản phẩm trong kho.");
                return;
            }
            existingItem.quantity++;
            $rootScope.loadQtyCart();
            $scope.messageSuccess("Sản phẩm này đã có ,thêm giỏ hàng thành công!");
        } else {
            if (quantity > product.quantity) {
                $scope.messageError("Sản phẩm này chỉ còn " + product.quantity + " sản phẩm trong kho.");
                return;
            }
            // Otherwise, add the new item to the cart
            cartItems.push(cartItem);
            $rootScope.qtyCart++;
            $scope.messageSuccess("Thêm vào giỏ hàng thành công!");
        }

        // Update the cart items in local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
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


    $scope.loadFromLocalStorage = function () {
        var json = localStorage.getItem("cartItems");
        this.cartItems = json ? JSON.parse(json) : [];
    }

    $scope.getProducts = function () {
        $http.get(apiUrlProduct)
            .then(function (response) {
                $scope.products = response.data;
                // alert($scope.products)
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getProducts()




    $scope.doSubmit = function () {
        if ($scope.formProduct.idProduct) {
            let timerInterval
            Swal.fire({
                title: 'Đang cập nhật!',
                html: 'Vui lòng chờ <b></b> milliseconds.',
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    $scope.onUpdate();
                    console.log('I was closed by the timer')
                }
            })
        } else {
            let timerInterval
            Swal.fire({
                title: 'Đang lưu mới!',
                html: 'Vui lòng chờ <b></b> milliseconds.',
                timer: 2500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    $scope.onSave();
                    console.log('I was closed by the timer')
                }
            })
        }
    };


    $scope.resetProducts = function () {
        $scope.formProduct = {
            status: 1
        }
    }


    // Thêm sản phẩm mới
    $scope.getColors = function () {
        $http.get(`${apiUrlProduct}/getAllColor`)
            .then(function (response) {
                $scope.colors = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getMaterials = function () {
        $http.get(`${apiUrlProduct}/getAllMaterial`)
            .then(function (response) {
                $scope.materials = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getDesign = function () {
        $http.get(`${apiUrlProduct}/getAllDesign`)
            .then(function (response) {
                $scope.designs = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getSize = function () {
        $http.get(`${apiUrlProduct}/getAllSize`)
            .then(function (response) {
                $scope.sizes = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getCategory = function () {
        $http.get(`${apiUrlProduct}/getAllCategory`)
            .then(function (response) {
                $scope.categories = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.GetresetForm = function () {
        $http.get(apiUrlProduct + '/search' + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "1")
            .then(function (response) {
                $scope.products = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    };
    $scope.pagerProducts = {
        page: 0,
        size: 9,
        get products() {
            var start = this.page * this.size;
            return $scope.products.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.products.length / this.size);
            return $scope.products.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.products.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                alert("Bạn đang ở trang đầu")
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                alert("Bạn đang ở trang cuối")
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
    $scope.resetSearch = function () {
        $('#matesearch').prop('selectedIndex', 0);
        $('#colorSearch').prop('selectedIndex', 0);
        $('#designSearch').prop('selectedIndex', 0);
        $('#statusSearch').prop('selectedIndex', 0);
        $scope.searchColor = "undefined";
        $scope.searchDesign = "undefined";
        $scope.searchMaterial = "undefined";
        $scope.searchSize = "undefined";
        $scope.searchStatus = "1";
        $scope.searchPriceMin = "";
        $scope.searchPriceMax = "";
        $scope.searchProducts = " ";
        $('#sizeSearch').prop('selectedIndex', 0);
        $scope.GetresetForm();
    }
    $scope.resetSearch();
    $scope.getSize()
    $scope.getDesign();
    $scope.GetresetForm();
    $scope.getMaterials();
    $scope.getColors();
    $scope.getCategory();

    $scope.detailProduct = {}
    $scope.idCheck = undefined;
    $scope.getDetailProduct = function (id) {
        if (id == 0) {
            id = localStorage.getItem('idDetail');
            $http.post(`/rest/guest/product/product_detail/` + id, token).then(function (response) {
                $scope.detailProduct = response.data;

            }).catch(error => {
                console.log(error, "lỗi")
            })
        } else {
            localStorage.removeItem('idDetail');
            localStorage.setItem('idDetail', id);
            $window.location.href = '#!product_detail';
        }
    }
    $scope.checkDesign = 0;
    $scope.checkMaterial = 0;
    $scope.checkSize = 0;
    $scope.checkColor = 0;
    $scope.PrD = {};
    $scope.checkProduct = function (id, check) {
        if (check == 0) {
            $scope.checkDesign = id;
        } else if (check == 1) {
            $scope.checkSize = id;
        } else if (check == 2) {
            $scope.checkColor = id;
        } else if (check == 3) {
            $scope.checkMaterial = id;
        }
        if ($scope.checkDesign != 0 && $scope.checkSize != 0 && $scope.checkColor != 0 && $scope.checkMaterial != 0) {
//            let url = 'rest/guest/product/get_detail_product' +'/' +$scope.checkDesign +'/' +$scope.checkSize +'/'+$scope.checkColor +'/'+$scope/checkMaterial
            $http.get(`/rest/guest/product/get_detail_product/` + $scope.checkDesign + `/` + $scope.checkSize + `/` + $scope.checkColor + `/` + $scope.checkMaterial).then(function (response) {
                $scope.PrD = response.data;
                if ($scope.PrD != '') {
                    $scope.checkQuantity = false;
                } else if ($scope.PrD == '') {
                    $scope.checkQuantity = true;
                }
            }).catch(error => {
                console.log(error, 'lỗi check product')
                alert(error);
            })
        }
    }

    $scope.changeImage = function (id) {
        var main_prodcut_image = document.getElementById('main_product_image');
        var image_product_change = document.getElementById('image_product_change');
        var image_product_change1 = document.getElementById('image_product_change1');
        var image_product_change2 = document.getElementById('image_product_change2');
        var image_product_change3 = document.getElementById('image_product_change3');
        if (id == 1) {
            main_prodcut_image.src = image_product_change.src;
        }
        if (id == 2) {
            main_prodcut_image.src = image_product_change1.src;
        }
        if (id == 3) {
            main_prodcut_image.src = image_product_change2.src;
        }
        if (id == 4) {
            main_prodcut_image.src = image_product_change3.src;
        }
    }
    $scope.displayProduct = {
        name: "",
        price: "",
        describe: "",
        imageDefault: "https://res.cloudinary.com/dcll6yp9s/image/upload/v1692068401/e2hebwyb9jyygy0ii1ym.png",
        imageDefault1: "https://res.cloudinary.com/dcll6yp9s/image/upload/v1692068401/e2hebwyb9jyygy0ii1ym.png",
        imageDefault2: "https://res.cloudinary.com/dcll6yp9s/image/upload/v1692068401/e2hebwyb9jyygy0ii1ym.png",
        imageDefault3: "https://res.cloudinary.com/dcll6yp9s/image/upload/v1692068401/e2hebwyb9jyygy0ii1ym.png",
        camera: "",
        ram: "",
        capacity: "",
        color: ""
    }
    $scope.getAcountActive = function () {
        $http.get(apiUrlAccout + `/getAccountActive`, token).then(function (respon) {
            $scope.accountActive = respon.data;
            $rootScope.name = $scope.accountActive.username;
            console.log($scope.accountActive.username)
        }).catch(err => {
            $scope.accountActive = null;
            $rootScope.account = null;
        })
    };
});
