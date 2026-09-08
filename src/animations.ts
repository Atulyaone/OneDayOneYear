import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function animateOpening(root: HTMLElement, reducedMotion: boolean) {
  const context = gsap.context(() => {
    if (reducedMotion) {
      gsap.set('.opening-title span, .newspaper-stage, .opening-actions', { autoAlpha: 1, clearProps: 'transform' })
      return
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    timeline
      .from('.opening-title span', { autoAlpha: 0, y: 18, duration: 0.72, stagger: 0.16 })
      .from('.opening-index', { autoAlpha: 0, y: 10, duration: 0.45 }, '-=0.18')
      .from('.newspaper-stage', { autoAlpha: 0, scale: 0.52, x: 120, rotation: 8, duration: 1.45, ease: 'power4.out' }, '+=0.15')
      .from('.opening-actions', { autoAlpha: 0, y: 12, duration: 0.5 }, '-=0.45')
  }, root)

  return () => context.revert()
}

export function animateMoment(root: HTMLElement, reducedMotion: boolean) {
  const context = gsap.context(() => {
    if (reducedMotion) {
      gsap.set('.reveal-on-scroll', { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' })
      return
    }

    gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((element) => {
      gsap.fromTo(element,
        { y: 24 },
        {
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        },
      )
    })

    gsap.from('.moment-hero-media img', {
      scale: 1.12,
      clipPath: 'inset(0 0 12% 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.moment-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    gsap.from('.evidence-image img', {
      scale: 1.12,
      clipPath: 'inset(0 12% 0 12%)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.evidence-image',
        start: 'top 82%',
        end: 'center center',
        scrub: 0.8,
      },
    })
  }, root)

  return () => {
    context.revert()
    ScrollTrigger.refresh()
  }
}
