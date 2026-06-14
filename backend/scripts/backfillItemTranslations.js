const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/productModel');

const itemTranslations = {
  'Canned Tuna': 'تونة معلبة',
  'Frozen Vegetables': 'خضروات مجمدة',
  'Fresh Vegetables': 'خضروات طازجة',
  'Fresh Fruits': 'فواكه طازجة',
  'Water Bottles': 'زجاجات مياه',
  Rice: 'أرز',
  Pasta: 'مكرونة',
  'Cooking Oil': 'زيت طهي',
  Milk: 'حليب',
  Cheese: 'جبن',
  Bread: 'خبز',
  Sugar: 'سكر',
  Beans: 'فول',
  tt: 'tt',
  pppp: 'pppp',
};

const categoryTranslations = {
  Food: 'أغذية',
  Dairy: 'ألبان',
  Bakery: 'مخبوزات',
  Pantry: 'مواد جافة',
  'Canned Food': 'أغذية معلبة',
  'Frozen Food': 'أغذية مجمدة',
  'Fresh Produce': 'منتجات طازجة',
  Beverages: 'مشروبات',
  'Dry Goods': 'مواد جافة',
};

const warehouseTranslations = {
  'Dry Goods Warehouse': 'مخزن المواد الجافة',
  'Cold Storage Warehouse': 'مخزن التبريد',
  'Fresh Produce Warehouse': 'مخزن المنتجات الطازجة',
  'Beverages Warehouse': 'مخزن المشروبات',
  'Bakery Supplies Warehouse': 'مخزن مستلزمات المخبوزات',
};

const reverseMap = (mapping) => Object.fromEntries(
  Object.entries(mapping).map(([english, arabic]) => [arabic, english])
);

const itemEnglishByArabic = reverseMap(itemTranslations);
const categoryEnglishByArabic = reverseMap(categoryTranslations);
const warehouseEnglishByArabic = reverseMap(warehouseTranslations);

const containsArabic = (text = '') => /[\u0600-\u06FF]/.test(String(text));

const isMissing = (value) => !String(value || '').trim();

const normalizeBilingualField = ({ englishValue, arabicValue, englishToArabic, arabicToEnglish }) => {
  const english = String(englishValue || '').trim();
  const arabic = String(arabicValue || '').trim();
  const result = {};

  if (containsArabic(english)) {
    if (isMissing(arabic)) result.arabic = english;
    if (arabicToEnglish[english]) result.english = arabicToEnglish[english];
  } else if (english && isMissing(arabic) && englishToArabic[english]) {
    result.arabic = englishToArabic[english];
  }

  if (arabic && !containsArabic(arabic) && englishToArabic[arabic]) {
    result.arabic = englishToArabic[arabic];
  }

  if (arabic && containsArabic(arabic) && isMissing(english) && arabicToEnglish[arabic]) {
    result.english = arabicToEnglish[arabic];
  }

  return result;
};

const run = async () => {
  try {
    await connectDB();
    const products = await Product.find({});
    let scanned = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      scanned += 1;
      const updates = {};

      const nameFix = normalizeBilingualField({
        englishValue: product.name,
        arabicValue: product.nameAr,
        englishToArabic: itemTranslations,
        arabicToEnglish: itemEnglishByArabic,
      });
      if (nameFix.english && nameFix.english !== product.name) updates.name = nameFix.english;
      if (nameFix.arabic && nameFix.arabic !== product.nameAr) updates.nameAr = nameFix.arabic;

      const categoryFix = normalizeBilingualField({
        englishValue: product.category,
        arabicValue: product.categoryAr,
        englishToArabic: categoryTranslations,
        arabicToEnglish: categoryEnglishByArabic,
      });
      if (categoryFix.english && categoryFix.english !== product.category) updates.category = categoryFix.english;
      if (categoryFix.arabic && categoryFix.arabic !== product.categoryAr) updates.categoryAr = categoryFix.arabic;

      const warehouseName = String(product.warehouse_name || '').trim();
      if (containsArabic(warehouseName) && warehouseEnglishByArabic[warehouseName]) {
        updates.warehouse_name = warehouseEnglishByArabic[warehouseName];
      }

      if (Object.keys(updates).length) {
        await Product.updateOne({ _id: product._id }, { $set: updates });
        updated += 1;
      } else {
        skipped += 1;
      }
    }

    console.log('Bilingual item backfill complete.');
    console.log(`Products scanned: ${scanned}`);
    console.log(`Products updated: ${updated}`);
    console.log(`Products skipped: ${skipped}`);
  } catch (error) {
    console.error('Bilingual item backfill failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
