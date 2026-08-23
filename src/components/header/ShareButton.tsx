// import { useEffect, useState } from 'react';
// import logo from "../../assets/upgraderboy_dark.svg";
// import "./header.css";

// const ShareButton: React.FC = () => {
//   const [isMac, setIsMac] = useState(false);
//   const [isWindows, setIsWindows] = useState(false);
//   const [canonicalHref, setCanonicalHref] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch canonical URL when component mounts
//     const canonical = document.querySelector('link[rel="canonical"]');
//     setIsMac(/Mac|iPhone/.test(navigator.platform));
//     setIsWindows(/Win/.test(navigator.platform));
//     setCanonicalHref(canonical?.href);
//   }, []); // No dependencies, runs once on mount

//   function getMetaDescription(): string {
//     // Get meta description from document
//     const metaTags = document.getElementsByTagName('meta');
//     for (let i = 0; i < metaTags.length; i++) {
//       if (metaTags[i].getAttribute('name') === 'description') {
//         return metaTags[i].getAttribute('content')?.slice(0, 190) || '';
//       }
//     }
//     return '';
//   }

//   const handleClick = async () => {
//     const title = document.title;
//     const text = getMetaDescription();
//     const logoUrl = logo;
//     const url = canonicalHref || window.location.href;

//     if ('share' in navigator) {
//       try {
//         await navigator.share({
//           url,
//           icon: logoUrl,
//           text,
//           title,
//         });
//         return;
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error(err.name, err.message);
//         }
//       }
//     }

//     // Fallback to open a new window if sharing API is not supported
//     const shareURL = new URL('https://www.addtoany.com/share');
//     shareURL.searchParams.append('url', url);
//     shareURL.searchParams.append('title', title);
//     shareURL.searchParams.append('description', text);
//     shareURL.searchParams.append('image', logoUrl);
//     window.open(shareURL.toString(), '_blank', 'popup,noreferrer,noopener');
//   };

//   return (
//     <button onClick={handleClick} className='sign' aria-label="Share this page">
//       <span>Share {" "}</span>
//       <i className={`icon uil-share${isMac ? '-apple' : (isWindows ? '-windows' : '')}`}></i>
//     </button>
//   );
// };

// export default ShareButton;
