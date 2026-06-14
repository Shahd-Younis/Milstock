const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/productModel');
const Warehouse = require('../models/warehouseModel');
const User = require('../models/userModel');

const productArabicNames = {
  'Canned Tuna': { nameAr: 'تونة معلبة', categoryAr: 'أغذية معلبة' },
  'Frozen Vegetables': { nameAr: 'خضروات مجمدة', categoryAr: 'أغذية مجمدة' },
  'Water Bottles': { nameAr: 'زجاجات مياه', categoryAr: 'مشروبات' },
  Bread: { nameAr: 'خبز', categoryAr: 'مخبوزات' },
  Milk: { nameAr: 'حليب', categoryAr: 'ألبان' },
  Cheese: { nameAr: 'جبن', categoryAr: 'ألبان' },
  Sugar: { nameAr: 'سكر', categoryAr: 'مواد جافة' },
  Rice: { nameAr: 'أرز', categoryAr: 'مواد جافة' },
  Pasta: { nameAr: 'مكرونة', categoryAr: 'مواد جافة' },
  'Cooking Oil': { nameAr: 'زيت طهي', categoryAr: 'مواد جافة' },
  Beans: { nameAr: 'فول', categoryAr: 'مواد جافة' },
  'Fresh Fruits': { nameAr: 'فواكه طازجة', categoryAr: 'منتجات طازجة' },
  'Fresh Vegetables': { nameAr: 'خضروات طازجة', categoryAr: 'منتجات طازجة' },
};

const warehouseArabicNames = {
  'Dry Goods Warehouse': {
    nameAr: 'مخزن المواد الجافة',
    locationAr: 'منطقة التخزين الرئيسية أ',
  },
  'Cold Storage Warehouse': {
    nameAr: 'مخزن التبريد',
    locationAr: 'منطقة التبريد ب',
  },
  'Bakery Supplies Warehouse': {
    nameAr: 'مخزن مستلزمات المخبوزات',
    locationAr: 'منطقة تخزين المخبوزات والأغذية المعبأة',
  },
  'Fresh Produce Warehouse': {
    nameAr: 'مخزن المنتجات الطازجة',
    locationAr: 'منطقة تخزين الأغذية الطازجة',
  },
};

const userArabicNames = {
  'Kitchen Request Coordinator': { nameAr: 'منسق طلبات المطبخ' },
  'Food Inventory Admin': { nameAr: 'مسؤول مخزون الأغذية' },
  'Seed Admin': { nameAr: 'مسؤول البيانات التجريبية' },
  'Fresh Food Supplier': { nameAr: 'مورد الأغذية الطازجة' },
  'Dairy Supplier': { nameAr: 'مورد الألبان' },
  'Equipment Supplier': { nameAr: 'مورد المعدات' },
};

const applyTranslations = async (Model, mapping) => {
  let updated = 0;
  let skipped = 0;

  for (const [name, translations] of Object.entries(mapping)) {
    const doc = await Model.findOne({ name });
    if (!doc) {
      skipped += 1;
      continue;
    }

    const updates = {};
    for (const [field, value] of Object.entries(translations)) {
      if (!doc[field]) updates[field] = value;
    }

    if (Object.keys(updates).length) {
      await Model.updateOne({ _id: doc._id }, { $set: updates });
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  return { updated, skipped };
};

const run = async () => {
  try {
    await connectDB();
    const productResult = await applyTranslations(Product, productArabicNames);
    const warehouseResult = await applyTranslations(Warehouse, warehouseArabicNames);
    const userResult = await applyTranslations(User, userArabicNames);

    console.log('Arabic translation seed complete.');
    console.log(`Products updated: ${productResult.updated}, skipped: ${productResult.skipped}`);
    console.log(`Warehouses updated: ${warehouseResult.updated}, skipped: ${warehouseResult.skipped}`);
    console.log(`Users updated: ${userResult.updated}, skipped: ${userResult.skipped}`);
  } catch (error) {
    console.error('Arabic translation seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
