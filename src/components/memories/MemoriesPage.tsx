import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import { MemoryItem } from "../db/portfolioDb";
import "./memories.css";

interface MemoriesPageProps {
  navigate: (to: string) => void;
}

const MemoriesPage: React.FC<MemoriesPageProps> = ({ navigate }) => {
  const { fetchMemories, portfolioData } = usePortfolioData();
  const [allMemories, setAllMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Lightbox State
  const [selectedEvent, setSelectedEvent] = useState<MemoryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [lightboxActive, setLightboxActive] = useState<boolean>(false);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch all memories dynamically
  useEffect(() => {
    let active = true;
    fetchMemories().then((list) => {
      if (active) {
        setAllMemories(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.memories, fetchMemories]);

  // Filter memories based on search term
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredMemories(allMemories);
    } else {
      const filtered = allMemories.filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.description.toLowerCase().includes(term) ||
          (m.category && m.category.toLowerCase().includes(term))
      );
      setFilteredMemories(filtered);
    }
    setCurrentPage(1); // Reset page on search
  }, [searchTerm, allMemories]);

  // Pagination calculations
  const totalItems = filteredMemories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemories = filteredMemories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Lightbox controls
  const openLightbox = (event: MemoryItem) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setLightboxActive(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxActive(false);
    setSelectedEvent(null);
    document.body.style.overflow = "unset";
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedEvent) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedEvent) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxActive) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxActive, selectedEvent]);

  return (
    <div className="blogs-page__container" style={{ padding: "6rem 1.5rem 4rem 1.5rem" }}>
      {/* Header */}
      <header className="blogs-page__header" style={{ marginBottom: "2rem" }}>
        <h1 className="blogs-page__title">Memories Gallery</h1>
        <p className="blogs-page__subtitle">Capturing moments, achievements, and special events over time</p>
      </header>

      {/* Navigation & Search Bar */}
      <div className="blogs-page__nav" style={{ marginBottom: "2.5rem" }}>
        <button className="blogs-page__back-btn" onClick={() => navigate("/")}>
          <i className="uil uil-arrow-left"></i> Back to Portfolio
        </button>

        <div className="blogs-page__search-wrapper">
          <i className="uil uil-search blogs-page__search-icon"></i>
          <input
            type="text"
            className="blogs-page__search-input"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading ? (
        <div className="memories__container container grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="memories__card skeleton-shimmer" key={n} style={{ border: "1px solid var(--border-color)", borderRadius: "1.25rem", padding: "1.5rem" }}>
              <div className="skeleton-item" style={{ height: "220px", borderRadius: "1rem", marginBottom: "1rem" }}></div>
              <div className="skeleton-item" style={{ height: "22px", width: "70%", marginBottom: "0.5rem" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "35%", marginBottom: "1rem" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "100%", marginBottom: "8px" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "85%", marginBottom: "1.5rem" }}></div>
              <div className="skeleton-item" style={{ height: "32px", width: "110px", borderRadius: "0.5rem" }}></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Memories Grid */}
          {currentMemories.length > 0 ? (
            <>
              <div className="memories__container container grid">
                {currentMemories.map((event) => {
                  const hasMultiple = event.images.length > 1;
                  return (
                    <div className="memories__card-wrapper" key={event.id}>
                      <div className="memories__card">
                        <div className="memories__scanner-line"></div>
                        <div className="memories__hud-bar">
                          <span className="memories__hud-status"><span className="memories__hud-blink">●</span> REC</span>
                          <span className="memories__hud-tag">{event.date}</span>
                        </div>
                        <div className="memories__img-wrapper">
                          <div className="memories__corner top-left"></div>
                          <div className="memories__corner top-right"></div>
                          <div className="memories__corner bottom-left"></div>
                          <div className="memories__corner bottom-right"></div>

                          <span className="memories__category">{event.category}</span>
                          {hasMultiple && (
                            <span className="memories__badge">
                              <i className="uil uil-images"></i> {event.images.length} Photos
                            </span>
                          )}
                          <img src={event.images[0]} alt={event.title} className="memories__img" />
                        </div>

                        <h3 className="memories__title">{event.title}</h3>
                        <p className="memories__description">{event.description}</p>

                        <button className="memories__button" onClick={() => openLightbox(event)}>
                          {hasMultiple ? "View Gallery" : "View Photo"}{" "}
                          <i className="uil uil-arrow-right memories__button-icon"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="memories__pagination" style={{ marginTop: "3rem" }}>
                  <button
                    className="memories__page-btn memories__page-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`memories__page-btn ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    className="memories__page-btn memories__page-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed var(--border-color)", borderRadius: "1rem", backgroundColor: "var(--container-color)", color: "var(--text-color-light)", gridColumn: "1 / -1" }}>
              <i className="uil uil-search-minus" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "var(--first-color)" }}></i>
              <h3 style={{ color: "var(--title-color)", marginBottom: "0.5rem" }}>No memories found</h3>
              <p>Try refining your search keyword or adjust the filter parameters.</p>
            </div>
          )}
        </>
      )}

      {/* Lightbox Modal */}
      <div className={`memories__modal ${lightboxActive ? "active" : ""}`} onClick={closeLightbox}>
        {selectedEvent && (
          <div className="memories__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <i className="uil uil-multiply memories__modal-close" onClick={closeLightbox}></i>

            <div className="memories__lightbox-slider">
              {selectedEvent.images.length > 1 && (
                <>
                  <button className="memories__lightbox-arrow memories__lightbox-arrow--prev" onClick={prevImage}>
                    <i className="uil uil-angle-left-b"></i>
                  </button>
                  <button className="memories__lightbox-arrow memories__lightbox-arrow--next" onClick={nextImage}>
                    <i className="uil uil-angle-right-b"></i>
                  </button>
                </>
              )}
              <img
                src={selectedEvent.images[currentImageIndex]}
                alt={`${selectedEvent.title} - ${currentImageIndex + 1}`}
                className="memories__lightbox-img"
                key={currentImageIndex}
              />
            </div>

            <div className="memories__lightbox-info">
              <h3 className="memories__lightbox-title">{selectedEvent.title}</h3>
              <p className="memories__lightbox-desc">{selectedEvent.description}</p>

              {selectedEvent.images.length > 1 && (
                <div className="memories__lightbox-dots">
                  {selectedEvent.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`memories__lightbox-dot ${idx === currentImageIndex ? "active" : ""}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriesPage;
