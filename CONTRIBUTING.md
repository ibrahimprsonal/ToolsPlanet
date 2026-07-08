git config --list

git branch --show-current

git branch -a


# ToolsPlanet - Developer Guide

হ্যালো! **ToolsPlanet** প্রোজেক্টে কাজ করার জন্য এই গাইডটি তৈরি করা হয়েছে। এই সাইটটি একটি "Micro-frontend" আর্কিটেকচার ফলো করে তৈরি করা হয়েছে, যাতে আপনি খুব সহজেই অন্য কোড নষ্ট না করে নতুন টুল যোগ করতে পারেন।

নিচের নিয়মগুলো ফলো করলে খুব সহজেই আপনি এই সাইটে কাজ করতে পারবেন।

---

## 1. Architecture: How the Site Works

এই সাইটের মূল কাঠামো ৩টি অংশে বিভক্ত:

১. **`index.html` এবং `style.css`**: এটি হলো মূল ওয়েবসাইট বা ফ্রেম (শেল), যেখানে সার্চ বার এবং নেভিগেশন আছে।
২. **`tools-list.js`**: এটি হলো আমাদের ডাটাবেস! এখানে একটি `TOOLS_LIST` অ্যারে (array) আছে, যেখানে আমাদের সব টুলের লিস্ট রাখা হয়।
৩. **`tools/` ফোল্ডার**: এটি হলো সবচেয়ে গুরুত্বপূর্ণ ফোল্ডার। আমাদের ওয়েবসাইটের প্রতিটি টুল (যেমন: ক্যালকুলেটর) এই ফোল্ডারের ভেতর সম্পূর্ণ আলাদা একটি পেজ হিসেবে থাকে।

---

## 2. How to Add a New Tool

নতুন টুল যোগ করা খুবই সহজ! শুধু নিচের ৩টি ধাপ ফলো করুন:

### ধাপ ১: টুলের জন্য ফোল্ডার তৈরি করুন
`tools/` ডিরেক্টরির ভেতর আপনার নতুন টুলের জন্য একটি ফোল্ডার তৈরি করুন। 
ধরুন আপনি একটি "Stopwatch" বানাতে চান। তাহলে ফোল্ডারের নাম দিন `tools/stopwatch/`।

### ধাপ ২: কোড লিখুন
ওই ফোল্ডারের ভেতর আপনার টুলের `index.html` ফাইল তৈরি করুন (সাথে চাইলে `style.css` ও `script.js` রাখতে পারেন)।

**⚠️ খুব গুরুত্বপূর্ণ:** আপনার টুলের `index.html` ফাইলে থিম এবং "Back" বাটন ঠিক রাখতে নিচের কোডগুলো ব্যবহার করবেন:

১. `<head>` এর ভেতর মূল সিএসএস ফাইলটি লিঙ্ক করুন:
```html
<link rel="stylesheet" href="../../style.css">
```

২. `<body>` এর ঠিক নিচে ব্যাকগ্রাউন্ড ডিজাইন এবং ব্যাক বাটনটি দিন:
```html
<!-- Background and Back Button -->
<a href="../../index.html" style="position: absolute; top: 20px; left: 20px; text-decoration: none; color: var(--text-secondary); background: var(--surface-color); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 6px; font-size: 0.9rem; transition: all 0.2s; display: flex; align-items: center; gap: 8px; z-index: 100;"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
```

### ধাপ ৩: টুলটি ওয়েবসাইটে রেজিস্টার করুন
এখন মেইন ফোল্ডারে থাকা `tools-list.js` ফাইলটি ওপেন করুন। সেখানে `TOOLS_LIST` এর ভেতরে আপনার টুলের তথ্য যোগ করে দিন।

