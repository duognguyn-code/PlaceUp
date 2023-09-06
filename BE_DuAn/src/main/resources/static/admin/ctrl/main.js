 app.controller('main', function ($rootScope,$scope, $http) {
        const apiUrlProduct = "http://localhost:8080/api/product";
        const apiUrlColor = "http://localhost:8080/api/color";
        const apiUrl = "http://localhost:8080/api/material";
        const apiUrlDesign = "http://localhost:8080/api/design";
        const apiUrlImage = "http://localhost:8080/api/image";

        const apiUrlProductDetail = "http://localhost:8080/api/productDetail";

        console.log(apiUrl);

        $scope.products = [];
        $scope.formProduct = {};

        $scope.productDetails = [];
        $scope.formProductDetail = {};

        $scope.colors = [];
        $scope.formColor = {};
        $scope.materials = [];
        $scope.formMaterial = {};
        $scope.designs = [];
        $scope.formDesign = {};

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

        $scope.getProductDetails = function () {
            $http.get(apiUrlProductDetail)
                .then(function (response) {
                    $scope.productDetails = response.data;
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        $scope.previewImage = function () {
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
        };
        // Thêm sản phẩm mới
        $scope.addProduct = function () {
            // Lấy tên tệp tin từ đường dẫn
            var input = document.getElementById('image');
            if (input.files && input.files[0]) {
                $scope.formProduct.image = input.files[0].name;
            }

            $http.post(apiUrlProduct, $scope.formProduct)
                .then(function (response) {
                    $scope.products.push(response.data);
                    $scope.formProduct = {};
                    $scope.resetProducts();
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.editProduct = function (product) {
            $scope.formProduct = angular.copy(product);
        }
        // Cập nhật thông tin sản phẩm
        $scope.updateProduct = function (product) {
            $http.put(apiUrlProduct + '/' + product.id, product)
                .then(function (response) {
                    // Cập nhật thông tin sản phẩm trong danh sách
                    var index = $scope.products.findIndex(p => p.id === product.id);
                    if (index !== -1) {
                        $scope.products[index] = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        // Xóa sản phẩm
        $scope.deleteProduct = function (product) {
            $http.delete(apiUrlProduct + '/' + product.id)
                .then(function (response) {
                    // Xóa sản phẩm khỏi danh sách
                    var index = $scope.products.findIndex(p => p.id === product.id);
                    if (index !== -1) {
                        $scope.products.splice(index, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.resetProducts = function () {
            $scope.formProduct = {
                status: 1
            }
        }
        console.log(apiUrlProduct);

        $scope.getColors = function () {
            $http.get(apiUrlColor)
                .then(function (response) {
                    $scope.colors = response.data;
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.addColor = function () {
            $http.post(apiUrlColor, $scope.formColor)
                .then(function (response) {
                    $scope.colors.push(response.data);
                    $scope.formColor = {};
                    $scope.resetColor();
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.editColor = function (color) {
            $scope.formColor = angular.copy(color);
        }
        $scope.updateColor = function () {
            var item = angular.copy($scope.formColor);
            $http.put(apiUrlColor + '/' + item.id, item).then(resp => {
                var index = $scope.colors.findIndex(p => p.id == item.id);
                $scope.colors[index] = item;
                alert("Cập nhật thành công");
                $scope.resetColor();
            }).catch(error => {
                alert("Cập nhật thất bại");
                console.log("Error", error);
            });
        }
        $scope.deleteColor = function (color) {
            $http.delete(apiUrlColor + '/' + color.id)
                .then(function (response) {
                    var index = $scope.colors.findIndex(p => p.id === color.id);
                    if (index !== -1) {
                        $scope.colors.splice(index, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.resetColor = function () {
            $scope.formColor = {
                status: 1
            }
        }
        $scope.pagerColor = {
            page: 0,
            size: 5,
            get colors() {
                var start = this.page * this.size;
                return $scope.colors.slice(start, start + this.size);

            },
            get count() {
                return Math.ceil(1.0 * $scope.colors.length / this.size);

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
        $scope.pagerDesign = {
            page: 0,
            size: 5,
            get designs() {
                var start = this.page * this.size;
                return $scope.designs.slice(start, start + this.size);

            },
            get count() {
                return Math.ceil(1.0 * $scope.designs.length / this.size);

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
        $scope.pagerMaterial = {
            page: 0,
            size: 5,
            get materials() {
                var start = this.page * this.size;
                return $scope.materials.slice(start, start + this.size);

            },
            get count() {
                return Math.ceil(1.0 * $scope.materials.length / this.size);

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
        $scope.pagerProduct = {
            page: 0,
            size: 5,
            get products() {
                var start = this.page * this.size;
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
        console.log(apiUrlColor);

        $scope.getMaterials = function () {
            $http.get(apiUrl)
                .then(function (response) {
                    $scope.materials = response.data;
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.addMaterial = function () {
            $http.post(apiUrl, $scope.formMaterial)
                .then(function (response) {
                    $scope.materials.push(response.data);
                    $scope.formMaterial = {};
                    $scope.resetMaterial();
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.editMaterial = function (material) {
            $scope.formMaterial = angular.copy(material);
        }
        $scope.updateMaterial = function () {
            var item = angular.copy($scope.formMaterial);
            $http.put(apiUrl + '/' + item.id, item).then(resp => {
                var index = $scope.materials.findIndex(p => p.id == item.id);
                $scope.materials[index] = item;
                alert("Cập nhật thành công");
                $scope.resetMaterial();
            }).catch(error => {
                alert("Cập nhật thất bại");
                console.log("Error", error);
            });
        }
        $scope.deleteMaterial = function (material) {
            $http.delete(apiUrl + '/' + material.id)
                .then(function (response) {
                    var index = $scope.materials.findIndex(p => p.id === material.id);
                    if (index !== -1) {
                        $scope.materials.splice(index, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.resetMaterial = function () {
            $scope.formMaterial = {
                status: 1
            }
        }
        $scope.getDesign = function () {
            $http.get(apiUrlDesign)
                .then(function (response) {
                    $scope.designs = response.data;
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.addDesign = function () {
            $http.post(apiUrlDesign, $scope.formDesign)
                .then(function (response) {
                    $scope.designs.push(response.data);
                    $scope.formDesign = {};
                    $scope.resetDesign();
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.editDesign = function (design) {
            $scope.formDesign = angular.copy(design);
        }
        $scope.updateDesign = function () {
            var item = angular.copy($scope.formDesign);
            $http.put(apiUrlDesign + '/' + item.id, item).then(resp => {
                var index = $scope.designs.findIndex(p => p.id == item.id);
                $scope.designs[index] = item;
                alert("Cập nhật thành công");
                $scope.resetDesign();
            }).catch(error => {
                alert("Cập nhật thất bại");
                console.log("Error", error);
            });
        }
        $scope.deleteDesign = function (design) {
            $http.delete(apiUrlDesign + '/' + design.id)
                .then(function (response) {
                    var index = $scope.designs.findIndex(p => p.id === design.id);
                    if (index !== -1) {
                        $scope.designs.splice(index, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        $scope.resetDesign = function () {
            $scope.formDesign = {
                status: 1
            }
        }
        $scope.getDesign();
        $scope.getProducts();
        $scope.getMaterials();
        $scope.getColors();

        $scope.getProductDetails();

    });