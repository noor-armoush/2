const db = require('../dbconfig/db');

// Fetch all products with their category names
const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
          p.product_description, 
        c.category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      ORDER BY p.product_id ASC
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.category_id,
        c.category_name,
        COUNT(p.product_id) AS product_count
      FROM category c
      LEFT JOIN product p ON p.category_id = c.category_id
      GROUP BY c.category_id, c.category_name
      ORDER BY c.category_id ASC
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // جلب جميع variants_id المرتبطة بالمنتج
    const variantRes = await client.query(
      'SELECT variants_id FROM variants WHERE product_id = $1',
      [id]
    );
    const variantIds = variantRes.rows.map(row => row.variants_id);

    // حذف المرتبطين في order_variants
    await client.query(
      'DELETE FROM order_variants WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );

    // حذف المرتبطين في basket
    await client.query(
      'DELETE FROM basket WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );

    // حذف المرتبطين في favorite
    await client.query(
      'DELETE FROM favorite WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );

    // حذف المراجعات المرتبطة بالمنتج
    const reviewsDeleted = await client.query(
      'DELETE FROM reviews WHERE product_id = $1 RETURNING *',
      [id]
    );

    // حذف المتغيرات المرتبطة بالمنتج
    const variantsDeleted = await client.query(
      'DELETE FROM variants WHERE product_id = $1 RETURNING *',
      [id]
    );

    // حذف المنتج نفسه
    const productDeleted = await client.query(
      'DELETE FROM product WHERE product_id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Product and all related data deleted successfully',
      deleted: {
        product: productDeleted.rows[0],
        variant_ids: variantIds,
        variants_count: variantsDeleted.rowCount,
        reviews_count: reviewsDeleted.rowCount
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: err.message
    });
  } finally {
    client.release();
  }
};

const getProductVariants = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        variants_id,
        product_id,
        product_image,
        stock,
        price,
        attributes
      FROM variants
      WHERE product_id = $1
    `;
    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching product variants:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product variants' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, category_id } = req.body;
  try {
    await db.query(
      `UPDATE product SET product_name = $1, category_id = $2 WHERE product_id = $3`,
      [product_name, category_id, id]
    );
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};


const deleteVariant = async (req, res) => {
  const { id } = req.params;

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // 1. جلب product_id المرتبط بهذا المتغير
    const variantInfo = await client.query(
      'SELECT product_id FROM variants WHERE variants_id = $1',
      [id]
    );

    if (variantInfo.rows.length === 0) {
      throw new Error('Variant not found');
    }

    const productId = variantInfo.rows[0].product_id;
    // حذف من الجداول المرتبطة
    await client.query('DELETE FROM order_variants WHERE variants_id = $1', [id]);
    await client.query('DELETE FROM basket WHERE variants_id = $1', [id]);
    await client.query('DELETE FROM favorite WHERE variants_id = $1', [id]);

    // حذف الفيرينت نفسه
    const result = await client.query('DELETE FROM variants WHERE variants_id = $1 RETURNING *', [id]);
    const remainingVariants = await client.query(
      'SELECT * FROM variants WHERE product_id = $1',
      [productId]
    );

    // إذا لم يتبقى أي متغيرات للمنتج، نقوم بحذفه
    if (remainingVariants.rows.length === 0) {
      // حذف المراجعات أولاً
      await client.query('DELETE FROM reviews WHERE product_id = $1', [productId]);

      // ثم حذف المنتج نفسه
      await client.query('DELETE FROM product WHERE product_id = $1', [productId]);

      await client.query('COMMIT');
      return res.json({
        success: true,
        message: 'Variant and its product deleted successfully',
        deletedProduct: true
      });
    }


    await client.query('COMMIT');
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting variant:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete variant', error: err.message });
  } finally {
    client.release();
  }
};
const getSingleVariant = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM variants WHERE variants_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching single variant:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch variant' });
  }
};


const updateVariant = async (req, res) => {
  const { id } = req.params;
  const { product_image, price, stock, attributes } = req.body;
  // التحقق من البيانات
  if (!product_image || !price || !stock || !attributes) {
    return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
  }

  if (price <= 0) {
    return res.status(400).json({ success: false, message: 'السعر يجب أن يكون أكبر من الصفر' });
  }

  if (stock <= 0) {
    return res.status(400).json({ success: false, message: 'الكمية يجب أن تكون أكبر من الصفر' });
  }

  try {
    await db.query(
      `UPDATE variants 
       SET product_image = $1, price = $2, stock = $3, attributes = $4 
       WHERE variants_id = $5`,
      [product_image, price, stock, attributes, id]
    );

    res.json({ success: true, message: 'Variant updated successfully' });
  } catch (err) {
    console.error('Error updating variant:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update variant', error: err.message });
  }
};


const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *',
      [name, id]
    );
    res.json({ success: true, updatedCategory: result.rows[0] });
  } catch (error) {
    console.error("Update category error:", error.message);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const insertQuery = `
      INSERT INTO category (category_name) 
      VALUES ($1) 
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [name.trim()]);  // هنا db بدل pool

    res.status(201).json(result.rows[0]); // ترجع الصنف الجديد
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Database error" });
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // ✅ جلب المنتجات المرتبطة بالصنف
    const productRes = await client.query(
      'SELECT product_id FROM product WHERE category_id = $1',
      [id]
    );
    const productIds = productRes.rows.map(row => row.product_id);

    // ✅ جلب كل variants المرتبطة بالمنتجات
    const variantRes = await client.query(
      'SELECT variants_id FROM variants WHERE product_id = ANY($1::int[])',
      [productIds]
    );
    const variantIds = variantRes.rows.map(row => row.variants_id);

    // ✅ حذف من الجداول المرتبطة بالـ variants
    await client.query(
      'DELETE FROM order_variants WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );
    await client.query(
      'DELETE FROM basket WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );
    await client.query(
      'DELETE FROM favorite WHERE variants_id = ANY($1::int[])',
      [variantIds]
    );

    // ✅ حذف المراجعات المرتبطة بالمنتجات
    await client.query(
      'DELETE FROM reviews WHERE product_id = ANY($1::int[])',
      [productIds]
    );

    // ✅ حذف الـ variants
    await client.query(
      'DELETE FROM variants WHERE product_id = ANY($1::int[])',
      [productIds]
    );

    // ✅ حذف المنتجات
    await client.query(
      'DELETE FROM product WHERE category_id = $1',
      [id]
    );

    // ✅ حذف الصنف نفسه
    await client.query(
      'DELETE FROM category WHERE category_id = $1',
      [id]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Category and all related data deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting category:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete category', error: err.message });
  } finally {
    client.release();
  }
};
// ✅ Get all products for a specific category_id
const getProductsByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT product_name, product_description
      FROM product
      WHERE category_id = $1
    `;
    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products by category:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};


const getAllRegions = async (req, res) => {
  try {
    const query = 'SELECT region_id, region_name FROM region ORDER BY region_id ASC';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.order_date,
        o.address,
        o.address_detail,
        o.order_status,
        o.order_phone,
        u.user_name,
        r.region_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN region r ON o.region_id = r.region_id
      ORDER BY o.order_id DESC
    `;

    const result = await db.query(query);
    console.log('عدد الطلبات:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('تفاصيل الخطأ:', error);
    res.status(500).json({
      success: false,
      message: 'فشل جلب الطلبات',
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const query = `
      SELECT 
        o.order_id,
        o.order_date,
        o.address,
        o.address_detail,
        o.order_status,
        u.user_name,
        u.user_phone,
        r.region_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN region r ON o.region_id = r.region_id
      WHERE o.order_id = $1
    `;

    const result = await db.query(query, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('فشل في جلب تفاصيل الطلب:', error);
    res.status(500).json({ message: 'فشل في جلب تفاصيل الطلب' });
  }
};

// ✅ تحديث حالة الطلبية
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const query = 'UPDATE orders SET order_status = $1 WHERE order_id = $2';
    await db.query(query, [status, orderId]);

    res.status(200).json({ message: 'تم تحديث حالة الطلبية بنجاح' });
  } catch (error) {
    console.error('خطأ في تحديث الحالة:', error);
    res.status(500).json({ error: 'فشل تحديث حالة الطلبية' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id,
        u.user_name,
        u.user_phone,
        u.user_email,
        u.user_address,
        r.region_name
      FROM users u
      JOIN region r ON u.region_id = r.region_id
      ORDER BY u.user_id ASC
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const insertShipmentData = async (req, res) => {
  const orderId = req.params.id;
  const { driver_name, driver_phone, shipping_car, shipping_hour } = req.body;

  try {
    const query = `
      INSERT INTO shipment (order_id, driver_name, driver_phone, shipping_car, shipping_hour)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await db.query(query, [orderId, driver_name, driver_phone, shipping_car, shipping_hour]);

    res.status(200).json({ message: 'Shipment data saved successfully' });
  } catch (error) {
    console.error('Error inserting shipment data:', error);
    res.status(500).json({ error: 'Failed to insert shipment data' });
  }
};


const getOrderProducts = async (req, res) => {
  const orderId = req.params.id;

  try {
    const query = `
      SELECT
        v.variants_id AS variant_id,
        v.product_image,
        v.attributes,
        c.category_name,
        p.product_name,
        ov.price,
        ov.quantity
      FROM order_variants ov
      JOIN variants v ON ov.variants_id = v.variants_id
      JOIN product p ON v.product_id = p.product_id
      JOIN category c ON p.category_id = c.category_id
      WHERE ov.order_id = $1;
    `;

    const result = await db.query(query, [orderId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ فشل جلب بيانات المنتجات للطلبية:', error);
    res.status(500).json({ error: 'فشل تحميل منتجات الطلب' });
  }
};


const addProduct = async (req, res) => {
  try {
    const { product_name, category_name, product_description, product_price, product_quantity, attributes } = req.body;

    if (!product_name || !category_name || !product_description || !product_price || !product_quantity) {
      return res.status(400).json({ message: 'الحقول الأساسية مطلوبة' });
    }

    if (Number(product_price) <= 0 || Number(product_quantity) <= 0) {
      return res.status(400).json({ message: 'الكمية والسعر يجب أن تكون أكبر من صفر' });
    }

    const insertProductQuery = `
      INSERT INTO product (product_name, category_id, product_description)
      VALUES ($1, (SELECT category_id FROM category WHERE category_name = $2), $3)
      RETURNING product_id
    `;

    const result = await db.query(insertProductQuery, [product_name, category_name, product_description]);
    const productId = result.rows[0].product_id;

    const insertVariantQuery = `
      INSERT INTO variants (product_id, price, stock, attributes)
      VALUES ($1, $2, $3, $4)
    `;

    await db.query(insertVariantQuery, [productId, product_price, product_quantity, attributes ? JSON.stringify(attributes) : null]);

    res.status(201).json({ message: 'تم إضافة المنتج بنجاح' });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'خطأ في إضافة المنتج' });
  }
};
// ✅ Get products by category name
const getProductsByCategoryName = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const query = `
      SELECT p.product_id, p.product_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      WHERE c.category_name = $1
      ORDER BY p.product_name ASC
    `;
    const result = await db.query(query, [categoryName]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "خطأ في جلب المنتجات حسب الصنف" });
  }
};
const addVariant = async (req, res) => {
  try {
    const { product_id, product_price, product_quantity, attributes } = req.body;

    if (!product_id || !product_price || !product_quantity) {
      return res.status(400).json({ message: "الحقول الأساسية مطلوبة" });
    }

    const query = `
      INSERT INTO variants (product_id, price, stock, attributes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(query, [
      product_id,
      product_price,
      product_quantity,
      attributes ? JSON.stringify(attributes) : null,
    ]);

    res.status(201).json({ success: true, variant: result.rows[0] });
  } catch (error) {
    console.error("Error adding variant:", error);
    res.status(500).json({ message: "خطأ في إضافة الخصائص" });
  }
};
// ✅ إضافة شحنة جديدة مع التحقق من عدم تكرار رقم الهاتف
const addShipmentEntry = async (req, res) => {
  const { driver_name, driver_phone, shipping_car } = req.body;

  if (!driver_name || !driver_phone || !shipping_car) {
    return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
  }

  try {
    // 🔍 تحقق من وجود رقم الهاتف مسبقًا
    const checkQuery = `SELECT * FROM shipment WHERE driver_phone = $1`;
    const checkResult = await db.query(checkQuery, [driver_phone]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: 'رقم الهاتف موجود مسبقًا' });
    }

    // ✅ إذا ما في تكرار، أضف الشحنة
    const insertQuery = `
      INSERT INTO shipment (driver_name, driver_phone, shipping_car)
      VALUES ($1, $2, $3)
    `;
    await db.query(insertQuery, [driver_name, driver_phone, shipping_car]);

    res.status(201).json({ message: 'تمت إضافة بيانات الشحن بنجاح' });
  } catch (error) {
    console.error('فشل في إضافة الشحنة:', error);
    res.status(500).json({ message: 'فشل في إضافة بيانات الشحن' });
  }
};


// جلب كل الشحنات
const getAllShipments = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM shipment ORDER BY shipment_id DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('فشل في جلب بيانات الشحن:', error);
    res.status(500).json({ message: 'فشل في جلب بيانات الشحن' });
  }
};


module.exports = { getAllProducts, getAllCategories, deleteProduct, getProductVariants,
   updateProduct , deleteVariant , getSingleVariant , updateVariant
  , updateCategory , addCategory , deleteCategory , getProductsByCategory , getAllRegions ,  
  getAllOrders ,getOrderById ,  updateOrderStatus , getAllUsers ,   insertShipmentData ,   getOrderProducts
  , addProduct , getProductsByCategoryName , addVariant , addShipmentEntry , getAllShipments


 };