উদাহরণ:
```javascript
const TOOLS_LIST = [
    { id: 'coming-soon', name: 'Coming Soon', icon: 'fa-solid fa-hourglass-half', desc: 'More amazing tools are on the way!' },
    { id: 'calculator', name: 'Calculator', icon: 'fa-solid fa-calculator', desc: 'A simple and beautiful calculator.' },
    // Add your new tool here:
    { id: 'stopwatch', name: 'Stopwatch', icon: 'fa-solid fa-stopwatch', desc: 'Track your time easily.' }
];
```
*(এখানে `id` এর জায়গায় ঠিক ওই নামটাই দেবেন, যে নামে আপনি `tools/` এর ভেতর ফোল্ডারটি বানিয়েছেন)*

ব্যাস! ওয়েবসাইটে ঢুকে দেখুন আপনার নতুন টুলটি সার্চ বার এবং হোম পেজে অটোমেটিক চলে এসেছে!

---

## 3. How to Remove a Tool

১. প্রথমে `tools/` ফোল্ডার থেকে ওই টুলের ফোল্ডারটি ডিলিট করে দিন।
২. এরপর `tools-list.js` ফাইল থেকে ওই টুলের লাইনটি মুছে ফেলুন।

---

## 4. Git Daily Workflow

আমরা সরাসরি `main` ব্রাঞ্চে কাজ করবো না। যখনই নতুন কোনো টুল বানাবেন, নিচে দেওয়া এই স্টেপগুলো হুবহু ফলো করবেন, তাহলে আপনাদের কোড কখনো হারাবে না বা কনফ্লিক্ট হবে না।

### কাজ শুরু করার আগে (প্রতিদিন)
১. **মেইন কোড আপডেট করে নিন:** 
   টার্মিনাল খুলে প্রথমে মেইন ব্রাঞ্চে যান এবং লেটেস্ট কোড গিটহাব থেকে নামিয়ে নিন।
   ```bash
   git checkout main
   git pull origin main
   ```

২. **নতুন ব্রাঞ্চ তৈরি করুন:**
   ধরুন আপনি একটি "Weather App" বানাতে চান। তাহলে টার্মিনালে লিখবেন:
   ```bash
   git checkout -b make-weather-app
   ```
   *(stopwatch, weather-app ইত্যাদি এর জায়গায় আপনার টুলের নাম দিন)*

### কাজ চলাকালীন
- `tools/` ফোল্ডারের ভেতর আপনার টুলের নামে ফোল্ডার বানিয়ে কাজ করুন।
- থিম ঠিক রাখার জন্য `style.css` লিংক করুন এবং `Back to Home` বাটন অ্যাড করুন (ওপরে নিয়ম দেওয়া আছে)।
- `tools-list.js`-এ আপনার টুলের নাম যোগ করুন।

### কাজ শেষ হলে (সেভ এবং পুশ)
১. **সেভ ও গিটহাবে পুশ করুন:**
   ```bash
   git add .
   git commit -m "Added a new awesome tool"
   git push origin <আপনার-ব্রাঞ্চের-নাম>
   ```

২. **Pull Request (PR) তৈরি করুন:**
   গিটহাব ওয়েবসাইটে গেলে আপনারা **"Compare & pull request"** নামের একটি অপশন পাবেন। সেখানে ক্লিক করে PR তৈরি করুন।

৩. **মার্জ (Merge) করুন:**
   সব ঠিক থাকলে PR টি `main` ব্রাঞ্চে মার্জ করে দিন। এতে করে লাইভ ওয়েবসাইটে টুলটি চলে যাবে!

৪. **আবার নতুন কাজ শুরু করতে চাইলে:**
   মার্জ হওয়ার পর আবার এই গাইডের **"কাজ শুরু করার আগে"** সেকশনের ১ নাম্বার পয়েন্ট থেকে শুরু করুন (অর্থাৎ `checkout main` এবং `pull origin main` করে নেবেন)।

---
কোনো কিছু বুঝতে অসুবিধা হলে, `tools/calculator/index.html` ফাইলটি ওপেন করে দেখতে পারেন যে সেটি কীভাবে কাজ করছে। Happy Coding!
