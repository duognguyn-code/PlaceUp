// app.controller('Controller',function($rootScope,$scope,$window,$timeout,$http){
//     var apiUrlProduct = "http://localhost:8080/api/product"
//     const jwtToken = localStorage.getItem("jwtToken")
//     const token = {
//         headers: {
//             Authorization: `Bearer `+jwtToken
//         }
//     }
//     $scope.accountActive = {};
//     $scope.accountHome= {};
//     $rootScope.cartItems = [];
//     $rootScope.qtyCart = 0;
//     $scope.index = 0;
//
//     $scope.logOut= function () {
//         localStorage.removeItem('jwtToken');
//         $rootScope.account=null;
//     }
//     $scope.messageSuccess = function (text) {
//         const Toast = Swal.mixin({
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 2000,
//             timerProgressBar: true,
//             didOpen: (toast) => {
//                 toast.addEventListener('mouseenter', Swal.stopTimer)
//                 toast.addEventListener('mouseleave', Swal.resumeTimer)
//             }
//         })
//
//         Toast.fire({
//             icon: 'success',
//             title: text
//         })
//     }
//     $scope.checkCartItemQuantity = function (item) {
//         var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//
//         // Tìm tất cả các mặt hàng trong giỏ hàng có cùng product.id
//         var itemsWithSameProduct = cartItems.filter(function (cartItem) {
//             return (
//                 cartItem.product.id === item.product.id &&
//                 cartItem.design === item.design &&
//                 cartItem.size === item.size &&
//                 cartItem.color === item.color &&
//                 cartItem.material === item.material
//             );
//         });
//
//
//         // Tính tổng số lượng sản phẩm có cùng product.id trong giỏ hàng
//         var totalQuantityInCart = itemsWithSameProduct.reduce(function (total, cartItem) {
//             return total + cartItem.quantity;
//         }, 0);
//         item.totalQuantityInCart = totalQuantityInCart;
//         alert(totalQuantityInCart);
//
//         // Gửi yêu cầu kiểm tra số lượng của sản phẩm trong db
//         var apiUrlProduct = `http://localhost:8080/api/product/${item.product.id}`;
//         $http.get(apiUrlProduct).then(function (response) {
//             var dbProductQuantity = response.data.quantity;
//             item.messageQuantity = ""; // Reset thông báo lỗi
//             if (item.quantity == 0) {
//                 item.messageQuantity = "Số lượng không trống";
//             } else if (item.quantity > dbProductQuantity) {
//                 item.messageQuantity = "Số lượng này vượt quá số lượng hiện có.";
//                 console.log("Số lượng trong giỏ hàng vượt quá số lượng của sản phẩm trong db.")
//             } else if (item.quantity + item.totalQuantityInCart > dbProductQuantity) {
//                 item.messageQuantity = "Số lượng này vượt quá số lượng hiện có .";
//                 console.log("Số lượng trong giỏ hàng vượt quá số lượng của sản phẩm trong db.")
//             }
//         }).catch(function (error) {
//             console.log("Lỗi khi truy vấn số lượng sản phẩm từ cơ sở dữ liệu: ", error);
//         });
//     };
//     $scope.messageError = function (text) {
//         const Toast = Swal.mixin({
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 2000,
//             timerProgressBar: true,
//             didOpen: (toast) => {
//                 toast.addEventListener('mouseenter', Swal.stopTimer)
//                 toast.addEventListener('mouseleave', Swal.resumeTimer)
//             }
//         })
//
//         Toast.fire({
//             icon: 'error',
//             title: text
//         })
//     }
//     $scope.getAcountActive = function () {
//         $http.get(apiUrlAccout + `/getAccountActive`).then(function (respon) {
//             $scope.accountActive = respon.data;
//             $rootScope.name = $scope.accountActive.username;
//             console.log($scope.accountActive.username)
//         }).catch(err => {
//             $scope.accountActive = null;
//             $rootScope.account = null;
//         })
//
//     };
//     $scope.addCart = function (product, quantity) {
//         var totalQuantityInCart = 0;
//         var selectedDesign = $scope.checkDesign.name;
//         var selectedSize = $scope.checkSize.name;
//         var selectedColor = $scope.checkColor.name;
//         var selectedMaterial = $scope.checkMaterial.name;
//
//         // Create a cart item object
//         var cartItem = {
//             product: product,
//             design: selectedDesign,
//             size: selectedSize,
//             color: selectedColor,
//             material: selectedMaterial,
//             quantity: quantity
//         };
//
//         // Retrieve existing cart items from local storage
//         var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//
//         // Check if the same product with the same options already exists in the cart
//         var existingItem = cartItems.find(function (item) {
//             return (
//                 item.product.id === cartItem.product.id &&
//                 item.design === cartItem.design &&
//                 item.size === cartItem.size &&
//                 item.color === cartItem.color &&
//                 item.material === cartItem.material
//             );
//         });
//
//         if (existingItem) {
//             totalQuantityInCart = existingItem.quantity;
//             if (totalQuantityInCart + quantity > product.quantity) {
//                 $scope.messageError("Sản phẩm này chỉ còn " + (product.quantity - totalQuantityInCart) + " sản phẩm trong kho.");
//                 return;
//             }
//             existingItem.quantity++;
//             $rootScope.loadQtyCart();
//             $scope.messageSuccess("Sản phẩm này đã có ,thêm giỏ hàng thành công!");
//         } else {
//             if (quantity > product.quantity) {
//                 $scope.messageError("Sản phẩm này chỉ còn " + product.quantity + " sản phẩm trong kho.");
//                 return;
//             }
//             // Otherwise, add the new item to the cart
//             cartItems.push(cartItem);
//             $rootScope.qtyCart++;
//             $scope.messageSuccess("Thêm vào giỏ hàng thành công!");
//         }
//
//         // Update the cart items in local storage
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     };
//     $scope.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     $rootScope.loadQtyCart = function () {
//         $rootScope.qtyCart = 0;
//         if ($rootScope.cartItems) {
//             $rootScope.cartItems.forEach(item => {
//                 $rootScope.qtyCart += item.quantity;
//             });
//         }
//     }
//     $scope.calculateSubtotal = function () {
//         var subtotal = 0;
//         for (var i = 0; i < $scope.cartItems.length; i++) {
//             var item = $scope.cartItems[i];
//             subtotal += item.product.price * item.quantity;
//         }
//         return subtotal;
//     };
//     $scope.calculateTotalAmount = function () {
//         var subtotal = $scope.calculateSubtotal();
//         return subtotal + $scope.ship;
//     };
//     // Hàm để xóa một mục khỏi giỏ hàng
//     $scope.removeItem = function (index) {
//         Swal.fire({
//             title: 'Bạn có chắc muốn xóa Sản phẩm này khỏi giỏ hàng?',
//             text: "Xóa không thể khôi phục lại!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes, delete it!'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 let timerInterval;
//                 Swal.fire({
//                     title: 'Đang xóa!',
//                     html: 'Vui lòng chờ <b></b> milliseconds.',
//                     timer: 1500,
//                     timerProgressBar: true,
//                     didOpen: () => {
//                         Swal.showLoading();
//                         const b = Swal.getHtmlContainer().querySelector('b');
//                     },
//                     willClose: () => {
//                         $scope.cartItems.splice(index, 1);
//                         localStorage.setItem('cartItems', JSON.stringify($scope.cartItems));
//                         location.reload("http://localhost:8080/user/index.html#!/cart");
//                         $scope.message('Đã xóa sản phẩm thành công');
//
//                     }
//                 });
//             }
//         });
//     };
//
//     $scope.loadFromLocalStorage = function () {
//         var json = localStorage.getItem("cartItems");
//         this.cartItems = json ? JSON.parse(json) : [];
//     }
//     $scope.calculateTotal = function (item) {
//         if (!item || !item.product || !item.quantity) {
//             return 0; // or any default value
//         }
//         return item.product.price * item.quantity;
//     };
//     $scope.pagerProducts = {
//         page: 0,
//         size: 9,
//         get products() {
//             var start = this.page * this.size;
//             return $scope.products.slice(start, start + this.size);
//
//         },
//         get count() {
//             return Math.ceil(1.0 * $scope.products.length / this.size);
//             return $scope.products.slice(start, start + this.size);
//
//         },
//         get count() {
//             return Math.ceil(1.0 * $scope.products.length / this.size);
//
//         },
//         first() {
//             this.page = 0;
//         },
//         prev() {
//             this.page--;
//             if (this.page < 0) {
//                 this.first();
//                 alert("Bạn đang ở trang đầu")
//             }
//         },
//         next() {
//             this.page++;
//             if (this.page >= this.count) {
//                 this.last();
//                 alert("Bạn đang ở trang cuối")
//             }
//         },
//         last() {
//             this.page = this.count - 1;
//         }
//     }
//     $scope.resetSearch = function () {
//         $('#matesearch').prop('selectedIndex', 0);
//         $('#colorSearch').prop('selectedIndex', 0);
//         $('#designSearch').prop('selectedIndex', 0);
//         $('#statusSearch').prop('selectedIndex', 0);
//         $scope.searchColor = "undefined";
//         $scope.searchDesign = "undefined";
//         $scope.searchMaterial = "undefined";
//         $scope.searchSize = "undefined";
//         $scope.searchStatus = "1";
//         $scope.searchPriceMin = "";
//         $scope.searchPriceMax = "";
//         $scope.searchProducts = " ";
//         $('#sizeSearch').prop('selectedIndex', 0);
//         $scope.GetresetForm();
//     }
//     $scope.resetSearch();
//
//
//     $scope.detailProduct = {}
//     $scope.idCheck = undefined;
//     $scope.getDetailProduct = function (id) {
//         console.log(id)
//         if (id == 0) {
//             id = localStorage.getItem('idDetail');
//             $http.post(`/rest/guest/product/product_detail/` + id).then(function (response) {
//                 $scope.detailProduct = response.data;
//                 alert($scope.detailProduct.images[0])
//             }).catch(error => {
//                 console.log(error, "lỗi")
//             })
//         } else {
//             localStorage.removeItem('idDetail');
//             localStorage.setItem('idDetail', id);
//             $window.location.href = '#!product_detail';
//         }
//     }
//     $scope.checkDesign = 0;
//     $scope.checkMaterial = 0;
//     $scope.checkSize = 0;
//     $scope.checkColor = 0;
//     $scope.PrD = {};
//     $scope.checkProduct = function (id, check) {
//         if (check == 0) {
//             $scope.checkDesign = id;
//         } else if (check == 1) {
//             $scope.checkSize = id;
//         } else if (check == 2) {
//             $scope.checkColor = id;
//         } else if (check == 3) {
//             $scope.checkMaterial = id;
//         }
//         if ($scope.checkDesign != 0 && $scope.checkSize != 0 && $scope.checkColor != 0 && $scope.checkMaterial != 0) {
// //            let url = 'rest/guest/product/get_detail_product' +'/' +$scope.checkDesign +'/' +$scope.checkSize +'/'+$scope.checkColor +'/'+$scope/checkMaterial
//             $http.get(`/rest/guest/product/get_detail_product/` + $scope.checkDesign + `/` + $scope.checkSize + `/` + $scope.checkColor + `/` + $scope.checkMaterial).then(function (response) {
//                 $scope.PrD = response.data;
//                 if ($scope.PrD != '') {
//                     $scope.checkQuantity = false;
//                 } else if ($scope.PrD == '') {
//                     $scope.checkQuantity = true;
//                 }
//             }).catch(error => {
//                 console.log(error, 'lỗi check product')
//                 alert(error);
//             })
//         }
//     }
//
// })