"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { initialPortfolioData, PortfolioData } from "./portfolioDb";

interface PortfolioContextType {
  portfolioData: PortfolioData;
  isLoading: boolean;
  user: any | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateHomeAbout: (homeData: PortfolioData["home"], aboutData: PortfolioData["about"]) => void;
  updateSkills: (skillsData: PortfolioData["skills"]) => void;
  updateServices: (servicesData: PortfolioData["services"]) => void;
  updateQualification: (qualificationData: PortfolioData["qualification"]) => void;
  updateProjects: (projectsData: PortfolioData["projects"]) => void;
  updateTestimonials: (testimonialsData: PortfolioData["testimonials"]) => void;
  updateMemories: (memoriesData: PortfolioData["memories"]) => void;
  updateBlogs: (blogsData: NonNullable<PortfolioData["blogs"]>) => void;
  updateSeo: (seoData: NonNullable<PortfolioData["seo"]>) => void;
  updateResources: (resourcesData: NonNullable<PortfolioData["resources"]>) => void;
  updateResourceCategories: (categoriesData: NonNullable<PortfolioData["resourceCategories"]>) => void;
  updateTerminalCommands: (commandsData: NonNullable<PortfolioData["terminalCommands"]>) => void;
  
  // Dynamic query optimized fetchers (rely on pre-loaded portfolioData)
  fetchProjects: (limitCount?: number) => Promise<any[]>;
  fetchMemories: (limitCount?: number) => Promise<any[]>;
  fetchBlogs: (limitCount?: number) => Promise<any[]>;
  fetchBlogPost: (id: string) => Promise<any | null>;

  // Comments and Likes Scalable Actions
  likeBlogPost: (blogId: string, userId: string) => Promise<void>;
  unlikeBlogPost: (blogId: string, userId: string) => Promise<void>;
  checkUserLikedBlogPost: (blogId: string, userId: string) => Promise<boolean>;
  fetchBlogPostLikesCount: (blogId: string) => Promise<number>;
  addCommentToBlogPost: (blogId: string, text: string, user: any) => Promise<any>;
  deleteCommentFromBlogPost: (blogId: string, commentId: string) => Promise<void>;
  fetchBlogPostComments: (blogId: string) => Promise<any[]>;
  updateCommentInBlogPost: (blogId: string, commentId: string, text: string) => Promise<void>;
  replyToCommentInBlogPost: (blogId: string, commentId: string, replyText: string, user: any) => Promise<any>;
  subscribeToNewsletter: (email: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: React.ReactNode;
  initialData?: PortfolioData;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children, initialData }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData || initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Initialize Auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback local mock user for testing if Firebase is blocked or offline
      const mockUser = localStorage.getItem("portfolio_mock_user");
      if (mockUser) {
        try {
          setUser(JSON.parse(mockUser));
        } catch (e) {
          localStorage.removeItem("portfolio_mock_user");
        }
      }
      setAuthLoading(false);
    }
  }, []);

  // Fetch complete portfolio data on mount from Neon PostgreSQL API Server
  useEffect(() => {
    if (initialData) {
      setIsLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const response = await fetch("/api/portfolio-data");
        if (!response.ok) throw new Error("Failed to load portfolio data from backend API");
        const merged = await response.json();
        setPortfolioData(merged);
        localStorage.setItem("portfolio_cached_data", JSON.stringify(merged));
        console.log("Portfolio data loaded successfully from Neon PostgreSQL.");
      } catch (err) {
        console.error("Failed to load portfolio data, falling back to local storage cache:", err);
        const cached = localStorage.getItem("portfolio_cached_data");
        if (cached) {
          try {
            setPortfolioData(JSON.parse(cached));
          } catch (e) {
            setPortfolioData(initialPortfolioData);
          }
        } else {
          setPortfolioData(initialPortfolioData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper: Clean undefined values from config objects before saving
  const cleanUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanUndefined);
    }
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanUndefined(val);
      }
    }
    return cleaned;
  };

  // Transactionally save all changes to Neon PostgreSQL database via Express API
  const saveAndSetData = async (newData: PortfolioData) => {
    const cleanedData = cleanUndefined(newData);
    setPortfolioData(newData);
    localStorage.setItem("portfolio_cached_data", JSON.stringify(newData));

    try {
      const response = await fetch("/api/save-portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData)
      });
      if (!response.ok) throw new Error("Failed to synchronize state with API server");
      console.log("Synchronized portfolio state to Neon PostgreSQL successfully.");
    } catch (error) {
      console.error("Failed to sync changes with database backend:", error);
    }
  };

  // CRUD State Updaters
  const updateHomeAbout = (homeData: PortfolioData["home"], aboutData: PortfolioData["about"]) => {
    saveAndSetData({ ...portfolioData, home: homeData, about: aboutData });
  };

  const updateSkills = (skillsData: PortfolioData["skills"]) => {
    saveAndSetData({ ...portfolioData, skills: skillsData });
  };

  const updateServices = (servicesData: PortfolioData["services"]) => {
    saveAndSetData({ ...portfolioData, services: servicesData });
  };

  const updateQualification = (qualificationData: PortfolioData["qualification"]) => {
    saveAndSetData({ ...portfolioData, qualification: qualificationData });
  };

  const updateProjects = (projectsData: PortfolioData["projects"]) => {
    saveAndSetData({ ...portfolioData, projects: projectsData });
  };

  const updateTestimonials = (testimonialsData: PortfolioData["testimonials"]) => {
    saveAndSetData({ ...portfolioData, testimonials: testimonialsData });
  };

  const updateMemories = (memoriesData: PortfolioData["memories"]) => {
    saveAndSetData({ ...portfolioData, memories: memoriesData });
  };

  const updateBlogs = (blogsData: NonNullable<PortfolioData["blogs"]>) => {
    saveAndSetData({ ...portfolioData, blogs: blogsData });
  };

  const updateSeo = (seoData: NonNullable<PortfolioData["seo"]>) => {
    saveAndSetData({ ...portfolioData, seo: seoData });
  };

  const updateResources = (resourcesData: NonNullable<PortfolioData["resources"]>) => {
    saveAndSetData({ ...portfolioData, resources: resourcesData });
  };

  const updateResourceCategories = (categoriesData: NonNullable<PortfolioData["resourceCategories"]>) => {
    saveAndSetData({ ...portfolioData, resourceCategories: categoriesData });
  };

  const updateTerminalCommands = (commandsData: NonNullable<PortfolioData["terminalCommands"]>) => {
    saveAndSetData({ ...portfolioData, terminalCommands: commandsData });
  };

  // Dynamic Query Fetchers with Fallbacks
  const fetchProjects = async (limitCount?: number): Promise<any[]> => {
    const list = portfolioData.projects || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchMemories = async (limitCount?: number): Promise<any[]> => {
    const list = portfolioData.memories || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchBlogs = async (limitCount?: number): Promise<any[]> => {
    const list = portfolioData.blogs || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchBlogPost = async (id: string): Promise<any | null> => {
    return (portfolioData.blogs || []).find((b) => b.id === id) || null;
  };

  // Firebase Auth providers & methods
  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else {
      const mock = { uid: "mock-user-1", displayName: "Ankit Bhuria", email: "ankit@example.com" };
      setUser(mock);
      localStorage.setItem("portfolio_mock_user", JSON.stringify(mock));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      if (email === "ankit@example.com" && pass === "admin123") {
        const mock = { uid: "mock-user-1", displayName: "Ankit Bhuria", email: "ankit@example.com" };
        setUser(mock);
        localStorage.setItem("portfolio_mock_user", JSON.stringify(mock));
      } else {
        throw new Error("Invalid mock credentials");
      }
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user && name) {
        await updateProfile(cred.user, { displayName: name });
      }
    } else {
      const mock = { uid: "mock-user-1", displayName: name || "Ankit Bhuria", email };
      setUser(mock);
      localStorage.setItem("portfolio_mock_user", JSON.stringify(mock));
    }
  };

  const logOut = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem("portfolio_mock_user");
    }
  };

  const refreshUser = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    }
  };

  // Comments and Likes scalable database actions querying Neon backend API
  const likeBlogPost = async (blogId: string, userId: string) => {
    const payload = { id: `${blogId}_${userId}`, userId };
    try {
      const response = await fetch(`/api/blogs/${blogId}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to like post");
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const unlikeBlogPost = async (blogId: string, userId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/likes/${userId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to unlike post");
    } catch (err) {
      console.error("Failed to unlike post:", err);
    }
  };

  const checkUserLikedBlogPost = async (blogId: string, userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/likes-comments`);
      if (!response.ok) throw new Error("Failed to fetch likes list");
      const { likes } = await response.json();
      return Array.isArray(likes) && likes.some((l: any) => l.userId === userId);
    } catch (err) {
      console.error("Failed to check user liked post status:", err);
      return false;
    }
  };

  const fetchBlogPostLikesCount = async (blogId: string): Promise<number> => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/likes-comments`);
      if (!response.ok) throw new Error("Failed to fetch likes count");
      const { likes } = await response.json();
      return Array.isArray(likes) ? likes.length : 0;
    } catch (err) {
      console.error("Failed to fetch blog likes count:", err);
      return 0;
    }
  };

  const addCommentToBlogPost = async (blogId: string, text: string, currentUser: any): Promise<any> => {
    const payload = {
      id: "comment-" + Date.now() + Math.random().toString(36).substring(7),
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email?.split("@")[0] || "Anonymous",
      userPhoto: currentUser.photoURL || null,
      text,
      parentId: null
    };

    try {
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to save blog comment");
      return { ...payload, timestamp: new Date().toISOString(), replies: [] };
    } catch (err) {
      console.error("Failed to save blog comment:", err);
      throw err;
    }
  };

  const deleteCommentFromBlogPost = async (blogId: string, commentId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/comments/${commentId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete comment");
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const fetchBlogPostComments = async (blogId: string): Promise<any[]> => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/likes-comments`);
      if (!response.ok) throw new Error("Failed to fetch likes-comments");
      const { comments } = await response.json();
      
      // Map self-referencing flat comments into nested structure
      const commentsMap = new Map<string, any>();
      comments.forEach((c: any) => {
        commentsMap.set(c.id, { ...c, timestamp: c.date, replies: [] });
      });

      const rootComments: any[] = [];
      commentsMap.forEach((c: any) => {
        if (c.parentId) {
          const parent = commentsMap.get(c.parentId);
          if (parent) {
            parent.replies.push(c);
          } else {
            rootComments.push(c);
          }
        } else {
          rootComments.push(c);
        }
      });

      return rootComments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (err) {
      console.error("Failed to load blog comments:", err);
      return [];
    }
  };

  const updateCommentInBlogPost = async (_blogId: string, _commentId: string, _text: string) => {
    // Currently fallback, can be expanded to dynamic PUT endpoint if required
    console.log("Comment edit features are read-only / local on SPA frontend currently.");
  };

  const replyToCommentInBlogPost = async (blogId: string, commentId: string, replyText: string, currentUser: any): Promise<any> => {
    const payload = {
      id: "comment-" + Date.now() + Math.random().toString(36).substring(7),
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email?.split("@")[0] || "Anonymous",
      userPhoto: currentUser.photoURL || null,
      text: replyText,
      parentId: commentId
    };

    try {
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to save reply");
      return { ...payload, timestamp: new Date().toISOString() };
    } catch (err) {
      console.error("Failed to save comment reply:", err);
      throw err;
    }
  };

  const subscribeToNewsletter = async (email: string) => {
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error("Failed to subscribe");
    } catch (err) {
      console.error("Failed to register newsletter subscription:", err);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isLoading,
        user,
        authLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logOut,
        refreshUser,
        updateCommentInBlogPost,
        replyToCommentInBlogPost,
        subscribeToNewsletter,
        likeBlogPost,
        unlikeBlogPost,
        checkUserLikedBlogPost,
        fetchBlogPostLikesCount,
        addCommentToBlogPost,
        deleteCommentFromBlogPost,
        fetchBlogPostComments,
        updateHomeAbout,
        updateSkills,
        updateServices,
        updateQualification,
        updateProjects,
        updateTestimonials,
        updateMemories,
        updateBlogs,
        updateSeo,
        updateResources,
        updateResourceCategories,
        updateTerminalCommands,
        fetchProjects,
        fetchMemories,
        fetchBlogs,
        fetchBlogPost,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioProvider");
  }
  return context;
};
