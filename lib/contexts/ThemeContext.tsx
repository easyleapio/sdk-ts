import React from "react";

export interface GlobalTheme {
  noneMode?: {
    backgroundColor?: string;
    color?: string;
    border?: string;
  };
  starknetMode?: {
    mainBgColor?: string;

    button?: {
      backgroundColor?: string;
      color?: string;
      border?: string;
      borderRadius?: string;
    };

    switchButton?: {
      backgroundColor?: string;
      color?: string;
      border?: string;
    };
  };
  bridgeMode?: {
    mainBgColor?: string;

    starknetButton?: {
      backgroundColor?: string;
      color?: string;
      border?: string;
      borderRadius?: string;
    };

    evmButton?: {
      backgroundColor?: string;
      color?: string;
      border?: string;
      borderRadius?: string;
    };

    switchButton?: {
      backgroundColor?: string;
      color?: string;
      border?: string;
    };
  };
}

const defaultTheme: GlobalTheme = {
  noneMode: {
    backgroundColor: "#221D31",
    color: "#fff",
    border: "1px solid #fff",
  },
  starknetMode: {
    mainBgColor: "#1C182B",

    button: {
      backgroundColor: "#1C182B",
      color: "#B9AEF1",
      border: "2px solid #443F53",
      borderRadius: "0.75rem",
    },

    switchButton: {
      backgroundColor: "#1C182B",
      color: "#B9AEF1",
      border: "2px solid #443F53",
    },
  },
  bridgeMode: {
    mainBgColor: "#1C182B",

    starknetButton: {
      backgroundColor: "#35314F",
      color: "#9182E8",
      border: "0px solid transparent",
      borderRadius: "0.75rem",
    },

    evmButton: {
      backgroundColor: "#1C182B",
      color: "#B5AADF",
      border: "2px solid #B5AADF",
      borderRadius: "0.75rem",
    },

    switchButton: {
      backgroundColor: "#1C182B",
      color: "#B5AADF",
      border: "2px solid #B5AADF",
    },
  },
};

const ThemeContext = React.createContext<GlobalTheme>(defaultTheme);

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme?: GlobalTheme;
  children: React.ReactNode;
}) => {
  const mergedTheme = { ...defaultTheme, ...theme };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
