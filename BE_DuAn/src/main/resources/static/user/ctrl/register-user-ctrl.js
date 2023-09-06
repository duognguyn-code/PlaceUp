app.controller("register-ctrl",function ($scope, $http,$window){

    const apiUrlAuthor = "http://localhost:8080/api/auth";
    $scope.formAuth={};
    $scope.accounts = [];
    $scope.roles = [];
    $scope.form = {};
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

    $scope.reset = function () {

        $scope.form = {
            username:"",
            date: new Date(),
            image: "https://res.cloudinary.com/dcll6yp9s/image/upload/v1669087979/kbasp5qdf76f3j02mebr.png",
            gender: true,
            status: 1,
            password:"",
            email:"",
            phone:"",
            role: {
                idRole: 3,
                name: "ROLE_USER"
            },
        }

    }

    const api ="/api/auth";
    $scope.create =function(){
        $http.get(api).then(resp => {
            var a = 1;
            console.log("Bắt đầu kiểm tra check trùng")
            $scope.accounts = resp.data;
            console.log("Đọc dữ liệu trong list")
            $scope.accounts.forEach(acc => {

                if ($scope.form.username == acc.account.username) {
                    console.log($scope.form.username)
                    console.log(acc.username)
                    console.log(" trùng")
                    Toast.fire({
                        icon: 'error',
                        title: 'Tài khoản đã tồn tại',
                    })
                    // alert("Tài khoản đã tồn tại")
                    return a = 0;

                }
                if ($scope.form.email == acc.account.email) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Email đã tồn tại ',
                    })
                    return a = 0;

                }
                if ($scope.form.phone == acc.account.phone) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Số điện thoại đã tồn tại ',
                    })
                    return a = 0;

                }
            })
            if (a == 1) {
                console.log("Bắt đầu thêm mới")
                var account = angular.copy($scope.form);
                var req = {
                    method: 'POST',
                    url: api + "/signup",
                    data: account,
                    transformResponse: [
                        function (data) {
                            return data;
                        }
                    ]
                }
                $http(req).then(response => {
                    alert("1")
                    $scope.addAuthor();
                    alert("2")
                    Toast.fire({
                        icon: 'success',
                        title: 'Đăng ký thành công!',
                    })

                    $window.location.href = '#!login';
                    $scope.reset();
                }).catch(error => {
                    Toast.fire({
                        icon: 'error',
                        title: 'Đăng ký thất bại!',
                    })
                    // alert("Error create!")
                    console.log("Error", error)
                });

            }
            console.log("Kết thúc thêm ")
        });
    }
    $scope.addAuthor= function (){
        var auth={
            role :{  idRole: 3},
            account: { username: $scope.form.username}
        }

        $http.post(apiUrlAuthor,auth).then(response => {
            $scope.message("Tạo Tài Khoản Thành Công")
        }).catch(error => {
            $scope.error("Tạo Tài Khoản Thất Bại")
        });
    }
    $scope.message = function (mes) {
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
} )