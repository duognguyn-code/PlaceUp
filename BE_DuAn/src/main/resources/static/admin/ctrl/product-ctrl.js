app.controller('productController', function ($rootScope, $scope, $http, $location, $routeParams) {
    const apiUrlProduct = "http://localhost:8080/api/product";

    $scope.products = [];
    $scope.formProduct = {};
    $scope.productData = {};
    $scope.sizes = [];
    $scope.formSize = {};
    $scope.colors = [];
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
    $scope.sortByNameAsc = true;
    $scope.sortByPriceAsc = true;

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
    $scope.sortByProductName = function () {
        if ($scope.sortByNameAsc) {
            $scope.products.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1; // Sort ascending
                }
                if (nameA > nameB) {
                    return 1; // Sort ascending
                }
                return 0;
            });
        } else {
            $scope.products.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return 1; // Sort descending
                }
                if (nameA > nameB) {
                    return -1; // Sort descending
                }
                return 0;
            });
        }

        // Thay đổi trạng thái sắp xếp
        $scope.sortByNameAsc = !$scope.sortByNameAsc;
    };
    $scope.sortByPrice = function () {
        if ($scope.sortByPriceAsc) {
            $scope.products.sort(function (a, b) {
                return a.price - b.price;
            });
        } else {
            $scope.products.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        $scope.sortByPriceAsc = !$scope.sortByPriceAsc;
    };
    $scope.uploadFile = function (files) {
        $scope.files = files;
        if (files.length > 4) {
            $scope.error('Ảnh tối da 4 ảnh');
        } else {
            var previewImagesContainer = document.getElementById('previewImagesContainer');
            previewImagesContainer.innerHTML = '';
            var imageCount = 0;
            for (var i = 0; i < files.length; i++) {
                if (imageCount >= 3) {
                    break;
                }

                var file = files[i];
                var reader = new FileReader();

                reader.onload = (function (file) {
                    return function (e) {
                        var previewImage = document.createElement('img');
                        previewImage.src = e.target.result;
                        previewImage.className = 'previewImage';
                        previewImage.style = "width:100px;";
                        previewImagesContainer.appendChild(previewImage);
                        imageCount++;
                    };
                })(file);

                reader.readAsDataURL(file);
            }
        }

    };
    $scope.uploadFileUpdate = function (files) {
        $scope.files1 = files;
        if (files.length > 4) {
            $scope.error('Ảnh tối da 4 ảnh');
        } else {
            var previewImagesContainerUpdate = document.getElementById('previewImagesContainerUpdate');
            previewImagesContainerUpdate.innerHTML = '';
            var imageCount = 0;
            for (var i = 0; i < files.length; i++) {
                if (imageCount >= 3) {
                    break;
                }

                var file = files[i];
                var reader = new FileReader();

                reader.onload = (function (file) {
                    return function (e) {
                        var previewImage = document.createElement('img');
                        previewImage.src = e.target.result;
                        previewImage.className = 'previewImage';
                        previewImage.style = "width:100px;";
                        previewImagesContainerUpdate.appendChild(previewImage);
                        imageCount++;
                    };
                })(file);

                reader.readAsDataURL(file);
            }
        }

    };
    $scope.checkimg=0
    $scope.checkImgUpdate=function (){
        $scope.checkimg=1
    }
    $scope.addProduct = function () {
        // Lấy tên tệp tin từ đường dẫn
        var formData = new FormData();
        angular.forEach($scope.files, function (file) {
            formData.append('files', file);
        });
        formData.append('name', $scope.formProduct.name);
        formData.append('size', $scope.formProduct.size);
        formData.append('price', $scope.formProduct.price);
        formData.append('quantity', $scope.formProduct.quantity);
        formData.append('status', $scope.formProduct.status = 1)
        formData.append('category', $scope.formProduct.category)
        formData.append('material', $scope.formProduct.material)
        formData.append('design', $scope.formProduct.design)
        formData.append('color', $scope.formProduct.color)
        console.log($scope.formProduct.category)
        var req = {
            method: 'POST',
            url: '/api/product/saveProduct',
            headers: {'Content-Type': undefined},
            data: formData,
            transformResponse: [
                function (data) {
                    return data;
                }
            ]
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
            console.log("ddd " + response);
            $scope.message("Thêm mới sản phẩm thành công");
            $scope.resetProducts();
            $scope.getProducts();
        }).catch(error => {
            $scope.error('Thêm mới thất bại');
            // alert(angular.toJson(error));
        });
    };
    $scope.edit = function (productId) {
        if (!$scope.isRedirected) {
            $scope.isRedirected = true;
            $location.path('/Pageupdateproduct/').search({id: productId});
        }
    };
    $scope.formMaterial.status=1
    $scope.formSize.status=1
    $scope.formDesign.status=1
    $scope.formColor.status=1
    $scope.formCategory.status=1
    $scope.refreshUpdate=function (){
        $scope.getProductDataUpdate();
    }
    $scope.getProductDataUpdate = function () {
        var productId = $routeParams.id;
        $http.get('/api/product/search/' + productId)
            .then(function (response) {
                var product = response.data;
                $scope.productData.category = product.category.idCategory;
                $scope.productData.name = product.name;
                $scope.productData.status = product.status;
                $scope.productData.material = product.material.idMaterial;
                $scope.productData.size = product.size.idSize;
                $scope.productData.design = product.design.idDesign;
                $scope.productData.price = product.price;
                $scope.productData.color = product.color.idColor;
                $scope.productData.quantity = product.quantity;
                $scope.productData.images = product.images;
            })
            .catch(function (error) {
                console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            });
    };

    $scope.onUpdate = function () {
        var productId = $routeParams.id;
        var formData = new FormData();
        angular.forEach($scope.files1, function(file) {
            // formData.append('image', image);
            formData.append('files', file);
        });
        formData.append('name', $scope.productData.name);
        formData.append('size', $scope.productData.size);
        formData.append('price', $scope.productData.price);
        formData.append('status', $scope.productData.status);
        formData.append('category', $scope.productData.category);
        formData.append('material', $scope.productData.material);
        formData.append('design', $scope.productData.design);
        formData.append('color', $scope.productData.color);
        formData.append('quantity', $scope.productData.quantity);
        let req = {
            method: 'POST',
            url: '/api/product/updateProduct/' + productId,
            data: formData,
            headers: {
                'Content-Type': undefined
            },
            transformResponse: [
                function (data) {
                    return data;
                }
            ]
        };

        let timerInterval;
        Swal.fire({
            title: 'Đang cập nhật, vui lòng chờ!',
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
        if ($scope.checkimg==1) {
            alert("1")
            $http.put(apiUrlProduct + '/deleteByProduct'+'/'+productId).then(resp => {
                $http(req)
                    .then(response => {
                        console.log("ddd " + response.data);
                        $scope.message("Cập nhật sản phẩm thành công");
                        $scope.getProducts();
                    })
                    .catch(error => {
                        $scope.error('Cập nhật thất bại');
                        // alert(error);
                        console.log(error)
                    });
            }).catch(error => {

            });

        }
        if ($scope.checkimg==0) {
            alert("0")
            $http(req)
                .then(response => {
                    console.log("ddd " + response.data);
                    $scope.message("Cập nhật sản phẩm thành công");
                    $scope.getProducts();
                })
                .catch(error => {
                    $scope.error('Cập nhật thất bại');
                    // alert(error);
                    console.log(error)
                });
        }
    };
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
    // Cập nhật thông tin sản phẩm

    // Xóa sản phẩm
    $scope.deleteProduct = function (formProduct) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa: ' + formProduct.name + '?',
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
                    title: 'Đang xóa: ' + formProduct.name + '!',
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
                    if (result.dismiss === Swal.DismissReason.timer) {
                        $http.post(apiUrlProduct + `/delete?id=${formProduct.id}`, formProduct.id).then(response => {
                            $scope.message('Đã cập nhật trạng thái  sản phẩm thành hết hàng');
                            $scope.getProducts();
                        }).catch(error => {
                            $scope.error('xóa thất bại');
                        });
                        console.log('I was closed by the timer')
                    }
                })

            }
        })

    };
    $scope.resetProducts = function () {
        $scope.formProduct = {
            status: 1
        }
    }


