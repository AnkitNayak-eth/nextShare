# **nextShare**

**nextShare** is a sleek file-sharing platform built with Next.js 15. Upload files up to 100MB, generate secure shareable links, and access them via QR codes or shortened URLs. Files expire within 24 hours, ensuring privacy and security. Powered by Cloudinary and MongoDB, it’s responsive, fast, and user-friendly.

![Screenshot of nextShare](https://github.com/user-attachments/assets/750ef5b4-2d72-4585-bd39-1f3d8dbea207)

---

## ✨ Features

- **File Uploads**: Users can upload files of up to **100MB**.
- **Cloudinary Integration**: Files are securely stored in Cloudinary.
- **Shareable Links**: Generate downloadable links for uploaded files.
- **QR Code Integration**: View a QR code for quick access to the uploaded file.
- **Link Shortening**: The app uses a pre-built **link-shortening API** project for efficient and reliable shortening.
- **Auto Expiry**: Files and their links expire after 24 hours.
- **Responsive Design**: Optimized for all devices using **Tailwind CSS**.
- **Enhanced UX**: Modern animations powered by **Framer Motion**.

---

## 🛠️ Technologies Used

- **Frontend**: React 18.3 with Next.js 15
- **Backend**: API routes in Next.js with MongoDB for logging
- **Styling**: Tailwind CSS
- **File Handling**: Cloudinary and Formidable
- **Utilities**: Link shortening logic (powered by your [link-shortening API project](https://github.com/AnkitNayak-eth/Trim-it-url-shortener)), file type validation, and QR code generation using `qrcode.react`
- **State Management**: Lightweight and local with React hooks
- **Deployment**: Ready to deploy on Vercel or other Node.js platforms

---

## 📜 License
This project is licensed under the MIT License. Feel free to use, modify, and distribute.

---

## 🙌 Acknowledgments
- **Next.js** for the full-stack framework
- **Cloudinary** for seamless file management
- **Tailwind CSS** for styling simplicity
- **MongoDB** for backend data management
- **qrcode.react** for generating QR codes
- Your **link-shortening API project** for enhancing usability

---

Enjoy sharing files securely with **nextShare**! 🚀
