const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/userModel');
const Warehouse = require('../models/warehouseModel');
const Product = require('../models/productModel');
const ProductWarehouse = require('../models/productWarehouseModel');
const Supplier = require('../models/supplierModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const InventoryMovement = require('../models/inventoryMovementModel');
const Consumption = require('../models/consumptionModel');
const Notification = require('../models/notificationModel');

const password = 'Password123!';
const daysFromToday = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

const run = async () => {
  await connectDB();

  console.log('Clearing existing MilStock sample data...');
  await Promise.all([
    Notification.deleteMany({}),
    Consumption.deleteMany({}),
    InventoryMovement.deleteMany({}),
    OrderItem.deleteMany({}),
    Order.deleteMany({}),
    ProductWarehouse.deleteMany({}),
    Product.deleteMany({}),
    Supplier.deleteMany({}),
    Warehouse.deleteMany({}),
    User.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash(password, 12);

  const adminUsers = await User.insertMany([
    {
      name: 'Food Inventory Admin',
      email: 'admin@milstock.local',
      password: hashedPassword,
      phone: '+966555000100',
      military_number: 'EMP-0001',
      role: 'admin',
    },
    {
      name: 'Warehouse Supervisor',
      email: 'warehouse@milstock.local',
      password: hashedPassword,
      phone: '+966555000300',
      military_number: 'EMP-0201',
      role: 'admin',
    },
  ]);

  const [adminUser, warehouseUser] = adminUsers;

  const warehouses = await Warehouse.insertMany([
    { name: 'Dry Goods Warehouse', location: 'Central Food Depot - Aisle 1', user_id: warehouseUser._id },
    { name: 'Cold Storage Warehouse', location: 'Central Food Depot - Refrigerated Zone', user_id: warehouseUser._id },
    { name: 'Fresh Produce Warehouse', location: 'Distribution Center - Produce Hall', user_id: adminUser._id },
  ]);

  const kitchenUser = await User.create({
    name: 'Kitchen Request Coordinator',
    email: 'kitchen@milstock.local',
    password: hashedPassword,
    phone: '+966555000200',
    military_number: 'EMP-0101',
    role: 'unit',
    assigned_warehouse: warehouses[0]._id,
    assigned_warehouse_name: warehouses[0].name,
  });

  const suppliers = await Supplier.insertMany([
    { name: 'Golden Grain Foods', phone: '+966555100001' },
    { name: 'Fresh Valley Produce', phone: '+966555100002' },
    { name: 'Pure Dairy Supply', phone: '+966555100003' },
    { name: 'Ocean Canned Foods', phone: '+966555100004' },
  ]);

  const products = await Product.insertMany([
    {
      name: 'Rice',
      quantity: 4200,
      unit: 'kg',
      category: 'Grains',
      min_quantity: 800,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2027-12-31'),
    },
    {
      name: 'Pasta',
      quantity: 1800,
      unit: 'kg',
      category: 'Grains',
      min_quantity: 400,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2027-08-15'),
    },
    {
      name: 'Sugar',
      quantity: 1200,
      unit: 'kg',
      category: 'Baking',
      min_quantity: 300,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2028-02-28'),
    },
    {
      name: 'Flour',
      quantity: 950,
      unit: 'kg',
      category: 'Baking',
      min_quantity: 500,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2026-11-30'),
    },
    {
      name: 'Cooking Oil',
      quantity: 750,
      unit: 'liter',
      category: 'Oils',
      min_quantity: 250,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2027-05-31'),
    },
    {
      name: 'Milk',
      quantity: 620,
      unit: 'liter',
      category: 'Dairy',
      min_quantity: 300,
      warehouse_id: warehouses[1]._id,
      expiry_date: new Date('2026-07-10'),
    },
    {
      name: 'Cheese',
      quantity: 380,
      unit: 'kg',
      category: 'Dairy',
      min_quantity: 120,
      warehouse_id: warehouses[1]._id,
      expiry_date: new Date('2026-10-05'),
    },
    {
      name: 'Beans',
      quantity: 1600,
      unit: 'kg',
      category: 'Legumes',
      min_quantity: 350,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2027-09-30'),
    },
    {
      name: 'Lentils',
      quantity: 1450,
      unit: 'kg',
      category: 'Legumes',
      min_quantity: 350,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2027-09-30'),
    },
    {
      name: 'Canned Tuna',
      quantity: 2400,
      unit: 'piece',
      category: 'Canned Food',
      min_quantity: 600,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2028-04-30'),
    },
    {
      name: 'Frozen Vegetables',
      quantity: 900,
      unit: 'kg',
      category: 'Frozen Food',
      min_quantity: 300,
      warehouse_id: warehouses[1]._id,
      expiry_date: new Date('2026-12-15'),
    },
    {
      name: 'Fresh Vegetables',
      quantity: 700,
      unit: 'kg',
      category: 'Fresh Produce',
      min_quantity: 250,
      warehouse_id: warehouses[2]._id,
      expiry_date: new Date('2026-06-20'),
    },
    {
      name: 'Fresh Fruits',
      quantity: 640,
      unit: 'kg',
      category: 'Fresh Produce',
      min_quantity: 240,
      warehouse_id: warehouses[2]._id,
      expiry_date: new Date('2026-06-18'),
    },
    {
      name: 'Bread',
      quantity: 500,
      unit: 'piece',
      category: 'Bakery',
      min_quantity: 200,
      warehouse_id: warehouses[2]._id,
      expiry_date: daysFromToday(-1),
    },
    {
      name: 'Yogurt',
      quantity: 320,
      unit: 'piece',
      category: 'Dairy',
      min_quantity: 100,
      warehouse_id: warehouses[1]._id,
      expiry_date: daysFromToday(7),
    },
    {
      name: 'Tomato Sauce',
      quantity: 850,
      unit: 'piece',
      category: 'Canned Food',
      min_quantity: 180,
      warehouse_id: warehouses[0]._id,
      expiry_date: daysFromToday(30),
    },
    {
      name: 'Apple Juice',
      quantity: 1100,
      unit: 'piece',
      category: 'Beverages',
      min_quantity: 220,
      warehouse_id: warehouses[0]._id,
      expiry_date: daysFromToday(90),
    },
    {
      name: 'Water Bottles',
      quantity: 6000,
      unit: 'piece',
      category: 'Beverages',
      min_quantity: 1200,
      warehouse_id: warehouses[0]._id,
      expiry_date: new Date('2028-01-31'),
    },
  ]);

  const byName = Object.fromEntries(products.map((product) => [product.name, product]));

  await ProductWarehouse.insertMany([
    { product_id: byName.Rice._id, warehouse_id: warehouses[0]._id, quantity: 4200 },
    { product_id: byName.Pasta._id, warehouse_id: warehouses[0]._id, quantity: 1800 },
    { product_id: byName.Sugar._id, warehouse_id: warehouses[0]._id, quantity: 1200 },
    { product_id: byName.Flour._id, warehouse_id: warehouses[0]._id, quantity: 950 },
    { product_id: byName['Cooking Oil']._id, warehouse_id: warehouses[0]._id, quantity: 750 },
    { product_id: byName.Milk._id, warehouse_id: warehouses[1]._id, quantity: 620 },
    { product_id: byName.Cheese._id, warehouse_id: warehouses[1]._id, quantity: 380 },
    { product_id: byName.Beans._id, warehouse_id: warehouses[0]._id, quantity: 1600 },
    { product_id: byName.Lentils._id, warehouse_id: warehouses[0]._id, quantity: 1450 },
    { product_id: byName['Canned Tuna']._id, warehouse_id: warehouses[0]._id, quantity: 2400 },
    { product_id: byName['Frozen Vegetables']._id, warehouse_id: warehouses[1]._id, quantity: 900 },
    { product_id: byName['Fresh Vegetables']._id, warehouse_id: warehouses[2]._id, quantity: 700 },
    { product_id: byName['Fresh Fruits']._id, warehouse_id: warehouses[2]._id, quantity: 640 },
    { product_id: byName.Bread._id, warehouse_id: warehouses[2]._id, quantity: 500 },
    { product_id: byName.Yogurt._id, warehouse_id: warehouses[1]._id, quantity: 320 },
    { product_id: byName['Tomato Sauce']._id, warehouse_id: warehouses[0]._id, quantity: 850 },
    { product_id: byName['Apple Juice']._id, warehouse_id: warehouses[0]._id, quantity: 1100 },
    { product_id: byName['Water Bottles']._id, warehouse_id: warehouses[0]._id, quantity: 6000 },
  ]);

  const orders = await Order.insertMany([
    {
      date: new Date('2026-06-01'),
      total_price: 9600,
      status: 'pending',
      user_id: kitchenUser._id,
      supplier_id: suppliers[0]._id,
    },
    {
      date: new Date('2026-06-02'),
      total_price: 4200,
      status: 'approved',
      user_id: adminUser._id,
      supplier_id: suppliers[2]._id,
    },
    {
      date: new Date('2026-06-03'),
      total_price: 5100,
      status: 'completed',
      user_id: kitchenUser._id,
      supplier_id: suppliers[1]._id,
    },
  ]);

  await OrderItem.insertMany([
    { order_id: orders[0]._id, product_id: byName.Rice._id, quantity: 800, unit_price: 4, total_price: 3200 },
    { order_id: orders[0]._id, product_id: byName.Pasta._id, quantity: 500, unit_price: 5, total_price: 2500 },
    { order_id: orders[0]._id, product_id: byName['Cooking Oil']._id, quantity: 300, unit_price: 13, total_price: 3900 },
    { order_id: orders[1]._id, product_id: byName.Milk._id, quantity: 400, unit_price: 6, total_price: 2400 },
    { order_id: orders[1]._id, product_id: byName.Cheese._id, quantity: 120, unit_price: 15, total_price: 1800 },
    { order_id: orders[2]._id, product_id: byName['Fresh Vegetables']._id, quantity: 450, unit_price: 6, total_price: 2700 },
    { order_id: orders[2]._id, product_id: byName['Fresh Fruits']._id, quantity: 300, unit_price: 8, total_price: 2400 },
  ]);

  await InventoryMovement.insertMany([
    {
      user_id: adminUser._id,
      product_id: byName.Rice._id,
      change_type: 'in',
      stock: 800,
      reference_id: warehouses[0]._id,
      reference_type: 'supplier_delivery',
    },
    {
      user_id: kitchenUser._id,
      product_id: byName.Bread._id,
      change_type: 'out',
      stock: 150,
      reference_id: warehouses[2]._id,
      reference_type: 'daily_kitchen_consumption',
    },
    {
      user_id: warehouseUser._id,
      product_id: byName.Milk._id,
      change_type: 'in',
      stock: 400,
      reference_id: warehouses[1]._id,
      reference_type: 'supplier_delivery',
    },
  ]);

  await Consumption.insertMany([
    { user_id: kitchenUser._id, product_id: byName.Bread._id, warehouse_id: warehouses[2]._id, quantity: 150 },
    { user_id: kitchenUser._id, product_id: byName.Milk._id, warehouse_id: warehouses[1]._id, quantity: 90 },
    { user_id: kitchenUser._id, product_id: byName['Fresh Vegetables']._id, warehouse_id: warehouses[2]._id, quantity: 120 },
  ]);

  await Notification.insertMany([
    {
      title: 'Fresh food expiry alert',
      type: 'expiry',
      message: 'Bread and fresh fruit batches are approaching their expiry dates.',
      is_read: false,
      user_id: adminUser._id,
    },
    {
      title: 'Low stock alert',
      type: 'low_stock',
      message: 'Flour stock is close to the minimum food warehouse threshold.',
      is_read: false,
      user_id: warehouseUser._id,
    },
    {
      title: 'Food order created',
      type: 'order',
      message: 'A new rice, pasta, and cooking oil order is pending approval.',
      is_read: false,
      user_id: kitchenUser._id,
    },
    {
      title: 'Consumption recorded',
      type: 'consumption',
      message: 'Daily bread, milk, and vegetable consumption was recorded.',
      is_read: true,
      user_id: kitchenUser._id,
    },
  ]);

  console.log('MilStock seed complete.');
  console.log(`Demo users: admin@milstock.local / ${password}, kitchen@milstock.local / ${password}`);
};

run()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
