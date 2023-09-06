app.controller('cart_admin-ctrl', function ($rootScope, $scope, $http, $filter) {
    const apiUrlCart = "http://localhost:8080/api/cart";
    const apiUrlBill = "http://localhost:8080/api/bill";
    const apiUrlProduct = "http://localhost:8080/api/product";
    const apiUser = "http://localhost:8080/rest/user";
    $scope.cart = [];
    $scope.formCart = {};
    $scope.products = [];
    $scope.formProduct = {};
    $scope.productData = {};
    $scope.sizes = [];
    $scope.formSize = {};
    $scope.colors = [];
    $scope.billProduct = [];
    $scope.formColor = {};
    $scope.materials = [];
    $scope.formMaterial = {};
    $scope.designs = [];
    $scope.formDesign = {};
    $scope.categories = [];
    $scope.formCategory = {};
    $scope.index = 0;
    $scope.checkButton = true;
    $scope.checkSubmit = false;
    $scope.tabs = [];
    $scope.showTab = false;
    $scope.tabid = 0;
    $scope.yourJsonData = [];
    $scope.checkTab = false;
    $scope.idBill=0;
    $scope.accountActive = {};

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
    $scope.error = function (err) {
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
            icon: 'error',
            title: err,
        })
    }
    $scope.tabidm = 1;
    $scope.addTab = function () {
        var newTab = {
            id: $scope.tabidm,
            title: 'Tab ' + ($scope.tabidm),
            active: false
        };

        // Kiểm tra trùng id
        while ($scope.tabExists(newTab.id)) {
            newTab.id++; // Tăng id lên 1
        }
        $scope.tabidm++;
        // Thêm tab vào danh sách
        $scope.tabs.push(newTab);

        // Hiển thị tab
        $scope.showTab = true;
        $scope.checkTab = true;
        // Đặt tab mới được thêm là active
        $scope.activateTab(newTab);
        var er = JSON.stringify(angular.copy($scope.tabs));
        localStorage.setItem("rt", er);
        var id = JSON.stringify(angular.copy($scope.tabidm));
        localStorage.setItem("idT", id);
    };
    $scope.getAcountActive = function () {
        $http.get(`/rest/user/getAccountActive`).then(function (respon){
            $scope.accountActive = respon.data;
            console.log($scope.accountActive.username)
            // alert($scope.accountActive.username);
        }).catch(err => {
            alert(err)
        })
    }

    // Hàm kiểm tra xem tab có tồn tại trong danh sách hay không
    $scope.tabExists = function (id) {
        for (var i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tabs[i].id === id) {
                return true;
            }
        }
        return false;
    };
    $scope.tabls = {};
    $scope.activateTab = function (tab) {
        // Vô hiệu hóa tất cả các tab
        $scope.tabls = tab;
        $scope.tabid = tab.id
        $scope.checkTab = true;
        $scope.cart.saveToLocalStorage();


        $scope.tabs.forEach(function (t) {
            t.active = false;
        });

        // Kích hoạt tab được chọn
        tab.active = true;
    };
    $scope.removeTab = function (tab) {
        var index = $scope.tabs.indexOf(tab);
        $scope.tabs.splice(index, 1);
        $scope.checkTab = false;
        $scope.cart.av = [];
        var er = JSON.stringify(angular.copy($scope.tabs));
        localStorage.setItem("rt", er);
    };

    // Lấy danh sách sản phẩm
    $scope.getProducts = function () {
        $http.get(apiUrlProduct)
            .then(function (response) {
                $scope.products = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.detailProduct = {}
    $scope.idCheck = undefined;
    // $scope.getDetailProduct = function (id) {
    //     console.log(id)
    //     if (id == 0) {
    //         id = localStorage.getItem('idDetail');
    //         $http.post(`/rest/guest/product/product_detail/` + id).then(function (response) {
    //             $scope.detailProduct = response.data;
    //         }).catch(error => {
    //             console.log(error, "lỗi")
    //         })
    //     } else {
    //         localStorage.removeItem('idDetail');
    //         localStorage.setItem('idDetail', id);
    //         $window.location.href = '#!product_detail';
    //     }
    // }
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
            $http.get(`rest/guest/product/get_detail_product/` + $scope.checkDesign + `/` + $scope.checkSize + `/` + $scope.checkColor + `/` + $scope.checkMaterial).then(function (response) {
                $scope.PrD = response.data;
                if ($scope.PrD != '') {
                    $scope.checkQuantity = false;
                } else if ($scope.PrD == '') {
                    $scope.checkQuantity = true;
                }
                // alert($scope.checkQuantity);
            }).catch(error => {
                console.log(error, 'lỗi check product')
            })
        }
    };

// alert("12")
    $scope.checkProduct=false
    $scope.checkImg=0
    $scope.getP = {
        idP: null,
        getID(product) {
            $scope.checkProduct=true
            $scope.detailProduct = angular.copy(product)
            $scope.searchDesign = $scope.detailProduct.design.idDesign
            $scope.searchColor = $scope.detailProduct.color.idColor
            $scope.searchMaterial = $scope.detailProduct.material.idMaterial
            $scope.searchSize = $scope.detailProduct.size.idSize
            // $scope.detailProduct.designs.idDesign = $scope.searchDesign
            // alert( $scope.detailProduct.design.idDesign)
            this.idP = $scope.detailProduct.category.idCategory
            if ($scope.detailProduct.images.length===1){
                $scope.checkImg=1
            }
            if ($scope.detailProduct.images.length===0){
                $scope.checkImg=0
            }
            if ($scope.detailProduct.images.length===2){
                $scope.checkImg=2
            }
            if ($scope.detailProduct.images.length===3){
                $scope.checkImg=3
            }
            if ($scope.detailProduct.images.length===4){
                $scope.checkImg=4
            }
            // console.log(id)
            // $http.post(`/rest/guest/product/product_detail/` + id).then(function (response) {
            //     $scope.detailProduct = response.data;
            // }).catch(error => {
            //     console.log(error, "lỗi")
            // })
        }, getD() {
            if ($scope.tabs.length === 0 || $scope.checkTab == false) {
                // alert("")
                $scope.error("Bạn Phải Tạo Hóa Đơn");
                return
            }
            $http.get(apiUrlProduct + '/searchBill' + '/' + this.idP + '/' + $scope.searchDesign + '/' + $scope.searchMaterial + '/' + $scope.searchColor + '/' + $scope.searchSize)
                .then(function (response) {
                    // alert(JSON.stringify(response.data))
                    $scope.billProduct = response.data;
                    if ( $scope.billProduct===null){
                        alert("Sản phẩm không tồn tại")
                        $scope.checkProduct=false
                        return
                    }
                    console.log(response);
                    $scope.cart.addP();

                })
                .catch(function (error) {
                    console.log(error);
                });
        },getProducta(){
            $http.get(apiUrlProduct + '/searchBill' + '/' + this.idP + '/' + $scope.searchDesign + '/' + $scope.searchMaterial + '/' + $scope.searchColor + '/' + $scope.searchSize)
                .then(function (response) {
                    $scope.detailProduct=response.data;
                    if ($scope.detailProduct==null){
                        $scope.checkImg=0
                    }
                    if ($scope.detailProduct.images.length===1){
                        $scope.checkImg=1
                    }
                    if ($scope.detailProduct.images.length===2){
                        $scope.checkImg=2
                    }
                    if ($scope.detailProduct.images.length===3){
                        $scope.checkImg=3
                    }
                    if ($scope.detailProduct.images.length===4){
                        $scope.checkImg=4
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }


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
    $scope.getProductByQRCode = function () {
        if ($scope.tabs.length === 0) {
            // alert($scope.tabid)
            // alert("")
            $scope.error("Bạn Phải Tạo Hóa Đơn");
            return
        }
        $http.get(apiUrlCart)
            .then(function (response) {
                $scope.formCart = response.data;
                if ($scope.formCart.length === 0) {
                    // alert(")
                    $scope.error("Mời Bạn Quét Lại Mã");
                    return
                }
                console.log(response);
                $scope.cart.add();
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    $scope.cart = {
        items: [],
        av: [],
        add() {
            var item = null;
            var item = this.items.find(item => item.id == $scope.formCart.id && item.idTab == $scope.tabid);

            if (item) {
                item.qty++;
                this.saveToLocalStorage();
            } else {
                $http.get(apiUrlCart + '/' + $scope.formCart.id).then(resp => {
                    resp.data.qty = 1;
                    resp.data.idTab = $scope.tabid;
                    this.items.push(resp.data);
                    this.saveToLocalStorage();
                })
            }

        },
        addP() {
            var item = null;
            var item = this.items.find(item => item.id == $scope.billProduct.id && item.idTab == $scope.tabid)

            if (item) {
                // if (idT){
                item.qty++;
                this.saveToLocalStorage();
                // }
            } else {
                $http.get(apiUrlCart + '/' + $scope.billProduct.id).then(resp => {
                    resp.data.qty = 1;
                    resp.data.idTab = $scope.tabid;
                    this.items.push(resp.data);
                    this.saveToLocalStorage();
                })
            }

        },
        saveToLocalStorage() {
            // var av =[];
            $scope.cart.av = []

            function getObjectById(jsons) {
                for (var i = 0; i < jsons.length; i++) {
                    if (jsons[i].idTab === $scope.tabid) {
                        $scope.cart.av.push(jsons[i])
                    }
                }
                return null;
            }

            var object = getObjectById($scope.cart.items);
            var df = JSON.stringify(angular.copy($scope.cart.av));

            localStorage.setItem("cart", df);
            var item = JSON.stringify(angular.copy(this.items));
            localStorage.setItem("item", item);

        },
        get count() {
            return this.av.map(item => item.qty)
                .reduce((total, qty) => total += qty, 0);
        }, get amount() {
            return this.av.map(item => item.qty * item.price)
                .reduce((total, qty) => total += qty, 0);
        }, get amc() {
            return this.amount + 0;
        }, clear() {
            // $scope.cart.av= [];
            var index = $scope.cart.items.findIndex(item => item.idTab == $scope.tabid);
            // alert(index)
            $scope.cart.items.splice(index, 2);
            $scope.bill.address = "";
            $scope.bill.personTake = "";
            $scope.bill.phoneTake = "";
            this.saveToLocalStorage();
        }
        , tru(id) {
            var item = this.items.find(item => item.id == id && item.idTab == $scope.tabid);
            if (item.qty == 1) {
                // alert("Bạn Không Thể Trừ")
                $scope.error("Số lượng phải lớn hơn 1");
            } else {
                item.qty--;
                this.saveToLocalStorage();
            }
        }
        , cong(id) {
            var item = this.items.find(item => item.id == id && item.idTab == $scope.tabid);

            item.qty++;
            this.saveToLocalStorage();

        },
        remove(id) {
            var index = this.items.findIndex(item => item.id == id && item.idTab == $scope.tabid);
            this.items.splice(index, 1);
            this.saveToLocalStorage();
        }
        , loadFromLocalStorage() {
            var json = localStorage.getItem("cart");
            this.items = json ? JSON.parse(json) : [];
            var jso = localStorage.getItem("rt");
            $scope.tabs = jso ? JSON.parse(jso) : [];
            var js = localStorage.getItem("idT");
            $scope.tabidm = jso ? JSON.parse(js) : 1;
            var item = localStorage.getItem("item");
            this.items = item ? JSON.parse(item) : [];
        }
    }
        , $scope.cart.loadFromLocalStorage();
    $scope.checkexport = false;
    $scope.date = new Date();
    $scope.getUsernameForBill = {};
    $scope.bill = {
        createDate: new Date(),
        address: "Không có(Mua trực tiếp tại cửa hàng)",
        account: {username: $scope.accountActive.username},
        phoneTake: "",
        personTake: "",
        timeReceive: new Date(),
        totalMoney: $scope.cart.amount,
        moneyShip: "0",
        typePayment: 1,
        description: "Không có ghi chú",
        statusBuy: "1",
        status: "4",
        userConfirm :" ",
        get billDetails() {
            return $scope.cart.av.map(item => {
                return {
                    product: {id: item.id},
                    price: item.price,
                    quantity: item.qty,
                    dateReturn: null,
                    moneyRefund: null,
                    description: "Không có ghi chú",
                    status: 2,
                    previousBillDetail: null
                }
            })
        }, purchase() {
            if ($scope.cart.av.length === 0) {
                // alert("Giỏ hàng trống")
                $scope.error("Giỏ hàng trống");
                return
            }
            $http.get(apiUrlAccount + '/findByPhone' + '/' + $scope.InforphoneTake)
                .then(function (response) {
                    $scope.getUsernameForBill = response.data;
                    console.log(response);

                    var bill = angular.copy($scope.bill);
                    var us = angular.copy($scope.getUsernameForBill);
                    // alert(us)
                    bill.account.username = us.username
                    bill.phoneTake = $scope.InforphoneTake
                    bill.userConfirm = $scope.accountAdmin.username
                    bill.personTake = $scope.InforpersonTake
                    bill.totalMoney = $scope.cart.amount
                    // alert(  bill.userConfirm)
                    var item = JSON.stringify(angular.copy(bill));
                    // alert(item)
                    $http.post(apiUrlBill, bill).then(resp => {
                        // alert("Đặt Hàng Thành Công");
                        $scope.message("Đặt Hàng Thành Công");
                        $scope.export();
                        $scope.productQuantity.laydt();
                        // if ( $scope.checkexport=true){
                        //     $scope.removeTab($scope.tabls);
                        // }
                    }).catch(error => {
                        // alert("Loi~")
                        $scope.error("Đặt Hàng Thất Bại");
                        console.log(error)
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }
    const apiUrlBillDetails = "http://localhost:8080/api/billDetail";
    $scope.productQuantity = {
        get productqty() {
            return $scope.cart.av.map(item => {
                return {
                    id: item.id,
                    price: item.price,
                    quantity: item.qty,
                    name: item.name,
                    // images: {idimage: item.images.idimage},
                    status: 1,
                    barcode: item.barcode,
                    category: {idCategory: item.category.idCategory},
                    size: {idSize: item.size.idSize},
                    color: {idColor: item.color.idColor},
                    design: {idDesign: item.design.idDesign},
                    material: {idMaterial: item.material.idMaterial},
                    // previousBillDetail:null
                }
            })
        }
        , laydt() {
            // alert("ok")
            var bill = angular.copy(this);
            // alert(bill)
            $http.put(apiUrlBillDetails + '/updatedt', bill).then(resp => {
                $scope.InforpersonTake = ""
                $scope.InforphoneTake = ""
                $scope.getProducts();
            }).catch(error => {
                // alert("Loi~")
                console.log(error)
            })
        }
    }
    $scope.searchProduct = function () {
        if ($scope.searchProducts === "") {
            $scope.searchProducts = " "

        }
        if ($scope.searchColor1 === 'undefined' && $scope.searchDesign1 === 'undefined' && $scope.searchMaterial1 === 'undefined'
            && $scope.searchCategory === 'undefined'&& $scope.searchProducts === 'undefined'
        ) {
            $scope.getProducts();
        } else {
            $http.get(apiUrlProduct + '/search' + '/' + $scope.searchProducts + '/' + $scope.searchColor1 + '/' + $scope.searchMaterial1 + '/' + "undefined" + '/' + $scope.searchDesign1 + '/' + $scope.searchPriceMin1 + '/' + $scope.searchPriceMax1 + '/' + $scope.searchStatus+ '/' + $scope.searchCategory)
                .then(function (response) {
                    $scope.products = response.data;
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
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
        size: 6,
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
                // alert("Bạn đang ở trang đầu")
                $scope.message("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("Bạn đang ở trang cuối")
                $scope.message("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }

    $scope.export = function () {
        html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
                $scope.removeTab($scope.tabls);
            }
        });
        $scope.checkexport = true;
    }
    $scope.acc = [];
    $scope.check = 0;
    $scope.check1=0
    const apiUrlAccount = "http://localhost:8080/api/account";
    $scope.findAccountByPhone = function () {
        $scope.check = 0;
        $http.get(apiUrlAccount + '/findByPhone' + '/' + $scope.InforphoneTake)
            .then(function (response) {
                $scope.acc = response.data;
                var item = angular.copy($scope.acc)
               var sts =item.status
                $scope.InforpersonTake = item.fullName
                if (sts==0){
                    $scope.check1 = 2
                    return
                }
                if ($scope.InforphoneTake.length == 10) {
                    if ($scope.acc.length == 0) {
                        $scope.check = 1
                    }
                }
                if ($scope.acc.length !== 0) {
                    $scope.check1=1
                }
                if ($scope.acc.length == 0) {
                    $scope.check1=0
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    $scope.accountAdmin={}
    $scope.user=function (){
        $http.get(apiUser+'/getAccountActive')
            .then(function (response) {
                // alert(JSON.stringify(response.data))
                $scope.accountAdmin = response.data
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.user();
    $scope.khoaAcc=function (){
        $scope.error("Tài khoản bị khóa")
        $scope.check1=0
        return
    }
    $scope.resetSearch = function () {
        $('#matesearch1').prop('selectedIndex', 0);
        $('#colorSearch1').prop('selectedIndex', 0);
        $('#designSearch1').prop('selectedIndex', 0);
        $('#statusSearch1').prop('selectedIndex', 0);
        $scope.searchColor1 = "undefined";
        $scope.searchDesign1 = "undefined";
        $scope.searchMaterial1 = "undefined";
        $scope.searchCategory = "undefined";
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
    $scope.getMaterials();
    $scope.getColors();
    $scope.getCategory();
    $scope.getProducts();


    $scope.formAccount = {};
    $scope.formAuth = {};
    $scope.checkUsername = {};
    const apiUrlAuthor = "http://localhost:8080/api/auth";
    $scope.addAccount = function () {
        $http.get(apiUrlAccount + '/checkusername' + '/' + $scope.formAccount.username)
            .then(function (response) {
                $scope.checkUsername = response.data;
                if ($scope.checkUsername.length === 0) {
                    $http.get(apiUrlAccount + '/findByPhone' + '/' + $scope.formAccount.phone)
                        .then(function (response) {
                            $scope.checkUsername = response.data;
                            if ($scope.checkUsername.length === 0) {

                                var colorData = angular.copy($scope.formAccount)
                                var req = {
                                    method: 'POST',
                                    url: apiUrlAccount,
                                    data: colorData
                                }
                                let timerInterval
                                Swal.fire({
                                    title: 'Đang thêm  mới vui lòng chờ!',
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
                                });
                                $http(req).then(response => {
                                    $scope.addAuthor();
                                    $scope.message("Thêm mới tài khoản thành công");
                                    $scope.InforpersonTake = colorData.fullName
                                    // $scope.formAccount={}
                                }).catch(error => {
                                    $scope.error('Thêm  mới thất bại');
                                });
                            } else {
                                // alert("Số Điện Thoại Đã Tồn Tại")
                                $scope.error("Số Điện Thoại Đã Tồn Tại");
                                return
                            }
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    // alert("Tài Khoản Đã Tồn Tại")
                    $scope.error("Tài Khoản Đã Tồn Tại");
                    return
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.addAuthor = function () {
        var auth = {
            role: {idRole: 1},
            account: {username: $scope.formAccount.username}
        }
        $http.post(apiUrlAuthor, auth).then(response => {
            // alert("thanh cong")
        }).catch(error => {
            // alert("that bai")
        });
    }
    $scope.addAcc = function () {
        $scope.formAccount.phone = $scope.InforphoneTake
    }
    $scope.checkForm = function () {
        // alert($scope.InforpersonTake)
        if ($scope.InforpersonTake === "") {
            // alert("Mời Bạn Nhập Thông Tin Khách Hàng")
            $scope.error("Thông tin khách hàng trống");
            return
        }
    }
    $scope.getIdBill=function (){
        $http.get(apiUrlCart+'/idBill')
            .then(function (response) {
                $scope.idBill = response.data +1 ;
            })
            .catch(function (error) {
                console.log(error);
            });
        var json = localStorage.getItem("cart");
        this.items = json ? JSON.parse(json) : [];
    }
    $scope.getIdBill();
    $scope.checkName=function (){
        // alert("s")
    }
    $scope.chonTab=function (){
        // alert("Bạn Phải Chọn Hóa Đơn")
        $scope.error("Bạn Phải Chọn Hóa Đơn");
    }
    $scope.msgPhone=function (){
        // alert("S")
        $scope.error("Số Điện Thoại Không Tồn Tại");
    }
    $scope.resetPhone=function (){
      $scope.InforphoneTake=""
        $scope.InforpersonTake=""
    }
});
