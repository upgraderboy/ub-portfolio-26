"use client";

import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import {
  ProjectItem,
  TestimonialItem,
  MemoryItem,
  SkillItem,
  QualificationItem,
  BlogItem,
} from "../db/portfolioDb";
import TipTapEditor from "./TipTapEditor";
import "./admin.css";

interface AdminProps {
  navigate: (to: string) => void;
}

const Admin: React.FC<AdminProps> = ({ navigate }) => {
  const {
    portfolioData,
    updateHomeAbout,
    updateSkills,
    updateQualification,
    updateProjects,
    updateTestimonials,
    updateMemories,
    updateBlogs,
    updateSeo,
    updateResources,
    updateResourceCategories,
    updateTerminalCommands,
  } = usePortfolioData();

  // Theme State
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mode");
      if (saved) setThemeMode(saved);
    }
  }, []);

  useEffect(() => {
    document.querySelector("body")?.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    document.querySelector("body")?.setAttribute("data-theme", nextTheme);
    localStorage.setItem("mode", nextTheme);
    setThemeMode(nextTheme);
  };

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Account Security Tab States
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newUsernameInput, setNewUsernameInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  // Navigation State (Active Tab)
  const [activeTab, setActiveTab] = useState<string>("home-about");

  // Form Edit/Add States
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setEditingId(null);
  }, [activeTab]);

  // Home & About State
  const [homeName, setHomeName] = useState(portfolioData.home.name);
  const [homeSubtitle, setHomeSubtitle] = useState(portfolioData.home.subtitle);
  const [homeDescription, setHomeDescription] = useState(portfolioData.home.description);
  const [aboutDescription, setAboutDescription] = useState(portfolioData.about.description);
  const [aboutExpYears, setAboutExpYears] = useState(portfolioData.about.experienceYears);
  const [aboutProjects, setAboutProjects] = useState(portfolioData.about.completedProjects);
  const [aboutSupport, setAboutSupport] = useState(portfolioData.about.supportAvailability);
  const [aboutCvUrl, setAboutCvUrl] = useState(portfolioData.about.cvUrl || "");
  const [homeImageUrl, setHomeImageUrl] = useState(portfolioData.home.imageUrl || "");
  const [aboutImageUrl, setAboutImageUrl] = useState(portfolioData.about.imageUrl || "");

  // SEO State
  const [seoSiteTitle, setSeoSiteTitle] = useState(portfolioData.seo?.siteTitle || "");
  const [seoSiteDescription, setSeoSiteDescription] = useState(portfolioData.seo?.siteDescription || "");
  const [seoRoutes, setSeoRoutes] = useState(portfolioData.seo?.routes || []);
  const [seoFaviconUrl, setSeoFaviconUrl] = useState(portfolioData.seo?.faviconUrl || "");

  // Form Route Sub-items state
  const [routePath, setRoutePath] = useState("");
  const [routeTitle, setRouteTitle] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routeChangeFreq, setRouteChangeFreq] = useState("weekly");
  const [routePriority, setRoutePriority] = useState("0.5");

  // Resources State
  const [resTitle, setResTitle] = useState("");
  const [resDescription, setResDescription] = useState("");
  const [resPdfUrl, setResPdfUrl] = useState("");
  const [resCategoryPath, setResCategoryPath] = useState<string[]>([]);
  const [resTags, setResTags] = useState("");
  const [resSource, setResSource] = useState("");
  const [resThumbnailUrl, setResThumbnailUrl] = useState("");

  // Category Configuration state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  // Console Command State
  const [cmdCommand, setCmdCommand] = useState("");
  const [cmdDescription, setCmdDescription] = useState("");
  const [cmdResponse, setCmdResponse] = useState("");
  const [cmdIsHtml, setCmdIsHtml] = useState(false);



  // Projects State Form
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("Web App");
  const [projImage, setProjImage] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projBuy, setProjBuy] = useState("");
  const [projGithub, setProjGithub] = useState("");

  // Testimonials State Form
  const [tstTitle, setTstTitle] = useState("");
  const [tstImage, setTstImage] = useState("");
  const [tstDescription, setTstDescription] = useState("");

  // Memories State Form
  const [memTitle, setMemTitle] = useState("");
  const [memDate, setMemDate] = useState("");
  const [memCategory, setMemCategory] = useState("");
  const [memDescription, setMemDescription] = useState("");
  const [memImages, setMemImages] = useState<string[]>([""]);

  // Blogs State Form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("");
  const [blogStatus, setBlogStatus] = useState<"public" | "draft">("public");

  // Skills State Form
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [skillType, setSkillType] = useState<"frontend" | "backend">("frontend");


  // Qualifications State Form
  const [qType, setQType] = useState<"education" | "experience">("education");
  const [qTitle, setQTitle] = useState("");
  const [qSubtitle, setQSubtitle] = useState("");
  const [qCalendar, setQCalendar] = useState("");

  // Skills & Qualifications Editing States
  const [editingSkillKey, setEditingSkillKey] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState("");

  const [editingQualId, setEditingQualId] = useState<string | null>(null);
  const [editQualTitle, setEditQualTitle] = useState("");
  const [editQualSubtitle, setEditQualSubtitle] = useState("");
  const [editQualCalendar, setEditQualCalendar] = useState("");

  // Drag & Drop Reordering States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);

  const handleDragStart = (index: number, source: string) => {
    setDraggedIndex(index);
    setDragSource(source);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number, source: string) => {
    e.preventDefault();
    if (draggedIndex === null || dragSource !== source || draggedIndex === targetIndex) return;

    if (source === "projects") {
      const items = [...portfolioData.projects];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateProjects(items);
      setDraggedIndex(targetIndex);
    } else if (source === "testimonials") {
      const items = [...portfolioData.testimonials];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateTestimonials(items);
      setDraggedIndex(targetIndex);
    } else if (source === "memories") {
      const items = [...portfolioData.memories];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateMemories(items);
      setDraggedIndex(targetIndex);
    } else if (source === "frontend-skills") {
      const items = [...portfolioData.skills.frontend];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateSkills({ ...portfolioData.skills, frontend: items });
      setDraggedIndex(targetIndex);
    } else if (source === "backend-skills") {
      const items = [...portfolioData.skills.backend];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateSkills({ ...portfolioData.skills, backend: items });
      setDraggedIndex(targetIndex);
    } else if (source === "education") {
      const items = [...portfolioData.qualification.education];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateQualification({ ...portfolioData.qualification, education: items });
      setDraggedIndex(targetIndex);
    } else if (source === "experience") {
      const items = [...portfolioData.qualification.experience];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateQualification({ ...portfolioData.qualification, experience: items });
      setDraggedIndex(targetIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragSource(null);
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("portfolio_admin_logged_in");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Update states when portfolio data loads/changes
  useEffect(() => {
    setHomeName(portfolioData.home.name);
    setHomeSubtitle(portfolioData.home.subtitle);
    setHomeDescription(portfolioData.home.description);
    setHomeImageUrl(portfolioData.home.imageUrl || "");
    setAboutDescription(portfolioData.about.description);
    setAboutExpYears(portfolioData.about.experienceYears);
    setAboutProjects(portfolioData.about.completedProjects);
    setAboutSupport(portfolioData.about.supportAvailability);
    setAboutImageUrl(portfolioData.about.imageUrl || "");
    setSeoSiteTitle(portfolioData.seo?.siteTitle || "");
    setSeoSiteDescription(portfolioData.seo?.siteDescription || "");
    setSeoRoutes(portfolioData.seo?.routes || []);
    setSeoFaviconUrl(portfolioData.seo?.faviconUrl || "");
  }, [portfolioData]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        sessionStorage.setItem("portfolio_admin_logged_in", "true");
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError(resData.error || "Incorrect username or password. Please try again.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("portfolio_admin_logged_in");
    setIsAuthenticated(false);
    setPasswordInput("");
    navigate("/");
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccess("");
    setSecurityError("");
    setSecurityLoading(true);

    try {
      const res = await fetch("/api/admin/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newUsername: newUsernameInput,
          newPassword: newPasswordInput
        })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setSecuritySuccess("Credentials updated successfully!");
        setCurrentPasswordInput("");
        setNewUsernameInput("");
        setNewPasswordInput("");
      } else {
        setSecurityError(resData.error || "Failed to update credentials.");
      }
    } catch (err) {
      setSecurityError("Failed to connect to authentication server.");
    } finally {
      setSecurityLoading(false);
    }
  };

  // Image upload base64 converter with image compression
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const max_size = 800;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setter(compressed);
    } catch (err) {
      console.error("Image compression failed, fallback to raw upload:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Memories dynamic image upload
  const handleMemoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const updated = [...memImages];
      updated[index] = compressed;
      setMemImages(updated);
    } catch (err) {
      console.error("Image compression failed, fallback to raw upload:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...memImages];
        updated[index] = reader.result as string;
        setMemImages(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (file.size > 800 * 1024) {
      alert("File is too large. Please upload a PDF under 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAboutCvUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // CRUD Actions
  // 1. Save Home & About text content
  const handleSaveHomeAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeAbout(
      { name: homeName, subtitle: homeSubtitle, description: homeDescription, imageUrl: homeImageUrl },
      {
        description: aboutDescription,
        experienceYears: aboutExpYears,
        completedProjects: aboutProjects,
        supportAvailability: aboutSupport,
        cvUrl: aboutCvUrl,
        imageUrl: aboutImageUrl,
      }
    );
    alert("Home and About sections updated successfully!");
  };

  // SEO CRUD Actions
  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeo({
      siteTitle: seoSiteTitle,
      siteDescription: seoSiteDescription,
      routes: seoRoutes,
      faviconUrl: seoFaviconUrl,
    });
    alert("Main SEO metadata updated successfully!");
  };

  const handleAddSeoRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routePath.startsWith("/")) {
      alert("Sub-route path must start with '/' (e.g. /resources)");
      return;
    }

    if (editingId) {
      const updated = seoRoutes.map((r) => {
        if (r.id === editingId) {
          return {
            ...r,
            path: routePath,
            title: routeTitle,
            description: routeDescription,
            changefreq: routeChangeFreq,
            priority: parseFloat(routePriority),
          };
        }
        return r;
      });
      updateSeo({
        siteTitle: seoSiteTitle,
        siteDescription: seoSiteDescription,
        routes: updated,
        faviconUrl: seoFaviconUrl,
      });
      setEditingId(null);
      alert("SEO sub-route updated successfully!");
    } else {
      const newRoute = {
        id: "seo-" + Date.now(),
        path: routePath,
        title: routeTitle,
        description: routeDescription,
        changefreq: routeChangeFreq,
        priority: parseFloat(routePriority),
      };
      const updated = [...seoRoutes, newRoute];
      updateSeo({
        siteTitle: seoSiteTitle,
        siteDescription: seoSiteDescription,
        routes: updated,
        faviconUrl: seoFaviconUrl,
      });
      alert("New SEO sub-route added successfully!");
    }

    setRoutePath("");
    setRouteTitle("");
    setRouteDescription("");
    setRouteChangeFreq("weekly");
    setRoutePriority("0.5");
  };

  const handleDeleteSeoRoute = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sub-route from Google Sitelinks?")) {
      const updated = seoRoutes.filter((r) => r.id !== id);
      updateSeo({
        siteTitle: seoSiteTitle,
        siteDescription: seoSiteDescription,
        routes: updated,
        faviconUrl: seoFaviconUrl,
      });
      alert("Sub-route deleted successfully!");
    }
  };

  const startEditSeoRoute = (r: any) => {
    setEditingId(r.id);
    setRoutePath(r.path);
    setRouteTitle(r.title);
    setRouteDescription(r.description);
    setRouteChangeFreq(r.changefreq || "weekly");
    setRoutePriority(String(r.priority || "0.5"));
  };

  const resetSeoRouteForm = () => {
    setEditingId(null);
    setRoutePath("");
    setRouteTitle("");
    setRouteDescription("");
    setRouteChangeFreq("weekly");
    setRoutePriority("0.5");
  };

  // Console Command CRUD Actions
  const handleSaveTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdCommand.trim() || !cmdDescription.trim() || !cmdResponse.trim()) {
      alert("Command, description, and response fields cannot be empty.");
      return;
    }

    const commandKey = cmdCommand.toLowerCase().trim().replace(/\s+/g, "-");
    const currentCommands = [...(portfolioData.terminalCommands || [])];

    if (editingId) {
      const updated = currentCommands.map((c) => {
        if (c.id === editingId) {
          return {
            ...c,
            command: commandKey,
            description: cmdDescription,
            response: cmdResponse,
            isHtml: cmdIsHtml,
          };
        }
        return c;
      });
      updateTerminalCommands(updated);
      setEditingId(null);
      alert("Terminal command updated successfully!");
    } else {
      const exists = currentCommands.some((c) => c.command.toLowerCase() === commandKey);
      if (exists) {
        alert(`Command '${commandKey}' already exists. Use the edit button to customize it.`);
        return;
      }
      const newCmd = {
        id: "cmd-" + Date.now(),
        command: commandKey,
        description: cmdDescription,
        response: cmdResponse,
        isHtml: cmdIsHtml,
      };
      updateTerminalCommands([...currentCommands, newCmd]);
      alert("New terminal command added successfully!");
    }

    resetTerminalCommandForm();
  };

  const handleDeleteTerminalCommand = (id: string) => {
    if (window.confirm("Are you sure you want to delete this shell command?")) {
      const updated = (portfolioData.terminalCommands || []).filter((c) => c.id !== id);
      updateTerminalCommands(updated);
      alert("Terminal command deleted successfully!");
    }
  };

  const startEditTerminalCommand = (cmd: any) => {
    setEditingId(cmd.id);
    setCmdCommand(cmd.command);
    setCmdDescription(cmd.description);
    setCmdResponse(cmd.response);
    setCmdIsHtml(cmd.isHtml || false);
  };

  const resetTerminalCommandForm = () => {
    setEditingId(null);
    setCmdCommand("");
    setCmdDescription("");
    setCmdResponse("");
    setCmdIsHtml(false);
  };

  // Resources CRUD Actions
  const resetResourceForm = () => {
    setEditingId(null);
    setResTitle("");
    setResDescription("");
    setResPdfUrl("");
    setResCategoryPath([]);
    setResTags("");
    setResSource("");
    setResThumbnailUrl("");
  };

  // Recursive Tree helpers
  const addChildToNode = (nodes: any[], targetId: string, newNode: any): any[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: addChildToNode(node.children, targetId, newNode),
        };
      }
      return node;
    });
  };

  const removeNodeFromTree = (nodes: any[], targetId: string): any[] => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => {
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: removeNodeFromTree(node.children, targetId),
          };
        }
        return node;
      });
  };

  const checkCategoryNameExists = (nodes: any[], name: string): boolean => {
    for (const node of nodes) {
      if (node.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (checkCategoryNameExists(node.children, name)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    const resList = portfolioData.resources || [];
    const parsedTags = resTags.split(",").map((t) => t.trim()).filter((t) => t !== "");

    if (resCategoryPath.length === 0) {
      alert("Please select at least a root category for this resource.");
      return;
    }

    if (editingId) {
      const updated = resList.map((r) => {
        if (r.id === editingId) {
          return {
            ...r,
            title: resTitle,
            description: resDescription,
            pdfUrl: resPdfUrl,
            categoryPath: resCategoryPath,
            tags: parsedTags,
            source: resSource || undefined,
            thumbnailUrl: resThumbnailUrl || undefined,
          };
        }
        return r;
      });
      updateResources(updated);
      setEditingId(null);
      alert("Resource updated successfully!");
    } else {
      const newRes = {
        id: "res-" + Date.now(),
        title: resTitle,
        description: resDescription,
        pdfUrl: resPdfUrl,
        categoryPath: resCategoryPath,
        tags: parsedTags,
        source: resSource || undefined,
        thumbnailUrl: resThumbnailUrl || undefined,
        dateAdded: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      };
      updateResources([...resList, newRes]);
      alert("Resource added successfully!");
    }
    resetResourceForm();
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      const resList = portfolioData.resources || [];
      updateResources(resList.filter((r) => r.id !== id));
      alert("Resource deleted successfully!");
    }
  };

  const startEditResource = (r: any) => {
    setEditingId(r.id);
    setResTitle(r.title);
    setResDescription(r.description);
    setResPdfUrl(r.pdfUrl);
    setResCategoryPath(r.categoryPath || []);
    setResTags(r.tags.join(", "));
    setResSource(r.source || "");
    setResThumbnailUrl(r.thumbnailUrl || "");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = portfolioData.resourceCategories || [];
    const nameTrim = newCategoryName.trim();
    if (!nameTrim) return;

    if (checkCategoryNameExists(categories, nameTrim)) {
      alert(`Category "${nameTrim}" already exists in the hierarchy.`);
      return;
    }

    const newCat = {
      id: "cat-" + Date.now(),
      name: nameTrim,
      children: [],
    };

    if (selectedParentCategory) {
      const updated = addChildToNode(categories, selectedParentCategory, newCat);
      updateResourceCategories(updated);
      alert(`Subcategory "${nameTrim}" added successfully!`);
    } else {
      updateResourceCategories([...categories, newCat]);
      alert(`Root Category "${nameTrim}" added successfully!`);
    }

    setNewCategoryName("");
  };

  const handleDeleteCategory = (catId: string) => {
    if (window.confirm("Are you sure you want to delete this category? All its nested subcategories will be removed recursively.")) {
      const categories = portfolioData.resourceCategories || [];
      const updated = removeNodeFromTree(categories, catId);
      updateResourceCategories(updated);
      if (selectedParentCategory === catId) {
        setSelectedParentCategory("");
      }
      alert("Category tree node deleted successfully!");
    }
  };

  // 2. Project CRUD
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: projTitle,
      category: projCategory,
      image: projImage || "https://raw.githubusercontent.com/upgraderboy/portfolio/main/src/assets/Portfolio.png",
      demo: projDemo || undefined,
      buy: projBuy || undefined,
      github: projGithub || undefined,
    };
    updateProjects([newProj, ...portfolioData.projects]);
    resetProjectForm();
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const updated = portfolioData.projects.map((p) => {
      if (p.id === editingId) {
        return {
          ...p,
          title: projTitle,
          category: projCategory,
          image: projImage,
          demo: projDemo || undefined,
          buy: projBuy || undefined,
          github: projGithub || undefined,
        };
      }
      return p;
    });
    updateProjects(updated);
    resetProjectForm();
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      updateProjects(portfolioData.projects.filter((p) => p.id !== id));
    }
  };

  const startEditProject = (p: ProjectItem) => {
    setEditingId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjImage(p.image);
    setProjDemo(p.demo || "");
    setProjBuy(p.buy || "");
    setProjGithub(p.github || "");
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setProjTitle("");
    setProjCategory("Web App");
    setProjImage("");
    setProjDemo("");
    setProjBuy("");
    setProjGithub("");
  };

  // 3. Testimonial CRUD
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTst: TestimonialItem = {
      id: "tst-" + Date.now(),
      title: tstTitle,
      image: tstImage || "https://raw.githubusercontent.com/upgraderboy/portfolio/main/src/assets/UB.png",
      description: tstDescription,
    };
    updateTestimonials([...portfolioData.testimonials, newTst]);
    resetTestimonialForm();
  };

  const handleEditTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const updated = portfolioData.testimonials.map((t) => {
      if (t.id === editingId) {
        return { ...t, title: tstTitle, image: tstImage, description: tstDescription };
      }
      return t;
    });
    updateTestimonials(updated);
    resetTestimonialForm();
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      updateTestimonials(portfolioData.testimonials.filter((t) => t.id !== id));
    }
  };

  const startEditTestimonial = (t: TestimonialItem) => {
    setEditingId(t.id);
    setTstTitle(t.title);
    setTstImage(t.image);
    setTstDescription(t.description);
  };

  const resetTestimonialForm = () => {
    setEditingId(null);
    setTstTitle("");
    setTstImage("");
    setTstDescription("");
  };

  // 4. Memory CRUD
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredImages = memImages.filter((img) => img.trim() !== "");
    const newMem: MemoryItem = {
      id: "mem-" + Date.now(),
      title: memTitle,
      date: memDate,
      category: memCategory || "General",
      description: memDescription,
      images: filteredImages.length > 0 ? filteredImages : ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"],
    };
    updateMemories([newMem, ...portfolioData.memories]);
    resetMemoryForm();
  };

  const handleEditMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const filteredImages = memImages.filter((img) => img.trim() !== "");
    const updated = portfolioData.memories.map((m) => {
      if (m.id === editingId) {
        return {
          ...m,
          title: memTitle,
          date: memDate,
          category: memCategory || "General",
          description: memDescription,
          images: filteredImages.length > 0 ? filteredImages : m.images,
        };
      }
      return m;
    });
    updateMemories(updated);
    resetMemoryForm();
  };

  const handleDeleteMemory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      updateMemories(portfolioData.memories.filter((m) => m.id !== id));
    }
  };

  const startEditMemory = (m: MemoryItem) => {
    setEditingId(m.id);
    setMemTitle(m.title);
    setMemDate(m.date);
    setMemCategory(m.category);
    setMemDescription(m.description);
    setMemImages(m.images);
  };

  const resetMemoryForm = () => {
    setEditingId(null);
    setMemTitle("");
    setMemDate("");
    setMemCategory("");
    setMemDescription("");
    setMemImages([""]);
  };

  // Skills Inline Editing Helpers
  const startEditSkill = (type: "frontend" | "backend", s: SkillItem) => {
    setEditingSkillKey(`${type}-${s.name}`);
    setEditSkillName(s.name);
    setEditSkillLevel(s.level);
  };

  const handleSaveSkillEdit = (type: "frontend" | "backend", oldName: string) => {
    if (!editSkillName) return;
    const updatedSkills = { ...portfolioData.skills };
    if (type === "frontend") {
      updatedSkills.frontend = updatedSkills.frontend.map((s) =>
        s.name === oldName ? { name: editSkillName, level: editSkillLevel } : s
      );
    } else {
      updatedSkills.backend = updatedSkills.backend.map((s) =>
        s.name === oldName ? { name: editSkillName, level: editSkillLevel } : s
      );
    }
    updateSkills(updatedSkills);
    setEditingSkillKey(null);
  };

  const handleCancelSkillEdit = () => {
    setEditingSkillKey(null);
  };

  // Qualifications Inline Editing Helpers
  const startEditQualification = (q: QualificationItem) => {
    setEditingQualId(q.id);
    setEditQualTitle(q.title);
    setEditQualSubtitle(q.subtitle);
    setEditQualCalendar(q.calendar);
  };

  const handleSaveQualificationEdit = (type: "education" | "experience", id: string) => {
    if (!editQualTitle || !editQualSubtitle || !editQualCalendar) return;
    const updatedQ = { ...portfolioData.qualification };
    if (type === "education") {
      updatedQ.education = updatedQ.education.map((q) =>
        q.id === id ? { id, title: editQualTitle, subtitle: editQualSubtitle, calendar: editQualCalendar } : q
      );
    } else {
      updatedQ.experience = updatedQ.experience.map((q) =>
        q.id === id ? { id, title: editQualTitle, subtitle: editQualSubtitle, calendar: editQualCalendar } : q
      );
    }
    updateQualification(updatedQ);
    setEditingQualId(null);
  };

  const handleCancelQualificationEdit = () => {
    setEditingQualId(null);
  };

  // 5. Skills CRUD
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const newSkill: SkillItem = { name: skillName, level: skillLevel };
    const updatedSkills = { ...portfolioData.skills };
    if (skillType === "frontend") {
      updatedSkills.frontend = [...updatedSkills.frontend, newSkill];
    } else {
      updatedSkills.backend = [...updatedSkills.backend, newSkill];
    }
    updateSkills(updatedSkills);
    setSkillName("");
  };

  const handleDeleteSkill = (type: "frontend" | "backend", name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const updatedSkills = { ...portfolioData.skills };
      if (type === "frontend") {
        updatedSkills.frontend = updatedSkills.frontend.filter((s) => s.name !== name);
      } else {
        updatedSkills.backend = updatedSkills.backend.filter((s) => s.name !== name);
      }
      updateSkills(updatedSkills);
    }
  };

  // 6. Qualification CRUD
  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: QualificationItem = {
      id: "q-" + Date.now(),
      title: qTitle,
      subtitle: qSubtitle,
      calendar: qCalendar,
    };
    const updatedQ = { ...portfolioData.qualification };
    if (qType === "education") {
      updatedQ.education = [...updatedQ.education, newQ];
    } else {
      updatedQ.experience = [...updatedQ.experience, newQ];
    }
    updateQualification(updatedQ);
    resetQForm();
  };

  const handleDeleteQualification = (type: "education" | "experience", id: string) => {
    if (window.confirm("Are you sure you want to delete this qualification?")) {
      const updatedQ = { ...portfolioData.qualification };
      if (type === "education") {
        updatedQ.education = updatedQ.education.filter((q) => q.id !== id);
      } else {
        updatedQ.experience = updatedQ.experience.filter((q) => q.id !== id);
      }
      updateQualification(updatedQ);
    }
  };

  const resetQForm = () => {
    setQTitle("");
    setQSubtitle("");
    setQCalendar("");
  };

  // 7. Blogs CRUD
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog: BlogItem = {
      id: "blog-" + Date.now(),
      title: blogTitle,
      content: blogContent,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      coverImage: blogCoverImage || "",
      status: blogStatus,
    };
    const currentBlogs = portfolioData.blogs || [];
    updateBlogs([newBlog, ...currentBlogs]);
    resetBlogForm();
  };

  const handleEditBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const currentBlogs = portfolioData.blogs || [];
    const updated = currentBlogs.map((b) => {
      if (b.id === editingId) {
        return {
          ...b,
          title: blogTitle,
          content: blogContent,
          coverImage: blogCoverImage || "",
          status: blogStatus,
        };
      }
      return b;
    });
    updateBlogs(updated);
    resetBlogForm();
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      const currentBlogs = portfolioData.blogs || [];
      updateBlogs(currentBlogs.filter((b) => b.id !== id));
    }
  };

  const startEditBlog = (b: BlogItem) => {
    setEditingId(b.id);
    setBlogTitle(b.title);
    setBlogContent(b.content);
    setBlogCoverImage(b.coverImage || "");
    setBlogStatus(b.status || "public");
  };

  const resetBlogForm = () => {
    setEditingId(null);
    setBlogTitle("");
    setBlogContent("");
    setBlogCoverImage("");
    setBlogStatus("public");
  };

  // Render Login Card if not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin__login-container">
        <div className="admin__login-card">
          <h2 className="admin__login-title">Admin CMS Login</h2>
          <span className="admin__login-subtitle">Portfolio Content Management</span>

          {authError && <div className="admin__login-error">{authError}</div>}

          <form onSubmit={handleLogin}>
            <div className="admin__form-group">
              <label className="admin__form-label" style={{ textAlign: "left" }}>
                Admin Username
              </label>
              <input
                type="text"
                className="admin__form-input"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>
            <div className="admin__form-group">
              <label className="admin__form-label" style={{ textAlign: "left" }}>
                Admin Password
              </label>
              <input
                type="password"
                className="admin__form-input"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin__login-btn">
              Login to Dashboard
            </button>
            <button
              type="button"
              className="admin__btn admin__btn--secondary"
              style={{ width: "100%", marginTop: "1rem", display: "block" }}
              onClick={() => navigate("/")}
            >
              Back to Portfolio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Category Tree UI Rendering Helper
  const renderCategoryTreeNode = (node: any, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedParentCategory === node.id;
    
    return (
      <div 
        key={node.id} 
        style={{ 
          marginLeft: depth > 0 ? "1.25rem" : "0", 
          marginTop: "0.5rem",
          borderLeft: depth > 0 ? "1px dashed rgba(100, 116, 139, 0.3)" : "none",
          paddingLeft: depth > 0 ? "0.75rem" : "0"
        }}
      >
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "0.5rem 0.75rem", 
            borderRadius: "0.35rem",
            backgroundColor: isSelected ? "rgba(1, 195, 105, 0.12)" : "var(--container-color)",
            border: isSelected ? "1px solid var(--green-color)" : "1px solid rgba(100, 116, 139, 0.1)",
            cursor: "pointer"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedParentCategory(isSelected ? "" : node.id);
          }}
        >
          <span style={{ 
            fontWeight: depth === 0 ? "600" : "500", 
            fontSize: depth === 0 ? "0.9rem" : "0.8rem",
            color: isSelected ? "var(--green-color)" : "var(--title-color)",
            display: "flex",
            alignItems: "center",
            columnGap: "0.35rem"
          }}>
            <i className={hasChildren ? "uil uil-folder" : "uil uil-file-alt"} style={{ color: isSelected ? "var(--green-color)" : "var(--text-color-light)" }}></i>
            {node.name}
          </span>
          <div style={{ display: "flex", columnGap: "0.25rem" }} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="admin__action-btn admin__action-btn--edit" 
              onClick={() => setSelectedParentCategory(node.id)}
              title="Select to add subcategory"
              style={{ padding: "0.25rem" }}
            >
              <i className="uil uil-plus"></i>
            </button>
            <button 
              type="button" 
              className="admin__action-btn admin__action-btn--delete" 
              onClick={() => handleDeleteCategory(node.id)}
              title="Delete Category node"
              style={{ padding: "0.25rem" }}
            >
              <i className="uil uil-trash-alt"></i>
            </button>
          </div>
        </div>
        {hasChildren && node.children!.map((child: any) => renderCategoryTreeNode(child, depth + 1))}
      </div>
    );
  };

  // Category Path string representation builder
  const resolveCategoryPathNames = (pathIds: string[]): string => {
    if (!pathIds || pathIds.length === 0) return "None";
    const names: string[] = [];
    let currentNodes = portfolioData.resourceCategories || [];

    for (const id of pathIds) {
      const node: any = currentNodes.find((n: any) => n.id === id);
      if (node) {
        names.push(node.name);
        currentNodes = node.children || [];
      } else {
        break;
      }
    }
    return names.join(" › ");
  };

  return (
    <div className="admin__layout">
      {/* Sidebar Navigation */}
      <div className="admin__sidebar">
        <div className="admin__sidebar-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="admin__sidebar-title">Admin Control Panel</span>
          <button 
            type="button" 
            onClick={toggleTheme}
            className="admin__action-btn"
            style={{ color: "var(--title-color)", display: "flex", alignItems: "center", cursor: "pointer", transition: "color 0.3s ease" }}
            title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <i className={`uil ${themeMode === "dark" ? "uil-sun" : "uil-moon"}`} style={{ fontSize: "1.25rem" }}></i>
          </button>
        </div>

        <div className="admin__nav">
          <div
            className={`admin__nav-item ${activeTab === "home-about" ? "active" : ""}`}
            onClick={() => setActiveTab("home-about")}
          >
            <i className="uil uil-home"></i> Home & About
          </div>
          <div
            className={`admin__nav-item ${activeTab === "skills-qual" ? "active" : ""}`}
            onClick={() => setActiveTab("skills-qual")}
          >
            <i className="uil uil-file-alt"></i> Skills & Journey
          </div>
          <div
            className={`admin__nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <i className="uil uil-scenery"></i> Projects (Portfolio)
          </div>
          <div
            className={`admin__nav-item ${activeTab === "testimonials" ? "active" : ""}`}
            onClick={() => setActiveTab("testimonials")}
          >
            <i className="uil uil-comment-message"></i> Testimonials
          </div>
          <div
            className={`admin__nav-item ${activeTab === "memories" ? "active" : ""}`}
            onClick={() => setActiveTab("memories")}
          >
            <i className="uil uil-image-v"></i> Memories
          </div>
          <div
            className={`admin__nav-item ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            <i className="uil uil-book-open"></i> Blogs Section
          </div>
          <div
            className={`admin__nav-item ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveTab("seo")}
          >
            <i className="uil uil-search"></i> Google SEO
          </div>
          <div
            className={`admin__nav-item ${activeTab === "sitemap" ? "active" : ""}`}
            onClick={() => setActiveTab("sitemap")}
          >
            <i className="uil uil-sitemap"></i> Sitemap Manager
          </div>
          <div
            className={`admin__nav-item ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            <i className="uil uil-file-bookmark-alt"></i> Resources Catalog
          </div>
          <div
            className={`admin__nav-item ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            <i className="uil uil-terminal"></i> Console Manager
          </div>
          <div
            className={`admin__nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="uil uil-key-skeleton"></i> Account Security
          </div>
        </div>

        <div className="admin__sidebar-footer">
          <button className="admin__btn admin__btn--secondary" onClick={() => navigate("/")}>
            <i className="uil uil-arrow-left"></i> View Portfolio
          </button>

          <button className="admin__logout-btn" onClick={handleLogout}>
            <i className="uil uil-sign-out-alt"></i> Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin__content">
        {/* TAB 1: HOME & ABOUT */}
        {activeTab === "home-about" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Home & About Sections</h2>
                <span className="admin__content-subtitle">Manage text descriptions and counters</span>
              </div>
            </div>

            <form onSubmit={handleSaveHomeAbout} className="admin__form-card">
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1.5rem" }}>Home Content</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group">
                  <label className="admin__form-label">Full Name</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sub-headline / Title</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={homeSubtitle}
                    onChange={(e) => setHomeSubtitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Short Description</label>
                  <textarea
                    className="admin__form-textarea"
                    value={homeDescription}
                    onChange={(e) => setHomeDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Home Profile Image (URL or Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="Image URL or Local Upload"
                      value={homeImageUrl.startsWith("data:image") ? "Local Image File Uploaded" : homeImageUrl}
                      onChange={(e) => setHomeImageUrl(e.target.value)}
                      disabled={homeImageUrl.startsWith("data:image")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-image-plus"></i> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, setHomeImageUrl)}
                      />
                    </label>
                    {homeImageUrl && (
                      <button 
                        type="button" 
                        className="admin__action-btn admin__action-btn--delete" 
                        onClick={() => setHomeImageUrl("")} 
                        style={{ height: "100%", width: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove Image"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="admin__form-title" style={{ textAlign: "left", margin: "2rem 0 1.5rem" }}>About Content</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Introduction / Biography</label>
                  <textarea
                    className="admin__form-textarea"
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Experience Years Badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutExpYears}
                    onChange={(e) => setAboutExpYears(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Completed Projects Badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutProjects}
                    onChange={(e) => setAboutProjects(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Support availability badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutSupport}
                    onChange={(e) => setAboutSupport(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">CV / Resume PDF (URL or File Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="PDF URL or Local Upload"
                      value={aboutCvUrl.startsWith("data:application/pdf") ? "Local PDF File Uploaded" : aboutCvUrl}
                      onChange={(e) => setAboutCvUrl(e.target.value)}
                      disabled={aboutCvUrl.startsWith("data:application/pdf")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-upload-alt"></i> Upload PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handlePdfUpload}
                      />
                    </label>
                    {aboutCvUrl && (
                      <button 
                        type="button" 
                        className="admin__action-btn admin__action-btn--delete" 
                        onClick={() => setAboutCvUrl("")} 
                        style={{ height: "100%", width: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove PDF"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">About Section Image (URL or Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="Image URL or Local Upload"
                      value={aboutImageUrl.startsWith("data:image") ? "Local Image File Uploaded" : aboutImageUrl}
                      onChange={(e) => setAboutImageUrl(e.target.value)}
                      disabled={aboutImageUrl.startsWith("data:image")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-image-plus"></i> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, setAboutImageUrl)}
                      />
                    </label>
                    {aboutImageUrl && (
                      <button 
                        type="button" 
                        className="admin__action-btn admin__action-btn--delete" 
                        onClick={() => setAboutImageUrl("")} 
                        style={{ height: "100%", width: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove Image"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                Save Text Updates
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SKILLS & JOURNEY */}
        {activeTab === "skills-qual" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Skills & Journey Timeline</h2>
                <span className="admin__content-subtitle">Manage languages, tools, and qualification markers</span>
              </div>
            </div>

            {/* Skills grid split */}
            <div className="admin__skills-section">
              {/* Frontend Skills List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Frontend Skills</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Skill</th>
                        <th>Level</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.skills.frontend.map((s, idx) => {
                        const isEditing = editingSkillKey === `frontend-${s.name}`;
                        return (
                          <tr
                            key={idx}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "frontend-skills")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "frontend-skills")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "frontend-skills" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editSkillName}
                                    onChange={(e) => setEditSkillName(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <select
                                    className="admin__form-select"
                                    value={editSkillLevel}
                                    onChange={(e) => setEditSkillLevel(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto" }}
                                  >
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveSkillEdit("frontend", s.name)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelSkillEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{s.name}</td>
                                <td>{s.level}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditSkill("frontend", s)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteSkill("frontend", s.name)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backend Skills List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Backend Skills</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Skill</th>
                        <th>Level</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.skills.backend.map((s, idx) => {
                        const isEditing = editingSkillKey === `backend-${s.name}`;
                        return (
                          <tr
                            key={idx}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "backend-skills")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "backend-skills")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "backend-skills" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editSkillName}
                                    onChange={(e) => setEditSkillName(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <select
                                    className="admin__form-select"
                                    value={editSkillLevel}
                                    onChange={(e) => setEditSkillLevel(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto" }}
                                  >
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveSkillEdit("backend", s.name)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelSkillEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{s.name}</td>
                                <td>{s.level}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditSkill("backend", s)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteSkill("backend", s.name)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} className="admin__form-card" style={{ marginTop: "2rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>Add New Skill</h3>
              <div className="admin__form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Name</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Kotlin"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Level</label>
                  <select
                    className="admin__form-select"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Type</label>
                  <select
                    className="admin__form-select"
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value as any)}
                  >
                    <option value="frontend">Frontend Skill</option>
                    <option value="backend">Backend Skill</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin__btn admin__btn--primary">
                Add Skill
              </button>
            </form>

            {/* Qualifications Timeline management */}
            <div className="admin__skills-section" style={{ marginTop: "2rem" }}>
              {/* Education List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Education Timeline</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Title</th>
                        <th>Subtitle</th>
                        <th>Calendar</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.qualification.education.map((q, idx) => {
                        const isEditing = editingQualId === q.id;
                        return (
                          <tr
                            key={q.id}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "education")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "education")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "education" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualTitle}
                                    onChange={(e) => setEditQualTitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualSubtitle}
                                    onChange={(e) => setEditQualSubtitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualCalendar}
                                    onChange={(e) => setEditQualCalendar(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveQualificationEdit("education", q.id)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelQualificationEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{q.title}</td>
                                <td>{q.subtitle}</td>
                                <td>{q.calendar}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditQualification(q)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteQualification("education", q.id)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Experience List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Experience Timeline</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Title</th>
                        <th>Subtitle</th>
                        <th>Calendar</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.qualification.experience.map((q, idx) => {
                        const isEditing = editingQualId === q.id;
                        return (
                          <tr
                            key={q.id}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "experience")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "experience")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "experience" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualTitle}
                                    onChange={(e) => setEditQualTitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualSubtitle}
                                    onChange={(e) => setEditQualSubtitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualCalendar}
                                    onChange={(e) => setEditQualCalendar(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveQualificationEdit("experience", q.id)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelQualificationEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{q.title}</td>
                                <td>{q.subtitle}</td>
                                <td>{q.calendar}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditQualification(q)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteQualification("experience", q.id)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add Qualification form */}
            <form onSubmit={handleAddQualification} className="admin__form-card" style={{ marginTop: "2rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>Add Qualification Timeline Marker</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group">
                  <label className="admin__form-label">Degree / Job Title</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. BCA 2nd - 750"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Institution / Organization</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Seth GB Podar College"
                    value={qSubtitle}
                    onChange={(e) => setQSubtitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Calendar / Dates</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. 2023 - 24"
                    value={qCalendar}
                    onChange={(e) => setQCalendar(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Category</label>
                  <select
                    className="admin__form-select"
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                  >
                    <option value="education">Education Timeline</option>
                    <option value="experience">Experience Timeline</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin__btn admin__btn--primary">
                Add Timeline Marker
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === "projects" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Projects Portfolio</h2>
                <span className="admin__content-subtitle">Manage cases, project cards, and redirect code links</span>
              </div>
            </div>

            {/* Edit Project Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditProject} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Project
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. E-Commerce Platform"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category *</label>
                    <select
                      className="admin__form-select"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      required
                    >
                      <option value="Web App">Web App</option>
                      <option value="Android App">Android App</option>
                      <option value="Softwares">Softwares</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Demo URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. http://example.com"
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Buy URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Buy Me A Coffee product link"
                      value={projBuy}
                      onChange={(e) => setProjBuy(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">GitHub URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. GitHub link"
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Cover Image (URL or Upload File)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={projImage.startsWith("data:") ? "Local File Uploaded" : projImage}
                        onChange={(e) => setProjImage(e.target.value)}
                        disabled={projImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setProjImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetProjectForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Projects Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Links</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.projects.map((p, idx) => (
                    <tr
                      key={p.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "projects")}
                      onDragOver={(e) => handleDragOver(e, idx, "projects")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "projects" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={p.image} alt={p.title} className="admin__table-img" />
                      </td>
                      <td>{p.title}</td>
                      <td>{p.category}</td>
                      <td>
                        <div style={{ display: "flex", columnGap: "0.5rem", fontSize: "1.2rem" }}>
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-external-link-alt" title="Demo"></i>
                            </a>
                          )}
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-github" title="GitHub"></i>
                            </a>
                          )}
                          {p.buy && (
                            <a href={p.buy} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-coffee" title="Buy link"></i>
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditProject(p)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteProject(p.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Project Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddProject} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Project
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. E-Commerce Platform"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category *</label>
                    <select
                      className="admin__form-select"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      required
                    >
                      <option value="Web App">Web App</option>
                      <option value="Android App">Android App</option>
                      <option value="Softwares">Softwares</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Demo URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. http://example.com"
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Buy URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Buy Me A Coffee product link"
                      value={projBuy}
                      onChange={(e) => setProjBuy(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">GitHub URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. GitHub link"
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Cover Image (URL or Upload File)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={projImage.startsWith("data:") ? "Local File Uploaded" : projImage}
                        onChange={(e) => setProjImage(e.target.value)}
                        disabled={projImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setProjImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Project
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === "testimonials" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Clients Testimonials</h2>
                <span className="admin__content-subtitle">Manage client reviews and ratings</span>
              </div>
            </div>

            {/* Edit Testimonial Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditTestimonial} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Testimonial
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Name *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. John Doe"
                      value={tstTitle}
                      onChange={(e) => setTstTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Avatar (URL or File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={tstImage.startsWith("data:") ? "Local File Uploaded" : tstImage}
                        onChange={(e) => setTstImage(e.target.value)}
                        disabled={tstImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setTstImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Client Review / Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write review here..."
                      value={tstDescription}
                      onChange={(e) => setTstDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetTestimonialForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Testimonials Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Avatar</th>
                    <th>Client Name</th>
                    <th>Review</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.testimonials.map((t, idx) => (
                    <tr
                      key={t.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "testimonials")}
                      onDragOver={(e) => handleDragOver(e, idx, "testimonials")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "testimonials" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={t.image} alt={t.title} className="admin__table-img" style={{ borderRadius: "50%" }} />
                      </td>
                      <td>{t.title}</td>
                      <td>
                        <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                          {t.description}
                        </p>
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditTestimonial(t)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteTestimonial(t.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Testimonial Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddTestimonial} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Testimonial
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Name *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. John Doe"
                      value={tstTitle}
                      onChange={(e) => setTstTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Avatar (URL or File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={tstImage.startsWith("data:") ? "Local File Uploaded" : tstImage}
                        onChange={(e) => setTstImage(e.target.value)}
                        disabled={tstImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setTstImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Client Review / Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write review here..."
                      value={tstDescription}
                      onChange={(e) => setTstDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Testimonial
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: MEMORIES */}
        {activeTab === "memories" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Special Memories</h2>
                <span className="admin__content-subtitle">Manage timeline event photo groups</span>
              </div>
            </div>

            {/* Edit Memory Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditMemory} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Event Memory
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Event Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Hackathon Final"
                      value={memTitle}
                      onChange={(e) => setMemTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Date *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. March 2024"
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category Group</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. College, Hackathons"
                      value={memCategory}
                      onChange={(e) => setMemCategory(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Event Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write brief description..."
                      value={memDescription}
                      onChange={(e) => setMemDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Multiple image list inputs */}
                  <div className="admin__form-group admin__form-group--full">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <label className="admin__form-label">Event Photos List</label>
                      <button
                        type="button"
                        className="memories__form-add-photo-btn"
                        onClick={() => setMemImages([...memImages, ""])}
                      >
                        <i className="uil uil-plus-circle"></i> Add Image field
                      </button>
                    </div>

                    <div className="memories__form-photos-list">
                      {memImages.map((val, idx) => (
                        <div className="memories__form-photo-row" key={idx}>
                          <input
                            type="text"
                            className="admin__form-input"
                            placeholder="Image URL"
                            value={val.startsWith("data:") ? "Local File Uploaded" : val}
                            onChange={(e) => {
                              const updated = [...memImages];
                              updated[idx] = e.target.value;
                              setMemImages(updated);
                            }}
                            disabled={val.startsWith("data:")}
                            style={{ flexGrow: 1 }}
                          />
                          <label className="memories__form-file-label">
                            <i className="uil uil-upload-alt"></i> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleMemoryImageUpload(e, idx)}
                            />
                          </label>

                          {memImages.length > 1 && (
                            <i
                              className="uil uil-trash-alt memories__form-photo-remove"
                              onClick={() => setMemImages(memImages.filter((_, i) => i !== idx))}
                            ></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetMemoryForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Memories Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Cover</th>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Photos Count</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.memories.map((m, idx) => (
                    <tr
                      key={m.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "memories")}
                      onDragOver={(e) => handleDragOver(e, idx, "memories")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "memories" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={m.images[0]} alt={m.title} className="admin__table-img" />
                      </td>
                      <td>{m.title}</td>
                      <td>{m.date}</td>
                      <td>{m.category}</td>
                      <td>
                        <i className="uil uil-images"></i> {m.images.length}
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditMemory(m)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteMemory(m.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Memory Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddMemory} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Event Memory
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Event Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Hackathon Final"
                      value={memTitle}
                      onChange={(e) => setMemTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Date *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. March 2024"
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category Group</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. College, Hackathons"
                      value={memCategory}
                      onChange={(e) => setMemCategory(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Event Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write brief description..."
                      value={memDescription}
                      onChange={(e) => setMemDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Multiple image list inputs */}
                  <div className="admin__form-group admin__form-group--full">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <label className="admin__form-label">Event Photos List</label>
                      <button
                        type="button"
                        className="memories__form-add-photo-btn"
                        onClick={() => setMemImages([...memImages, ""])}
                      >
                        <i className="uil uil-plus-circle"></i> Add Image field
                      </button>
                    </div>

                    <div className="memories__form-photos-list">
                      {memImages.map((val, idx) => (
                        <div className="memories__form-photo-row" key={idx}>
                          <input
                            type="text"
                            className="admin__form-input"
                            placeholder="Image URL"
                            value={val.startsWith("data:") ? "Local File Uploaded" : val}
                            onChange={(e) => {
                              const updated = [...memImages];
                              updated[idx] = e.target.value;
                              setMemImages(updated);
                            }}
                            disabled={val.startsWith("data:")}
                            style={{ flexGrow: 1 }}
                          />
                          <label className="memories__form-file-label">
                            <i className="uil uil-upload-alt"></i> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleMemoryImageUpload(e, idx)}
                            />
                          </label>

                          {memImages.length > 1 && (
                            <i
                              className="uil uil-trash-alt memories__form-photo-remove"
                              onClick={() => setMemImages(memImages.filter((_, i) => i !== idx))}
                            ></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Event Memory
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 6: BLOGS */}
        {activeTab === "blogs" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Articles & Blog Posts</h2>
                <span className="admin__content-subtitle">Write and publish technical posts using the TipTap Notion editor</span>
              </div>
            </div>

            {/* Edit Blog Form */}
            {editingId && (
              <form onSubmit={handleEditBlog} className="admin__form-card" style={{ borderColor: "var(--title-color)", marginBottom: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Blog Post
                </h3>
                <div className="admin__form-grid" style={{ marginBottom: "1.5rem" }}>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Blog Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Mastering Reverse Engineering on iOS"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Cover Image (URL or Local File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={blogCoverImage.startsWith("data:") ? "Local File Uploaded" : blogCoverImage}
                        onChange={(e) => setBlogCoverImage(e.target.value)}
                        disabled={blogCoverImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="admin__btn admin__btn--secondary" style={{ display: "flex", alignItems: "center", cursor: "pointer", columnGap: "0.25rem", padding: "0.75rem 1.25rem", fontSize: "0.85rem" }}>
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setBlogCoverImage)}
                        />
                      </label>
                      {blogCoverImage && (
                        <button type="button" className="admin__btn admin__btn--danger" onClick={() => setBlogCoverImage("")} style={{ padding: "0.75rem" }}>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Publication Status</label>
                    <select
                      className="admin__form-input"
                      value={blogStatus}
                      onChange={(e) => setBlogStatus(e.target.value as "public" | "draft")}
                      style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "0.5rem" }}
                    >
                      <option value="public">Public (Published on site)</option>
                      <option value="draft">Draft (Hidden from site)</option>
                    </select>
                  </div>
                </div>

                <div className="admin__form-group admin__form-group--full" style={{ marginBottom: "1.5rem" }}>
                  <label className="admin__form-label">Post Content *</label>
                  <TipTapEditor content={blogContent} onChange={setBlogContent} />
                </div>

                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetBlogForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Blogs Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>Cover</th>
                    <th>Post Title</th>
                    <th>Date Published</th>
                    <th style={{ width: "100px" }}>Status</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(portfolioData.blogs || []).length > 0 ? (
                    portfolioData.blogs!.map((b) => (
                      <tr key={b.id}>
                        <td>
                          {b.coverImage ? (
                            <img src={b.coverImage} alt={b.title} className="admin__table-img" style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)" }}>No Cover</span>
                          )}
                        </td>
                        <td style={{ fontWeight: "600" }}>{b.title}</td>
                        <td style={{ fontFamily: "monospace" }}>{b.date}</td>
                        <td>
                          <span style={{
                            display: "inline-block",
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            borderRadius: "4px",
                            textAlign: "center",
                            textTransform: "capitalize",
                            backgroundColor: b.status === "draft" ? "rgba(100, 116, 139, 0.15)" : "rgba(34, 197, 94, 0.15)",
                            color: b.status === "draft" ? "#94a3b8" : "#22c55e",
                            border: b.status === "draft" ? "1px solid rgba(100, 116, 139, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)"
                          }}>
                            {b.status || "public"}
                          </span>
                        </td>
                        <td>
                          <div className="admin__table-actions">
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--edit"
                              onClick={() => startEditBlog(b)}
                              title="Edit Blog"
                            >
                              <i className="uil uil-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--delete"
                              onClick={() => handleDeleteBlog(b.id)}
                              title="Delete Blog"
                            >
                              <i className="uil uil-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--text-color-light)", padding: "2rem" }}>
                        No blog posts published yet. Write your first article below!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add New Blog Form */}
            {!editingId && (
              <form onSubmit={handleAddBlog} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create New Blog Post
                </h3>
                <div className="admin__form-grid" style={{ marginBottom: "1.5rem" }}>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Blog Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Mastering Reverse Engineering on iOS"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Cover Image (URL or Local File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={blogCoverImage.startsWith("data:") ? "Local File Uploaded" : blogCoverImage}
                        onChange={(e) => setBlogCoverImage(e.target.value)}
                        disabled={blogCoverImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="admin__btn admin__btn--secondary" style={{ display: "flex", alignItems: "center", cursor: "pointer", columnGap: "0.25rem", padding: "0.75rem 1.25rem", fontSize: "0.85rem" }}>
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setBlogCoverImage)}
                        />
                      </label>
                      {blogCoverImage && (
                        <button type="button" className="admin__btn admin__btn--danger" onClick={() => setBlogCoverImage("")} style={{ padding: "0.75rem" }}>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Publication Status</label>
                    <select
                      className="admin__form-input"
                      value={blogStatus}
                      onChange={(e) => setBlogStatus(e.target.value as "public" | "draft")}
                      style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "0.5rem" }}
                    >
                      <option value="public">Public (Published on site)</option>
                      <option value="draft">Draft (Hidden from site)</option>
                    </select>
                  </div>
                </div>

                <div className="admin__form-group admin__form-group--full" style={{ marginBottom: "1.5rem" }}>
                  <label className="admin__form-label">Post Content *</label>
                  <TipTapEditor content={blogContent} onChange={setBlogContent} />
                </div>

                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Blog Post
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 7: GOOGLE SEO & SITELINKS */}
        {activeTab === "seo" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Google SEO & Sitelinks</h2>
                <span className="admin__content-subtitle">Optimize search results and configure sub-route listings</span>
              </div>
            </div>

            {/* Google Search Real-time Preview */}
            <div className="admin__form-card" style={{ marginBottom: "2rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                <i className="uil uil-eye"></i> Google Search Snippet Preview
              </h3>
              <span className="admin__content-subtitle" style={{ marginBottom: "1.5rem", display: "block" }}>
                This is a live simulation of how your portfolio site appears in Google search engine result pages (SERPs)
              </span>

              <div className="google-preview-card" style={{
                backgroundColor: "#fff",
                color: "#4d5156",
                fontFamily: "arial, sans-serif",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #dadce0",
                boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
                maxWidth: "600px",
                textAlign: "left"
              }}>
                {/* Google Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
                  <div style={{
                    backgroundColor: "#f1f3f4",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.5rem"
                  }}>
                    {seoFaviconUrl ? (
                      <img src={seoFaviconUrl} alt="Favicon" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                    ) : (
                      <i className="uil uil-globe" style={{ color: "#5f6368", fontSize: "1rem" }}></i>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: "#202124", lineHeight: "1.2", fontWeight: "400" }}>{seoSiteTitle || "Upgrader Boy"}</span>
                    <span style={{ fontSize: "0.75rem", color: "#5f6368", lineHeight: "1.2" }}>https://upgraderboy.tech</span>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  color: "#1a0dab",
                  fontSize: "1.25rem",
                  fontWeight: "400",
                  lineHeight: "1.3",
                  margin: "0.25rem 0 0.5rem 0",
                  textDecoration: "none"
                }}>
                  {seoSiteTitle || "Upgrader Boy"} - Portfolio, Blogs, Projects
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: "0.875rem",
                  color: "#4d5156",
                  lineHeight: "1.58",
                  margin: "0 0 1rem 0",
                  wordWrap: "break-word"
                }}>
                  {seoSiteDescription || "Tech. That Makes Trends"}
                </p>

                {/* Sitelinks 2x2 Grid */}
                {seoRoutes.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #ebebeb"
                  }}>
                    {seoRoutes.map((r) => (
                      <div key={r.id} style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                        <h4 style={{
                          color: "#1a0dab",
                          fontSize: "0.95rem",
                          fontWeight: "400",
                          margin: "0 0 0.25rem 0"
                        }}>
                          {r.title}
                        </h4>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#4d5156",
                          lineHeight: "1.4"
                        }}>
                          {r.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Meta Settings Form */}
            <form onSubmit={handleSaveSeo} className="admin__form-card">
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1.5rem" }}>Main Metadata</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Google Search Title (Brand/Site Name)</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Upgrader Boy"
                    value={seoSiteTitle}
                    onChange={(e) => setSeoSiteTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Favicon Icon (URL or Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="Favicon URL or Local Upload"
                      value={seoFaviconUrl.startsWith("data:") ? "Local Favicon File Uploaded" : seoFaviconUrl}
                      onChange={(e) => setSeoFaviconUrl(e.target.value)}
                      disabled={seoFaviconUrl.startsWith("data:")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-upload-alt"></i> Upload Favicon
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, setSeoFaviconUrl)}
                      />
                    </label>
                    {seoFaviconUrl && (
                      <button 
                        type="button" 
                        className="admin__action-btn admin__action-btn--delete" 
                        onClick={() => setSeoFaviconUrl("")} 
                        style={{ height: "100%", width: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove Favicon"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Main Search Description (Slogan/Meta tag)</label>
                  <textarea
                    className="admin__form-textarea"
                    placeholder="e.g. Tech. That Makes Trends"
                    value={seoSiteDescription}
                    onChange={(e) => setSeoSiteDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                Save Main SEO Metadata
              </button>
            </form>
          </div>
        )}

        {/* TAB 7.5: SITEMAP MANAGER */}
        {activeTab === "sitemap" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Sitemap XML Manager & Sitelinks</h2>
                <span className="admin__content-subtitle">
                  Configure crawling priorities, update frequencies, and customize Google search sitelink routes:
                </span>
              </div>
            </div>

            {/* Configured Sitemap Routes List */}
            <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
              <i className="uil uil-list-ui-alt"></i> Configured Sitelinks & Static Routes ({seoRoutes.length})
            </h3>
            <div className="admin__table-container" style={{ marginBottom: "2rem" }}>
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Sub-route Path</th>
                    <th>Search Title</th>
                    <th>Sub-link Description</th>
                    <th>Change Freq</th>
                    <th>Priority</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seoRoutes.length > 0 ? (
                    seoRoutes.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: "600", fontFamily: "monospace", color: "var(--green-color)" }}>{r.path}</td>
                        <td style={{ fontWeight: "600" }}>{r.title}</td>
                        <td>{r.description}</td>
                        <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{r.changefreq || "weekly"}</td>
                        <td style={{ fontWeight: "600", fontFamily: "monospace" }}>{r.priority !== undefined ? r.priority : "0.50"}</td>
                        <td>
                          <div className="admin__table-actions">
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--edit"
                              onClick={() => startEditSeoRoute(r)}
                              title="Edit Sitelink"
                            >
                              <i className="uil uil-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--delete"
                              onClick={() => handleDeleteSeoRoute(r.id)}
                              title="Delete Sitelink"
                            >
                              <i className="uil uil-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "var(--text-color-light)", padding: "2rem" }}>
                        No Google sub-routes configured yet. Add routes below to display under search results!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add / Edit Sitelink Form */}
            <form onSubmit={handleAddSeoRoute} className="admin__form-card" style={{ marginBottom: "3rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                <i className="uil uil-plus-circle"></i> {editingId ? "Edit Sub-route Sitelink" : "Add New Sub-route Sitelink"}
              </h3>
              <div className="admin__form-grid" style={{ marginBottom: "1.5rem" }}>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sub-route URL Path *</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. /resources (must start with '/')"
                    value={routePath}
                    onChange={(e) => setRoutePath(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sub-route Title *</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Resources"
                    value={routeTitle}
                    onChange={(e) => setRouteTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Sub-link Search Description *</label>
                  <textarea
                    className="admin__form-textarea"
                    placeholder="e.g. All Tech Resources by Upgrader Boy"
                    value={routeDescription}
                    onChange={(e) => setRouteDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sitemap Change Frequency</label>
                  <select
                    className="admin__form-input"
                    value={routeChangeFreq}
                    onChange={(e) => setRouteChangeFreq(e.target.value)}
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sitemap Priority (0.1 - 1.0)</label>
                  <input
                    type="number"
                    className="admin__form-input"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={routePriority}
                    onChange={(e) => setRoutePriority(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="admin__btn admin__btn--primary">
                  {editingId ? "Update Sitelink" : "Create Sitelink"}
                </button>
                {editingId && (
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetSeoRouteForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Sitemap XML Auto-Generated Previews */}
            <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
              <i className="uil uil-file-code-alt"></i> Auto-Generated Dynamic Entries Preview
            </h3>
            <span className="admin__content-subtitle" style={{ display: "block", marginBottom: "1rem" }}>
              These dynamic pages are automatically crawled and appended to your <code>sitemap.xml</code> mapping at build-time:
            </span>

            <div className="admin__table-container" style={{ marginBottom: "3rem" }}>
              <table className="admin__table" style={{ opacity: 0.85 }}>
                <thead>
                  <tr>
                    <th>Dynamic URL</th>
                    <th>Type</th>
                    <th>Change Freq</th>
                    <th>Default Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: "monospace" }}>https://upgraderboy.tech/</td>
                    <td style={{ fontWeight: "600", color: "var(--title-color)" }}>Homepage</td>
                    <td style={{ fontFamily: "monospace" }}>daily</td>
                    <td style={{ fontWeight: "600", fontFamily: "monospace" }}>1.0</td>
                  </tr>
                  {(portfolioData.blogs || []).filter(b => b.status !== "draft").map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: "monospace" }}>https://upgraderboy.tech/blogs/{b.id}</td>
                      <td>Blog Post: {b.title}</td>
                      <td style={{ fontFamily: "monospace" }}>weekly</td>
                      <td style={{ fontFamily: "monospace" }}>0.7</td>
                    </tr>
                  ))}
                  {(portfolioData.projects || []).map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "monospace" }}>https://upgraderboy.tech/projects?id={p.id}</td>
                      <td>Project: {p.title}</td>
                      <td style={{ fontFamily: "monospace" }}>monthly</td>
                      <td style={{ fontFamily: "monospace" }}>0.6</td>
                    </tr>
                  ))}
                  {(portfolioData.memories || []).map(m => (
                    <tr key={m.id}>
                      <td style={{ fontFamily: "monospace" }}>https://upgraderboy.tech/memories?id={m.id}</td>
                      <td>Memory: {m.title}</td>
                      <td style={{ fontFamily: "monospace" }}>monthly</td>
                      <td style={{ fontFamily: "monospace" }}>0.5</td>
                    </tr>
                  ))}
                  {(portfolioData.resources || []).map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: "monospace" }}>https://upgraderboy.tech/resources?id={r.id}</td>
                      <td>Resource: {r.title}</td>
                      <td style={{ fontFamily: "monospace" }}>weekly</td>
                      <td style={{ fontFamily: "monospace" }}>0.6</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: RESOURCES CATALOG */}
        {activeTab === "resources" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Resources Catalog</h2>
                <span className="admin__content-subtitle">Manage study resources, books, papers, and dynamic nested categories</span>
              </div>
            </div>

            {/* Part 1: Category Tree Administration */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem", marginBottom: "2rem" }} className="admin__form-grid--two-columns">
              {/* Category Tree Visualizer */}
              <div className="admin__form-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                  <i className="uil uil-folder-open"></i> Hierarchical Category Tree
                </h3>
                <span className="admin__content-subtitle" style={{ display: "block", marginBottom: "1.5rem" }}>
                  Click a category node to highlight it as the parent folder, or click [+] next to a node to add a subcategory.
                </span>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "0.5rem", 
                  backgroundColor: "rgba(100, 116, 139, 0.03)", 
                  padding: "1rem", 
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(100, 116, 139, 0.15)",
                  maxHeight: "350px",
                  overflowY: "auto"
                }}>
                  {(portfolioData.resourceCategories || []).length > 0 ? (
                    (portfolioData.resourceCategories || []).map((cat) => renderCategoryTreeNode(cat))
                  ) : (
                    <span style={{ color: "var(--text-color-light)", fontSize: "0.85rem", fontStyle: "italic" }}>
                      No categories configured yet. Create one on the right!
                    </span>
                  )}
                </div>
              </div>

              {/* Add / Nest Category Node Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <form onSubmit={handleAddCategory} className="admin__form-card">
                  <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                    <i className="uil uil-plus-circle"></i> Add Category Node
                  </h3>
                  {selectedParentCategory ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--green-color)", fontWeight: "600", display: "block", marginBottom: "1rem" }}>
                      Adding subcategory under: {resolveCategoryPathNames([selectedParentCategory])}
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-color-light)", display: "block", marginBottom: "1rem" }}>
                      No node selected. Adding Category at Root level.
                    </span>
                  )}

                  <div className="admin__form-group" style={{ marginBottom: "1rem" }}>
                    <label className="admin__form-label">Category Node Name *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. AI & ML, Operating Systems"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="admin__btn admin__btn--primary">Add Node</button>
                    {selectedParentCategory && (
                      <button 
                        type="button" 
                        className="admin__btn admin__btn--secondary" 
                        onClick={() => setSelectedParentCategory("")}
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Part 2: Add/Edit Resource Form */}
            <form onSubmit={handleAddResource} className="admin__form-card">
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                <i className="uil uil-file-plus-alt"></i> {editingId ? "Edit Resource Document" : "Add New Resource Document"}
              </h3>
              <div className="admin__form-grid" style={{ marginBottom: "1.5rem" }}>
                <div className="admin__form-group">
                  <label className="admin__form-label">Resource Title *</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Introduction to Algorithms 3rd Ed."
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Source / Author (Optional)</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Thomas H. Cormen, or My Hand Notes"
                    value={resSource}
                    onChange={(e) => setResSource(e.target.value)}
                  />
                </div>
                
                {/* PDF URL Input / Local Uploader */}
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">PDF File Document * (URL or Local File Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="PDF Document URL"
                      value={resPdfUrl.startsWith("data:") ? "Local PDF Document File Uploaded" : resPdfUrl}
                      onChange={(e) => setResPdfUrl(e.target.value)}
                      disabled={resPdfUrl.startsWith("data:")}
                      style={{ flexGrow: 1 }}
                      required
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-upload-alt"></i> Upload PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handlePdfUpload}
                      />
                    </label>
                    {resPdfUrl && (
                      <button type="button" className="admin__btn admin__btn--danger" onClick={() => setResPdfUrl("")} style={{ padding: "0.75rem" }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Cover Thumbnail Image URL Input / Local Uploader */}
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">PDF Cover Image Thumbnail (URL or Local Image Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="Image URL or Local Upload"
                      value={resThumbnailUrl.startsWith("data:") ? "Local Image File Uploaded" : resThumbnailUrl}
                      onChange={(e) => setResThumbnailUrl(e.target.value)}
                      disabled={resThumbnailUrl.startsWith("data:")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-image-plus"></i> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, setResThumbnailUrl)}
                      />
                    </label>
                    {resThumbnailUrl && (
                      <button type="button" className="admin__btn admin__btn--danger" onClick={() => setResThumbnailUrl("")} style={{ padding: "0.75rem" }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Cascading Category Selectors */}
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Category Path Assignment *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    {/* Selector Level 1 */}
                    <select
                      className="admin__form-input"
                      style={{ minWidth: "150px", flex: 1 }}
                      value={resCategoryPath[0] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResCategoryPath(val ? [val] : []);
                      }}
                      required
                    >
                      <option value="">-- Choose Root Category --</option>
                      {(portfolioData.resourceCategories || []).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    {/* Selector Level 2 */}
                    {resCategoryPath.length > 0 && (() => {
                      const root = (portfolioData.resourceCategories || []).find((c) => c.id === resCategoryPath[0]);
                      if (root && root.children && root.children.length > 0) {
                        return (
                          <>
                            <i className="uil uil-angle-right" style={{ color: "var(--text-color-light)" }}></i>
                            <select
                              className="admin__form-input"
                              style={{ minWidth: "150px", flex: 1 }}
                              value={resCategoryPath[1] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  setResCategoryPath([resCategoryPath[0], val]);
                                } else {
                                  setResCategoryPath([resCategoryPath[0]]);
                                }
                              }}
                            >
                              <option value="">-- Choose Subcategory (L2) --</option>
                              {root.children.map((child) => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                              ))}
                            </select>
                          </>
                        );
                      }
                      return null;
                    })()}

                    {/* Selector Level 3 */}
                    {resCategoryPath.length > 1 && (() => {
                      const root = (portfolioData.resourceCategories || []).find((c) => c.id === resCategoryPath[0]);
                      const sub = root?.children?.find((c) => c.id === resCategoryPath[1]);
                      if (sub && sub.children && sub.children.length > 0) {
                        return (
                          <>
                            <i className="uil uil-angle-right" style={{ color: "var(--text-color-light)" }}></i>
                            <select
                              className="admin__form-input"
                              style={{ minWidth: "150px", flex: 1 }}
                              value={resCategoryPath[2] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  setResCategoryPath([resCategoryPath[0], resCategoryPath[1], val]);
                                } else {
                                  setResCategoryPath([resCategoryPath[0], resCategoryPath[1]]);
                                }
                              }}
                            >
                              <option value="">-- Choose Subcategory (L3) --</option>
                              {sub.children.map((child) => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                              ))}
                            </select>
                          </>
                        );
                      }
                      return null;
                    })()}

                    {/* Selector Level 4 */}
                    {resCategoryPath.length > 2 && (() => {
                      const root = (portfolioData.resourceCategories || []).find((c) => c.id === resCategoryPath[0]);
                      const sub = root?.children?.find((c) => c.id === resCategoryPath[1]);
                      const subSub = sub?.children?.find((c) => c.id === resCategoryPath[2]);
                      if (subSub && subSub.children && subSub.children.length > 0) {
                        return (
                          <>
                            <i className="uil uil-angle-right" style={{ color: "var(--text-color-light)" }}></i>
                            <select
                              className="admin__form-input"
                              style={{ minWidth: "150px", flex: 1 }}
                              value={resCategoryPath[3] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  setResCategoryPath([resCategoryPath[0], resCategoryPath[1], resCategoryPath[2], val]);
                                } else {
                                  setResCategoryPath([resCategoryPath[0], resCategoryPath[1], resCategoryPath[2]]);
                                }
                              }}
                            >
                              <option value="">-- Choose Subcategory (L4) --</option>
                              {subSub.children.map((child) => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                              ))}
                            </select>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <span className="admin__content-subtitle" style={{ marginTop: "0.5rem", display: "block" }}>
                    Select categories cascadingly. Unselected sub-levels remain general.
                  </span>
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Search Tags (Comma-separated)</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. algorithm, dsa, cormen, book"
                    value={resTags}
                    onChange={(e) => setResTags(e.target.value)}
                  />
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Short Description *</label>
                  <textarea
                    className="admin__form-textarea"
                    placeholder="Provide a quick summary of what this document covers..."
                    value={resDescription}
                    onChange={(e) => setResDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="admin__btn admin__btn--primary">
                  {editingId ? "Update Resource" : "Publish Resource"}
                </button>
                {(editingId || resTitle || resDescription || resPdfUrl) && (
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetResourceForm}>
                    Clear Form
                  </button>
                )}
              </div>
            </form>

            {/* Part 3: Resources catalog table */}
            <h3 className="admin__form-title" style={{ textAlign: "left", margin: "2rem 0 1rem" }}>Active Catalog Resources</h3>
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Category Path Hierarchy</th>
                    <th>Tags</th>
                    <th>Source</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(portfolioData.resources || []).length > 0 ? (
                    (portfolioData.resources || []).map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: "600" }}>
                          <span style={{ marginRight: "0.5rem", color: "var(--green-color)" }}><i className="uil uil-file-pdf"></i></span>
                          {r.title}
                        </td>
                        <td style={{ fontSize: "0.85rem", fontWeight: "500" }}>{resolveCategoryPathNames(r.categoryPath)}</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                            {r.tags.map((t, idx) => (
                              <span key={idx} className="admin__tag" style={{ fontSize: "0.7rem", padding: "0.1rem 0.35rem" }}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td>{r.source || <span style={{ color: "var(--text-color-light)", fontStyle: "italic" }}>None</span>}</td>
                        <td>
                          <div className="admin__table-actions">
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--edit"
                              onClick={() => startEditResource(r)}
                              title="Edit Resource"
                            >
                              <i className="uil uil-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--delete"
                              onClick={() => handleDeleteResource(r.id)}
                              title="Delete Resource"
                            >
                              <i className="uil uil-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--text-color-light)", padding: "2rem" }}>
                        No catalog resources uploaded yet. Publish your first document above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Direct PDF Viewer Cards Preview */}
            <h3 className="admin__form-title" style={{ textAlign: "left", margin: "3rem 0 1rem" }}>
              <i className="uil uil-eye"></i> Dynamic PDF Viewer & Cards Grid
            </h3>
            <span className="admin__content-subtitle" style={{ display: "block", marginBottom: "1.5rem" }}>
              Review published resources, read documents, and interact with the 3D flipbook directly inside your control panel:
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }} className="admin__form-grid--two-columns">
              {(portfolioData.resources || []).length > 0 ? (
                (portfolioData.resources || []).map((r) => (
                  <div key={r.id} className="admin__form-card" style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--green-color)", fontWeight: "600", textTransform: "uppercase" }}>
                          {resolveCategoryPathNames(r.categoryPath)}
                        </span>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--title-color)", marginTop: "0.25rem" }}>{r.title}</h4>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", fontFamily: "monospace" }}>{r.dateAdded}</span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-color)", lineBreak: "auto", margin: 0 }}>{r.description}</p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                      {r.tags.map((t: string, idx: number) => (
                        <span key={idx} className="admin__tag" style={{ fontSize: "0.7rem" }}>#{t}</span>
                      ))}
                      {r.source && (
                        <span className="admin__tag" style={{ fontSize: "0.7rem", backgroundColor: "rgba(100, 116, 139, 0.1)", color: "var(--text-color-light)" }}>
                          Source: {r.source}
                        </span>
                      )}
                    </div>

                    {/* Compact Interactive 3D Flipbook Iframe */}
                    <div style={{ border: "1px solid rgba(100, 116, 139, 0.15)", borderRadius: "0.5rem", overflow: "hidden", height: "600px", backgroundColor: "#000" }}>
                      <iframe 
                        src={`/flipbook/index.html?file=${encodeURIComponent(r.id)}`} 
                        width="100%" 
                        height="100%" 
                        style={{ border: "none", display: "block" }} 
                        allowFullScreen
                      ></iframe>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "auto" }}>
                      <button
                        type="button"
                        className="admin__btn admin__btn--secondary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                        onClick={() => startEditResource(r)}
                      >
                        <i className="uil uil-edit"></i> Edit Details
                      </button>
                      <button
                        type="button"
                        className="admin__btn admin__btn--danger"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                        onClick={() => handleDeleteResource(r.id)}
                      >
                        <i className="uil uil-trash-alt"></i> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin__form-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-color-light)" }}>
                  No published documents available to display.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: CONSOLE MANAGER */}
        {activeTab === "console" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Console Command & Shell Customizer</h2>
                <span className="admin__content-subtitle">
                  Configure interactive terminal commands, descriptions, and text/HTML output responses:
                </span>
              </div>
            </div>

            <div className="admin__form-grid" style={{ marginBottom: "3rem" }}>
              {/* Command Form */}
              <form onSubmit={handleSaveTerminalCommand} className="admin__form-card">
                <h3 className="admin__form-title">
                  {editingId ? <><i className="uil uil-edit"></i> Edit Command</> : <><i className="uil uil-plus"></i> Add New Command</>}
                </h3>

                <div className="admin__form-group">
                  <label className="admin__form-label">Command Name <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. contact"
                    value={cmdCommand}
                    onChange={(e) => setCmdCommand(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", display: "block", marginTop: "0.25rem" }}>
                    The user types this key in the terminal. No spaces allowed (will be replaced with hyphens).
                  </span>
                </div>

                <div className="admin__form-group">
                  <label className="admin__form-label">Description <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Display developer contact methods"
                    value={cmdDescription}
                    onChange={(e) => setCmdDescription(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", display: "block", marginTop: "0.25rem" }}>
                    Shown when the user runs the 'help' command.
                  </span>
                </div>

                <div className="admin__form-group">
                  <label className="admin__form-label" style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={cmdIsHtml}
                      onChange={(e) => setCmdIsHtml(e.target.checked)}
                      style={{ transform: "scale(1.1)", cursor: "pointer" }}
                    />
                    Render Response as Rich HTML
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", display: "block", marginTop: "0.25rem", marginLeft: "1.3rem" }}>
                    Tick this if the output response contains HTML tags (like link anchors, colors, strong headers).
                  </span>
                </div>

                <div className="admin__form-group">
                  <label className="admin__form-label">Response payload <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <textarea
                    rows={8}
                    className="admin__form-input"
                    placeholder="Type plain text response, HTML template, or system macros like [SYSTEM_PROJECTS] / [SYSTEM_NEOFETCH]"
                    value={cmdResponse}
                    onChange={(e) => setCmdResponse(e.target.value)}
                    required
                    style={{ fontFamily: "monospace", fontSize: "0.85rem", resize: "vertical" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", display: "block", marginTop: "0.25rem" }}>
                    Use <strong>[SYSTEM_PROJECTS]</strong> to print the live portfolio projects index or <strong>[SYSTEM_NEOFETCH]</strong> for browser specs.
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    {editingId ? "Save Changes" : "Create Command"}
                  </button>
                  {editingId && (
                    <button type="button" className="admin__btn admin__btn--secondary" onClick={resetTerminalCommandForm}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Configured Commands Table */}
            <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
              <i className="uil uil-list-ui-alt"></i> Configured Shell Commands ({ (portfolioData.terminalCommands || []).length })
            </h3>
            
            <div className="admin__table-container" style={{ marginBottom: "3rem" }}>
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Command</th>
                    <th>Description</th>
                    <th>Render Mode</th>
                    <th>Preview Response</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(portfolioData.terminalCommands && portfolioData.terminalCommands.length > 0) ? (
                    portfolioData.terminalCommands.map((cmd) => (
                      <tr key={cmd.id} style={{ verticalAlign: "middle" }}>
                        <td style={{ fontWeight: "600", fontFamily: "monospace", color: "var(--green-color)" }}>
                          guest@upgraderboy:~$ {cmd.command}
                        </td>
                        <td style={{ fontSize: "0.88rem" }}>{cmd.description}</td>
                        <td>
                          <span 
                            style={{ 
                              padding: "0.2rem 0.5rem", 
                              borderRadius: "4px", 
                              fontSize: "0.75rem", 
                              fontWeight: "600",
                              background: cmd.isHtml ? "rgba(0, 255, 30, 0.08)" : "rgba(255, 255, 255, 0.05)",
                              color: cmd.isHtml ? "var(--green-color)" : "var(--text-color)",
                              border: cmd.isHtml ? "1px solid rgba(0, 255, 30, 0.2)" : "1px solid rgba(255, 255, 255, 0.1)"
                            }}
                          >
                            {cmd.isHtml ? "HTML" : "TEXT"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace", opacity: 0.8 }}>
                          {cmd.response}
                        </td>
                        <td>
                          <div className="admin__table-actions">
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--edit"
                              onClick={() => startEditTerminalCommand(cmd)}
                              title="Edit Command"
                            >
                              <i className="uil uil-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="admin__action-btn admin__action-btn--delete"
                              onClick={() => handleDeleteTerminalCommand(cmd.id)}
                              title="Delete Command"
                            >
                              <i className="uil uil-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--text-color-light)", padding: "2rem" }}>
                        No terminal commands configured. Add commands above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ACCOUNT SECURITY */}
        {activeTab === "security" && (
          <div>
            <div className="admin__content-header">
              <h2 className="admin__content-title">Account Security</h2>
              <span className="admin__content-subtitle">Update CMS Dashboard login credentials</span>
            </div>

            <div className="admin__card">
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                <i className="uil uil-key-skeleton"></i> Change Admin Credentials
              </h3>

              {securitySuccess && (
                <div style={{ color: "var(--green-color)", fontWeight: "500", marginBottom: "1rem", fontSize: "0.95rem" }}>
                  {securitySuccess}
                </div>
              )}
              {securityError && (
                <div style={{ color: "red", fontWeight: "500", marginBottom: "1rem", fontSize: "0.95rem" }}>
                  {securityError}
                </div>
              )}

              <form onSubmit={handleUpdateCredentials} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "500px" }}>
                <div className="admin__form-group">
                  <label className="admin__form-label">Current Admin Password <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <input
                    type="password"
                    className="admin__form-input"
                    placeholder="Enter current password to verify identity"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    required
                  />
                </div>

                <div className="admin__form-group">
                  <label className="admin__form-label">New Admin Username <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="Username"
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value)}
                    required
                  />
                </div>

                <div className="admin__form-group">
                  <label className="admin__form-label">New Admin Password <span style={{ color: "var(--green-color)" }}>*</span></label>
                  <input
                    type="password"
                    className="admin__form-input"
                    placeholder="Password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="admin__btn admin__btn--primary" 
                  disabled={securityLoading}
                  style={{ alignSelf: "flex-start", padding: "0.75rem 2rem" }}
                >
                  {securityLoading ? "Updating..." : "Update Credentials"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
