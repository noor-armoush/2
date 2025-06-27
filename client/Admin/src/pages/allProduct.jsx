import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SearchInput from '../components/SearchInput';

const AllProduct = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProductName, setUpdatedProductName] = useState('');
  const [updatedCategoryId, setUpdatedCategoryId] = useState('');
  const [variantToEdit, setVariantToEdit] = useState(null);
  const [newVariantPrice, setNewVariantPrice] = useState('');
  const [newVariantStock, setNewVariantStock] = useState('');
  const [newVariantImage, setNewVariantImage] = useState('');
  const [newVariantAttributes, setNewVariantAttributes] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/api/allProduct")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/allCategories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category_name === selectedCategory
      : true;

    const matchesSearch =
      typeof product.product_name === 'string' &&
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (productId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج وجميع البيانات المرتبطة به؟')) return;

    try {
      await axios.delete(`http://localhost:5000/api/product/${productId}`);
      setProducts(prev => prev.filter(p => p.product_id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('فشل حذف المنتج. قد يكون مرتبطًا ببيانات أخرى.');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setUpdatedProductName(product.product_name);
    const category = categories.find(c => c.category_name === product.category_name);
    setUpdatedCategoryId(category ? category.category_id : '');
  };

  const closeModals = () => {
    setEditProduct(null);
    setUpdatedProductName('');
    setUpdatedCategoryId('');
    setShowDetails(false);
    setSelectedProduct(null);
    setVariantToEdit(null);
  };

  const handleUpdateProduct = async () => {
    if (!updatedProductName.trim()) {
      alert("اسم المنتج لا يمكن أن يكون فارغاً");
      return;
    }
    if (!updatedCategoryId) {
      alert("يرجى اختيار الصنف");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/product/${editProduct.product_id}`, {
        product_name: updatedProductName,
        category_id: updatedCategoryId
      });

      setProducts(prevProducts =>
        prevProducts.map(p => {
          if (p.product_id === editProduct.product_id) {
            const category = categories.find(c => c.category_id === parseInt(updatedCategoryId));
            return {
              ...p,
              product_name: updatedProductName,
              category_name: category ? category.category_name : p.category_name
            };
          }
          return p;
        })
      );

      closeModals();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("فشل تحديث المنتج.");
    }
  };

  const handleDetails = async (product) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/product/${product.product_id}/variants`);
      setSelectedProduct({ ...product, variants: res.data });
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching details:", err);
      alert("فشل تحميل تفاصيل المنتج.");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المتغير وكافة البيانات المرتبطة به؟")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/variant/${variantId}`);

      if (response.data.deletedProduct) {
        // إذا تم حذف المنتج أيضاً، نحدث قائمة المنتجات
        setProducts(prev => prev.filter(p => p.product_id !== selectedProduct.product_id));
        alert("تم حذف آخر متغير للمنتج وبالتالي تم حذف المنتج أيضاً");
        closeModals();
      } else {
        // إذا لم يتم حذف المنتج، نحدث فقط قائمة المتغيرات
        setSelectedProduct(prev => ({
          ...prev,
          variants: prev.variants.filter(v => v.variants_id !== variantId)
        }));
        alert("تم حذف المتغير بنجاح");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      alert("فشل حذف المتغير.");
    }
  };

  const handleEditVariant = async (variantId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/variant/${variantId}`);
      const data = res.data;
      setVariantToEdit(data);
      setNewVariantPrice(data.price);
      setNewVariantStock(data.stock);
      setNewVariantImage(data.product_image);
      setNewVariantAttributes(JSON.stringify(data.attributes, null, 2));
    } catch (error) {
      console.error("Error fetching variant:", error);
      alert("فشل تحميل بيانات المتغير.");
    }
  };

  const handleUpdateVariant = async () => {
    // التحقق من عدم وجود قيم فارغة أو صفر
    if (!newVariantPrice || newVariantPrice <= 0) {
      alert("يرجى إدخال سعر صحيح أكبر من الصفر");
      return;
    }

    if (!newVariantStock || newVariantStock <= 0) {
      alert("يرجى إدخال كمية صحيحة أكبر من الصفر");
      return;
    }

    if (!newVariantImage || newVariantImage.trim() === "") {
      alert("يرجى إدخال رابط صورة صحيح");
      return;
    }

    try {
      JSON.parse(newVariantAttributes);
    } catch (e) {
      alert("صيغة الخصائص غير صالحة. يجب أن تكون بصيغة JSON صحيحة");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/variant/${variantToEdit.variants_id}`, {
        product_image: newVariantImage,
        price: newVariantPrice,
        stock: newVariantStock,
        attributes: JSON.parse(newVariantAttributes)
      });

      setSelectedProduct(prev => ({
        ...prev,
        variants: prev.variants.map(v =>
          v.variants_id === variantToEdit.variants_id
            ? {
              ...v,
              product_image: newVariantImage,
              price: newVariantPrice,
              stock: newVariantStock,
              attributes: JSON.parse(newVariantAttributes)
            }
            : v
        )
      }));

      setVariantToEdit(null);
    } catch (err) {
      console.error("Error updating variant:", err);
      alert("فشل تحديث المتغير.");
    }
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />

      <div className="p-6 text-right w-full">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="flex flex-row-reverse justify-start mb-4 items-center space-x-reverse space-x-2">
          <button className="border rounded-md px-4 py-2 flex items-center gap-1">
            <span className="material-symbols-outlined"></span>
            فلترة حسب الصنف
          </button>
          <select
            id="category"
            name="category"
            className="border rounded px-4 py-2 bg-white focus:outline-none text-center"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">الكل</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="text-gray-700">
              <tr>
                <th className="py-3 px-6 bg-cyan-500 text-white"></th>
                <th className="py-3 px-6 bg-cyan-500 text-white">حذف</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">تعديل</th>
                 <th className="py-3 px-6 bg-cyan-500 text-white">وصف المنتج</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">اسم المنتج</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">الصنف</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="border-t">
                  <td className="py-2 px-4">
                    {!(editProduct && editProduct.product_id === product.product_id) && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDetails(product)}
                      >
                        التفاصيل
                      </button>
                    )}
                  </td>

                  <td className="py-2 px-4">
                    {!(editProduct && editProduct.product_id === product.product_id) && (
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>

                  <td className="py-2 px-4">
                    {editProduct && editProduct.product_id === product.product_id ? (
                      <>
                        <button
                          onClick={handleUpdateProduct}
                          className="bg-green-500 text-white px-2 py-1 rounded mx-1"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={closeModals}
                          className="bg-gray-300 px-2 py-1 rounded mx-1"
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-blue-600"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
<td className="py-2 px-4 text-right">
  {product.product_description || "لا يوجد وصف"} 
</td>
                  <td className="py-2 px-4 text-right">
                    {editProduct && editProduct.product_id === product.product_id ? (
                      <input
                        type="text"
                        value={updatedProductName}
                        onChange={(e) => setUpdatedProductName(e.target.value)}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      product.product_name
                    )}
                  </td>


                  <td className="py-2 px-4 text-right">
                    {editProduct && editProduct.product_id === product.product_id ? (
                      <select
                        value={updatedCategoryId}
                        onChange={(e) => setUpdatedCategoryId(e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="">اختر الصنف</option>
                        {categories.map((cat) => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      product.category_name
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-4 text-gray-500">لا توجد منتجات لهذا الصنف.</div>
          )}
        </div>

        {showDetails && selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals();
            }}
          >
            <div className="bg-white p-6 rounded shadow w-full max-w-4xl">
              <h2 className="text-xl font-bold mb-4">تفاصيل المنتج: {selectedProduct.product_name}</h2>

              <table className="min-w-full text-center border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">الصورة</th>
                    <th className="border px-4 py-2">الصفات</th>
                    <th className="border px-4 py-2">الكمية</th>
                    <th className="border px-4 py-2">السعر</th>
                    <th className="border px-4 py-2">تعديل</th>
                    <th className="border px-4 py-2">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.variants.map((variant) => (
                    <React.Fragment key={variant.variants_id}>
                      <tr className="border-t">
                        <td className="border px-2 py-2">
                          <img src={variant.product_image} alt="Product" className="h-20 w-20 object-contain mx-auto" />
                        </td>
                        <td className="border px-2 py-2 text-sm whitespace-pre-wrap text-right">
                          {JSON.stringify(variant.attributes, null, 2)}
                        </td>
                        <td className="border px-2 py-2">{variant.stock}</td>
                        <td className="border px-2 py-2">{variant.price}</td>
                        <td className="border px-2 py-2">
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleEditVariant(variant.variants_id)}
                          >
                            تعديل
                          </button>
                        </td>
                        <td className="border px-2 py-2">
                          <button
                            onClick={() => handleDeleteVariant(variant.variants_id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                      {variantToEdit && variantToEdit.variants_id === variant.variants_id && (
                        <tr>
                          <td colSpan="6" className="p-4 bg-gray-100">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block mb-1">رابط الصورة: *</label>
                                <input
                                  type="text"
                                  className="border rounded w-full p-2"
                                  value={newVariantImage}
                                  onChange={(e) => setNewVariantImage(e.target.value)}
                                  required

                                />
                              </div>
                              <div>
                                <label className="block mb-1">الكمية: *</label>
                                <input
                                  type="number"
                                  min="1"
                                  className="border rounded w-full p-2"
                                  value={newVariantStock}
                                  onChange={(e) => setNewVariantStock(e.target.value)}
                                  required

                                />
                              </div>
                              <div>
                                <label className="block mb-1">السعر: *</label>
                                <input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  className="border rounded w-full p-2"
                                  value={newVariantPrice}
                                  onChange={(e) => setNewVariantPrice(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block mb-1">الخصائص (JSON): *</label>
                                <textarea
                                  className="border rounded w-full p-2 text-sm font-mono"
                                  rows={4}
                                  value={newVariantAttributes}
                                  onChange={(e) => setNewVariantAttributes(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded"
                                  onClick={handleUpdateVariant}
                                >
                                  حفظ
                                </button>
                                <button
                                  className="bg-gray-400 text-white px-4 py-2 rounded"
                                  onClick={() => setVariantToEdit(null)}
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div className="text-left mt-4">
                <button onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">إغلاق</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProduct;