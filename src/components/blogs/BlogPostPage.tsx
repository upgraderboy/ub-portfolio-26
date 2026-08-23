"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import AuthorImg from "../../assets/Ankit Bhuria.jpeg";
import "./blogs.css";

const formatPostContent = (html: string): string => {
  if (!html) return "";

  let parsed = html;

  // Regex to match existing/legacy Google Drive preview iframes and capture surrounding attributes
  const driveRegex = /<iframe([^>]*)src="https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/preview"([^>]*)><\/iframe>/g;
  
  parsed = parsed.replace(driveRegex, (match, attrsBefore, fileId, attrsAfter) => {
    const allAttrs = (attrsBefore || "") + (attrsAfter || "");
    
    // If it is a video (contains autoplay or is embedded as video size), skip upgrading
    if (allAttrs.includes("autoplay") || allAttrs.includes("controls")) {
      return match;
    }
    
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return `
      <div class="pdf-container" style="margin: 24px 0;">
        <div class="pdf-download-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background-color: var(--card-color); border: 1px solid var(--border-color); border-radius: 8px 8px 0 0; margin-bottom: 0;">
          <span style="font-weight: 500; color: var(--title-color); display: inline-flex; align-items: center; gap: 8px;"><i class="uil uil-file-alt" style="color: var(--green-color); font-size: 1.2rem;"></i> Shared Document (Google Drive)</span>
          <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" style="padding: 6px 12px; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; background-color: var(--first-color); color: #fff; border-radius: 6px; font-weight: 500;">Download File <i class="uil uil-import"></i></a>
        </div>
        <iframe src="/flipbook/index.html?file=${encodeURIComponent(downloadUrl)}" width="100%" height="600" style="width: 100%; height: 600px; border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 8px 8px; display: block;" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  });

  return parsed;
};

interface BlogPostPageProps {
  blogId: string;
  navigate: (to: string) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogId, navigate }) => {
  const { 
    fetchBlogPost, 
    portfolioData,
    user,
    likeBlogPost,
    unlikeBlogPost,
    checkUserLikedBlogPost,
    fetchBlogPostLikesCount,
    addCommentToBlogPost,
    deleteCommentFromBlogPost,
    fetchBlogPostComments,
    updateCommentInBlogPost,
    replyToCommentInBlogPost
  } = usePortfolioData();

  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments and Likes States
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit Comment States
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [submittingCommentEdit, setSubmittingCommentEdit] = useState(false);

  // Reply States
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyCommentText, setReplyCommentText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Table of Contents States
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  // Scroll Progress Bar Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch article contents on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    let active = true;
    setLoading(true);
    fetchBlogPost(blogId).then((post) => {
      if (active) {
        setBlog(post);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [blogId, portfolioData.blogs, fetchBlogPost]);

  // Parse headings once blog loads
  useEffect(() => {
    if (!blog || loading) return;

    const timer = setTimeout(() => {
      const articleEl = document.querySelector(".blog-post__article");
      if (!articleEl) return;

      const headingEls = articleEl.querySelectorAll("h2, h3");
      const list: { id: string; text: string; level: number }[] = [];

      headingEls.forEach((el, index) => {
        const id = el.id || `heading-${index}`;
        el.id = id;
        list.push({
          id,
          text: el.textContent || "",
          level: el.tagName.toLowerCase() === "h2" ? 2 : 3
        });
      });

      setHeadings(list);
    }, 150);

    return () => clearTimeout(timer);
  }, [blog, loading]);

  // Observer to track which heading is active on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries.filter((entry) => entry.isIntersecting);
        if (visibleHeadings.length > 0) {
          setActiveHeadingId(visibleHeadings[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Hover Copy Code Buttons setup
  useEffect(() => {
    if (!blog || loading) return;

    const timer = setTimeout(() => {
      const articleEl = document.querySelector(".blog-post__article");
      if (!articleEl) return;

      const preElements = articleEl.querySelectorAll("pre");
      preElements.forEach((pre) => {
        if (pre.querySelector(".code-copy-btn")) return;

        pre.style.position = "relative";
        pre.style.paddingTop = "2.5rem"; 
        pre.style.borderRadius = "0.75rem";

        const code = pre.querySelector("code");
        let lang = "code";
        if (code) {
          const className = code.className || "";
          const match = className.match(/language-(\w+)/);
          if (match && match[1]) {
            lang = match[1];
          }
        }

        const headerBar = document.createElement("div");
        headerBar.className = "code-header-bar";
        headerBar.style.position = "absolute";
        headerBar.style.top = "0";
        headerBar.style.left = "0";
        headerBar.style.width = "100%";
        headerBar.style.padding = "0.4rem 1rem";
        headerBar.style.backgroundColor = "rgba(100, 116, 139, 0.12)";
        headerBar.style.borderBottom = "1px solid rgba(100, 116, 139, 0.08)";
        headerBar.style.display = "flex";
        headerBar.style.justifyContent = "space-between";
        headerBar.style.alignItems = "center";
        headerBar.style.borderTopLeftRadius = "0.75rem";
        headerBar.style.borderTopRightRadius = "0.75rem";
        headerBar.style.fontSize = "0.75rem";
        headerBar.style.color = "var(--text-color-light)";
        headerBar.style.textTransform = "uppercase";
        headerBar.style.fontWeight = "600";
        headerBar.innerText = lang;

        const copyBtn = document.createElement("button");
        copyBtn.className = "code-copy-btn";
        copyBtn.style.padding = "2px 8px";
        copyBtn.style.fontSize = "0.7rem";
        copyBtn.style.borderRadius = "4px";
        copyBtn.style.border = "1px solid rgba(100, 116, 139, 0.25)";
        copyBtn.style.background = "transparent";
        copyBtn.style.color = "var(--text-color-light)";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.fontWeight = "600";
        copyBtn.style.display = "inline-flex";
        copyBtn.style.alignItems = "center";
        copyBtn.style.gap = "4px";
        copyBtn.innerHTML = '<i class="uil uil-copy"></i> Copy';

        copyBtn.addEventListener("click", () => {
          const textToCopy = code ? code.innerText : pre.innerText;
          navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.innerHTML = '<i class="uil uil-check" style="color: var(--green-color)"></i> Copied!';
            copyBtn.style.borderColor = "var(--green-color)";
            copyBtn.style.color = "var(--green-color)";
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="uil uil-copy"></i> Copy';
              copyBtn.style.borderColor = "rgba(100, 116, 139, 0.25)";
              copyBtn.style.color = "var(--text-color-light)";
            }, 2000);
          });
        });

        headerBar.appendChild(copyBtn);
        pre.appendChild(headerBar);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [blog, loading]);

  // Load likes and comments once user or blogId shifts
  useEffect(() => {
    let active = true;
    
    const loadCommentsAndLikes = async () => {
      if (!blogId) return;
      try {
        const count = await fetchBlogPostLikesCount(blogId);
        if (active) setLikesCount(count);

        if (user) {
          const hasLiked = await checkUserLikedBlogPost(blogId, user.uid);
          if (active) setLiked(hasLiked);
        } else {
          if (active) setLiked(false);
        }

        const commentsList = await fetchBlogPostComments(blogId);
        if (active) setComments(commentsList);
      } catch (err) {
        console.error("Failed to load interaction metrics:", err);
      }
    };

    loadCommentsAndLikes();
    return () => {
      active = false;
    };
  }, [blogId, user]);

  // Toggle user like status with optimistic UI updates and rule error alerts
  const handleLikeToggle = async () => {
    if (!user) {
      alert("Please login first to like this article!");
      return;
    }
    const originalLiked = liked;
    const originalCount = likesCount;

    try {
      if (liked) {
        setLiked(false);
        setLikesCount(prev => Math.max(prev - 1, 0));
        await unlikeBlogPost(blogId, user.uid);
      } else {
        setLiked(true);
        setLikesCount(prev => prev + 1);
        await likeBlogPost(blogId, user.uid);
      }
    } catch (err: any) {
      console.error("Toggle like failed:", err);
      // Revert states
      setLiked(originalLiked);
      setLikesCount(originalCount);
      alert("Failed to toggle like on Firestore. This is usually caused by database permission rules blocking the write operation on 'blogs/" + blogId + "/likes'. Please check your Firebase Firestore rules.");
    }
  };

  // Add Comment Submit with rule error alerts
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const added = await addCommentToBlogPost(blogId, newCommentText.trim(), user);
      setComments(prev => [...prev, added]);
      setNewCommentText("");
    } catch (err: any) {
      console.error("Add comment failed:", err);
      alert("Failed to submit comment to Firestore. This is usually caused by database permission rules blocking writes on 'blogs/" + blogId + "/comments'. Please verify your Firebase Firestore rules.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Edit Comment Submit
  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentText.trim()) return;
    setSubmittingCommentEdit(true);
    try {
      await updateCommentInBlogPost(blogId, commentId, editingCommentText.trim());
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editingCommentText.trim(), updatedAt: new Date().toISOString() } : c));
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err: any) {
      console.error("Edit comment failed:", err);
      alert("Failed to save changes. Please check your Firestore rules.");
    } finally {
      setSubmittingCommentEdit(false);
    }
  };

  // Submit Reply to Comment
  const handleReplySubmit = async (commentId: string) => {
    if (!user) {
      alert("Please login first to reply!");
      return;
    }
    if (!replyCommentText.trim()) return;
    setSubmittingReply(true);
    try {
      const newReply = await replyToCommentInBlogPost(blogId, commentId, replyCommentText.trim(), user);
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          const currentReplies = c.replies || [];
          return { ...c, replies: [...currentReplies, newReply] };
        }
        return c;
      }));
      setReplyingCommentId(null);
      setReplyCommentText("");
    } catch (err: any) {
      console.error("Submit reply failed:", err);
      alert("Failed to submit reply. Please check your Firestore rules.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Delete Comment Action with rule error alerts
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteCommentFromBlogPost(blogId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err: any) {
      console.error("Delete comment failed:", err);
      alert("Failed to delete comment from Firestore. This is usually caused by database rules blocking deletes on 'blogs/" + blogId + "/comments/" + commentId + "'.");
    }
  };

  // Copy article link to clipboard
  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setShowShareDropdown(false);
    });
  };

  if (loading) {
    return (
      <div className="blog-post__container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div className="portfolio-loader-circle" style={{ borderColor: "rgba(0, 255, 30, 0.1)", borderTopColor: "var(--first-color)" }}></div>
        <div style={{ color: "var(--text-color-light)", marginTop: "1rem" }}>Loading article content...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-post__container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
        <i className="uil uil-exclamation-triangle" style={{ fontSize: "4rem", color: "var(--first-color)", marginBottom: "1.5rem" }}></i>
        <h2 style={{ color: "var(--title-color)", marginBottom: "1rem" }}>Article Not Found</h2>
        <p style={{ color: "var(--text-color-light)", marginBottom: "2rem" }}>The article you are looking for does not exist or has been deleted.</p>
        <button className="blogs__view-all-btn" onClick={() => navigate("/blogs")}>
          Back to Articles
        </button>
      </div>
    );
  }

  // Calculate approximate reading duration
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length : 0;
  const readTime = Math.max(Math.ceil(wordCount / 200), 2);

  // Fetch related articles (excluding current one)
  const relatedPosts = (portfolioData.blogs || [])
    .filter((post: any) => post.id !== blogId)
    .slice(0, 2);

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <>
      {/* Sleek Reading Progress Indicator */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: `${scrollProgress}%`, 
          height: "4px", 
          backgroundColor: "var(--green-color)", 
          zIndex: 9999, 
          transition: "width 0.1s ease" 
        }} 
      />

      <div className="blog-post__container">
        <div className="blog-post__layout-wrapper" style={{ display: "flex", columnGap: "3rem", alignItems: "start", position: "relative" }}>
          <div className="blog-post__main-content" style={{ flex: 1, minWidth: 0 }}>
        {/* Navigation Action Bar */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "2.5rem", 
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <button 
            className="blogs-page__back-btn" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              columnGap: "0.5rem",
              background: "transparent",
              border: "none",
              color: "var(--text-color-light)",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 500,
              padding: 0,
              transition: "color 0.2s"
            }} 
            onClick={() => navigate("/blogs")}
          >
            <i className="uil uil-arrow-left" style={{ fontSize: "1.25rem" }}></i> Back to Articles
          </button>

          {/* Social Share Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                columnGap: "0.5rem",
                background: "rgba(100, 116, 139, 0.08)",
                border: "1px solid rgba(100, 116, 139, 0.15)",
                color: "var(--title-color)",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              onClick={() => setShowShareDropdown(!showShareDropdown)}
            >
              <i className="uil uil-share-alt" style={{ fontSize: "1rem" }}></i> Share Article
            </button>

            {showShareDropdown && (
              <div 
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 0.5rem)",
                  backgroundColor: "var(--container-color)",
                  border: "1px solid rgba(100, 116, 139, 0.15)",
                  borderRadius: "0.75rem",
                  padding: "0.5rem",
                  zIndex: 100,
                  minWidth: "180px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
              >
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-whatsapp" style={{ color: "#25D366", fontSize: "1.1rem" }}></i> WhatsApp
                </a>

                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-linkedin" style={{ color: "#0077B5", fontSize: "1.1rem" }}></i> LinkedIn
                </a>

                <a 
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-twitter" style={{ color: "#1DA1F2", fontSize: "1.1rem" }}></i> Twitter / X
                </a>

                <button 
                  onClick={handleCopyLink}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    background: "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                >
                  <i className="uil uil-copy" style={{ color: "var(--green-color)", fontSize: "1.1rem" }}></i> Copy Link
                </button>
              </div>
            )}

            {copiedLink && (
              <div 
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "calc(100% + 0.5rem)",
                  backgroundColor: "var(--title-color)",
                  color: "var(--container-color)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  zIndex: 200,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                Copied Link!
              </div>
            )}
          </div>
        </div>

        {/* Article Author Profile & Meta Row */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            columnGap: "1rem", 
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(100, 116, 139, 0.15)",
            paddingBottom: "1.5rem"
          }}
        >
          <img 
            src={AuthorImg} 
            alt="Ankit Bhuria" 
            style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%", 
              objectFit: "cover",
              border: "2px solid var(--green-color)"
            }} 
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, color: "var(--title-color)", fontSize: "0.95rem" }}>Ankit Bhuria</span>
            <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-color-light)" }}>
              <span>Published on {blog.date}</span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", columnGap: "0.25rem" }}>
                <i className="uil uil-clock" style={{ color: "var(--green-color)" }}></i> {readTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="blog-post__title" style={{ marginBottom: "1.75rem" }}>{blog.title}</h1>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="blog-post__cover-wrapper" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
            <img src={blog.coverImage} alt={blog.title} className="blog-post__cover" />
          </div>
        )}

        {/* Article Content */}
        <article className="blog-post__article" dangerouslySetInnerHTML={{ __html: formatPostContent(blog.content) }} />

        {/* Dynamic Clapping Reaction & Bottom Share Row */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "4rem", 
            paddingTop: "2rem",
            borderTop: "1px solid rgba(100, 116, 139, 0.15)",
            flexWrap: "wrap",
            gap: "1.5rem"
          }}
        >
          {/* Heart Like Toggle Button */}
          <div style={{ display: "flex", alignItems: "center", columnGap: "0.75rem" }}>
            <button 
              onClick={handleLikeToggle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: liked ? "rgba(239, 68, 68, 0.08)" : "rgba(100, 116, 139, 0.08)",
                border: liked ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(100, 116, 139, 0.15)",
                color: liked ? "#ef4444" : "var(--text-color-light)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none"
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              title={liked ? "Unlike this article" : "Like this article"}
            >
              <svg 
                viewBox="0 0 24 24" 
                width="22" 
                height="22" 
                style={{ 
                  fill: liked ? "#ef4444" : "none", 
                  stroke: liked ? "#ef4444" : "var(--title-color)", 
                  strokeWidth: "2",
                  transition: "all 0.2s ease" 
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--title-color)" }}>
              {likesCount} likes
            </span>
          </div>

          <div style={{ display: "flex", columnGap: "0.5rem" }}>
            <a 
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(37, 211, 102, 0.1)",
                color: "#25D366",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-whatsapp"></i>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(0, 119, 181, 0.1)",
                color: "#0077B5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-linkedin"></i>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(29, 161, 246, 0.1)",
                color: "#1DA1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-twitter"></i>
            </a>
          </div>
        </div>

        {/* Professional Author Signature Bio Card */}
        <div 
          style={{ 
            marginTop: "3rem", 
            padding: "2rem", 
            borderRadius: "1rem", 
            border: "1px solid rgba(100, 116, 139, 0.15)",
            background: "linear-gradient(135deg, rgba(100, 116, 139, 0.03) 0%, rgba(100, 116, 139, 0.08) 100%)",
            display: "flex",
            columnGap: "1.5rem",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: "1.25rem"
          }}
        >
          <img 
            src={AuthorImg} 
            alt="Ankit Bhuria" 
            style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              objectFit: "cover",
              border: "3px solid var(--green-color)"
            }} 
          />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--green-color)", fontWeight: 700, textTransform: "uppercase" }}>Written By</span>
            <h4 style={{ fontSize: "1.25rem", color: "var(--title-color)", margin: "0.15rem 0 0.5rem" }}>Ankit Bhuria</h4>
            <p style={{ fontSize: "var(--small-font-size)", color: "var(--text-color-light)", margin: 0, lineHeight: "1.5" }}>
              Software Developer & Tech Innovator. I write about full-stack web architectures, systems engineering, clean code structures, and learning in public.
            </p>
          </div>
        </div>

        {/* Interactive & Scalable Comments Section */}
        <div style={{ marginTop: "4rem", borderTop: "1px solid rgba(100, 116, 139, 0.15)", paddingTop: "3rem" }}>
          <h3 style={{ fontSize: "1.3rem", color: "var(--title-color)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="uil uil-comments" style={{ color: "var(--green-color)", fontSize: "1.5rem" }}></i> Discussion ({comments.length})
          </h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleAddComment} style={{ display: "flex", flexDirection: "column", rowGap: "0.75rem", marginBottom: "3rem" }}>
              <div style={{ display: "flex", columnGap: "0.75rem", alignItems: "start" }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--green-color)" }} />
                ) : (
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--first-color)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, flexShrink: 0 }}>
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  required
                  rows={3}
                  style={{
                    flexGrow: 1,
                    padding: "0.85rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                    backgroundColor: "var(--container-color)",
                    color: "var(--title-color)",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.5"
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submittingComment || !newCommentText.trim()}
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "var(--green-color)",
                  color: "#fff",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "2rem",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  columnGap: "0.5rem"
                }}
              >
                {submittingComment && (
                  <div className="portfolio-loader-circle" style={{ width: "14px", height: "14px", borderWidth: "2px", borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                )}
                Post Comment
              </button>
            </form>
          ) : (
            <div 
              style={{ 
                padding: "2rem", 
                borderRadius: "0.75rem", 
                border: "1px dashed rgba(100, 116, 139, 0.25)", 
                textAlign: "center", 
                background: "rgba(100, 116, 139, 0.02)",
                marginBottom: "3rem"
              }}
            >
              <i className="uil uil-lock" style={{ fontSize: "2rem", color: "var(--text-color-light)", marginBottom: "0.5rem", display: "inline-block" }}></i>
              <p style={{ margin: "0 0 1rem 0", color: "var(--text-color-light)", fontSize: "0.9rem" }}>Please log in to participate in the discussion.</p>
              <button
                type="button"
                onClick={() => {
                  const event = new CustomEvent("open-auth-modal");
                  window.dispatchEvent(event);
                }}
                style={{
                  background: "var(--first-color)",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "2rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Log In / Register
              </button>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
              {comments.map((comment) => {
                const isOwnComment = user && user.uid === comment.userId;
                const isAuthorComment = comment.userName === "Ankit Bhuria" || comment.userId === "mock-google-id" || comment.userId?.includes("mock-google");
                const isEditing = editingCommentId === comment.id;
                
                return (
                  <div 
                    key={comment.id}
                    style={{
                      display: "flex",
                      columnGap: "1rem",
                      alignItems: "start",
                      paddingBottom: "1.5rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)"
                    }}
                  >
                    {comment.userPhoto ? (
                      <img src={comment.userPhoto} alt={comment.userName} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "var(--first-color)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 700, flexShrink: 0 }}>
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div style={{ flexGrow: 1 }}>
                      {/* Comment Header metadata */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, color: "var(--title-color)", fontSize: "0.9rem" }}>{comment.userName}</span>
                          {isAuthorComment && (
                            <span style={{ backgroundColor: "rgba(1, 195, 105, 0.1)", color: "var(--green-color)", fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>Author</span>
                          )}
                          <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)" }}>
                            {new Date(comment.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>

                        {/* Actions buttons */}
                        <div style={{ display: "flex", alignItems: "center", columnGap: "0.75rem" }}>
                          {user && (
                            <button
                              onClick={() => {
                                setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id);
                                setReplyCommentText("");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--text-color-light)",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                columnGap: "0.25rem"
                              }}
                            >
                              <i className="uil uil-comment-share" style={{ fontSize: "1rem" }}></i> Reply
                            </button>
                          )}

                          {isOwnComment && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentText(comment.text);
                                }}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "var(--text-color-light)",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  columnGap: "0.25rem"
                                }}
                              >
                                <i className="uil uil-edit" style={{ fontSize: "0.95rem" }}></i> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "rgba(239, 68, 68, 0.7)",
                                  cursor: "pointer",
                                  fontSize: "1.1rem",
                                  padding: "0.25rem",
                                  transition: "color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(239, 68, 68, 0.7)"}
                                title="Delete comment"
                              >
                                <i className="uil uil-trash-alt"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Comment text body (Edit mode vs Read mode) */}
                      {isEditing ? (
                        <div style={{ marginTop: "0.5rem" }}>
                          <textarea
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                            rows={3}
                            style={{
                              width: "100%",
                              padding: "0.6rem 0.8rem",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(100, 116, 139, 0.2)",
                              backgroundColor: "var(--container-color)",
                              color: "var(--title-color)",
                              fontSize: "0.9rem",
                              outline: "none",
                              resize: "none",
                              fontFamily: "inherit"
                            }}
                          />
                          <div style={{ display: "flex", columnGap: "0.5rem", marginTop: "0.5rem" }}>
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingCommentText("");
                              }}
                              style={{
                                padding: "0.4rem 1rem",
                                borderRadius: "2rem",
                                border: "1px solid rgba(100, 116, 139, 0.2)",
                                background: "transparent",
                                color: "var(--text-color-light)",
                                cursor: "pointer",
                                fontSize: "0.75rem"
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateComment(comment.id)}
                              disabled={submittingCommentEdit || !editingCommentText.trim()}
                              style={{
                                padding: "0.4rem 1rem",
                                borderRadius: "2rem",
                                border: "none",
                                background: "var(--green-color)",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: 600
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ margin: "0.35rem 0 0 0", color: "var(--text-color)", fontSize: "0.9rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                          {comment.text}
                        </p>
                      )}

                      {/* Nested Replies List */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem", marginTop: "1rem", paddingLeft: "1.5rem", borderLeft: "2px solid rgba(100, 116, 139, 0.1)" }}>
                          {comment.replies.map((reply: any) => {
                            const isAuthorReply = reply.userName === "Ankit Bhuria" || reply.userId === "mock-google-id" || reply.userId?.includes("mock-google");
                            return (
                              <div key={reply.id} style={{ display: "flex", columnGap: "0.75rem", alignItems: "start" }}>
                                {reply.userPhoto ? (
                                  <img src={reply.userPhoto} alt={reply.userName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--first-color)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                                    {reply.userName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div style={{ flexGrow: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 600, color: "var(--title-color)", fontSize: "0.85rem" }}>{reply.userName}</span>
                                    {isAuthorReply && (
                                      <span style={{ backgroundColor: "rgba(1, 195, 105, 0.1)", color: "var(--green-color)", fontSize: "0.55rem", padding: "0.1rem 0.3rem", borderRadius: "3px", fontWeight: 700, textTransform: "uppercase" }}>Author</span>
                                    )}
                                    <span style={{ fontSize: "0.7rem", color: "var(--text-color-light)" }}>
                                      {new Date(reply.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                  </div>
                                  <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-color)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                                    {reply.text}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingCommentId === comment.id && (
                        <div style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
                          <form 
                            onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id); }} 
                            style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
                          >
                            <textarea 
                              value={replyCommentText} 
                              onChange={(e) => setReplyCommentText(e.target.value)} 
                              placeholder="Write a reply..."
                              required
                              rows={2}
                              style={{
                                width: "100%",
                                padding: "0.6rem 0.85rem",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(100, 116, 139, 0.2)",
                                backgroundColor: "var(--container-color)",
                                color: "var(--title-color)",
                                fontSize: "0.85rem",
                                outline: "none",
                                resize: "none",
                                fontFamily: "inherit"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", columnGap: "0.5rem" }}>
                              <button 
                                type="button" 
                                onClick={() => setReplyingCommentId(null)}
                                style={{
                                  padding: "0.4rem 1rem",
                                  fontSize: "0.75rem",
                                  borderRadius: "2rem",
                                  border: "1px solid rgba(100, 116, 139, 0.2)",
                                  backgroundColor: "transparent",
                                  color: "var(--text-color-light)",
                                  cursor: "pointer"
                                }}
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                disabled={submittingReply || !replyCommentText.trim()}
                                style={{
                                  padding: "0.4rem 1rem",
                                  fontSize: "0.75rem",
                                  borderRadius: "2rem",
                                  border: "none",
                                  backgroundColor: "var(--green-color)",
                                  color: "#fff",
                                  cursor: "pointer",
                                  fontWeight: 600
                                }}
                              >
                                Submit Reply
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-color-light)", fontSize: "0.9rem" }}>
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>

        {/* Read Next / Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: "4.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--title-color)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="uil uil-book-open" style={{ color: "var(--green-color)" }}></i> Read Next
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {relatedPosts.map((post: any) => (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/blogs/${post.id}`)}
                  style={{
                    backgroundColor: "var(--container-color)",
                    border: "1px solid rgba(100, 116, 139, 0.15)",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.25s, border-color 0.25s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--green-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(100, 116, 139, 0.15)";
                  }}
                >
                  {post.coverImage && (
                    <div style={{ height: "150px", overflow: "hidden" }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", marginBottom: "0.5rem" }}>{post.date}</span>
                    <h4 style={{ fontSize: "1rem", color: "var(--title-color)", margin: "0 0 0.5rem", lineHeight: "1.4", fontWeight: 600 }}>{post.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-color-light)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>

          {/* Sticky Table of Contents Sidebar */}
          {headings.length > 0 && (
            <aside 
              className="blog-post__toc-sidebar"
              style={{
                width: "220px",
                position: "sticky",
                top: "100px",
                display: "none", 
                flexDirection: "column",
                rowGap: "0.85rem",
                flexShrink: 0,
                maxHeight: "calc(100vh - 140px)",
                overflowY: "auto",
                padding: "0.25rem 0.5rem"
              }}
            >
              <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--title-color)", fontWeight: 700, letterSpacing: "1px", marginBottom: "0.5rem", borderBottom: "1px solid rgba(100,116,139,0.1)", paddingBottom: "0.5rem" }}>
                On This Page
              </h4>
              <nav style={{ display: "flex", flexDirection: "column", rowGap: "0.65rem" }}>
                {headings.map((h) => (
                  <a 
                    key={h.id} 
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveHeadingId(h.id);
                    }}
                    style={{
                      fontSize: h.level === 2 ? "0.85rem" : "0.78rem",
                      paddingLeft: h.level === 3 ? "1rem" : "0",
                      color: activeHeadingId === h.id ? "var(--green-color)" : "var(--text-color-light)",
                      fontWeight: activeHeadingId === h.id ? 700 : 500,
                      textDecoration: "none",
                      lineHeight: "1.4",
                      transition: "all 0.2s"
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
