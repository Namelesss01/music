import React, { useEffect, useState, useCallback, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

// Carousel Context
const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// Carousel Component
const Carousel = React.forwardRef(
  ({ opts, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(opts, plugins);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, [api]);

    const scrollNext = useCallback(() => {
      api?.scrollNext();
    }, [api]);

    useEffect(() => {
      if (!api) return;
      api.on("select", onSelect);
      api.on("reInit", onSelect);

      const interval = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0); // возвращаемся к началу
        }
      }, 5000); // Интервал 5 секунды

      return () => clearInterval(interval);
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{ carouselRef, api, scrollNext, canScrollPrev, canScrollNext }}
      >
        <div ref={ref} className={`relative ${className}`} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

// Carousel Content, Item, Next, and Previous Buttons Components
const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={`flex ${className}`} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={`min-w-full ${className}`}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef((props, ref) => {
  const { canScrollPrev, api } = useCarousel();
  return (
    <Button
      ref={ref}
      disabled={!canScrollPrev}
      onClick={() => api.scrollPrev()}
      {...props}
    >
      <ArrowLeftIcon />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef((props, ref) => {
  const { canScrollNext, api } = useCarousel();
  return (
    <Button
      ref={ref}
      disabled={!canScrollNext}
      onClick={() => api.scrollNext()}
      {...props}
    >
      <ArrowRightIcon />
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

// Exporting Carousel components
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
