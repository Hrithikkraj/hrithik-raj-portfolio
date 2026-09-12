import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RowsPhotoAlbum, type Photo } from 'react-photo-album';
import 'react-photo-album/rows.css';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import '../assets/styles/PhotoGallery.scss';

import gallery01 from '../assets/images/gallery/gallery-01.jpg';
import gallery02 from '../assets/images/gallery/gallery-02.jpg';
import gallery03 from '../assets/images/gallery/gallery-03.jpg';
import gallery04 from '../assets/images/gallery/gallery-04.jpg';
import gallery05 from '../assets/images/gallery/gallery-05.jpg';
import gallery06 from '../assets/images/gallery/gallery-06.jpg';
import gallery07 from '../assets/images/gallery/gallery-07.jpg';
import gallery08 from '../assets/images/gallery/gallery-08.jpg';
import gallery09 from '../assets/images/gallery/gallery-09.jpg';
import gallery10 from '../assets/images/gallery/gallery-10.jpg';
import gallery11 from '../assets/images/gallery/gallery-11.jpg';
import gallery12 from '../assets/images/gallery/gallery-12.jpg';
import gallery13 from '../assets/images/gallery/gallery-13.jpg';
import gallery14 from '../assets/images/gallery/gallery-14.jpg';
import gallery15 from '../assets/images/gallery/gallery-15.jpg';
import gallery16 from '../assets/images/gallery/gallery-16.jpg';
import gallery17 from '../assets/images/gallery/gallery-17.jpg';
import gallery18 from '../assets/images/gallery/gallery-18.jpg';
import gallery19 from '../assets/images/gallery/gallery-19.jpg';

interface CustomPhoto extends Photo {
  id: string;
  caption: string;
}

const PHOTOS: CustomPhoto[] = [
  {
    id: 'gallery-01',
    src: gallery01,
    width: 4000,
    height: 2252,
    alt: 'Glass-and-stone contemporary architectural facade with rhythmic window columns under an open sky',
    caption: 'Rhythms in stone and glass',
  },
  {
    id: 'gallery-02',
    src: gallery02,
    width: 3000,
    height: 4000,
    alt: 'Monochrome high-contrast cityscape with residential high-rises, silhouetted palm fronds, and sun rays piercing overcast clouds',
    caption: 'Monochrome sunbeams over urban silhouettes',
  },
  {
    id: 'gallery-03',
    src: gallery03,
    width: 2057,
    height: 3654,
    alt: 'Textured concrete multi-story residential building under a crisp blue sky with a solitary bird perched on the rooftop edge',
    caption: 'Solitary perch atop warm concrete',
  },
  {
    id: 'gallery-04',
    src: gallery04,
    width: 4000,
    height: 2252,
    alt: 'Low-angle perspective of a geometric glass curtain wall reflecting soft clouds and azure sky',
    caption: 'Geometric glass ascent into clouds',
  },
  {
    id: 'gallery-05',
    src: gallery05,
    width: 4000,
    height: 2252,
    alt: 'Rhythm of angled window sun-shades and architectural louvers catching golden afternoon sunlight',
    caption: 'Angular louvers in afternoon light',
  },
  {
    id: 'gallery-06',
    src: gallery06,
    width: 4000,
    height: 2252,
    alt: 'Golden-hour building facade with open balconies set against a deep blue sky and a daytime crescent moon',
    caption: 'Warm facades and a daytime moon',
  },
  {
    id: 'gallery-07',
    src: gallery07,
    width: 3815,
    height: 2148,
    alt: 'Wide-angle symmetry between twin residential towers flanking a dusk courtyard under dramatic evening clouds',
    caption: 'Courtyard twilight between twin towers',
  },
  {
    id: 'gallery-08',
    src: gallery08,
    width: 4000,
    height: 2252,
    alt: 'Silhouette of a lone bird perched on the corner of a minimalist concrete wall against textured twilight clouds',
    caption: 'Quiet horizon at dusk',
  },
  {
    id: 'gallery-09',
    src: gallery09,
    width: 3024,
    height: 4032,
    alt: 'Priest in red and gold holding a large flaming brass lamp aloft during a riverside Ganga aarti ceremony at night',
    caption: 'Aarti flame over the river sands',
  },
  {
    id: 'gallery-10',
    src: gallery10,
    width: 3024,
    height: 4032,
    alt: 'Sunlit amphitheatre with Diplosphere 2.0 banner, framed by golden-leafed trees and mountain haze in the background',
    caption: 'Diplosphere mornings',
  },
  {
    id: 'gallery-11',
    src: gallery11,
    width: 3024,
    height: 4032,
    alt: 'Low-angle view of the Red Fort gate with its arched entrance, ornate turrets, and birds soaring against dramatic cloudy sky',
    caption: 'Birds above Lahori Gate',
  },
  {
    id: 'gallery-12',
    src: gallery12,
    width: 3024,
    height: 4032,
    alt: 'A solitary tree silhouetted in misty darkness, framed by blue and orange haze from distant street lights at night',
    caption: 'Neon mist and a lone tree',
  },
  {
    id: 'gallery-13',
    src: gallery13,
    width: 3024,
    height: 4032,
    alt: 'Cluster of warm amber wicker pendant lamps glowing against a deep black ceiling in a dimly lit interior',
    caption: 'Wicker lanterns in amber warmth',
  },
  {
    id: 'gallery-14',
    src: gallery14,
    width: 3024,
    height: 4032,
    alt: 'Empty Delhi Metro platform corridor bathed in deep green shadows and amber fluorescent light strips receding into the distance',
    caption: 'Emerald corridor after midnight',
  },
  {
    id: 'gallery-15',
    src: gallery15,
    width: 3024,
    height: 4032,
    alt: 'Black-and-white art studio with students painting on easels under industrial ceiling lights in a raw concrete space',
    caption: 'Studio session in monochrome',
  },
  {
    id: 'gallery-16',
    src: gallery16,
    width: 3024,
    height: 4032,
    alt: 'Driver hand on Hyundai steering wheel with blurred rain-streaked tunnel walls flying past the side windows at speed',
    caption: 'Tunnel drive in the rain',
  },
  {
    id: 'gallery-17',
    src: gallery17,
    width: 3024,
    height: 4032,
    alt: 'Bare plumeria branches reaching skyward against a blue sky streaked with wispy clouds and a diagonal power line',
    caption: 'Bare branches against open sky',
  },
  {
    id: 'gallery-18',
    src: gallery18,
    width: 3024,
    height: 4032,
    alt: 'Railway platform overbridge framed by a blazing purple-to-red sunset sky with silhouetted tracks and trees below',
    caption: 'Overbridge at golden hour',
  },
  {
    id: 'gallery-19',
    src: gallery19,
    width: 3024,
    height: 4032,
    alt: 'Rainy night cityscape from above — headlights and streetlamps reflected on glistening wet tarmac with buildings glowing in amber',
    caption: 'City lights in the rain',
  },
];

