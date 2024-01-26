import { useEffect } from 'react';

type SequentialFadeInOptions = {
  duration?: number;
  ease?: string;
};

/**
 * Custom React hook for applying a sequential fade-in effect to the children of a given container.
 *
 * @description This hook sets up a sequential fade-in animation for the children of the element
 * referenced by `containerRef`. The animation makes each child element fade in and move upwards
 * in sequence. The `isVisible` flag controls whether the animation should run, and `options`
 * allows customization of the animation duration and easing function.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Reference to the container element whose children will be animated.
 * @param {boolean} [isVisible=true] - Flag to determine if the fade-in effect should be applied.
 * @param {SequentialFadeInOptions} [options] - Optional configuration for the animation, including duration and easing.
 *
 * @function useSequentialFadeIn
 * @returns {void}
 */
export const useSequentialFadeIn = (
  containerRef: React.RefObject<HTMLElement>,
  isVisible = true,
  options?: SequentialFadeInOptions,
) => {
  const transitionDuration = options?.duration || 0.125;
  const ease = options?.ease || 'cubic-bezier(0.39, 0.575, 0.565, 1)';
  useEffect(() => {
    const animate = () => {
      const childElements: HTMLCollection = (
        containerRef?.current as { children: HTMLCollection }
      ).children;

      for (let i = 1; i < childElements.length; i++) {
        const element: HTMLElement = childElements[i] as HTMLElement;
        element.style.filter = 'opacity(0%)';
        element.style.transform = 'translate(0,' + (1 + i * 0.125) + 'rem)';
      }
      setTimeout(() => {
        for (let i = 1; i < childElements.length; i++) {
          const element: HTMLElement = childElements[i] as HTMLElement;
          const duration = transitionDuration + i * 0.125;

          element.style.transition = `transform ${duration}s ${ease}, filter ${duration}s ${ease}, margin-top ${duration}s ${ease}`;
          element.style.transitionDelay = `${i * 0.025}s`;
          element.style.filter = 'opacity(100%)';
          element.style.transform = 'translate(0,0)';
        }
      });
    };

    if (containerRef.current && isVisible) {
      animate();
    }
  }, [containerRef, isVisible, transitionDuration, ease]);
};
