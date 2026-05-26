"use client";

import { useEffect, useRef, useState } from "react";
import { cards } from "../data/cards";

const navItems = [
  { label: "Start", href: "#image1-cloud" },
  { label: "01", href: "#info-card-1" },
  { label: "02", href: "#info-card-2" },
  { label: "03", href: "#info-card-3" },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assetPath = (path) => `${basePath}${path}`;
const homePath = `${basePath || ""}/`;

function InfoCard({ card, index }) {
  const number = String(index + 1).padStart(2, "0");
  const isEven = (index + 1) % 2 === 0;

  return (
    <article
      id={`info-card-${index + 1}`}
      className={`info-card ${isEven ? "info-card-flex-row-reverse" : ""}`}
    >
      <div
        className={`info-serial-no ${isEven ? "info-serial-no-even" : ""}`}
        aria-hidden="true"
      >
        {number}
      </div>
      <div className={`half-box-text ${isEven ? "half-box-text-even" : ""}`}>
        <div className="subtitle">
          <span className="start-dash" />
          <span className="subtitle-text font-roboto">{card.subtitle}</span>
        </div>
        <h2 className="title">{card.title}</h2>
        <p className="description">{card.description}</p>
        <a className="read-more" href={homePath}>
          <span>czytaj dalej</span>
          <img src={assetPath("/assets/icons/right-arrow.svg")} alt="" />
        </a>
      </div>
      <div className={`half-box-image ${isEven ? "half-box-image-even" : ""}`}>
        <img className="info-image" src={assetPath(card.image)} alt={card.title} />
      </div>
    </article>
  );
}

export default function MountainsLanding() {
  const rightSideNavRef = useRef(null);
  const sectionIndicatorRef = useRef(null);
  const heroPlaceholderRef = useRef(null);
  const heroSectionRef = useRef(null);
  const image1CloudRef = useRef(null);
  const image2MountainsRef = useRef(null);
  const image3PersonRef = useRef(null);
  const bgLayer3Ref = useRef(null);
  const layerBackgroundColorRef = useRef(null);
  const mainContainerRef = useRef(null);
  const hideNavTimerRef = useRef(null);
  const [accountIcon, setAccountIcon] = useState("/assets/icons/profile-icon.svg");

  useEffect(() => {
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
    const observers = [];

    const showRightSideNav = () => {
      const rightSideNav = rightSideNavRef.current;
      if (!rightSideNav) return;
      rightSideNav.classList.remove("opacity-0");
      clearTimeout(hideNavTimerRef.current);
      hideNavTimerRef.current = setTimeout(() => {
        rightSideNav.classList.add("opacity-0");
      }, 1700);
    };

    showRightSideNav();

    const backgroundObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          if (ratio > 0.6) {
            if (sectionIndicatorRef.current) {
              sectionIndicatorRef.current.style.transform = "translateY(000%)";
            }
            showRightSideNav();
          }

          const boundedRatio = Math.max(0, Math.min(1, ratio));
          const slide = 150 * (1 - boundedRatio);
          const slide2 = 50 * (1 - boundedRatio);
          const slide3 = 20 * (1 - boundedRatio);

          entry.target.style.transform = `translateY(-${slide}px)`;
          if (image2MountainsRef.current) {
            image2MountainsRef.current.style.transform = `translateY(-${slide2}px)`;
          }
          if (bgLayer3Ref.current) {
            bgLayer3Ref.current.style.transform = `translateY(-${slide2}px)`;
          }
          if (image3PersonRef.current) {
            image3PersonRef.current.style.transform = `translateY(${slide3}px)`;
          }
        });
      },
      { threshold: thresholds },
    );

    const heroOpacityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (heroSectionRef.current) {
            heroSectionRef.current.style.opacity = entry.intersectionRatio;
          }
        });
      },
      { threshold: thresholds },
    );

    if (image1CloudRef.current) backgroundObserver.observe(image1CloudRef.current);
    if (heroPlaceholderRef.current) heroOpacityObserver.observe(heroPlaceholderRef.current);
    observers.push(backgroundObserver, heroOpacityObserver);

    const updateBackgroundHeight = () => {
      if (!mainContainerRef.current || !layerBackgroundColorRef.current) return;
      layerBackgroundColorRef.current.style.height = `${mainContainerRef.current.offsetHeight + 200}px`;
    };

    updateBackgroundHeight();
    window.addEventListener("resize", updateBackgroundHeight);

    const animateCardImage = (entry, direction) => {
      const card = entry.target.closest(".info-card");
      const startDash = card?.querySelector(".start-dash");
      const ratio = entry.intersectionRatio;

      if (ratio > 0.6 && card && sectionIndicatorRef.current) {
        const index = card.querySelector(".info-serial-no")?.textContent || "00";
        sectionIndicatorRef.current.style.transform = `translateY(${index}00%)`;
        showRightSideNav();
      }

      if (entry.boundingClientRect.top < 0) return;

      const slideAmount = 50 - ratio * 50;
      entry.target.style.transform =
        direction === "odd" ? `translateX(${slideAmount}px)` : `translateX(-${slideAmount}px)`;
      entry.target.style.opacity = 0.3 + ratio * 0.7;
      if (startDash) {
        startDash.style.maxWidth = `${Math.min((72 * (ratio * 100 + 30)) / 100, 72)}px`;
      }
    };

    const oddCardObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => animateCardImage(entry, "odd")),
      { threshold: thresholds },
    );
    const evenCardObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => animateCardImage(entry, "even")),
      { threshold: thresholds },
    );
    const slideUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top < 0) return;
          const slideAmount = 20 - 20 * entry.intersectionRatio;
          entry.target.style.transform = `translateY(${slideAmount}px)`;
        });
      },
      { threshold: thresholds },
    );

    document.querySelectorAll(".info-image").forEach((img, index) => {
      if ((index + 1) % 2 === 0) evenCardObserver.observe(img);
      else oddCardObserver.observe(img);
    });
    document
      .querySelectorAll(".info-card .title, .info-card .description, .info-card .read-more")
      .forEach((element) => slideUpObserver.observe(element));
    observers.push(oddCardObserver, evenCardObserver, slideUpObserver);

    return () => {
      clearTimeout(hideNavTimerRef.current);
      window.removeEventListener("resize", updateBackgroundHeight);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleAccountEnter = () => setAccountIcon("/assets/icons/profile-icon-yellow.svg");
  const handleAccountLeave = () => setAccountIcon("/assets/icons/profile-icon.svg");

  return (
    <>
      <div ref={layerBackgroundColorRef} className="layer-background-color" aria-hidden="true" />
      <div ref={heroPlaceholderRef} className="hero-section-view-placeholder" />
      <aside
        ref={rightSideNavRef}
        className="right-side-nav"
        onMouseEnter={() => rightSideNavRef.current?.classList.remove("opacity-0")}
        onMouseLeave={() => rightSideNavRef.current?.classList.add("opacity-0")}
        onTouchStart={() => rightSideNavRef.current?.classList.remove("opacity-0")}
        onTouchEnd={() => rightSideNavRef.current?.classList.add("opacity-0")}
      >
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="section-indicator-bar">
          <div ref={sectionIndicatorRef} className="section-indicator" />
        </div>
      </aside>

      <div
        id="image1-cloud"
        ref={image1CloudRef}
        className="image1-cloud"
        style={{ backgroundImage: `url("${assetPath("/assets/images/HG.webp")}")` }}
      />
      <div
        ref={image2MountainsRef}
        className="image2-mountains"
        style={{ backgroundImage: `url("${assetPath("/assets/images/MG.webp")}")` }}
      />
      <div
        ref={image3PersonRef}
        className="image3-person-on-mountain"
        style={{ backgroundImage: `url("${assetPath("/assets/images/VG.webp")}")` }}
      />
      <div className="bg-layer0-black-white" />
      <div className="bg-layer1-black-white" />
      <div className="bg-layer2-black-white" />
      <div ref={bgLayer3Ref} className="bg-layer3-black-white" />

      <nav>
        <div className="logo">MNTN</div>
        <ul className="nav-items">
          <li>
            <a href={homePath}>Ekwipunek</a>
          </li>
          <li>
            <a href={homePath}>O nas</a>
          </li>
          <li>
            <a href={homePath}>Blog</a>
          </li>
        </ul>
        <div className="userAccount">
          <a
            href={homePath}
            onMouseEnter={handleAccountEnter}
            onMouseLeave={handleAccountLeave}
            onTouchStart={handleAccountEnter}
            onTouchEnd={handleAccountLeave}
          >
            <img src={assetPath(accountIcon)} alt="ikona profilu" />
            <span className="font-roboto">Konto</span>
          </a>
        </div>
      </nav>

      <main ref={mainContainerRef} className="main-container">
        <section className="hero-section" ref={heroSectionRef}>
          <div className="subtitle">
            <span className="start-dash" />
            <span className="subtitle-text font-roboto">POLSKI PRZEWODNIK</span>
          </div>
          <h1>Przygotuj się na góry, szlaki i widoki ponad chmurami!</h1>
          <a className="scroll-down" href="#info-card-1">
            <span>przewiń dalej</span>
            <img src={assetPath("/assets/icons/down-arrow.svg")} alt="" />
          </a>
        </section>

        <section className="container-info-cards">
          {cards.map((card, index) => (
            <InfoCard key={card.title} card={card} index={index} />
          ))}
        </section>
      </main>

      <footer>
        <div className="footer-info">
          <div className="footer-info-about-us">
            <div className="logo font-roboto">MNTN</div>
            <p>Ruszaj na szlak i odkrywaj kolejne pasma, schroniska oraz górskie kierunki w Polsce.</p>
          </div>
          <span className="copyright">Copyright 2026 MNTN. Regulamin i prywatność</span>
        </div>

        <div className="footer-navlinks">
          <div>
            <div className="footer-navlinks-header">Więcej na blogu</div>
            <ul>
              <li>
                <a href={homePath}>O MNTN</a>
              </li>
              <li>
                <a href={homePath}>Autorzy i przewodnicy</a>
              </li>
              <li>
                <a href={homePath}>Napisz dla nas</a>
              </li>
              <li>
                <a href={homePath}>Kontakt</a>
              </li>
              <li>
                <a href={homePath}>Polityka prywatności</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-navlinks-header">Więcej o MNTN</div>
            <ul>
              <li>
                <a href={homePath}>Zespół</a>
              </li>
              <li>
                <a href={homePath}>Praca</a>
              </li>
              <li>
                <a href={homePath}>Dla mediów</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
