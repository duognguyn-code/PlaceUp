app.controller('billDetails-ctrl', function ($rootScope,$scope, $http,$routeParams) {
    const apiUrlBillDetails = "http://localhost:8080/api/billDetail";
    const apiUrlBill = "http://localhost:8080/api/bill";
    const apiUrlProduct = "http://localhost:8080/api/product";
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer ` + jwtToken
        }
    }
    $scope.bill = [];
    $scope.formBill={};
    $scope.billDetails = [];
    $scope.formbillDetails = {};
    $scope.items= [];
    $scope.getBillDetailForMoney =[];
    $scope.formBillDetailData={}
    $scope.getBillByID = function () {
        var billId = $routeParams.idBill;
        $http.get(apiUrlBill+'/'+billId)
            .then(function (response) {
                $scope.bill = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.getBillByID();
    $scope.cop=function (){


        var item = $scope.bill.find(item => item.id == $routeParams.idBill )
        var item1 = $scope.billDetails.find(item => item.bill.id == $routeParams.idBill)

        $scope.formBill = angular.copy(item);
    }
    $scope.getBillDetail = function () {
        var billId = $routeParams.idBill;
        $http.get(apiUrlBillDetails+'/'+billId,token)
            .then(function (response) {
                $scope.billDetails = response.data;
                for (var i = 0; i <  $scope.billDetails.length; i++) {
                    $scope.billDetails[i].checkQuantity=  $scope.billDetails[i].quantity
                }
                $scope.items.push(response.data);
                console.log(response);
                $scope.cop();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    $scope.getBillDetail();
    $scope.getBillDetailForMoney1 = function () {
        var billId = $routeParams.idBill;
        $http.get(apiUrlBillDetails+'/forMoney'+'/'+billId)
            .then(function (response) {
                $scope.getBillDetailForMoney = response.data;
                $scope.items.push(response.data);
                console.log(response);
                $scope.cop();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.getBillDetailForMoney1();

    // $scope.updateBill=function (){
    //     var item = angular.copy($scope.formBill);
    //     $http.put(apiUrlBill + '/updateBill', item).then(resp => {
    //         var index = $scope.bill.findIndex(p => p.id == item.id);
    //         $scope.bill[index] = item;
    //         alert("Cập nhật thành công");
    //         $scope.cop();
    //     }).catch(error => {
    //         alert("Cập nhật thất bại");
    //         console.log("Error", error);
    //     });
    // }
    $scope.formProductData ={}
    $scope.updateQuantity = function (bill){
        var it = angular.copy($scope.formBill)
        // alert(it.status)
        if (it.status == 3 || it.status == 4  ){
            return
        }
        $http.get(apiUrlProduct+'/'+bill.product.id)
            .then(function (response) {
                $scope.formProductData = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        $http.get(apiUrlBillDetails+'/forQuantityProduct'+'/'+bill.id,token)
            .then(function (response) {
                $scope.formBillDetailData = response.data;
                var quantity = angular.copy($scope.formProductData)   // so luong product trong DB
                var quantity1 = angular.copy($scope.formBillDetailData) //so luong cua sp trong productdetail
                var qty = quantity1.quantity - bill.quantity
                var qtyUpdate = null
                if (qty < quantity1.quantity || qty ==0){
                    qtyUpdate = quantity.quantity + qty
                }if (qty > quantity1.quantity ){
                    qtyUpdate = quantity.quantity - qty
                }
                if (qtyUpdate < 0){
                    alert("Số Lượng Sản Phẩm Chỉ Còn: "+quantity.quantity)
                    $scope.getBillDetail();
                    return
                }
                var product = angular.copy($scope.formProductData)
                product.quantity = qtyUpdate
                $http.put(apiUrlProduct+'/updatePr',product).then(function (response){
                    // alert("Thay doi thanh cong")
                        $scope.messageSuccess("Thay đổi thành công");
                    qtyUpdate=null
                    var item = angular.copy(bill);
                    item.quantity = bill.quantity;
                    if (bill.status ===5||bill.status ===4||bill.status ===3){
                        // alert("Bạn Không Thể Sửa Sản Phầm Này")
                        $scope.messageError("Bạn Không Thể Sửa Sản Phầm Này");
                        return
                    }
                    $http.put(apiUrlBillDetails + '/updateBillDetail', item).then(resp => {
                        var index = $scope.getBillDetailForMoney.findIndex(p => p.id == item.id);
                        $scope.getBillDetailForMoney[index] = item;
                        // alert("Cập nhật thành công1");
                        $scope.updateToTalMoney();
                    }).catch(error => {
                        // alert("Cập nhật thất bại12");
                        console.log("Error", error);
                    });

                }).catch(function (error) {
                    $scope.messageError("Thay đổi thất bại");
                    console.log(error);
                });

            })
            .catch(function (error) {
                console.log(error);
            });

    }
    $scope.checkQuantityPr = function (billDetail){
        if(billDetail.quantity < 0 || billDetail.quantity==0){
            $scope.messageError("Số lượng phải lớn hơn 0");
            billDetail.quantity =billDetail.checkQuantity
            return
        }
    }
    $scope.getProduct=function (bill){

    }

    $scope.CancelBillDetails= function (bill){
        $http.get(apiUrlProduct+'/'+bill.product.id)
            .then(function (response) {
                $scope.formProductData = response.data;
                console.log(response);

                var product = angular.copy($scope.formProductData)
                product.quantity = product.quantity + bill.quantity
                $http.put(apiUrlProduct+'/updatePr',product,token).then(function (response){

                    var item = angular.copy(bill);
                    item.status = 5;
                    var item1 = angular.copy(bill);
                    alert(bill.bill.typePayment)
                    if (bill.bill.typePayment==true){
                        item1.status = 5;
                        item1.quantity=0;
                    }
                    if (bill.bill.typePayment==false){
                    item1.status = 5;
                    item1.quantity=bill.quantity;
                    }

                    $http.put(apiUrlBillDetails + '/updateBillDetail',item).then(resp => {
                        var index = $scope.billDetails.findIndex(p => p.id == item.id);
                        $scope.billDetails[index] = item;
                        var index1 = $scope.getBillDetailForMoney.findIndex(p => p.id == item1.id);
                        // var index1 = $scope.getBillDetailForMoney.findIndex(p => p.id == item1.id&&p.bill.typePayment==true);
                        $scope.getBillDetailForMoney[index1] = item1;
                        // alert("Hủy hàng thành công");
                        $scope.messageSuccess("Hủy hàng thành công");
                        $scope.updateToTalMoney();
                        $scope.CancelBill();
                    }).catch(error => {
                        // alert("Hủy hàng thất bại");
                        $scope.messageError("Hủy hàng thất bại");
                        console.log("Error", error);
                    });

                }).catch(function (error) {
                    console.log(error);
                });

            })
            .catch(function (error) {
                console.log(error);
            });

    }
    $scope.CancelBill= function (){
        var item = angular.copy($scope.formBill)
        $http.put(apiUrlBill + '/updateStatus'+'/'+$routeParams.idBill,item,token).then(function (response) {
            if (response.data) {
            } else {
            }
        }).catch(error => {
        });
    }
    $scope.updateToTalMoney=function (){
        var totalMn = $scope.formBill.moneyShip + $scope.checktotal.checkbill

        // alert( $scope.checktotal.checkbill)
        $http.put(apiUrlBill + '/updateTotalMoney' +'/'+totalMn +'/'+$routeParams.idBill).then(resp => {

           $scope.formBill.totalMoney =totalMn;
        }).catch(error => {
            console.log("Error", error);
        });

    }
     $scope.checktotal={
    get checkbill() {
        return $scope.getBillDetailForMoney.map(item => item.quantity * item.price)
            .reduce((total, qty) => total += qty, 0);
    }
    } ;
    $scope.pagerbillDetails = {
        page: 0,
        size: 5,
        get billdetails() {
            var start = this.page * this.size;
            return $scope.billDetails.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.billDetails.length / this.size);
            return $scope.billDetails.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.billDetails.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("Bạn đang ở trang đầu")
                $scope.messageSuccess("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("Bạn đang ở trang cuối")
                $scope.messageSuccess("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }

    $scope.logOut= function () {
        $rootScope.account=null;
        localStorage.removeItem('jwtToken');
    }

    $scope.checkLogin = function () {
        if (jwtToken == null){
            $scope.logOut();
        }else {
            $http.get("http://localhost:8080/rest/user/getRole",token).then(respon =>{
                if (respon.data.name === "USER"){
                    $scope.logOut();
                }else if (respon.data.name === "ADMIN"){
                    $rootScope.check = null;
                }else {
                    $rootScope.check = "OK";
                }
            })
        }
    }

    $scope.checkLogin();

    $scope.messageSuccess=function (text) {
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
            title: text
        })
    }
    $scope.messageError=function (text) {
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
            title: text
        })
    }

});