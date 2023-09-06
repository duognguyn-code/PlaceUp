app.controller('category-ctrl', function ($rootScope,$scope, $http) {

    const apiUrlCategory = "http://localhost:8080/api/category";
    $scope.categories = [];
    $scope.formCategory = {};
    $scope.checkName={};
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
    $scope.formCategory.status=1
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

    $scope.getCategory = function () {
        $http.get(apiUrlCategory)
            .then(function (response) {
                $scope.categories = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.addCategory = function () {
        var categoryData = {
            name: $scope.formCategory.name,
            status: $scope.formCategory.status,
            type: $scope.formCategory.type
        };
        var req = {
            method: 'POST',
            url: apiUrlCategory,
            data: categoryData
        }
        // let timerInterval
        // Swal.fire({
        //     title: 'Đang thêm  mới vui lòng chờ!',
        //     html: 'Vui lòng chờ <b></b> milliseconds.',
        //     timer: 5500,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading()
        //         const b = Swal.getHtmlContainer().querySelector('b')
        //         timerInterval = setInterval(() => {
        //             b.textContent = Swal.getTimerLeft()
        //         }, 100)
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval)
        //     }
        // });
        $http.get(apiUrlCategory+'/'+$scope.formCategory.name)
            .then(function (response) {
                $scope.checkName=response.data;
                if (!$scope.checkName){
        $http(req).then(response => {
            console.log("ddd " + response);
            $scope.message("Thêm mới thể loại thành công");
            $scope.resetCategory();
            $scope.getCategory();
        }).catch(error => {
            console.log(error)
            $scope.error('Thêm mới thất bại');

        });
                }else{
                    // alert("Thể loại đã tồn tại")
                    $scope.error('Thể Loại đã tồn tại');
                    return
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.editCategory = function (category) {
        $scope.formCategory = angular.copy(category);
    }
    $scope.updateCategory = function () {
        var item = angular.copy($scope.formCategory);
        $http.put(apiUrlCategory, item).then(resp => {
            var index = $scope.categories.findIndex(p => p.id == item.id);
            $scope.categories[index] = item;
            // alert("");
            $scope.message('Cập nhật thành công');
            $scope.resetCategory();
            $scope.getCategory();
        }).catch(error => {
            // alert("");
            $scope.error('Cập nhật thất bại');
            console.log("Error", error);
        });
    }
    $scope.deleteCategory = function (item) {
        $http.put(apiUrlCategory + '/delete', item).then(resp => {
            // var index = $scope.categories.findIndex(p => p.id == item.id);
            // $scope.categories[index] = item;
            // alert("");
            $scope.message('Tạm ngưng thành công');
            $scope.resetCategory();
            $scope.getCategory();
        }).catch(error => {
            // alert("");
            $scope.error('Tạm ngưng thất bại');
            console.log("Error", error);
        });
    };
    $scope.resetCategory = function () {
        $scope.formCategory = {
            status: 1
        }
    }
    $scope.getCategory();

    $scope.pagerCategory = {
        page: 0,
        size: 5,
        get category() {
            var start = this.page * this.size;
            return $scope.categories.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.categories.length / this.size);
            return $scope.categories.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.categories.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("Bạn đang ở trang đầu")
                $scope.message('Bạn đang ở trang đầu');
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("Bạn đang ở trang cuối")
                $scope.message('Bạn đang ở trang cuối');
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
});