/*    $scope.previewImage = function () {
        var input = document.getElementById('image');
        if (input.files && input.files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.imagePreview = e.target.result;
                $scope.$apply(); // Cập nhật lại scope để hiển thị hình ảnh
            };
            $scope.formProduct.url_images = []; // Xóa các hình ảnh hiện có trong danh sách
            for (var i = 0; i < input.files.length; i++) {
                var file = input.files[i];
                var reader1 = new FileReader();
                reader.onload = (function (file) {
                    return function (e) {
                        $scope.formProduct.url_image.push(e.target.result);
                        $scope.$apply(); // Cập nhật lại scope để hiển thị hình ảnh
                    };
                })(file);
                reader1.readAsDataURL(file);
                console.log("Tên tệp tin:", file.name);
            }
        } else {
            $scope.imagePreview = ""; // Đặt giá trị rỗng nếu không có tệp tin được chọn
            $scope.formProduct.url_image = []; // Đặt danh sách hình ảnh thành rỗng
        }
    };*/
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
    $scope.addColor = function () {
        var colorData = {
            name: $scope.formColor.name,
            status: $scope.formColor.status
        };
        var req = {
            method: 'POST',
            url: `${apiUrlProduct}/createColor`,
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
            console.log("ddd " + response);
            $scope.message("thêm mới màu thành công");
            $scope.resetCategory();
            $scope.getColors();
        }).catch(error => {
            $scope.error('thêm mới thất bại');
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
    $scope.addMaterial = function () {
        var materialData = {
            name: $scope.formMaterial.name,
            status: $scope.formMaterial.status
        };
        var req = {
            method: 'POST',
            url: `${apiUrlProduct}/createMaterial`,
            data: materialData
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
            console.log("ddd " + response);
            $scope.message("thêm mới chất liệu thành công");
            $scope.resetCategory();
            $scope.getMaterials();
        }).catch(error => {
            $scope.error('thêm mới thất bại');
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
    $scope.addDesign = function () {
        var designData = {
            name: $scope.formDesign.name,
            status: $scope.formDesign.status
        };
        var req = {
            method: 'POST',
            url: `${apiUrlProduct}/createDesign`,
            data: designData
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
            console.log("ddd " + response);
            $scope.message("thêm mới kiểu dáng thành công");
            $scope.resetCategory();
            $scope.getDesign();
        }).catch(error => {
            $scope.error('thêm mới thất bại');
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
    $scope.addSize = function () {
        var sizeData = {
            name: $scope.formSize.name,
            status: $scope.formSize.status
        };
        var req = {
            method: 'POST',
            url: `${apiUrlProduct}/createSize`,
            data: sizeData
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
            console.log("ddd " + response);
            $scope.message("thêm mới size nhanh thành công");
            $scope.resetCategory();
            $scope.getSize();
        }).catch(error => {
            $scope.error('thêm mới thất bại');
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
    $scope.addCategory = function () {
        var categoryData = {
            name: $scope.formCategory.name,
            status: $scope.formCategory.status
        };
        var req = {
            method: 'POST',
            url: `${apiUrlProduct}/createCategory`,
            data: categoryData
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
            console.log("ddd " + response);
            $scope.message("thêm mới thể loại thành công");
            $scope.resetCategory();
            $scope.getCategory();
        }).catch(error => {
            $scope.error('thêm mới thất bại');
        });
    };
    $scope.resetCategory = function () {
        $scope.formCategory = {
            status: 1
        }
        $scope.formSize = {
            status: 1
        }
        $scope.formDesign = {
            status: 1
        }
        $scope.formColor = {
            status: 1
        }
        $scope.formMaterial = {
            status: 1
        }
    }
    $scope.generationName = function () {
        if ($scope.formProduct.name != undefined || $scope.formProduct.name != null || $scope.formProduct.name != '') {
            $scope.formProduct.name = ' ';
        }
        if ($scope.formProduct.category != undefined || $scope.formProduct.category != null || $scope.formProduct.category != '') {
            for (let i = 0; i < $scope.categories.length; i++) {
                if ($scope.formProduct.category == $scope.categories[i].idCategory) {
                    $scope.formProduct.name =' ' + $scope.categories[i].name;
                }
            }
        }
        if ($scope.formProduct.color != undefined || $scope.formProduct.color != null || $scope.formProduct.color != '') {
            for (let i = 0; i < $scope.colors.length; i++) {
                if ($scope.formProduct.color == $scope.colors[i].idColor) {
                    $scope.formProduct.name += 'C' + $scope.colors[i].name;
                }
            }
        }
        if ($scope.formProduct.design != undefined || $scope.formProduct.design != null || $scope.formProduct.design != '') {
            for (let i = 0; i < $scope.designs.length; i++) {
                if ($scope.formProduct.design == $scope.designs[i].idDesign) {
                    $scope.formProduct.name += 'D' + $scope.designs[i].name;
                }
            }
        }
        if ($scope.formProduct.material != undefined || $scope.formProduct.material != null || $scope.formProduct.material != '') {
            for (let i = 0; i < $scope.colors.length; i++) {
                if ($scope.formProduct.material == $scope.materials[i].idMaterial) {
                    $scope.formProduct.name += 'M' + $scope.materials[i].name;
                }
            }
        }
        if ($scope.formProduct.size != undefined || $scope.formProduct.size != null || $scope.formProduct.size != '') {
            for (let i = 0; i < $scope.sizes.length; i++) {
                if ($scope.formProduct.size == $scope.sizes[i].idSize) {
                    $scope.formProduct.name += 'S' + $scope.sizes[i].name;
                }
            }
        }

    }
    $scope.generationNameForUpdate = function () {
        if ($scope.productData.name != undefined || $scope.productData.name != null || $scope.productData.name != '') {
            $scope.productData.name = ' ';
        }
        if ($scope.productData.category != undefined || $scope.productData.category != null || $scope.productData.category != '') {
            for (let i = 0; i < $scope.categories.length; i++) {
                if ($scope.productData.category == $scope.categories[i].idCategory) {
                    $scope.productData.name = ' ' + $scope.categories[i].name;
                }
            }
        }
        if ($scope.productData.color != undefined || $scope.productData.color != null || $scope.productData.color != '') {
            for (let i = 0; i < $scope.colors.length; i++) {
                if ($scope.productData.color == $scope.colors[i].idColor) {
                    $scope.productData.name += ' Màu ' + $scope.colors[i].name;
                }
            }
        }
        if ($scope.productData.design != undefined || $scope.productData.design != null || $scope.productData.design != '') {
            for (let i = 0; i < $scope.designs.length; i++) {
                if ($scope.productData.design == $scope.designs[i].idDesign) {
                    $scope.productData.name += ' Thiết kế ' + $scope.designs[i].name;
                }
            }
        }
        if ($scope.productData.material != undefined || $scope.productData.material != null || $scope.productData.material != '') {
            for (let i = 0; i < $scope.colors.length; i++) {
                if ($scope.formProduct.material == $scope.materials[i].idMaterial) {
                    $scope.productData.name += ' Chất Liệu ' + $scope.materials[i].name;
                }
            }
        }
        if ($scope.productData.size != undefined || $scope.productData.size != null || $scope.productData.size != '') {
            for (let i = 0; i < $scope.sizes.length; i++) {
                if ($scope.productData.size == $scope.sizes[i].idSize) {
                    $scope.productData.name += ' Size ' + $scope.sizes[i].name;
                }
            }
        }

    }
    $scope.searchProduct = function () {
        if ($scope.searchPriceMin === "") {
            $scope.searchPriceMin = "Min"

        }
        if ($scope.searchProducts === "") {
            $scope.searchProducts = " "

        }
        if ($scope.searchPriceMax === "") {
            $scope.searchPriceMax = "Max"
        }
        if ($scope.searchColor === 'undefined' && $scope.searchDesign === 'undefined' && $scope.searchMaterial === 'undefined'&& $scope.searchCategory === 'undefined'
            && $scope.searchSize === 'undefined' && $scope.searchPriceMin === "" && $scope.searchPriceMax === "" && $scope.searchProducts === 'undefined'
        ) {
            $scope.getProducts();
        } else {
            $http.get(apiUrlProduct + '/search' + '/' + $scope.searchProducts + '/' + $scope.searchColor + '/' + $scope.searchMaterial + '/' + $scope.searchSize + '/' + $scope.searchDesign + '/' + $scope.searchPriceMin + '/' + $scope.searchPriceMax + '/' + $scope.searchStatus+ '/' + $scope.searchCategory)
                .then(function (response) {
                    $scope.products = response.data;
                    console.log(response);
                    $scope.pagerProducts.first()
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    };
    $scope.detailProduct={}
    $scope.idCheck=undefined;
    $scope.getDetailProduct=function (id){
        console.log(id)
        if(id==0){
            id = localStorage.getItem('idDetail');
            $http.post(`/rest/guest/product/detailproduct/` + id).then(function (respon) {
                $scope.detailProduct = respon.data;
            }).catch(err => {
                    console.log(err, 'kiixu  lỗi')
                }
            )
        }else {
            localStorage.removeItem('idDetail');
            localStorage.setItem('idDetail', id);
            $window.location.href='#!product';
        }
    }
    $scope.GetresetForm = function () {
        $http.get(apiUrlProduct + '/search' + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "undefined" + '/' + "1"+ '/' + "undefined")
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
        size: 5,
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
                // alert("")
                $scope.message("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                $scope.message("Bạn đang ở trang cuối");
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
        $scope.searchCategory = "undefined";
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
    $scope.getProductDataUpdate();
    $scope.generationNameForUpdate();

});