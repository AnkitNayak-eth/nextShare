"use client";
import { useState, useRef, useEffect } from "react";
import { FileUpload } from "./file-upload";
import { BackgroundBeams } from "./background-beams";
import { QRCodeCanvas } from "qrcode.react";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API;

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state

  const inputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileUpload = (files) => setFile(files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;

        const shortenRes = await fetch(`${apiUrl}/shorten`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ originalUrl: uploadedUrl }),
        });

        if (shortenRes.ok) {
          const shortenData = await shortenRes.json();
          setUrl(`${apiUrl}/${shortenData.shortUrl}`);
        } else {
          setUrl(uploadedUrl); // Fallback to original URL
        }
        setShowModal(true); // Open modal on success
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("An error occurred during the upload process:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
  };

  const handleCancelFile = () => {
    setUrl("");
  };

  const handleGenerateMore = () => {
    // Reset states for a new upload
    setFile(null);
    setUrl("");
    setShowModal(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (!isClient) return null;

  const footerLinks = [
    {
      icon: <FaLinkedin className="h-6 w-6 " />,
      href: "https://www.linkedin.com/in/ankitnayaketh/",
    },
    {
      icon: <FaTwitter className="h-6 w-6 " />,
      href: "https://x.com/AnkitNayak_eth",
    },
    {
      icon: <FaGithub className="h-6 w-6 " />,
      href: "https://github.com/AnkitNayak-eth",
    },
  ];

  return (
    <div className="flex justify-center items-center h-[100vh] bg-neutral-950 relative font-mono">
      <div className="w-full z-20 max-w-2xl p-4 -mt-32 ">
        <h1 className="relative p-8 z-10 text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          NextShare
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-2 text-base text-center relative z-10">
          A Secure and Seamless File Sharing App.<br></br> Upload files (up to
          100MB), Files expire automatically within 24 hours, ensuring privacy
          and safety.
        </p>
        <div className="flex flex-col items-center justify-center mt-8">
          <FileUpload
            onChange={handleFileUpload}
            ref={inputRef}
            onCancel={handleCancelFile}
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`mt-4 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center ${
              isUploading || !file
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-indigo-600 border-solid rounded-full"></span>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
          <nav className="flex flex-row m-8 items-center gap-8">
          {footerLinks.map((link, index) => (
            <a
              href={link.href}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transform hover:scale-150 transition-transform duration-300 ease-in-out"
            >
              <span>{link.icon}</span>
            </a>
          ))}
        </nav>
        </div>
        
      </div>

      {showModal && (
        <div className="fixed flex inset-0 bg-black bg-opacity-60 justify-center items-center z-50">
          <BackgroundBeamsWithCollision className="flex-col relative w-full h-full  bg-black p-6 rounded-2xl shadow-2xl max-w-md overflow-hidden animate-border-color">
            {/* Modal Header */}
            <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
              File Uploaded Successfully!
            </h2>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="p-[0.4rem] bg-white rounded-lg shadow-md">
                <QRCodeCanvas value={url} size={160} className="rounded" />
              </div>
            </div>

            {/* URL and Message */}
            <p className="text-white text-sm text-center mb-6 leading-relaxed">
              Your file has been uploaded, and a shareable link has been
              generated. Copy the link or scan the QR code to access the file.
            </p>
            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-center font-mono text-sm text-black break-all">
                <strong>🔗 URL:</strong> {url}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handleCopy}
                className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition duration-300"
              >
                📋 Copy URL
              </button>
              <button
                onClick={handleGenerateMore}
                className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-300"
              >
                ➕ Upload Another
              </button>
            </div>
          </BackgroundBeamsWithCollision>
        </div>
      )}

      <BackgroundBeams />
    </div>
  );
}
