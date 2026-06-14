export const getCurrentLocale = () => {
  if (typeof window === "undefined") return "en";
  return window.location.pathname.startsWith("/ar") ? "ar" : "en";
};

const knownTextTranslations = {
  "Fresh Vegetables": "خضروات طازجة",
  Bread: "خبز",
  Rice: "أرز",
  Pasta: "مكرونة",
  "Cooking Oil": "زيت طهي",
  Milk: "حليب",
  Cheese: "جبن",
  "Fresh Fruits": "فواكه طازجة",
  Sugar: "سكر",
  Beans: "فول",
  "Dry Goods Warehouse": "مخزن المواد الجافة",
  "Cold Storage Warehouse": "مخزن التبريد",
  "Fresh Produce Warehouse": "مخزن المنتجات الطازجة",
  "Bakery Supplies Warehouse": "مخزن مستلزمات المخبوزات",
  "Fresh Food Supplier": "مورد الأغذية الطازجة",
  "Dairy Supplier": "مورد الألبان",
  "Equipment Supplier": "مورد المعدات",
  "Kitchen Request Coordinator": "منسق طلبات المطبخ",
  "Food Inventory Admin": "مسؤول مخزون الأغذية",
  "Seed Admin": "مسؤول البيانات التجريبية",
  admin: "مسؤول",
  unit: "مستخدم وحدة",
  supplier: "مورد",
};

export const localizeText = (value, locale = getCurrentLocale()) => {
  const text = String(value || "").trim();
  if (!text) return "";
  if (locale !== "ar") return text;
  if (text.includes(",")) {
    return text.split(",").map((part) => localizeText(part, locale)).join("، ");
  }
  return knownTextTranslations[text] || text;
};

export const getLocalizedValue = (entity, field, locale = getCurrentLocale()) => {
  if (!entity) return "";
  const translatedField = `${field}Ar`;
  const snakeTranslatedField = `${field}_ar`;
  const defaultValue = entity[field] ?? entity.translations?.en?.[field] ?? "";
  const arabicValue = entity[translatedField] ?? entity[snakeTranslatedField] ?? entity.translations?.ar?.[field] ?? "";

  if (locale === "ar") {
    return localizeText(arabicValue || defaultValue || "", locale);
  }
  return defaultValue || entity.translations?.en?.[field] || arabicValue || "";
};

export const getLocalizedDisplayName = (entity, locale = getCurrentLocale()) =>
  getLocalizedValue(entity, "name", locale);

export const getLocalizedRoleLabel = (roleOrName, locale = getCurrentLocale()) =>
  localizeText(roleOrName, locale);

const interpolate = (template, params = {}) =>
  String(template || "").replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? "");

export const notificationTranslations = {
  en: {
    LOW_STOCK_TITLE: "Low stock",
    LOW_STOCK_MESSAGE: "{{itemName}} stock is running low",
    EXPIRATION_REMINDER_TITLE: "Expiration reminder",
    EXPIRATION_REMINDER_MESSAGE: "{{itemName}} will expire in {{daysRemaining}} days",
    EXPIRED_ITEM_TITLE: "Expired item",
    EXPIRED_ITEM_MESSAGE: "{{itemName}} has expired",
    REQUEST_CREATED_TITLE: "Request created",
    REQUEST_CREATED_MESSAGE: "Request {{requestCode}} has been created",
    REQUEST_APPROVED_TITLE: "Request approved",
    REQUEST_APPROVED_MESSAGE: "Request {{requestCode}} has been approved",
    REQUEST_UPDATED_TITLE: "Request update",
    REQUEST_UPDATED_MESSAGE: "Request {{requestCode}} was updated",
  },
  ar: {
    LOW_STOCK_TITLE: "انخفاض في المخزون",
    LOW_STOCK_MESSAGE: "مخزون {{itemName}} منخفض",
    EXPIRATION_REMINDER_TITLE: "تذكير بانتهاء الصلاحية",
    EXPIRATION_REMINDER_MESSAGE: "{{itemName}} ستنتهي صلاحيته خلال {{daysRemaining}} يوم",
    EXPIRED_ITEM_TITLE: "صنف منتهي الصلاحية",
    EXPIRED_ITEM_MESSAGE: "انتهت صلاحية {{itemName}}",
    REQUEST_CREATED_TITLE: "تم إنشاء الطلب",
    REQUEST_CREATED_MESSAGE: "تم إنشاء الطلب {{requestCode}}",
    REQUEST_APPROVED_TITLE: "تمت الموافقة على الطلب",
    REQUEST_APPROVED_MESSAGE: "تمت الموافقة على الطلب {{requestCode}}",
    REQUEST_UPDATED_TITLE: "تحديث طلب",
    REQUEST_UPDATED_MESSAGE: "تم تحديث الطلب {{requestCode}}",
  },
};

const normalizeNotificationParams = (notification, locale) => {
  const metadata = notification?.metadata || {};
  const params = notification?.params || {};
  const itemName = locale === "ar"
    ? localizeText(metadata.item_name_ar || metadata.product_name_ar || params.itemNameAr || params.itemName || metadata.item_name || metadata.product_name, locale)
    : params.itemName || metadata.item_name || metadata.product_name || params.itemNameAr || metadata.item_name_ar || metadata.product_name_ar;

  return {
    ...metadata,
    ...params,
    itemName,
    requestCode: params.requestCode || metadata.request_code || metadata.order_code || metadata.order_id || metadata.request_id || notification?.entity_id || "",
    daysRemaining: params.daysRemaining ?? metadata.days_remaining ?? "",
  };
};

const getKeyFromType = (notification, suffix) => {
  const type = String(notification?.type || "");
  if (type === "low_stock") return `LOW_STOCK_${suffix}`;
  if (notification?.metadata?.expiration_status === "expired" || type === "expired") return `EXPIRED_ITEM_${suffix}`;
  if (type === "expiration" || type === "expiration_reminder") return `EXPIRATION_REMINDER_${suffix}`;
  if (type.includes("request") || type.includes("order")) return `REQUEST_UPDATED_${suffix}`;
  return "";
};

export const formatNotification = (notification, locale = getCurrentLocale()) => {
  const params = normalizeNotificationParams(notification, locale);
  const translations = notificationTranslations[locale] || notificationTranslations.en;
  const fallbackTranslations = notificationTranslations.en;
  const titleKey = notification?.titleKey || notification?.metadata?.titleKey || getKeyFromType(notification, "TITLE");
  const messageKey = notification?.messageKey || notification?.metadata?.messageKey || getKeyFromType(notification, "MESSAGE");

  const titleTemplate = translations[titleKey] || fallbackTranslations[titleKey];
  const messageTemplate = translations[messageKey] || fallbackTranslations[messageKey];

  const title = locale === "ar"
    ? notification?.titleAr || (titleTemplate ? interpolate(titleTemplate, params) : "") || notification?.title || ""
    : notification?.title || (titleTemplate ? interpolate(titleTemplate, params) : "") || notification?.titleAr || "";
  const message = locale === "ar"
    ? notification?.messageAr || (messageTemplate ? interpolate(messageTemplate, params) : "") || notification?.message || ""
    : notification?.message || (messageTemplate ? interpolate(messageTemplate, params) : "") || notification?.messageAr || "";

  return { title: localizeText(title, locale), message: localizeText(message, locale), params };
};
