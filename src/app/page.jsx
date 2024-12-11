"use client";
import { useState, useRef, useEffect } from "react";
import { FileUpload } from "./file-upload";
import { BackgroundBeams } from "./background-beams";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API;


  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to check if we're on the client

  const inputRef = useRef(null); // Reference for file input

  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted on the client
  }, []);

  const handleFileUpload = (files) => setFile(files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload the file and get the URL
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;

        // Step 2: Shorten the URL using your sho-rt-ly API
        const shortenRes = await fetch(`${apiUrl}/shorten`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ originalUrl: uploadedUrl }),
        });

        if (shortenRes.ok) {
          const shortenData = await shortenRes.json();
          setUrl(`${apiUrl}/${shortenData.shortUrl}`);
        } else {
          console.error("Failed to shorten URL");
          setUrl(uploadedUrl); // Use the original URL if shortening fails
        }
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("An error occurred during the upload process:", error);
    } finally {
      // Reset states
      setIsUploading(false);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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
    setUrl(""); // Reset file when cancel is triggered
  };

  // Only render the component if we're on the client
  if (!isClient) {
    return null; // Or a loading spinner/message
  }

  return (
    <div className="flex justify-center items-center h-[100vh] bg-neutral-950 relative">
      <div className="w-full z-20 max-w-2xl p-4 -mt-32 ">
        <h1 className="relative p-8 z-10 text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          NextShare
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-2 text-base text-center relative z-10">
          A Secure and Seamless File Sharing App.<br></br> Upload files (up to
          100MB), share an encrypted link, and let nextShare ensure your files
          are auto-deleted in 24 hours <br></br>Privacy Guaranteed !
        </p>
        <div className="flex flex-col items-center justify-center mt-8">
          <FileUpload onChange={handleFileUpload} ref={inputRef} onCancel={handleCancelFile} />
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
          {url && (
            <div className="mt-8 flex flex-col md:flex-row items-center space-x-4 md:space-x-4">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-grow rounded-lg py-2 px-4 border border-neutral-800 focus:ring-2 focus:ring-teal-500 bg-neutral-950 text-white placeholder:text-neutral-700 transition duration-300"
                style={{
                  minWidth: `${Math.max(250, url.length * 8)}px`,
                }}
                placeholder="Your file URL will appear here"
              />
              <button
                onClick={handleCopy}
                className="mt-4 md:mt-0 p-2 px-6 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition duration-300 shadow-md"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
