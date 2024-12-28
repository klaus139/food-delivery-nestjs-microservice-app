"use client"
// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({children}:{children:React.ReactNode}) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <NextUIProvider >
      <NextThemesProvider attribute='class' defaultTheme="dark">
      {children}
      </NextThemesProvider>
    
      
    </NextUIProvider>
  );
}