const PhotoGallery: React.FC = () => {
  const [index, setIndex] = useState(-1);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Responsive targetRowHeight:
  // Desktop (~1440px): 170px
  // Tablet (~768px): 140px
  // Mobile (~375px): 110px
  const targetRowHeight = (containerWidth: number) => {
    if (containerWidth < 480) return 110;
    if (containerWidth < 900) return 140;
    return 170;
  };

  // Slides for yet-another-react-lightbox
  const slides = useMemo(
    () =>
      PHOTOS.map((photo) => ({
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: photo.alt,
        title: photo.caption,
      })),
    []
  );

  return (
    <section id="photography" className="photo-gallery-section" aria-labelledby="photography-title">
      <div className="photo-gallery__inner">
        <div className="photo-gallery__header">
          <h2 id="photography-title" className="photo-gallery__title">
            Through My Lens
          </h2>
          <p className="photo-gallery__subtitle">
            A few frames I&apos;ve caught along the way, photography is where I slow down.
          </p>
        </div>

        {/* Calm outer entrance animation wrapping the entire gallery container */}
        <motion.div
          className="photo-gallery__album-wrapper"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reducedMotion ? 0.3 : 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Decorative SVGs */}
          <div className="photo-gallery__decor photo-gallery__decor--1">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 85 Q 40 20 85 15" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
              <circle cx="85" cy="15" r="4" fill="currentColor" />
            </svg>
          </div>
          <div className="photo-gallery__decor photo-gallery__decor--2">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 L 90 90 M 90 10 L 10 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            </svg>
          </div>

          <RowsPhotoAlbum
            photos={PHOTOS}
            targetRowHeight={targetRowHeight}
            spacing={12}
            defaultContainerWidth={1200}
            onClick={({ index: clickedIndex }) => setIndex(clickedIndex)}
            componentsProps={{
              button: ({ index: photoIndex, photo }) => ({
                className: `photo-gallery__tile cursor-hover tile-rot-${(photoIndex % 4) + 1}`,
                'aria-label': `View photo: ${(photo as CustomPhoto).caption}`,
              }),
              image: {
                className: 'photo-gallery__tile-img',
              },
            }}
            render={{
              extras: () => (
                <>
                  <div className="photo-gallery__tile-glow" />
                  <div className="photo-gallery__noise" />
                  <div className="photo-gallery__corner photo-gallery__corner--tl">+</div>
                  <div className="photo-gallery__corner photo-gallery__corner--tr">+</div>
                  <div className="photo-gallery__corner photo-gallery__corner--bl">+</div>
                  <div className="photo-gallery__corner photo-gallery__corner--br">+</div>
                </>
              ),
            }}
          />
        </motion.div>
      </div>

      {/* Lightbox full-screen viewer with built-in swipe, arrows, escape, and click-outside */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        className="pg-yarl-custom"
        carousel={{
          finite: false,
          imageFit: 'contain',
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnEscape: true,
        }}
        animation={
          reducedMotion
            ? {
              fade: 0,
              swipe: 0,
              navigation: 0,
              easing: {
                fade: 'linear',
                swipe: 'linear',
                navigation: 'linear',
              },
            }
            : {
              fade: 280,
              swipe: 350,
              navigation: 300,
              easing: {
                fade: 'ease',
                swipe: 'cubic-bezier(0.16, 1, 0.3, 1)',
                navigation: 'cubic-bezier(0.16, 1, 0.3, 1)',
              },
            }
        }
      />
    </section>
  );
};

export default PhotoGallery;
