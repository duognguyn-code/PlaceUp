app.controller('product-change',function($rootScope,$scope,$http, $window){
    $scope.listProductChange =[];
    $scope.getOneProduct = {};
    $scope.objectInt = 5;
    $scope.seLected = [];
    // const jwtToken = localStorage.getItem("jwtToken");
    // const token = {
    //     headers: {
    //         Authorization: `Bearer ` + jwtToken
    //     }
    // }
    // $scope.logOut = function (){
    //     $window.location.href = "http://localhost:8080/views/index.html#!/login"
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Vui lòng đăng nhập lại!!',
    //         text: 'Tài khoản của bạn không có quyền truy cập!!',
    //     })
    // }
    //
    // $scope.checkLogin = function () {
    //     if (jwtToken == null){
    //         $scope.logOut();
    //     }else {
    //         $http.get("http://localhost:8080/rest/user/getRole",token).then(respon =>{
    //             if (respon.data.name === "USER"){
    //                 $scope.logOut();
    //             }else if (respon.data.name === "ADMIN"){
    //                 $rootScope.check = null;
    //             }else {
    //                 $rootScope.check = "OK";
    //             }
    //         })
    //     }
    // }
    //
    // $scope.checkLogin();
    $scope.message = function (mes){
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
    $scope.error =  function (err){
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

    // $scope.getAllProductChange=function(){
    //     $http.get('/rest/user/productchange/getAll').then(resp=>{
    //         $scope.listProductChange = resp.data;
    //         for (var i = 0; i <  $scope.listProductChange.length; i++) {
    //             $scope.listProductChange[i].checkQuantity=  $scope.listProductChange[i].quantityProductChange
    //         }
    //         console.log('dsadsadsdsadas '+$scope.listProductChange);
    //     }).catch(error=>{
    //         console.log(error);
    //     })
    // }

    $scope.getAllProductChangeDetails=function(id){
        $http.get(`/rest/user/productchange/getPrChangeDetails/${id}`).then(resp=>{
            $scope.getOneProduct = resp.data;
            console.log('dsadsadsdsadas '+resp.data);
        }).catch(error=>{
            console.log(error);
        })

    }

    // $scope.getAllProductChange();
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
                console.log('đã kiểm tra id là: '+ id.idChange);
                console.log('đã kiểm tra id là: '+ id.status);
                return true;
            }
        }
    }

    $scope.postRequest = function(){
        if($scope.seLected.length == 0){
            $scope.error("Hãy chọn yêu cầu để xác nhận");
            return null;
        }else{
            let timerInterval
            Swal.fire({
                title: 'Đang gửi thông báo cho khách hàng!',
                html: 'Vui lòng chờ <b></b> milliseconds.',
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    $http.post(`/rest/staff/productchange/comfirmRequest`,$scope.seLected).then(response => {
                        console.log("ddd " + response.data);
                        $scope.message("Đã xác nhận yêu cầu");
                        $scope.seLected=[];
                        // $scope.getAllProductChange();
                        $scope.sumStatus();
                        $scope.searchBill();
                    }).catch(error => {
                        $scope.error('lỗi có bug rồi');
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
                    console.log('I was closed by the timer')
                }
            })

        }

    }

    $scope.putRequest = function(){
        if($scope.seLected.length  == 0){
            $scope.error("Vui lòng chọn yêu cầu hủy");
            return null;
        }else if($scope.seLected.status == 2){
            $scope.error("Vui lòng chọn yêu khác");
            return null;
        }
        $http.post(`/rest/staff/productchange/cancelRequest`,$scope.seLected).then(response => {
            console.log("ddd " + response.data);
            $scope.message("Đã hủy yêu cầu");
            $scope.sumStatus();
            $scope.seLected=[];
            // $scope.getAllProductChange();
            $scope.searchBill();
        }).catch(error => {
            $scope.error('lỗi có bug rồi');
        });

    }
    const apiUrlProductChange = "http://localhost:8080/rest/user/productchange";
    $scope.updateQuantity=function(prChange){
        var item =angular.copy(prChange)
        $http.put(apiUrlProductChange+'/updateqQuantity'+'/'+item.id+'/'+item.quantityProductChange).then(response => {
             // alert("")
            $scope.message("Thay đổi thành công");
        }).catch(error => {
            console.log(error);
        });
    }
    $scope.redirectToGoogle = function (formReasonReturn) {
        for (var i = 0; i < formReasonReturn.images.length; i++) {
            $window.open(formReasonReturn.images[i].urlimage, '_blank');
        }
        // var reason=formReasonReturn.images[1].urlimage
        // $window.open(reason, '_blank');
    };
    $scope.formReasonReturn={};
    $scope.getForReasonReturn=function(prChange){
        $scope.formReasonReturn=angular.copy(prChange);
        // var item =angular.copy(prChange)
        // $http.get(apiUrlProductChange+'/forReasonreturn'+'/'+item.id).then(response => {
        //     $scope.formReasonReturn=angular.copy(response.data)
        // }).catch(error => {
        //     console.log(error);
        // });
        // alert(JSON.stringify($scope.formReasonReturn))
    }
    $scope.formPrdReturn=[];
    $scope.quantity1=0
    $scope.quantity2=0
    $scope.chang=function (id){
        var item = $scope.formPrdReturn.find(item => item.id == id);
        let a =item.quantityProductChange - (item.quantity1+item.quantity2);
        // alert(a)
        if(a < 0){
            // alert("")
            $scope.error("Không thể");
            item.quantity1=$scope.quantity1
            item.quantity2=$scope.quantity2
            return
        }{
            quantity=item.quantityProductChange
            $scope.quantity1= item.quantity1
            $scope.quantity2=item.quantity2
            return;
        }

    }
    $scope.getprd=function (){
        $http.post(`/rest/staff/productchange/prdList`,$scope.seLected).then(response => {

            $scope.formPrdReturn=response.data;
            for (var i = 0; i <  $scope.formPrdReturn.length; i++) {
                $scope.formPrdReturn[i].quantity1=0
                $scope.formPrdReturn[i].quantity2=0

        }
        }).catch(error => {
            console.log(error);
        });
    }
    $scope.productQuantitychange={
        get productReturn(){
            return $scope.formPrdReturn.map(item =>{
                return {
                    id: item.billDetail.product.id,
                    barcode: item.billDetail.product.barcode,
                    name: item.billDetail.product.name,
                    price: item.billDetail.product.price,
                    quantity: item.quantity1,
                    category: {idCategory: item.billDetail.product.category.idCategory},
                    size: {idSize: item.billDetail.product.size.idSize},
                    color: {idColor: item.billDetail.product.color.idColor},
                    design: {idDesign: item.billDetail.product.design.idDesign},
                    material: {idMaterial: item.billDetail.product.material.idMaterial},
                    status : 1,
                }
            })
        },get productCancel(){
            return $scope.formPrdReturn.map(item =>{
                return {
                    // id: item.billDetail.product.id,
                    // barcode: item.billDetail.product.barcode,
                    name: item.billDetail.product.name,
                    price: item.billDetail.product.price,
                    quantity: item.quantity2,
                    category: {idCategory: item.billDetail.product.category.idCategory},
                    size: {idSize: item.billDetail.product.size.idSize},
                    color: {idColor: item.billDetail.product.color.idColor},
                    design: {idDesign: item.billDetail.product.design.idDesign},
                    material: {idMaterial: item.billDetail.product.material.idMaterial},
                    status : 2,
                }
            })
        }
        , updateReturnQuantityProduct(){
            var prd = angular.copy(this);
            $http.put(`/rest/staff/productchange/updateProductChange`, prd).then(resp => {
                // alert("ok")
                $scope.postRequest();
                $scope.sumStatus();
            }).catch(error => {
                // alert("Loi~")
                console.log(error)
            })
            $http.put(`/rest/staff/productchange/updateProductCancel`, prd).then(resp => {
                // alert("ok")
            }).catch(error => {
                // alert("Loi~")
                console.log(error)
            })
        }
    }

    $scope.formAddBill =[];
    $scope.formAddBill1 ={};
    $scope.totalMoneyBill= null
    $scope.addProduct=function (bill){
        $scope.formAddBill =[];
        $scope.formAddBill1 = bill
         var it =$scope.listProductChange.find(item => item.id == bill.id);
        it.quantityAddBill=0
        $scope.formAddBill.push(it);
    }
    $scope.checkBtn=function (prd){
        if (prd.quantityProductChange > prd.checkQuantity){
            // alert("")
            $scope.error("Không thể tăng số lượng");
            prd.quantityProductChange=prd.checkQuantity
            return
        }
        if (prd.quantityProductChange < 0 || prd.quantityProductChange==0){
            // alert(")
            $scope.error("Số lượng phải lớn hơn 0");
            prd.quantityProductChange=prd.checkQuantity
            return
        }
    }
    $scope.updateQuantityBill=function (it){
        var item = $scope.formAddBill.find(item => item.id == it.id);
       var item2=angular.copy(item);
        if (item2.quantityAddBill >item2.billDetail.product.quantity){
            // alert(")
            $scope.error("Số Lượng Sản Phẩm Chỉ Còn: "+item2.billDetail.product.quantity);
            it.quantityAddBill = 0
            return
        }
       $scope.totalMoneyBill = item2.billDetail.product.price * item2.quantityAddBill
    }
    $scope.addBill = {
        createDate: new Date(),
        address: "",
        account: {username: " "},
        phoneTake: "",
        personTake: "",
        timeReceive: new Date(),
        totalMoney: "",
        moneyShip: "0",
        typePayment: 1,
        description: "1",
        statusBuy: "1",
        status: "1",
        oldBill:{id : 9},
        get billDetails() {
            return $scope.formAddBill.map(item => {
                return {
                    product: {id:item.billDetail.product.id},
                    price: item.billDetail.product.price,
                    quantity: item.quantityAddBill,
                    dateReturn:new Date(),
                    moneyRefund: null,
                    description: "Không",
                    status: 1,
                    previousBillDetail: {id:item.billDetail.id},
                }
            })
        }
        , purchase() {
                    var bill = angular.copy($scope.addBill);
                    bill.address =  $scope.formAddBill1.billDetail.bill.address
                    bill.account.username =  $scope.formAddBill1.account.username
                    bill.phoneTake =  $scope.formAddBill1.billDetail.bill.phoneTake
                    bill.personTake =  $scope.formAddBill1.billDetail.bill.personTake
                    bill.totalMoney = $scope.totalMoneyBill
                    bill.description =  $scope.formAddBill1.billDetail.bill.address
                    bill.oldBill.id =  $scope.formAddBill1.billDetail.bill.id

                    $http.post(`/rest/staff/productchange/CreateBillChange`, bill).then(resp => {
                        // alert("");
                        $scope.message("Tạo Bill Thành Công");
                        $scope.sumStatus();
                        $window.location.href = '#!productReturn';
                        $http.put(`/rest/staff/productchange/updateBill`+`/`+$scope.formAddBill1.id+`/`+"update").then(response => {
                        }).catch(error => {
                            // $scope.error('lỗi có bug rồi');
                        });
                    }).catch(error => {
                        // alert("Loi~")
                        $scope.error("Tạo Bill Thất Bại");
                        console.log(error)
                    })

        }
    }
    $scope.NoReturnProduct = function (id){
        // alert(id)
        $http.put(`/rest/staff/productchange/updateBill`+`/`+id+`/`+"cancel").then(response => {
            $scope.sumStatus();
            // alert("Thành Công")
            $scope.message("Trả thành công");
        }).catch(error => {
            $scope.error("Trả thất bại");
            // $scope.error('lỗi có bug rồi');
        });
    }
    $scope.resetSearch = function () {
        // $scope.searchPhone = " ";
        // $scope.searchStatus = "1";
        $scope.searchBill()

    }
    $scope.checksts=0;
    // $scope.resetSearch();
    $scope.searchBill1 = function () {

        if ($scope.searchPhone === "") {
            $scope.searchPhone = " "
        }
        if ($scope.searchStatus==1){
            $scope.checksts=0
        }
        if ($scope.searchStatus==2){
            $scope.checksts=1
        }
        if ($scope.searchStatus==3){
            $scope.checksts=3
        }
        if ($scope.searchStatus==4){
            $scope.checksts=3
        }
        if ($scope.searchStatus==5){
            $scope.checksts=3
        }

        $http.get(apiUrlProductChange  +'/'+ $scope.searchPhone + '/' + $scope.searchStatus)
            .then(function (response) {
                $scope.listProductChange = response.data;
                for (var i = 0; i <  $scope.listProductChange.length; i++) {
                    $scope.listProductChange[i].checkQuantity=  $scope.listProductChange[i].quantityProductChange
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    };
    $scope.searchBill = function () {
        $scope.checksts=0
        $scope.searchPhone = " ";
        $scope.searchStatus = "1";
        if ($scope.searchPhone === "") {
            $scope.searchPhone = " "
        }
        $http.get(apiUrlProductChange  +'/'+ $scope.searchPhone + '/' + 1)
            .then(function (response) {
                $scope.listProductChange = response.data;
                for (var i = 0; i <  $scope.listProductChange.length; i++) {
                    $scope.listProductChange[i].checkQuantity=  $scope.listProductChange[i].quantityProductChange
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    };
    $scope.searchBill();
    $scope.sumSts1=0;
    $scope.sumSts2=0;
    $scope.sumSts3=0;
    $scope.sumSts4=0;
    $scope.sumSts5=0;
    $scope.sumStatus=function (){
        for (let i = 1; i < 6; i++) {
            $http.get(apiUrlProductChange+'/sumStatus'+'/'+i)
                .then(function (response) {
                    if (i==1){
                        $scope.sumSts1=response.data;
                    }
                    if (i==2){
                        $scope.sumSts2=response.data;
                    }
                    if (i==3){
                        $scope.sumSts3=response.data;
                    }
                    if (i==4){
                        $scope.sumSts4=response.data;
                    }
                    if (i==5){
                        $scope.sumSts5=response.data;
                    }
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    $scope.sumStatus();
    $scope.formProduct={}
    $scope.getProduct=function (prChange){

        $scope.formProduct=angular.copy(prChange);
        // alert(JSON.stringify($scope.formProduct))

    }
    $scope.pagerPrdChange = {
        page: 0,
        size: 5,
        get productsChange() {
            var start = this.page * this.size;
            return $scope.listProductChange.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.listProductChange.length / this.size);
            return $scope.listProductChange.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.listProductChange.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("")
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
});