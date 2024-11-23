export interface ThemeSettings {
  colors: {
    website: {
      background: string;
    };
    header: {
      background: string;
      borderBottom: {
        height: number;
        color: string;
      };
    };
    footer: {
      background: string;
      borderTop: {
        height: number;
        color: string;
      };
    };
    modules: {
      background: string;
      border: {
        height: number;
        color: string;
      };
      title: {
        background: string;
      };
    };
  };
  typography: {
    website: {
      fontFamily: string;
      fontSize: string;
      color: string;
      lineHeight: number;
    };
    headings: {
      fontFamily: string;
      color: string;
      h1: {
        fontSize: string;
      };
      h2: {
        fontSize: string;
      };
      h3: {
        fontSize: string;
      };
    };
    header: {
      fontFamily: string;
      fontSize: string;
      color: string;
      menu: {
        fontFamily: string;
        fontSize: string;
        color: string;
        hoverColor: string;
      };
    };
    footer: {
      fontFamily: string;
      fontSize: string;
      color: string;
      copyright: {
        fontSize: string;
      };
    };
    modules: {
      title: {
        fontFamily: string;
        fontSize: string;
        color: string;
      };
      links?: {
        fontFamily: string;
        fontSize: string;
        color: string;
        hoverColor: string;
      };
    };
  };
  layout: {
    header: {
      height: string;
    };
    footer: {
      height: string;
    };
    modules: {
      borderRadius: number;
      title: {
        padding: number;
      };
    };
  };
  buttons: {
    submit: {
      background: string;
      hoverBackground: string;
      borderRadius: number;
      border: {
        height: number;
        color: string;
      };
      font: {
        family: string;
        size: string;
        color: string;
        hoverColor: string;
      };
      padding: {
        top: number;
        bottom: number;
      };
    };
    cta: {
      background: string;
      hoverBackground: string;
      borderRadius: number;
      border: {
        height: number;
        color: string;
      };
      font: {
        family: string;
        size: string;
        color: string;
        hoverColor: string;
      };
      padding: {
        top: number;
        bottom: number;
      };
    };
  };
  list?: {
    title: {
      fontFamily: string;
      fontSize: string;
      color: string;
      background: string;
    };
    article: {
      title: {
        fontFamily: string;
        fontSize: string;
        color: string;
        background: string;
      };
      image: {
        width: string;
      };
      description: {
        fontFamily: string;
        fontSize: string;
        color: string;
      };
      link: {
        fontFamily: string;
        fontSize: string;
        color: string;
        hoverColor: string;
        position: 'left' | 'right';
      };
    };
  };
  affiliate: {
    subtitle: {
      fontFamily: string;
      fontSize: string;
      color: string;
    };
    disclaimer: {
      fontFamily: string;
      fontSize: string;
      color: string;
    };
    product: {
      title: {
        background: string;
        fontFamily: string;
        fontSize: string;
        color: string;
      };
      button: {
        background: string;
        hoverBackground: string;
        border: {
          height: number;
          color: string;
        };
        borderRadius: number;
        font: {
          family: string;
          size: string;
          color: string;
        };
        padding: {
          top: number;
          bottom: number;
        };
      };
    };
  };
  animations?: {
    page?: {
      type: 'fade' | 'slide' | 'scale' | 'flip';
      duration: number;
    };
    hover?: {
      scale: number;
      duration: number;
    };
    loading?: {
      type: 'pulse' | 'spin' | 'bounce' | 'shimmer';
      duration: number;
    };
    scroll?: {
      type: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in';
      distance: number;
      duration: number;
      delay: number;
    };
  };
}