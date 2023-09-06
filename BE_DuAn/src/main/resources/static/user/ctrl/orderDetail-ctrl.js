app.controller('order-detail-ctrl',function($window,$rootScope,$scope,$http,$routeParams){
    var urlBillDetail=`http://localhost:8080/api/billDetail/rest/user`;
    var urlOrder=`http://localhost:8080/api/bill/rest/user/order`;
    $scope.orderDetails=[];
    $scope.formProductChange={};
    $scope.idCheckBox = {};
    $scope.seLected = [];
    $scope.index = 0;
    $scope.form={};
    $scope.formDetails= {};
    $scope.accountActive = {};
    $scope.logOut= function () {
        $rootScope.account=null;
        localStorage.removeItem('jwtToken');
    }
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }

    $scope.shouldShowChangeButton = function(orderDetail) {
        const receivedTime = new Date(orderDetail.bill.timeReceive).getTime();
        const currentTime = new Date().getTime();
        const threeDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        return (currentTime - receivedTime) < threeDaysInMilliseconds;
    };


    $scope.getAllByOrder=function(){
        var id = $routeParams.idBill;
        $http.get(urlBillDetail + `/${id}`).then(resp=>{
            $scope.orderDetails = resp.data;
            // alert(JSON.stringify( $scope.orderDetails))
        }).catch(error=>{
            console.log(error);
        })
    }

    $scope.getAcountActive = function () {
        $http.get(`/rest/user/getAccountActive`).then(function (respon){
            $scope.accountActive = respon.data;
            $rootScope.name = $scope.accountActive.username;
            console.log($scope.accountActive.username)
            // alert($scope.accountActive.username);
        }).catch(err => {
            // alert(err)
        })
    }
    $scope.saveProductChangeDetail = function (){
        var form = new FormData();
        angular.forEach($scope.files, function(file) {
            form.append('files', file);
        });
        // alert($scope.formDetails.id + "rỗng ko")
        form.append("bill_detail", $scope.formDetails.id);
        let req = {
            method: 'POST',
            url: '/rest/user/productchange/saveRequest',
            headers: {
                'Content-Type': undefined,
            },
            data: form
        }
        $http(req).then(resp=>{
            console.log(resp.data+ " datanafy cos da ko");
        }).catch(error=>{
            console.log(error);
        })
    }
    $scope.getAcountActive();

    $scope.saveProductChange = function (){
        Swal.fire({
            title: 'Thực hiện gửi yêu cầu đổi trả ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Tạo yêu cầu thành công' + '!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        var formData = new FormData();
                        angular.forEach($scope.files, function(file) {
                            formData.append('files', file);
                        });
                        if ($scope.formProductChange.description === 'other') {
                            formData.append("description", $scope.customReason);
                        } else {
                            formData.append("description", $scope.formProductChange.description);
                        }
                        formData.append("email", $scope.accountActive.email);
                        formData.append("phone", $scope.accountActive.phone);
                        formData.append("quantityProductChange",$scope.formProductChange.quantity_product_change);
                        formData.append("account",$scope.accountActive.username);
                        formData.append("bill_detail",$scope.formDetails.id);
                        let req = {
                            method: 'POST',
                            url: '/rest/user/productchange/save',
                            headers: {
                                'Content-Type': undefined,
                            },
                            data: formData,
                            transformResponse: [
                                function (data) {
                                    return data;
                                }
                            ]
                        }
                        Swal.fire({
                            title: 'Đang gửi yêu cầu đến admin' + '!',
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
                        })
                        $http(req).then(response => {
                            console.log("ddd " + response.data);
                            $scope.saveProductChangeDetail();
                            $scope.message("Gửi yêu cầu đổi trả thành công");
                            $('#staticBackdrop').modal('hide');
                            $scope.formProductChange={};
                            $scope.files=null;
                            window.location.href = '/user/index.html#!';
                        }).catch(error => {
                            $scope.error('gửi  yêu cầu đổi trả thất bại');
                        });
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {


                    }
                })
            }
        })
    }
    $scope.uploadFile = function (files) {
        $scope.files = files;
        if (files.length > 5){
            $scope.error("Tối đa 5 files")
        }else{


        console.log($scope.files);
        var previewImagesContainer = document.getElementById('previewImagesContainer');
        var previewVideo = document.getElementById('previewVideo');
        previewImagesContainer.innerHTML = ''; // Xóa bỏ các ảnh hiện có
        previewVideo.style.display = 'none';

        var imageCount = 0;
        for (var i = 0; i < files.length; i++) {

            if (imageCount >= 3) {
                break;
            }

            var file = files[i];
            var reader = new FileReader();

            reader.onload = (function (file) {
                return function (e) {
                    if (file.type.startsWith('video/')) {
                        previewVideo.src = e.target.result;
                        previewVideo.style.display = 'block';
                    } else {
                        var previewImage = document.createElement('img');
                        previewImage.src = e.target.result;
                        previewImage.className = 'previewImage';
                        previewImage.width = '100'; // Chỉnh kích thước ảnh
                        previewImagesContainer.appendChild(previewImage);
                    }
                    imageCount++; // Tăng biến đếm số lượng ảnh đã hiển thị
                };
            })(file);

            reader.readAsDataURL(file);
        }
        }
    };
    $scope.getAllByUser=function(){
        $http.get(urlOrder).then(function(response){
            $scope.orders=response.data;
            $rootScope.id = $scope.orders.id;
        }).catch(error=>{
            console.log('error getOrder',error);
        });
    }
    $scope.getProductChange=function(formProductChange){
        $http.get(`/rest/user/productchange/findProductChange/${formProductChange.id}`).then(resp=>{
            console.log($scope.formDetails.id + "$scope.formDetails.id id")
            $scope.formDetails = resp.data;
            console.log(resp.data)
        }).catch(error=>{
            console.log(error);
        })
    }
    $scope.increaseQuantity = function (item) {
        item.quantity++;
    };

    $scope.decreaseQuantity = function (item) {
        if (item.quantity > 1) {
            item.quantity--;
        }
    };

    $scope.message = function (mes){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
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
    $scope.error =  function (err){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
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

    $scope.checkSelected= function (id){
        console.log('sdsadasadsa '+id)
        var check = true;
        for(var i=0;i<$scope.seLected.length;i++){
            if($scope.seLected[i]==id){
                check = false;
                console.log('đã kt id ' + id)
                $scope.seLected.splice(i,1);
            }
        }
        if (check){
            $scope.seLected.push(id);
        }
    }
    $scope.checkSelect=function (id){
        for (var i = 0; i < $scope.seLected.length; i++) {
            if ($scope.seLected[i] == id) {
                console.log('đã kiểm tra id là: '+ id)
                return true;
            }
        }
    }


    $scope.uploadFileChange = function(files){
        $scope.files = files;
        console.log($scope.files);
    }
// get accouunt





    $scope.getAllByOrder();
    const apiUrlBillDetails = "http://localhost:8080/api/billDetail";
    const apiUrlBill = "http://localhost:8080/api/bill";
    const apiUrlProduct = "http://localhost:8080/api/product";
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
    $scope.updateQuantity  = function (bill){
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
        // alert("123")
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
                    // alert(bill.bill.typePayment)
                    if (bill.bill.typePayment==true){
                        item1.status = 5;
                        item1.quantity=0;
                    }
                    if (bill.bill.typePayment==false){
                        item1.status = 5;
                        item1.quantity=bill.quantity;
                    }

                    $http.put(apiUrlBillDetails + '/updateBillDetail1',item).then(resp => {
                        var index = $scope.billDetails.findIndex(p => p.id == item.id);
                        $scope.billDetails[index] = item;
                        var index1 = $scope.getBillDetailForMoney.findIndex(p => p.id == item1.id);
                        $scope.getBillDetailForMoney[index1] = item1;
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
    $scope.messageSuccess=function (text) {
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
    $scope.messageError=function (text) {
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

});