// Category to tags mapping
export const categoryTags = {
  all: ['all', 'american football', 'apple', 'athletic shoes', 'badminton', 'baseball', 'basketball', 'beauty', 'beverages', 'blenders', 'casual shoes', 'compact cars', 'cookware', 'cricket', 'dairy', 'dresses', 'earrings', 'fashion accessories', 'football', 'fragrances', 'fruits', 'furniture', 'golf', 'golf', 'handbags', 'home decor', 'kitchen appliances', 'leather watches', 'luxury watches', "men's shirts", 'meat', 'minivans', 'oppo', 'party glasses', 'perfumes', 'personal care', 'realme', 'samsung-galaxy', 'scooters', 'sedans', 'skirts', 'sportbikes', 'sports cars', 'sports cleats', 'suvs', 'sunglasses', 'tablets', 'tennis', 'utensils', 'vegetables', 'vivo', 'watches', 'laptops'],
  groceries: ['all', 'beverages', 'dairy', 'fruits', 'meat', 'vegetables'],
  vehicle: ['all', 'compact cars', 'minivans', 'scooters', 'sedans', 'sportbikes', 'sports cars', 'suvs'],
  sports: ['all', 'american football', 'badminton', 'baseball', 'basketball', 'cricket', 'football', 'golf', 'tennis'],
  kitchen: ['all', 'blenders', 'cookware', 'kitchen appliances', 'utensils'],
  home: ['all', 'furniture', 'home decor'],
  beauty: ['all', 'beauty', 'fragrances','party glasses',  'perfumes', 'personal care', 'sunglasses'],
  smartphones: ['all', 'apple', 'oppo', 'realme', 'samsung-galaxy', 'vivo'],
  laptops: ['all', 'laptops', 'tablets'],
  fashion: ['all', 'athletic shoes', 'casual shoes', 'dresses', 'earrings', 'fashion accessories', 'handbags', 'leather watches', 'luxury watches', "men's shirts", 'skirts', 'sports cleats', 'watches']
};

// Helper function to get tag name
export function getTagName(tagKey) {
  const tags = {
    'fragrances': 'fragrances', 
    'personal care': 'Personal Care', 
    'beauty': 'Beauty', 
    'perfumes': 'Perfumes',
    'sunglasses': 'Sun glasses',
    'party glasses': 'Party Glasses',
    'furniture': 'Furniture',
    'home decor': 'Home Decor',
    'premium': 'Premium',
    'sedans': 'Sedans', 
    'minivans': 'Minivans',
    'suvs': 'Suvs', 
    'compact cars': 'Compact Cars', 
    'sports cars': 'Sports Cars', 
    'sportbikes': 'Sportbikes',
    'scooters': 'Scooters',
    'meat': 'Meat',
    'vegetables': 'Vegetables', 
    'fruits': 'Fruits', 
    'beverages': 'Beverages', 
    'dairy': 'Dairy',
    'american football': 'American Football', 
    'badminton': 'Badminton', 
    'baseball': 'Baseball', 
    'basketball': 'Basketball', 
    'cricket': 'Cricket', 
    'football': 'Football', 
    'golf': 'Golf', 
    'tennis': 'Tennis',
    'apple': 'Apple',
    'oppo': 'Oppo',
    'realme': 'Realme',
    'samsung-galaxy': 'Samsung',
    'tablets': 'Tablets',
    'vivo': 'Vivo',
    'laptops': 'Laptops',
    'blenders': 'Blenders',
    'cookware': 'Cookware',
    'kitchen appliances': 'Kitchen Appliances',
    'utensils': 'Utensils',
    "men's shirts": "Men's Shirts",
    'sports cleats': 'Sports Cleats',
    'athletic shoes': 'Athletic Shoes',
    'casual shoes': 'Casual Shoes',
    'watches': 'Watches',
    'leather watches': 'Leather Watches',
    'luxury watches': 'Luxury Watches',
    'earrings': 'Earrings', 
    'fashion accessories': 'Fashion Accessories', 
    'handbags': 'Handbags',
    'skirts': 'Skirts',
    'dresses': 'Dresses'
  };
  return tags[tagKey] || tagKey;
}

// Helper function to get category name
export function getCategoryName(categoryKey) {
  const categories = {
    'groceries': 'Groceries',
    'vehicle': 'Vehicle',
    'kitchen': 'Kitchen',
    'home': 'Home',
    'beauty': 'Beauty',
    'laptops': 'Laptops',
    'smartphones': 'Phones',
    'sports': 'sports',
    'fashion': 'Fashion'
  };
  return categories[categoryKey] || categoryKey;
}

export function formatCategory(category) {
  if (category == "beauty" || category == "fragrances" || category == "skin-care" || category == "sunglasses") {
    category = "beauty";
  } else if (category == "furniture" || category == "home-decoration") {
    category = "home";
  } else if (category == "sports-accessories") {
    category = "sports";
  } else if (category == "womens-bags" || category == "womens-dresses" || 
             category == "womens-jewellery" || category == "womens-shoes" || 
             category == "womens-watches" || category == "tops" || 
             category == "mens-shirts" || category == "mens-shoes" || 
             category == "mens-watches") {
    category = "fashion";
  } else if (category == "vehicle" || category == "motorcycle") {
    category = "vehicle";
  } else if (category == "smartphones" || category == "mobile-accessories") {
    category = "smartphones";
  } else if (category == "kitchen-accessories") {
    category = "kitchen";
  } else if (category == "laptops" || category == "tablets") {
    category = "laptops";
  }
  return category;
}