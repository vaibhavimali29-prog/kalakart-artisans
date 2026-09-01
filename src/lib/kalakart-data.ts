import vase from "@/assets/p-vase.jpg";
import madhubani from "@/assets/p-madhubani.jpg";
import basket from "@/assets/p-basket.jpg";
import saree from "@/assets/p-saree.jpg";
import wood from "@/assets/p-wood.jpg";
import jewelry from "@/assets/p-jewelry.jpg";

export const images = { vase, madhubani, basket, saree, wood, jewelry };

export type ProductStatus = "Published" | "Draft" | "Out of Stock";

export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  stock: number;
  status: ProductStatus;
  image: string;
  craft: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Handcrafted Terracotta Vase",
    price: 850,
    rating: 4.8,
    stock: 12,
    status: "Published",
    image: vase,
    craft: "Pottery",
  },
  {
    id: "p2",
    name: "Madhubani Painting",
    price: 2400,
    rating: 4.9,
    stock: 4,
    status: "Published",
    image: madhubani,
    craft: "Folk Art",
  },
  {
    id: "p3",
    name: "Bamboo Storage Basket",
    price: 650,
    rating: 4.6,
    stock: 20,
    status: "Published",
    image: basket,
    craft: "Weaving",
  },
  {
    id: "p4",
    name: "Handwoven Silk Saree",
    price: 5600,
    rating: 5.0,
    stock: 2,
    status: "Published",
    image: saree,
    craft: "Textile",
  },
  {
    id: "p5",
    name: "Rosewood Sculpture",
    price: 3200,
    rating: 4.7,
    stock: 0,
    status: "Out of Stock",
    image: wood,
    craft: "Wood Craft",
  },
  {
    id: "p6",
    name: "Oxidised Jhumka Set",
    price: 1499,
    rating: 4.8,
    stock: 8,
    status: "Draft",
    image: jewelry,
    craft: "Jewellery",
  },
];

export type OrderStatus =
  | "New Order"
  | "Processing"
  | "Ready to Ship"
  | "Shipped"
  | "Delivered";

export type Order = {
  id: string;
  product: string;
  image: string;
  buyer: string;
  qty: number;
  price: number;
  date: string;
  status: OrderStatus;
};

export const orders: Order[] = [
  {
    id: "KK-2841",
    product: "Handcrafted Terracotta Vase",
    image: vase,
    buyer: "Ananya Sharma",
    qty: 2,
    price: 1700,
    date: "28 Aug 2026",
    status: "New Order",
  },
  {
    id: "KK-2838",
    product: "Bamboo Storage Basket",
    image: basket,
    buyer: "Rahul Verma",
    qty: 1,
    price: 650,
    date: "26 Aug 2026",
    status: "Processing",
  },
  {
    id: "KK-2830",
    product: "Madhubani Painting",
    image: madhubani,
    buyer: "Meera Iyer",
    qty: 1,
    price: 2400,
    date: "22 Aug 2026",
    status: "Ready to Ship",
  },
  {
    id: "KK-2811",
    product: "Handwoven Silk Saree",
    image: saree,
    buyer: "Kavya Nair",
    qty: 1,
    price: 5600,
    date: "18 Aug 2026",
    status: "Shipped",
  },
  {
    id: "KK-2790",
    product: "Oxidised Jhumka Set",
    image: jewelry,
    buyer: "Simran Kaur",
    qty: 3,
    price: 4497,
    date: "11 Aug 2026",
    status: "Delivered",
  },
];

export const statusTone: Record<OrderStatus, string> = {
  "New Order": "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-gold-foreground",
  "Ready to Ship": "bg-accent text-accent-foreground",
  Shipped: "bg-maroon/12 text-maroon",
  Delivered: "bg-leaf/15 text-leaf",
};

export type Inquiry = {
  id: string;
  buyer: string;
  product: string;
  image: string;
  message: string;
  time: string;
  aiReply: string;
};

export const inquiries: Inquiry[] = [
  {
    id: "i1",
    buyer: "Ananya Sharma",
    product: "Bamboo Storage Basket",
    image: basket,
    message: "Can you make this basket in a larger size?",
    time: "12 min ago",
    aiReply:
      "Namaste Ananya! Yes, I can weave this basket in a larger size (about 18 inches tall). It takes 4–5 days to make and would be priced around ₹950. Would you like me to start one for you?",
  },
  {
    id: "i2",
    buyer: "Rahul Verma",
    product: "Handcrafted Terracotta Vase",
    image: vase,
    message: "Is the vase waterproof? I want to keep fresh flowers in it.",
    time: "2 hours ago",
    aiReply:
      "Thank you for asking, Rahul! The vase is sealed with a natural food-safe coating on the inside, so it holds water well and is perfect for fresh flowers.",
  },
  {
    id: "i3",
    buyer: "Meera Iyer",
    product: "Madhubani Painting",
    image: madhubani,
    message: "Do you take custom orders with our family names painted?",
    time: "Yesterday",
    aiReply:
      "Namaste Meera! Yes, I do custom Madhubani work including names and motifs of your choice. Custom pieces take 8–10 days and start at ₹2,800. Shall I share a few design options?",
  },
  {
    id: "i4",
    buyer: "Kavya Nair",
    product: "Handwoven Silk Saree",
    image: saree,
    message: "What is the delivery time to Kochi?",
    time: "2 days ago",
    aiReply:
      "Hello Kavya! Delivery to Kochi usually takes 4–6 days after dispatch, and the saree ships within 24 hours of your order.",
  },
];

export const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
