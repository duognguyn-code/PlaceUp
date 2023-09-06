app.controller('order-ctrl',function($rootScope,$scope,$http,$location){
    var urlOrder=`http://localhost:8080/api/bill/rest/user/order`;
    $scope.orders=[];
    $scope.form={};
    $rootScope.id=null;
    $scope.logOut= function () {
        $rootScope.account=null;
        localStorage.removeItem('jwtToken');
    }
    // $scope.huyDon=async function (id) {
    //     $scope.form.id = id;
    //
    //     const {value: text} = await Swal.fire({
    //         input: 'textarea',
    //         inputLabel: 'Lý do hủy đơn hàng',
    //         inputPlaceholder: 'Nhập lý do của bạn ở đây...',
    //         inputAttributes: {
    //             'aria-label': 'Type your message here'
    //         },
    //         showCancelButton: true
    //     })
    //     if (text) {
    //         $scope.form.note=text;
    //         Swal.fire({
    //             title: 'Bạn muốn hủy đơn hàng?',
    //             text: "Xác nhận không thể khôi phục lại!",
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Yes, delete it!'
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 $http.post(urlOrder+'/change',$scope.form).then(function(response){
    //                     Swal.fire(
    //                         'Hủy đơn hàng thành công!',
    //                         'Click để tiếp tục.',
    //                         'success'
    //                     )
    //                     $scope.getAllByUser();
    //                 }).catch(error=>{
    //                     Swal.fire(
    //                         'Hủy đơn hàng thành công!',
    //                         'Click để tiếp tục.',
    //                         'success'
    //                     )
    //                     $scope.getAllByUser();
    //                 });
    //             }
    //         })
    //     }
    // }
    $scope.form = {};
    const apiUrlBill = "http://localhost:8080/api/bill";
    const apiUrlBillDetails = "http://localhost:8080/api/billDetail";
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer ` + jwtToken
        }
    }
    $scope.updateStatusCancel = function (bill) {
        if (bill.status===4){
            // alert("Bạn không thể hủy đơn hàng này")
            $scope.messageError("Bạn không thể hủy đơn hàng này");
            return}
        if (bill.status===5){
            // alert("Đơn hàng đã được hủy")
            $scope.messageError("Đơn hàng đã được hủy");
            return}
        Swal.fire({
            title: 'Bạn có chắc muốn đổi trạng thái không?',
            text: "Đổi không thể quay lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Vui Lòng Chờ!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        $scope.form.id = bill.id;
                        $scope.form.status=5
                        $http.put(apiUrlBill + '/updateStatus'+'/'+bill.id, $scope.form,token).then(function (response) {

                            if (response.data) {
                                $scope.UpdateBillDetaillByStatusBill( $scope.form.status,$scope.form.id);
                                $scope.getAllByUser();
                                $scope.messageSuccess("Hủy đơn thành công");
                            } else {
                                $scope.messageError("Hủy đơn thất bại");
                            }
                        }).catch(error => {
                            $scope.messageError("Hủy đơn thất bại");
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
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            }
        })
    }
    $scope.UpdateBillDetaillByStatusBill = function (status,id){
        $http.put(apiUrlBillDetails + '/UpdateBillDetaillByStatusBill'+'/'+status +'/'+id,token).then(function (response) {
            if (response.data) {
            } else {
            }
        }).catch(error => {
            // $scope.messageError("Đổi trạng thái thất bại");
        });
    }
    $scope.getAllByUser=function(){
        $http.get(urlOrder).then(function(response){
            $scope.orders=response.data;
            $rootScope.id = $scope.orders.id;
        }).catch(error=>{
            console.log('error getOrder',error);
        });
    }
    $scope.getOrder=function(id){
        if (!$scope.isRedirected) {
            $scope.isRedirected = true;
            $location.path('/purchaseDetail/').search({idBill: id});
        }
    }
    $scope.getOrderDetail=function (id){
        let url=`/api/billDetail/rest/user/`+id;
        $http.get(url).then(function(response){
            if(response.data){
                $scope.ordersDetail=response.data;
            }
        }).catch(error=>{
            console.log(error);
        });

    }
    $scope.getAllByUser();
    $scope.pagerBill = {
        page: 0,
        size: 5,
        get orders() {
            var start = this.page * this.size;
            return $scope.orders.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.orders.length / this.size);
            return $scope.orders.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.orders.length / this.size);

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
});