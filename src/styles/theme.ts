export const theme = {
  name: "Linear Design System",
  version: "1.0.0",
  description: "Linear.app의 완전한 디자인 시스템과 테마 설정",
  
  colors: {
    brand: {
      primary: "#7170ff",
      secondary: "#8989f0", 
      accent: "#7170ff",
      accentHover: "#8989f0",
      accentTint: "#f1f1ff"
    },
    background: {
      primary: "#ffffff",
      secondary: "#f9f8f9", 
      tertiary: "#f4f2f4",
      quaternary: "#eeedef",
      quinary: "#e9e8ea",
      marketing: "#010102",
      translucent: "rgba(0,0,0,.02)",
      level0: "#ffffff",
      level1: "#f8f8f8",
      level2: "#f4f4f4",
      level3: "#f0f0f0",
      tint: "#f4f4f5"
    },
    text: {
      primary: "#282a30",
      secondary: "#3c4149", 
      tertiary: "#6f6e77",
      quaternary: "#86848d"
    },
    foreground: {
      primary: "#282a2f",
      secondary: "#3c4149",
      tertiary: "#6f6e77", 
      quaternary: "#86848d"
    },
    border: {
      primary: "#e9e8ea",
      secondary: "#e4e2e4",
      tertiary: "#dcdbdd",
      translucent: "rgba(0,0,0,.05)"
    },
    line: {
      primary: "#d4d4d6",
      secondary: "#eaeaeb",
      tertiary: "#f0f0f0",
      quaternary: "#f4f4f4",
      tint: "#f4f4f5"
    },
    link: {
      primary: "#7070ff",
      hover: "var(--color-text-primary)"
    },
    semantic: {
      blue: "#4ea7fc",
      red: "#eb5757",
      green: "#4cb782",
      orange: "#fc7840", 
      yellow: "#f2c94c",
      indigo: "#5e6ad2",
      linearPlan: "#68cc58",
      linearBuild: "#d4b144",
      linearSecurity: "#7a7fad"
    },
    utility: {
      white: "#ffffff",
      black: "#000000",
      transparent: "hsla(0,0%,100%,0)"
    },
    selection: {
      text: "currentColor",
      background: "color-mix(in lch,var(--color-brand-bg),transparent 64%)",
      dim: "color-mix(in lch,var(--color-brand-bg),transparent 80%)"
    },
    header: {
      background: "hsla(0,0%,100%,.8)",
      border: "rgba(0,0,0,.08)"
    },
    overlay: {
      primary: "hsla(0,0%,100%,.65)",
      dimRgb: "0,0,0"
    }
  },

  typography: {
    fontFamilies: {
      regular: '"Inter Variable","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Open Sans","Helvetica Neue",sans-serif',
      serif: '"Tiempos Headline",ui-serif,Georgia,Cambria,"Times New Roman",Times,serif',
      monospace: '"Berkeley Mono",ui-monospace,"SF Mono","Menlo",monospace',
      emoji: '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","Twemoji Mozilla","Noto Color Emoji","Android Emoji"'
    },
    fontWeights: {
      light: "300",
      normal: "400", 
      medium: "510",
      semibold: "590",
      bold: "680"
    },
    fontSizes: {
      micro: "0.6875rem",    // 11px
      mini: "0.75rem",       // 12px
      small: "0.8125rem",    // 13px
      regular: "0.9375rem",  // 15px
      large: "1.125rem",     // 18px
      title1: "2.25rem",     // 36px
      title2: "1.5rem",      // 24px
      title3: "1.25rem"      // 20px
    },
    titles: {
      title1: {
        size: "1.0625rem",
        lineHeight: "1.4",
        letterSpacing: "-0.012em",
        fontWeight: "590"
      },
      title2: {
        size: "1.3125rem", 
        lineHeight: "1.33",
        letterSpacing: "-0.012em",
        fontWeight: "590"
      },
      title3: {
        size: "1.5rem",
        lineHeight: "1.33", 
        letterSpacing: "-0.012em",
        fontWeight: "590"
      },
      title4: {
        size: "2rem",
        lineHeight: "1.125",
        letterSpacing: "-0.022em",
        fontWeight: "590"
      },
      title5: {
        size: "2.5rem",
        lineHeight: "1.1",
        letterSpacing: "-0.022em", 
        fontWeight: "590"
      },
      title6: {
        size: "3rem",
        lineHeight: "1.1",
        letterSpacing: "-0.022em",
        fontWeight: "590"
      },
      title7: {
        size: "3.5rem",
        lineHeight: "1.1", 
        letterSpacing: "-0.022em",
        fontWeight: "590"
      },
      title8: {
        size: "4rem",
        lineHeight: "1.06",
        letterSpacing: "-0.022em",
        fontWeight: "590"
      },
      title9: {
        size: "4.5rem",
        lineHeight: "1",
        letterSpacing: "-0.022em",
        fontWeight: "590"
      }
    },
    text: {
      large: {
        size: "1.0625rem",
        lineHeight: "1.6", 
        letterSpacing: "0"
      },
      regular: {
        size: "0.9375rem",
        lineHeight: "1.6",
        letterSpacing: "-0.011em"
      },
      small: {
        size: "0.875rem",
        lineHeight: "calc(21 / 14)",
        letterSpacing: "-0.013em"
      },
      mini: {
        size: "0.8125rem",
        lineHeight: "1.5",
        letterSpacing: "-0.01em"
      },
      micro: {
        size: "0.75rem", 
        lineHeight: "1.4",
        letterSpacing: "0"
      },
      tiny: {
        size: "0.625rem",
        lineHeight: "1.5",
        letterSpacing: "-0.015em"
      }
    },
    fontSettings: '"cv01","ss03"',
    fontVariations: '"opsz" auto'
  },

  spacing: {
    pageMaxWidth: "1024px",
    pagePaddingInline: "24px",
    pagePaddingBlock: "64px",
    headerHeight: "64px",
    gridColumns: "12",
    gridGap: "32px",
    blockSpacingSmall: "8px",
    blockSpacing: "16px"
  },

  borderRadius: {
    4: "4px",
    6: "6px", 
    8: "8px",
    12: "12px",
    16: "16px",
    24: "24px",
    32: "32px",
    rounded: "9999px",
    circle: "50%"
  },

  borders: {
    hairline: "1px"
  },

  shadows: {
    none: "0px 0px 0px transparent",
    tiny: "0px 1px 1px 0px rgba(0,0,0,.09)",
    low: "0px 1px 4px -1px rgba(0,0,0,.09)",
    medium: "0px 3px 12px rgba(0,0,0,.09)",
    high: "0px 7px 24px rgba(0,0,0,.06)",
    stackLow: "0px -1px 1px 0px rgba(0,0,0,.11) inset,0px 8px 2px 0px transparent,0px 5px 2px 0px rgba(0,0,0,.01),0px 3px 2px 0px rgba(0,0,0,.04),0px 1px 1px 0px rgba(0,0,0,.07),0px 0px 1px 0px rgba(0,0,0,.08)"
  },

  animation: {
    speeds: {
      highlightFadeIn: "0s",
      highlightFadeOut: "0.15s", 
      quickTransition: "0.1s",
      regularTransition: "0.25s"
    },
    easings: {
      inQuad: "cubic-bezier(0.55,0.085,0.68,0.53)",
      inCubic: "cubic-bezier(0.55,0.055,0.675,0.19)",
      inQuart: "cubic-bezier(0.895,0.03,0.685,0.22)",
      outQuad: "cubic-bezier(0.25,0.46,0.45,0.94)",
      outCubic: "cubic-bezier(0.215,0.61,0.355,1)",
      outQuart: "cubic-bezier(0.165,0.84,0.44,1)",
      inOutQuad: "cubic-bezier(0.455,0.03,0.515,0.955)",
      inOutCubic: "cubic-bezier(0.645,0.045,0.355,1)",
      inOutQuart: "cubic-bezier(0.77,0,0.175,1)"
    }
  },

  focus: {
    ringColor: "rgba(0,0,0,.4)",
    ringWidth: "2px", 
    ringOffset: "2px"
  },

  components: {
    button: {
      height: "48px",
      iconSize: "18px",
      fontSize: "16px",
      cornerRadius: "var(--radius-rounded)",
      padding: "0 16px",
      gap: "10px"
    },
    input: {
      height: "62px"
    },
    switch: {
      height: "20px",
      width: "32px", 
      thumbSize: "14px"
    }
  },

  breakpoints: {
    mobile: "640px",
    tablet: "768px", 
    desktop: "1024px",
    wide: "1280px",
    ultraWide: "1536px"
  },

  zIndex: {
    max: "10000",
    debug: "5100",
    skipNav: "5000",
    contextMenu: "1200",
    tooltip: "1100", 
    toasts: "800",
    dialog: "700",
    dialogOverlay: "699",
    commandMenu: "650",
    popover: "600",
    overlay: "500",
    header: "100",
    scrollbar: "75",
    footer: "50",
    layer3: "3",
    layer2: "2", 
    layer1: "1"
  },

  darkMode: {
    colors: {
      background: {
        primary: "#08090a",
        secondary: "#0f1011", 
        tertiary: "#16171a"
      },
      text: {
        primary: "#f7f8f8",
        secondary: "#d1d5d9",
        tertiary: "#8a8f98"
      },
      header: {
        background: "rgba(10, 10, 10, 0.8)"
      }
    }
  }
} as const;

export type Theme = typeof theme;