app.controller('address-form-ctrl', function ($rootScope,$http, $scope, $window) {

    $scope.form = {}
    $scope.title={
        insert:'Thêm mới',
        update:'Cập nhật'
    };
    $scope.checkSubmit=false;
    $scope.listaddress= [];
    $scope.provinces = [];
    $scope.district = [];
    $scope.ward = [];
    $scope.name_province = "";
    $scope.name_district = "";
    $scope.name_ward = "";
    $scope.id_province="";
    $scope.id_district="";
    $scope.id_ward ="";
    const callApiAddress = "http://localhost:8080/rest/user/address";
    const callApiAcounts = "http://localhost:8080/rest/user";
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }


    var citis = document.getElementById("city");
    var districts = document.getElementById("district");
    var wards = document.getElementById("ward");



    $scope.onSave = function() {
        $http.post(callApiAddress+"/create", $scope.form,token,
            $scope.form.addressTake = $scope.name_ward+", "+$scope.name_district+", "+$scope.name_province,
            $scope.form.province = $scope.name_province, $scope.form.district = $scope.name_district,
            $scope.form.ward = $scope.name_ward).then(response => {
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
                title: 'Thêm mới thành công!',
            })
            $window.location.href = '#!address'
        }).catch(error => {
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
                title: 'Thêm mới thất bại!',
            })
        });
    };

    $scope.doSubmit = function() {
        if($scope.form.idAddress) {
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
        }else{
            let timerInterval
            Swal.fire({
                title: 'Đang lưu mới!',
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
                    $scope.onSave();
                    console.log('I was closed by the timer')
                }
            })
        }
    };
    //tìm address theo username
    $scope.getAddressByUsername = function () {
        $http.get(callApiAddress+'/getByUsername',token).then(function (respon){
            $scope.listaddress = respon.data;
            console.log($scope.listaddress + "adress theo username")
        }).catch(err => {
            console.log(err)
        })
    }
    //get tất cả tỉnh
    $scope.getProvince = function (){
        $http.get(callApiAddress+"/getProvince",token).then(function (respon) {
            $scope.provinces = respon.data.data;
            console.log($scope.provinces)
        }).catch(err =>{
            console.log(err)
        })
    }
    //get tất cả huyện theo id của tỉnh
    $scope.getDistrict = function (provinces){
        $http.get(callApiAddress+"/getDistrict?province_id="+provinces,token).then(function (respon) {
            $scope.district = respon.data.data;
            console.log($scope.district)
        }).catch(err =>{
            console.log(err)
        })
    }
    //get tất cả xã theo id của huyện
    $scope.getWard = function (district){
        $http.get(callApiAddress+"/getWard?district_id="+district,token).then(function (respon) {
            $scope.ward = respon.data.data;
            console.log($scope.ward)
        }).catch(err =>{
            console.log(err)
        })
    }

    // bắt thay đổi của select tỉnh
    citis.onchange = function (){
        district.length = 1;
        ward.length = 1;
        if (this.value != "") {
            console.log(citis.options[citis.selectedIndex].text)
            $scope.getDistrict(this.value)
            $scope.name_province = citis.options[citis.selectedIndex].text;
            $scope.id_province = this.value;

        }
    }

    //bắt thay đổi của select huyện
    districts.onchange = function (){
        ward.length = 1;
        if (this.value != "") {
            console.log(districts.options[districts.selectedIndex].text)
            console.log(this.value)
            $scope.getWard(this.value)
            $scope.name_district = districts.options[districts.selectedIndex].text;
            $scope.id_district = this.value;

        }
    }

    //bắt thay đổi của select xã
    wards.onchange = function (){
        if (this.value != "") {
            console.log(wards.options[wards.selectedIndex].text)
            console.log(this.value)
            $scope.name_ward = wards.options[wards.selectedIndex].text;
            $scope.id_ward = this.value;

        }
    }


    $scope.delete = function(addres) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa: '+addres.addressTake+'?',
            text: "Xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang xóa: '+addres.addressTake+'!',
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
                        $http.post(`${callApiAddress}/delete`,[addres.idAddress]).then(response=> {
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
                                title:'Xóa thành công!'
                            })
                            $scope.listaddress.splice($scope.listaddress.indexOf(addres), 1);
                            $scope.getAddressByUsername();
                        }).catch(error=>{
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
                                title:'Đã xảy ra lỗi!' ,
                            })
                        });
                        console.log('I was closed by the timer')
                    }
                })

            }
        })

    };
    $scope.setAddressDefault = function (addres) {
        $http.post(`${callApiAcounts}/setaddressdefault`,addres.idAddress,token).then(function () {
            // alert(token)
            $window.location.href = '#!cart';
        }).catch(err=>{
            console.log(err)
        })
    }
    $scope.logOut= function () {
        // alert("dang xuat ben dia chi")
        $rootScope.account=null;
        localStorage.removeItem('jwtToken');
    }

    $scope.getAddressByUsername();
    $scope.getProvince();
    $scope.pagerAddress = {
        page: 0,
        size: 3,
        get listaddress() {
            var start = this.page * this.size;
            return $scope.listaddress.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.listaddress.length / this.size);
            return $scope.listaddress.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.listaddress.length / this.size);

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
})